export interface ICache {
  get(key: string): any;
  set(key: string, content: any): void;
}

export class SimpleCache implements ICache {
  private data: Record<string, any>;

  constructor() {
    this.data = [];
  }

  get(key: string): any {
    return this.data[key];
  }

  set(key: string, content: any): void {
    this.data[key] = content;
  }
}
