import type { TCapabilities } from '@/shared/types';

export type THeadSet = {
  on(event: string, callback: (payload?: unknown) => void): void;
  off(event: string, callback: (payload?: unknown) => void): void;
  send(data: unknown): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getCapabilities(): TCapabilities;
};
