import { createContext, type ReactNode } from "react";
import type { StorageAdapter, StorageDependencies } from "./types";
import { ThemeSerializer } from "./serialization/ThemeSerializer";

export const StorageContext = createContext<StorageDependencies | null>(null);

export interface StorageProviderProps {
  children: ReactNode;
  adapter?: StorageAdapter;
  serializer?: ThemeSerializer;
  templateRegistry?: any;
}
