export interface ILaser {
  connected: boolean;
  serviceStarted: boolean;
  attached: boolean;
  baudRate: number;
  interface: number;
  returnedDataType: number;
}
