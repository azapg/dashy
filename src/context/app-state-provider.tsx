'use client';

import {createContext, FC, ReactNode, useContext, useState} from "react";

interface AppStateContextType {
  currentExperiment?: number;
  setCurrentExperiment: (experiment: number) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if(!context) {
    throw new Error('useAppState must be used within an AuthProvider');
  }
  return context;
}

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: FC<AppStateProviderProps> = ({ children }) => {
  const [currentExperiment, setCurrentExperiment] = useState<number | undefined>(undefined)

  return (
    <AppStateContext.Provider value={{
      currentExperiment,
      setCurrentExperiment
    }}>
      {children}
    </AppStateContext.Provider>
  )
}