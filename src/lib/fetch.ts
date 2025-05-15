import {ApiResponse, Payload, ServerResponse} from "@/api/types";

export async function get<T>(route: string, body?: Payload) {
  return safeFetch<T>(route, 'GET', body);
}

export async function post<T>(route: string, body?: Payload) {
  return safeFetch<T>(route, 'POST', body);
}

export async function put<T>(route: string, body?: Payload) {
  return safeFetch<T>(route, 'PUT', body);
}

export async function del<T>(route: string, body?: Payload) {
  return safeFetch<T>(route, 'DELETE', body);
}

async function safeFetch<T>(route: string, method: string, body?: Payload): Promise<ApiResponse<T>> {
  try {
    const response = await fetch('/api/' + route, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const serverResponse: ServerResponse = await response.json();

    if(!response.ok) {
      return err(`Server responded with status ${response.status}: ${response.statusText}`);
    }

    if(serverResponse.success && serverResponse.data) {
      return success<T>(serverResponse.data, serverResponse.message);
    } else {
      return err(`Couldn't receive data from the server. ${response.statusText}`);
    }

  } catch (error) {
    return err(`An error occurred: ${error}`);
  }
}

function err<T>(message: string): ApiResponse<T> {
  return {
    success: false,
    error: message
  }
}

function success<T>(data: object, message?: string): ApiResponse<T> {
  return {
    success: true,
    message,
    data: data as T,
  }
}