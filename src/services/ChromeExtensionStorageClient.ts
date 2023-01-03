import type { StorageClientServiceInterface } from "@/types";
import { injectable } from "inversify";

@injectable()
export class ChromeExtensionStorageClient
  implements StorageClientServiceInterface
{
  public async get<T>(key: string): Promise<T | null> {
    return (await chrome.storage.sync.get(key))[key] || null;
  }

  public async set<T>(key: string, value: T): Promise<void> {
    await chrome.storage.sync.set({ [key]: value });
  }

  public async remove(key: string): Promise<void> {
    await chrome.storage.sync.remove(key);
  }
}
