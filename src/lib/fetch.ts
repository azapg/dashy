import {Payload} from "@/api/types";

export async function get(route: string, body: Payload) {
  return safeFetch(route, body, 'GET');
}

export async function post(route: string, body: Payload) {
  return safeFetch(route, body, 'POST');
}

export async function put(route: string, body: Payload) {
  return safeFetch(route, body, 'PUT');
}

export async function del(route: string, body: Payload) {
  return safeFetch(route, body, 'DELETE');
}

async function safeFetch(route: string, body: Payload, method: string) {
  const response = await fetch('/api/' + route, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  return await response.json()
}