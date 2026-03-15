import type { THeadSet } from './types';
import type { TCapabilities } from '@/shared/types';
import type { THeadSetEventMap } from '@/shared/types';
import { TypedEvents, EventEmitterProxy } from 'events-constructor';
import { HEADSET_EVENT_NAMES } from '@/shared/types';

abstract class BaseHeadSet extends EventEmitterProxy<THeadSetEventMap> implements THeadSet {
  constructor() {
    super(new TypedEvents<THeadSetEventMap>(HEADSET_EVENT_NAMES));
  }

  abstract send(data: unknown): Promise<void>;
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getCapabilities(): TCapabilities;
}

export default BaseHeadSet;
