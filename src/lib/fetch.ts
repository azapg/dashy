import {ApiResponse, Payload, ServerResponse} from "@/api/types";

export async function get(route: string, body?: Payload) {
  return safeFetch(route, 'GET', body);
}

export async function post(route: string, body?: Payload) {
  return safeFetch(route, 'POST', body);
}

export async function put(route: string, body?: Payload) {
  return safeFetch(route, 'PUT', body);
}

export async function del(route: string, body?: Payload) {
  return safeFetch(route, 'DELETE', body);
}

async function safeFetch(route: string, method: string, body?: Payload): Promise<ApiResponse> {
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
      return success(serverResponse.data, serverResponse.message);
    } else {
      return err(`Couldn't receive data from the server. ${response.statusText}`);
    }

  } catch (error) {
    return err(`An error occurred: ${error}`);
  }
}

function err(message: string): ApiResponse {
  return {
    success: false,
    error: message
  }
}

function success(data: object, message?: string): ApiResponse {
  return {
    success: true,
    message,
    data,
  }
}