import type { TDeviceSearcher } from '@/entities/WebHidSearcher/types';
import type { THeadSet } from '@/entities/headset/types';
import type { TCapabilities, THeadSetEventMap } from '@/shared/types';
import WebHidSearcher from '@/entities/WebHidSearcher/WebHidSearcher';
import WebHidHeadSet from '@/entities/headset/WebHidHeadSet';
import { DeviceNotFoundError, OperationFailedError } from '@/shared/errors';
import { TypedEvents, EventEmitterProxy } from 'events-constructor';
import { HEADSET_EVENT_NAMES } from '@/shared/types';

const DEVICE_EVENTS = ['inputreport', 'muted-mic', 'unmuted-mic', 'incoming-call', 'call-answered', 'call-rejected'] as const;

/**
 * Фасад для управления гарнитурой/спикерфоном: поиск по имени, подключение, отправка команд, подписка на события.
 */
class HeadSetManager extends EventEmitterProxy<THeadSetEventMap> {
  private currentDevice: THeadSet | null = null;
  private readonly searcher: TDeviceSearcher;

  /**
   * @param searcher — реализация поиска устройств (например, WebHidSearcher).
   */
  constructor(searcher: TDeviceSearcher) {
    super(new TypedEvents<THeadSetEventMap>(HEADSET_EVENT_NAMES));
    this.searcher = searcher;
  }

  /**
   * Подключение к устройству по имени (подстрока productName).
   * @throws {DeviceNotFoundError} если устройство не найдено.
   */
  async connect(deviceName: string): Promise<void> {
    const deviceInfo = await this.searcher.findDeviceByName(deviceName);
    if (deviceInfo === null) {
      throw new DeviceNotFoundError(`Device not found: ${deviceName}`);
    }
    const hidDevice = await this.getHidDeviceByName(deviceName);
    if (hidDevice === null) {
      throw new DeviceNotFoundError(`Device not found: ${deviceName}`);
    }
    const device = new WebHidHeadSet(hidDevice);
    await device.connect();
    this.currentDevice = device;
    this.forwardDeviceEvents(device);
  }

  /**
   * Отключение от текущего устройства.
   */
  async disconnect(): Promise<void> {
    if (this.currentDevice === null) {
      return;
    }
    await this.currentDevice.disconnect();
    this.currentDevice = null;
  }

  /**
   * Возможности текущего устройства (canMute, canAnswer и т.д.). Пустой объект, если устройство не подключено.
   */
  getCapabilities(): TCapabilities {
    if (this.currentDevice === null) {
      return {};
    }
    return this.currentDevice.getCapabilities();
  }

  /**
   * Отправка команды на устройство (Uint8Array, массив чисел или ArrayBuffer).
   * @throws {OperationFailedError} если устройство не подключено.
   */
  async send(command: unknown): Promise<void> {
    if (this.currentDevice === null) {
      throw new OperationFailedError('No device connected');
    }
    await this.currentDevice.send(command);
  }

  private async getHidDeviceByName(name: string): Promise<HIDDevice | null> {
    if (this.searcher instanceof WebHidSearcher) {
      return this.searcher.getHidDeviceByName(name);
    }
    return null;
  }

  private forwardDeviceEvents(device: THeadSet): void {
    for (const event of DEVICE_EVENTS) {
      device.on(event, (payload: unknown) => {
        this.events.trigger(event as keyof THeadSetEventMap, payload as THeadSetEventMap[keyof THeadSetEventMap]);
      });
    }
  }
}

export default HeadSetManager;
