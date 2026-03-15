import DeviceNotFoundError from './DeviceNotFoundError';
import EventNotSupportedError from './EventNotSupportedError';
import DeviceDisconnectedError from './DeviceDisconnectedError';
import OperationFailedError from './OperationFailedError';

const errorPredicates = {
  hasDeviceNotFoundError: (error: unknown): boolean => error instanceof DeviceNotFoundError,
  hasEventNotSupportedError: (error: unknown): boolean => error instanceof EventNotSupportedError,
  hasDeviceDisconnectedError: (error: unknown): boolean => error instanceof DeviceDisconnectedError,
  hasOperationFailedError: (error: unknown): boolean => error instanceof OperationFailedError,
};

export default errorPredicates;
