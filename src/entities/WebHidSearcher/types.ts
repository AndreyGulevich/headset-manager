import type { TDeviceInfo } from '@/shared/types';

export type TDeviceSearcher = {
  getDevices(): Promise<TDeviceInfo[]>;
  findDeviceByName(name: string): Promise<TDeviceInfo | null>;
};
