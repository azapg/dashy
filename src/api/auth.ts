import {post} from "@/lib/fetch";
import {Payload} from "@/api/types";

interface UserRegistrationPayload extends Payload {
  username: string;
  email: string;
  password: string;
}

interface UserLoginPayload extends Payload {
  email: string;
  password: string;
}

export async function registerUser(user: UserRegistrationPayload) {
  return await post('auth/register.php', user)
}

export async function loginUser(user: UserLoginPayload) {
  return await post('auth/login.php', user)
}