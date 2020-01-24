import { RegistryEntry } from './registry-entry';

export interface Registry {
  [path: string]: RegistryEntry;
}
