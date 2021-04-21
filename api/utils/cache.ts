export interface ICache {
  /**
   * Returns the cached value associated to the key.
   *
   * @param key - The key of the item to return
   * @returns The value associated to 'key' or undefined
   */
  get(key: string): any;

  /**
   * Caches a new value and associates it to the key.
   *
   * @param key - The key of the item to cache
   * @param value - The value to cache
   */
  set(key: string, value: any): void;

  /**
   * Clears cached values that are too old
   */
  empty(): void;
}

export class SimpleCache implements ICache {
  /**
   * Contains the cached data
   */
  private data: Record<
    string,
    {
      timestamp: number;
      value: any;
    }
  >;

  /**
   * The duration to keep cached values in minutes
   */
  private maxDuration: number;

  /**
   * A new SimpleCache object
   *
   * @param maxDuration - The duration to keep cached values in minutes
   * @returns A new SimpleCache object
   */
  constructor(maxDuration: number) {
    this.data = {};
    this.maxDuration = maxDuration;
  }

  get(key: string): any {
    const data = this.data[key];
    if (data) {
      data.timestamp = Date.now();
    }
    return data?.value;
  }

  set(key: string, value: any): void {
    this.data[key] = { timestamp: Date.now(), value };
  }

  empty(): void {
    const limit = Date.now() - this.maxDuration * 60000;
    for (const [key, value] of Object.entries(this.data)) {
      if (value.timestamp < limit) {
        delete this.data[key];
      }
    }
  }
}
