import {createContext} from "react";

export type User = {
  user_id: number,
  username: string,
  role_id: number,
  expires_at: string
}

export const UserContext = createContext<User | null>(null)