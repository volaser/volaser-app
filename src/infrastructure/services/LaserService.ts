import { ILaserService } from '../../core/measurement/services/ILaserService';

import {
  actions,
  definitions,
  ReturnedDataTypes,
  RNSerialport,
} from 'react-native-serialport';
import { DeviceEventEmitter } from 'react-native';
import { ILaserPayload } from '../../core/measurement/models/ILaserPayload';
import { observable } from 'mobx';

const FRAME_HEADER = '59';
const FRAME_INDEX_HEADER_1 = 0;
const FRAME_INDEX_HEADER_2 = 1;
const FRAME_INDEX_DISTANCE_LOW = 2;
const FRAME_INDEX_DISTANCE_HIGH = 3;
const FRAME_INDEX_STRENGTH_LOW = 4;
const FRAME_INDEX_STRENGTH_HIGH = 5;

export class LaserService implements ILaserService {
  @observable connected = false;
  serviceStarted = false;
  baudRate = 115200;
  interface = -1;

  constructor() {
    this.startListener();
  }

  isConnected() {
    return this.connected;
  }

  startListener(): void {
    DeviceEventEmitter.addListener(
      actions.ON_SERVICE_STARTED,
      response => {
        this.serviceStarted = true;
        if (response.deviceAttached) {
          this.connected = true;
        }
      },
      this,
    );
    DeviceEventEmitter.addListener(
      actions.ON_SERVICE_STOPPED,
      () => (this.serviceStarted = false),
      this,
    );
    DeviceEventEmitter.addListener(
      actions.ON_DEVICE_ATTACHED,
      () => {
        this.connected = true;
      },
      this,
    );
    DeviceEventEmitter.addListener(
      actions.ON_DEVICE_DETACHED,
      () => {
        this.connected = false;
      },
      this,
    );
    DeviceEventEmitter.addListener(actions.ON_ERROR, this.onError, this);
    DeviceEventEmitter.addListener(
      actions.ON_CONNECTED,
      () => {
        this.connected = true;
      },
      this,
    );
    DeviceEventEmitter.addListener(
      actions.ON_DISCONNECTED,
      () => {
        this.connected = false;
      },
      this,
    );

    RNSerialport.setReturnedDataType(definitions.RETURNED_DATA_TYPES
      .HEXSTRING as ReturnedDataTypes);
    RNSerialport.setAutoConnectBaudRate(this.baudRate);
    RNSerialport.setInterface(this.interface);
    RNSerialport.setAutoConnect(true);
    RNSerialport.startUsbService();
  }
  async stopListener(): Promise<void> {
    DeviceEventEmitter.removeAllListeners();
    const isOpen = await RNSerialport.isOpen();
    if (isOpen) {
      RNSerialport.disconnect();
    }
    RNSerialport.stopUsbService();
  }

  onError(error: Error): void {
    throw error;
  }

  async measure(): Promise<ILaserPayload> {
    return new Promise(resolve => {
      let subscription = DeviceEventEmitter.addListener(
        actions.ON_READ_DATA,
        data => {
          resolve(this.hexStringToPayload(data.payload));
          subscription.remove();
        },
        this,
      );
    });
  }

  private hexStringToPayload(hexString: string): ILaserPayload {
    const hexArray = this.createHexArrayFromString(hexString, 2);
    if (!this.frameLegit(hexArray)) {
      return { distance: 0, strength: 0 };
    }
    const distance = this.shiftAndCombineBytes(
      hexArray[FRAME_INDEX_DISTANCE_LOW],
      hexArray[FRAME_INDEX_DISTANCE_HIGH],
    );
    const strength = this.shiftAndCombineBytes(
      hexArray[FRAME_INDEX_STRENGTH_LOW],
      hexArray[FRAME_INDEX_STRENGTH_HIGH],
    );

    return {
      distance: distance / 100,
      strength,
    };
  }

  private createHexArrayFromString(
    hexString: string,
    size: number,
  ): Array<string> {
    const hexArray = [];
    while (hexString.length >= size) {
      hexArray.push(hexString.substring(0, size));

      hexString = hexString.substring(size, hexString.length);
    }
    return hexArray;
  }

  private frameLegit(hexArray: Array<string>): boolean {
    if (
      hexArray[FRAME_INDEX_HEADER_1] !== FRAME_HEADER ||
      hexArray[FRAME_INDEX_HEADER_2] !== FRAME_HEADER
    ) {
      return false;
    }
    return true;
  }

  private shiftAndCombineBytes(lowByte: string, highByte: string): number {
    const low = parseInt(lowByte, 16);
    const high = parseInt(highByte, 16);
    return ((high & 0xff) << 8) | (low & 0xff);
  }
}
