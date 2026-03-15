import ErrorCode from './codes';

class EventNotSupportedError extends Error {
  readonly code = ErrorCode.EVENT_NOT_SUPPORTED;

  constructor(message: string) {
    super(message);
    this.name = 'EventNotSupportedError';
    Object.setPrototypeOf(this, EventNotSupportedError.prototype);
  }
}

export default EventNotSupportedError;
