"use client";

import {createContext, useState, ReactNode, useContext} from "react";

export type User = {
  user_id: number,
  username: string,
  role_id: number,
  expires_at: string
}

type UserContextType = {
  currentUser: User | null,
  setCurrentUser: (user: User | null) => void
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {
  }
});

type UserProviderProps = {
  children: ReactNode
}

export const UserProvider = ({children}: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{currentUser, setCurrentUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);