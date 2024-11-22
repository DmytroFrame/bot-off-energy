import { createHash } from "crypto";
import type { StorageService } from "./storage-service";
import type { QueueData } from "./interfaces";
import type { UpdateListenerHandler } from "./types";

export class ApiService {
  private readonly baseUrl = "https://be-svitlo.oe.if.ua";
  private queuesHash: Record<number, string> = {};
  private queues: Record<number, QueueData> = {};
  private storage: StorageService;
  private listener: UpdateListenerHandler | null = null;

  constructor(storage: StorageService, updateTimeMin: number) {
    this.storage = storage;
    this.sync();
    setInterval(this.sync.bind(this), updateTimeMin * 60 * 1000);
  }

  async get(queue: number) {
    if (this.queues[queue]) return this.queues[queue];

    const data = await this.makeRequest(queue);

    if (data.current.hasQueue === "yes") {
      this.queues[queue] = data;
      return data;
    }
  }

  async hasQueue(queue: number) {
    try {
      const res = await this.makeRequest(queue);
      return res.current.hasQueue === "yes";
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async setUpdateListener(handler: UpdateListenerHandler) {
    this.listener = handler;
  }

  private async sync() {
    const values = await this.storage.get();
    const queues = Array.from(new Set(Object.values(values)));

    for (const queue of queues) {
      const data = await this.makeRequest(queue);
      const hash = this.generateHash(JSON.stringify(data));

      if (!this.queues[queue]) {
        this.queues[queue] = data;
        this.queuesHash[queue] = hash;
        return;
      }

      if (this.queuesHash[queue] !== hash) {
        this.queues[queue] = data;
        this.queuesHash[queue] = hash;

        console.log(`Updated queue: ${queue}, hash: ${hash}`);

        if (this.listener)
          try {
            await this.listener(queue);
          } catch (error) {
            console.error(error);
          }
      }
    }
  }

  private async makeRequest(queue: number): Promise<QueueData> {
    console.count("makeRequest /GavByQueue");

    const request = await fetch(this.baseUrl + "/GavByQueue", {
      body: JSON.stringify({ queue }),
      method: "POST",
    });
    return request.json();
  }

  private generateHash(data: string) {
    return createHash("sha256").update(data).digest("hex");
  }
}
