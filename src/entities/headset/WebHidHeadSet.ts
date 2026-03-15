import type { TCapabilities } from '@/shared/types';
import BaseHeadSet from './BaseHeadSet';

const DEFAULT_REPORT_ID = 0;

/**
 * Реализация THeadSet для WebHID: открытие устройства, отправка отчётов, подписка на inputreport.
 */
class WebHidHeadSet extends BaseHeadSet {
  private inputReportHandler: ((ev: HIDInputReportEvent) => void) | null = null;

  /**
   * @param device — HIDDevice из navigator.hid.getDevices() или requestDevice().
   */
  constructor(private readonly device: HIDDevice) {
    super();
  }

  async send(data: unknown): Promise<void> {
    const bytes = this.normalizeToBytes(data);
    await this.device.sendReport(DEFAULT_REPORT_ID, bytes as BufferSource);
  }

  async connect(): Promise<void> {
    await this.device.open();
    this.inputReportHandler = this.createInputReportHandler();
    this.device.addEventListener('inputreport', this.inputReportHandler);
  }

  async disconnect(): Promise<void> {
    if (this.inputReportHandler !== null) {
      this.device.removeEventListener('inputreport', this.inputReportHandler);
      this.inputReportHandler = null;
    }
    await this.device.close();
  }

  getCapabilities(): TCapabilities {
    return {
      canMute: true,
      canAnswer: true,
      canReject: true,
      canHandleCall: true,
    };
  }

  private createInputReportHandler(): (ev: HIDInputReportEvent) => void {
    return (ev: HIDInputReportEvent) => {
      const data = new Uint8Array(ev.data.buffer);
      this.events.trigger('inputreport', { reportId: ev.reportId, data });
    };
  }

  private normalizeToBytes(data: unknown): Uint8Array {
    if (data instanceof Uint8Array) {
      return data;
    }
    if (ArrayBuffer.isView(data)) {
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }
    if (data instanceof ArrayBuffer) {
      return new Uint8Array(data);
    }
    if (Array.isArray(data) && data.every((x) => typeof x === 'number')) {
      return new Uint8Array(data as number[]);
    }
    throw new TypeError('send() expects Uint8Array, ArrayBuffer, or array of numbers');
  }
}

export default WebHidHeadSet;
