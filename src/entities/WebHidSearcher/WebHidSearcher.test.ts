import { jest } from '@jest/globals';
import WebHidSearcher from './WebHidSearcher';
import { OperationFailedError } from '@/shared/errors';

const DEVICE_NAME = 'Test Headset';
const VENDOR_ID = 0x1234;
const PRODUCT_ID = 0x5678;
const PRODUCT_NAME = 'Test Headset USB';

const createMockHidDevice = (
  overrides: Partial<{ productName: string; vendorId: number; productId: number }> = {}
) => ({
  productName: PRODUCT_NAME,
  vendorId: VENDOR_ID,
  productId: PRODUCT_ID,
  ...overrides,
});

const createMockHid = (devices: HIDDevice[] = []) => ({
  getDevices: jest.fn<() => Promise<HIDDevice[]>>().mockResolvedValue(devices),
});

describe('WebHidSearcher', () => {
  let mockHid: ReturnType<typeof createMockHid>;

  beforeEach(() => {
    mockHid = createMockHid();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDevices', () => {
    it('должен вернуть массив TDeviceInfo при наличии устройств', async () => {
      const hidDevice = createMockHidDevice();
      mockHid.getDevices.mockResolvedValue([hidDevice as unknown as HIDDevice]);
      const searcher = new WebHidSearcher(mockHid as unknown as { getDevices(): Promise<HIDDevice[]> });

      const result = await searcher.getDevices();

      expect(mockHid.getDevices).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: `${VENDOR_ID}-${PRODUCT_ID}`,
        name: PRODUCT_NAME,
        vendorId: VENDOR_ID,
        productId: PRODUCT_ID,
      });
    });

    it('должен вернуть пустой массив при отсутствии устройств', async () => {
      mockHid.getDevices.mockResolvedValue([] as HIDDevice[]);
      const searcher = new WebHidSearcher(mockHid as unknown as { getDevices(): Promise<HIDDevice[]> });

      const result = await searcher.getDevices();

      expect(result).toEqual([]);
    });

    it('должен выбросить OperationFailedError при отсутствии WebHID в окружении', async () => {
      const searcher = new WebHidSearcher(undefined as unknown as { getDevices(): Promise<HIDDevice[]> });

      await expect(searcher.getDevices()).rejects.toThrow(OperationFailedError);
    });
  });

  describe('findDeviceByName', () => {
    it('должен вернуть TDeviceInfo при совпадении имени по подстроке', async () => {
      const hidDevice = createMockHidDevice();
      mockHid.getDevices.mockResolvedValue([hidDevice as unknown as HIDDevice]);
      const searcher = new WebHidSearcher(mockHid as unknown as { getDevices(): Promise<HIDDevice[]> });

      const result = await searcher.findDeviceByName('Headset');

      expect(result).not.toBeNull();
      expect(result?.name).toBe(PRODUCT_NAME);
    });

    it('должен вернуть null при отсутствии устройства с таким именем', async () => {
      mockHid.getDevices.mockResolvedValue([] as HIDDevice[]);
      const searcher = new WebHidSearcher(mockHid as unknown as { getDevices(): Promise<HIDDevice[]> });

      const result = await searcher.findDeviceByName(DEVICE_NAME);

      expect(result).toBeNull();
    });

    it('должен вернуть null при пустом имени', async () => {
      const hidDevice = createMockHidDevice();
      mockHid.getDevices.mockResolvedValue([hidDevice as unknown as HIDDevice]);
      const searcher = new WebHidSearcher(mockHid as unknown as { getDevices(): Promise<HIDDevice[]> });

      const result = await searcher.findDeviceByName('   ');

      expect(result).toBeNull();
    });
  });

  describe('getHidDeviceByName', () => {
    it('должен вернуть устройство при совпадении имени', async () => {
      const hidDevice = createMockHidDevice();
      mockHid.getDevices.mockResolvedValue([hidDevice as unknown as HIDDevice]);
      const searcher = new WebHidSearcher(mockHid as unknown as { getDevices(): Promise<HIDDevice[]> });

      const result = await searcher.getHidDeviceByName('Test');

      expect(result).toBe(hidDevice);
    });

    it('должен вернуть null при пустом имени', async () => {
      const hidDevice = createMockHidDevice();
      mockHid.getDevices.mockResolvedValue([hidDevice as unknown as HIDDevice]);
      const searcher = new WebHidSearcher(mockHid as unknown as { getDevices(): Promise<HIDDevice[]> });

      const result = await searcher.getHidDeviceByName('');

      expect(result).toBeNull();
    });
  });
});
