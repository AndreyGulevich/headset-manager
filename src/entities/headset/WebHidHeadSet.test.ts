import { jest } from '@jest/globals';
import WebHidHeadSet from './WebHidHeadSet';

const createMockDevice = () => {
  const open = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const close = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const sendReport = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const addEventListener = jest.fn();
  const removeEventListener = jest.fn();
  return {
    open,
    close,
    sendReport,
    addEventListener,
    removeEventListener,
  };
};

describe('WebHidHeadSet', () => {
  let mockDevice: ReturnType<typeof createMockDevice>;

  beforeEach(() => {
    mockDevice = createMockDevice();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connect', () => {
    it('должен вызвать open и подписаться на inputreport при вызове connect', async () => {
      const headset = new WebHidHeadSet(mockDevice as unknown as HIDDevice);

      await headset.connect();

      expect(mockDevice.open).toHaveBeenCalled();
      expect(mockDevice.addEventListener).toHaveBeenCalledWith('inputreport', expect.any(Function));
    });
  });

  describe('disconnect', () => {
    it('должен вызвать removeEventListener и close при вызове disconnect после connect', async () => {
      const headset = new WebHidHeadSet(mockDevice as unknown as HIDDevice);
      await headset.connect();
      const call = mockDevice.addEventListener.mock.calls.find((c) => c[0] === 'inputreport');
      const handler = call?.[1];

      await headset.disconnect();

      expect(mockDevice.removeEventListener).toHaveBeenCalledWith('inputreport', handler);
      expect(mockDevice.close).toHaveBeenCalled();
    });
  });

  describe('send', () => {
    it('должен вызвать sendReport с reportId 0 и Uint8Array при передаче массива чисел', async () => {
      const headset = new WebHidHeadSet(mockDevice as unknown as HIDDevice);
      const data = [1, 2, 3];

      await headset.send(data);

      expect(mockDevice.sendReport).toHaveBeenCalledWith(0, new Uint8Array([1, 2, 3]));
    });

    it('должен вызвать sendReport при передаче Uint8Array', async () => {
      const headset = new WebHidHeadSet(mockDevice as unknown as HIDDevice);
      const data = new Uint8Array([4, 5, 6]);

      await headset.send(data);

      expect(mockDevice.sendReport).toHaveBeenCalledWith(0, data);
    });

    it('должен выбросить TypeError при передаче неподдерживаемого типа', async () => {
      const headset = new WebHidHeadSet(mockDevice as unknown as HIDDevice);

      await expect(headset.send('invalid')).rejects.toThrow(TypeError);
    });
  });

  describe('getCapabilities', () => {
    it('должен вернуть объект с булевыми флагами возможностей', () => {
      const headset = new WebHidHeadSet(mockDevice as unknown as HIDDevice);

      const caps = headset.getCapabilities();

      expect(caps).toEqual({
        canMute: true,
        canAnswer: true,
        canReject: true,
        canHandleCall: true,
      });
    });
  });

  describe('on/off', () => {
    it('должен вызывать callback при эмите события inputreport после получения данных от устройства', async () => {
      const headset = new WebHidHeadSet(mockDevice as unknown as HIDDevice);
      await headset.connect();
      const call = mockDevice.addEventListener.mock.calls.find((c) => c[0] === 'inputreport');
      const handler = call?.[1] as (ev: { reportId: number; data: DataView }) => void;
      const callback = jest.fn();
      headset.on('inputreport', callback);
      const dataView = new DataView(new ArrayBuffer(2));
      const ev = { reportId: 0, data: dataView };

      handler(ev);

      expect(callback).toHaveBeenCalledWith({ reportId: 0, data: new Uint8Array(2) });
    });
  });
});
