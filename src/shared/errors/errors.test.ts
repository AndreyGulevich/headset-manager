import {
  ErrorCode,
  DeviceNotFoundError,
  EventNotSupportedError,
  DeviceDisconnectedError,
  OperationFailedError,
  errors,
} from './index';

const MESSAGE = 'test message';

describe('shared/errors', () => {
  describe('ErrorCode', () => {
    it('должен содержать коды ошибок с префиксом ID_', () => {
      expect(ErrorCode.DEVICE_NOT_FOUND).toBe('ID_DEVICE_NOT_FOUND');
      expect(ErrorCode.EVENT_NOT_SUPPORTED).toBe('ID_EVENT_NOT_SUPPORTED');
      expect(ErrorCode.DEVICE_DISCONNECTED).toBe('ID_DEVICE_DISCONNECTED');
      expect(ErrorCode.OPERATION_FAILED).toBe('ID_OPERATION_FAILED');
    });
  });

  describe('DeviceNotFoundError', () => {
    it('должен иметь имя DeviceNotFoundError и поле code при создании', () => {
      const error = new DeviceNotFoundError(MESSAGE);

      expect(error.name).toBe('DeviceNotFoundError');
      expect(error.message).toBe(MESSAGE);
      expect(error.code).toBe(ErrorCode.DEVICE_NOT_FOUND);
    });
  });

  describe('EventNotSupportedError', () => {
    it('должен иметь имя EventNotSupportedError и поле code при создании', () => {
      const error = new EventNotSupportedError(MESSAGE);

      expect(error.name).toBe('EventNotSupportedError');
      expect(error.message).toBe(MESSAGE);
      expect(error.code).toBe(ErrorCode.EVENT_NOT_SUPPORTED);
    });
  });

  describe('DeviceDisconnectedError', () => {
    it('должен иметь имя DeviceDisconnectedError и поле code при создании', () => {
      const error = new DeviceDisconnectedError(MESSAGE);

      expect(error.name).toBe('DeviceDisconnectedError');
      expect(error.message).toBe(MESSAGE);
      expect(error.code).toBe(ErrorCode.DEVICE_DISCONNECTED);
    });
  });

  describe('OperationFailedError', () => {
    it('должен иметь имя OperationFailedError и поле code при создании', () => {
      const error = new OperationFailedError(MESSAGE);

      expect(error.name).toBe('OperationFailedError');
      expect(error.message).toBe(MESSAGE);
      expect(error.code).toBe(ErrorCode.OPERATION_FAILED);
    });
  });

  describe('errors', () => {
    it('должен вернуть true при передаче экземпляра DeviceNotFoundError в hasDeviceNotFoundError', () => {
      const error = new DeviceNotFoundError(MESSAGE);

      expect(errors.hasDeviceNotFoundError(error)).toBe(true);
    });

    it('должен вернуть false при передаче другого типа в hasDeviceNotFoundError', () => {
      expect(errors.hasDeviceNotFoundError(new Error())).toBe(false);
      expect(errors.hasDeviceNotFoundError(null)).toBe(false);
    });

    it('должен вернуть true при передаче экземпляра EventNotSupportedError в hasEventNotSupportedError', () => {
      const error = new EventNotSupportedError(MESSAGE);

      expect(errors.hasEventNotSupportedError(error)).toBe(true);
    });

    it('должен вернуть true при передаче экземпляра DeviceDisconnectedError в hasDeviceDisconnectedError', () => {
      const error = new DeviceDisconnectedError(MESSAGE);

      expect(errors.hasDeviceDisconnectedError(error)).toBe(true);
    });

    it('должен вернуть true при передаче экземпляра OperationFailedError в hasOperationFailedError', () => {
      const error = new OperationFailedError(MESSAGE);

      expect(errors.hasOperationFailedError(error)).toBe(true);
    });
  });
});
