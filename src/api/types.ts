export type Payload = object;
export interface User {
  user_id: number;
  username: string;
  email: string;
  role_id?: number;
  expires_at: string;
}

export type ServerResponse = {
  success: boolean;
  error?: string;
  message?: string;
  data?: object;
}

export type ApiResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: object;
}