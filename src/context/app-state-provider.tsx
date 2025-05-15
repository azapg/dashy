'use client';

import {createContext, FC, ReactNode, useContext, useState} from "react";
import {Experiment} from "@/api/experiments";

interface AppStateContextType {
  currentExperiment?: Experiment;
  setCurrentExperiment: (experiment: Experiment) => void;
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
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | undefined>(undefined)

  return (
    <AppStateContext.Provider value={{
      currentExperiment,
      setCurrentExperiment
    }}>
      {children}
    </AppStateContext.Provider>
  )
}