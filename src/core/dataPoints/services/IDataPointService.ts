import { IDataPoint } from '../models/IDataPoint';

export interface IDataPointService {
  loadDataPoints(): Promise<Array<IDataPoint> | undefined>;
  saveDataPoints(dataPoints: Array<IDataPoint>): Promise<void>;
  safeDataPointName(dataPoint: IDataPoint): string;
}
