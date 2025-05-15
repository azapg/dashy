import {post} from "@/lib/fetch";
import {Payload, User} from "@/api/types";

export interface UserRegistrationPayload extends Payload {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginPayload extends Payload {
  email: string;
  password: string;
  rememberMe: boolean
}

export async function registerRequest(user: UserRegistrationPayload) {
  return await post<User>('auth/register.php', user)
}

export async function loginRequest(user: UserLoginPayload) {
  return await post<User>('auth/login.php', user)
}

export async function logoutRequest() {
  return await post<{ session_invalidated: boolean }>('auth/logout.php')
}