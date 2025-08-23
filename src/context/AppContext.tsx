import React, { createContext, useContext, type ReactNode } from 'react';
import { ThoughtManager } from '../core/ThoughtManager';
import { LocalStorage } from '../storage/LocalStorage';
import {type IUserStorage} from '../storage/userStorage.interface.ts';
import {LocalStorageThoughts} from "../storage/LocalStorageThoughts.ts";

interface AppContextType {
  userStorage: IUserStorage;
  manager: ThoughtManager;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const thoughtStorage = new LocalStorageThoughts();
const userStorage = new LocalStorage();
const manager = new ThoughtManager(thoughtStorage);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = {
    userStorage,
    manager
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};