import { ILaserPayload } from '../models/ILaserPayload';

export interface ILaserService {
  isConnected(): boolean;

  startListener(): void;
  stopListener(): Promise<void>;

  measure(): Promise<ILaserPayload>;
}
