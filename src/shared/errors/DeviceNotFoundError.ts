import ErrorCode from './codes';

class DeviceNotFoundError extends Error {
  readonly code = ErrorCode.DEVICE_NOT_FOUND;

  constructor(message: string) {
    super(message);
    this.name = 'DeviceNotFoundError';
    Object.setPrototypeOf(this, DeviceNotFoundError.prototype);
  }
}

export default DeviceNotFoundError;
