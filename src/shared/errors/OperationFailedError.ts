import ErrorCode from './codes';

class OperationFailedError extends Error {
  readonly code = ErrorCode.OPERATION_FAILED;

  constructor(message: string) {
    super(message);
    this.name = 'OperationFailedError';
    Object.setPrototypeOf(this, OperationFailedError.prototype);
  }
}

export default OperationFailedError;
