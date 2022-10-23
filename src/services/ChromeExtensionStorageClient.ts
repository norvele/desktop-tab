import { StorageClientServiceInterface } from "@/types";

export class ChromeExtensionStorageClient
  implements StorageClientServiceInterface
{
  async get<T>(key: string): Promise<T | null> {
    return (await chrome.storage.sync.get(key))[key] || null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await chrome.storage.sync.set({ [key]: value });
  }

  async remove(key: string): Promise<void> {
    await chrome.storage.sync.remove(key);
  }
}
