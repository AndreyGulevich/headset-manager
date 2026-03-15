import { jest } from '@jest/globals';
import HeadSetManager from './HeadSetManager';
import WebHidSearcher from '@/entities/WebHidSearcher/WebHidSearcher';
import { DeviceNotFoundError, errors } from '@/shared/errors';
import type { TDeviceSearcher } from '@/entities/WebHidSearcher/types';
import type { TDeviceInfo } from '@/shared/types';

const DEVICE_NAME = 'Test Device';

const createMockSearcher = (overrides: {
  findDeviceByName?: (name: string) => Promise<TDeviceInfo | null>;
  getHidDeviceByName?: (name: string) => Promise<HIDDevice | null>;
} = {}) => {
  const findDeviceByName =
    overrides.findDeviceByName ?? jest.fn<() => Promise<TDeviceInfo | null>>().mockResolvedValue(null);
  const getHidDeviceByName =
    overrides.getHidDeviceByName ?? jest.fn<() => Promise<HIDDevice | null>>().mockResolvedValue(null);
  return {
    findDeviceByName,
    getHidDeviceByName,
    getDevices: jest.fn<() => Promise<HIDDevice[]>>().mockResolvedValue([]),
  } as unknown as TDeviceSearcher & { findDeviceByName: jest.Mock; getHidDeviceByName: jest.Mock };
};

const createMockHidDevice = () => ({
  open: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  close: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  sendReport: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
});

describe('HeadSetManager', () => {
  let mockSearcher: ReturnType<typeof createMockSearcher>;

  beforeEach(() => {
    mockSearcher = createMockSearcher();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connect', () => {
    it('должен выбросить DeviceNotFoundError при отсутствии устройства по имени', async () => {
      (mockSearcher.findDeviceByName as jest.Mock<() => Promise<TDeviceInfo | null>>).mockResolvedValue(null);
      const manager = new HeadSetManager(mockSearcher);
      let thrown: unknown;
      try {
        await manager.connect(DEVICE_NAME);
      } catch (e) {
        thrown = e;
      }

      expect(thrown).toBeInstanceOf(DeviceNotFoundError);
      expect(errors.hasDeviceNotFoundError(thrown)).toBe(true);
    });

    it('должен подключиться и сохранить устройство при наличии устройства и WebHidSearcher', async () => {
      const deviceInfo: TDeviceInfo = {
        id: '1-2',
        name: DEVICE_NAME,
        vendorId: 1,
        productId: 2,
      };
      const hidDevice = createMockHidDevice();
      (mockSearcher.findDeviceByName as jest.Mock<() => Promise<TDeviceInfo | null>>).mockResolvedValue(deviceInfo);
      const hidDeviceWithName = { ...hidDevice, productName: DEVICE_NAME } as unknown as HIDDevice;
      const searcher = new WebHidSearcher({
        getDevices: jest.fn<() => Promise<HIDDevice[]>>().mockResolvedValue([hidDeviceWithName]),
      } as unknown as { getDevices(): Promise<HIDDevice[]> });
      const manager = new HeadSetManager(searcher);

      await manager.connect(DEVICE_NAME);

      expect(manager.getCapabilities()).toEqual({
        canMute: true,
        canAnswer: true,
        canReject: true,
        canHandleCall: true,
      });
    });
  });

  describe('disconnect', () => {
    it('должен выполниться без ошибки при отсутствии текущего устройства', async () => {
      const manager = new HeadSetManager(mockSearcher);

      await expect(manager.disconnect()).resolves.toBeUndefined();
    });
  });

  describe('getCapabilities', () => {
    it('должен вернуть пустой объект при отсутствии подключённого устройства', () => {
      const manager = new HeadSetManager(mockSearcher);

      expect(manager.getCapabilities()).toEqual({});
    });
  });

  describe('send', () => {
    it('должен выбросить ошибку при вызове send без подключённого устройства', async () => {
      const manager = new HeadSetManager(mockSearcher);

      await expect(manager.send([1, 2, 3])).rejects.toThrow('No device connected');
    });
  });

  describe('on/off', () => {
    it('должен подписаться на событие через on и отписаться через off', () => {
      const manager = new HeadSetManager(mockSearcher);
      const callback = jest.fn();
      manager.on('muted-mic', callback);
      manager.off('muted-mic', callback);

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
