export { HeadSetManager } from '@/features';
export { WebHidSearcher, WebHidHeadSet } from '@/entities';
export type { TCapabilities, TDeviceInfo, THeadSetEventMap } from '@/shared';
export { errors, ErrorCode } from '@/shared';
export {
  DeviceNotFoundError,
  EventNotSupportedError,
  DeviceDisconnectedError,
  OperationFailedError,
} from '@/shared';
