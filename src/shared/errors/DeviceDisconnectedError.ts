import ErrorCode from './codes';

class DeviceDisconnectedError extends Error {
  readonly code = ErrorCode.DEVICE_DISCONNECTED;

  constructor(message: string) {
    super(message);
    this.name = 'DeviceDisconnectedError';
    Object.setPrototypeOf(this, DeviceDisconnectedError.prototype);
  }
}

export default DeviceDisconnectedError;
