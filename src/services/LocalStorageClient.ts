import type { StorageClientServiceInterface } from "@/types";
import { injectable } from "inversify";

@injectable()
export class LocalStorageClient implements StorageClientServiceInterface {
  public async get<T>(key: string): Promise<T | null> {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  public async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}
