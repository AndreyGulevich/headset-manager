import type { TDeviceSearcher } from './types';
import type { TDeviceInfo } from '@/shared/types';
import { OperationFailedError } from '@/shared/errors';

type THid = {
  getDevices(): Promise<HIDDevice[]>;
};

const mapHidDeviceToDeviceInfo = (device: HIDDevice): TDeviceInfo => {
  const id = `${device.vendorId}-${device.productId}`;
  return {
    id,
    name: device.productName,
    vendorId: device.vendorId,
    productId: device.productId,
  };
};

/**
 * Поиск устройств через WebHID API.
 */
class WebHidSearcher implements TDeviceSearcher {
  constructor(private readonly hid: THid = navigator.hid) {}

  /**
   * Возвращает список устройств, к которым уже был предоставлен доступ.
   */
  async getDevices(): Promise<TDeviceInfo[]> {
    this.ensureHidSupported();
    const devices = await this.hid.getDevices();
    return devices.map(mapHidDeviceToDeviceInfo);
  }

  /**
   * Ищет устройство по имени (productName включает переданное имя).
   */
  async findDeviceByName(name: string): Promise<TDeviceInfo | null> {
    const device = await this.getHidDeviceByName(name);
    return device ? mapHidDeviceToDeviceInfo(device) : null;
  }

  /**
   * Возвращает HIDDevice по имени для подключения (например, в WebHidHeadSet).
   */
  async getHidDeviceByName(name: string): Promise<HIDDevice | null> {
    this.ensureHidSupported();
    const devices = await this.hid.getDevices();
    const normalizedName = name.trim().toLowerCase();
    if (normalizedName === '') {
      return null;
    }
    const device = devices.find((d) => d.productName.toLowerCase().includes(normalizedName));
    return device ?? null;
  }

  private ensureHidSupported(): void {
    if (typeof this.hid === 'undefined') {
      throw new OperationFailedError('WebHID is not supported in this environment');
    }
  }
}

export default WebHidSearcher;
