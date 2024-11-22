import type { StorageType } from "./types";

export class StorageService {
  private readonly storageFile: string;

  constructor(storageFile: string) {
    this.storageFile = storageFile;
  }

  async get(queue?: number) {
    const data = await this.read();

    if (!queue) return data;

    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value === queue)
    );
  }

  async set(id: string, queue: number) {
    const data = await this.read();
    data[id] = queue;
    await this.write(data);
  }

  async delete(id: string) {
    const data = await this.read();
    delete data[id];
    await this.write(data);
  }

  private async read(): Promise<StorageType> {
    try {
      return await Bun.file(this.storageFile).json();
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  private write(storage: StorageType) {
    return Bun.write(this.storageFile, JSON.stringify(storage, null, 4));
  }
}
