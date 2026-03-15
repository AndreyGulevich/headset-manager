export type TCapabilities = {
  canMute?: boolean;
  canAnswer?: boolean;
  canReject?: boolean;
  canHandleCall?: boolean;
  canSetIncomingCall?: boolean;
};

export type TDeviceInfo = {
  id: string;
  name: string;
  vendorId: number;
  productId: number;
  capabilities?: TCapabilities;
};

export type THeadSetEventMap = {
  inputreport: { reportId: number; data: Uint8Array };
  'incoming-call': void;
  'muted-mic': void;
  'unmuted-mic': void;
  'call-answered': void;
  'call-rejected': void;
};

export const HEADSET_EVENT_NAMES = [
  'inputreport',
  'incoming-call',
  'muted-mic',
  'unmuted-mic',
  'call-answered',
  'call-rejected',
] as const satisfies (keyof THeadSetEventMap)[];
