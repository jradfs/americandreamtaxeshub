declare module 'pg' {
  export class Pool {
    constructor(config?: any);
    connect(): Promise<any>;
    query(text: string, params?: any[]): Promise<any>;
    end(): Promise<void>;
  }
  
  export interface PoolClient {
    query(text: string, params?: any[]): Promise<any>;
    release(err?: Error): void;
  }
}