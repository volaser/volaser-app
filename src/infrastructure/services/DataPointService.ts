import { IDataPoint } from '../../core/dataPoints/models/IDataPoint';
import { IDataPointService } from '../../core/dataPoints/services/IDataPointService';
import { AsyncPersistentStore } from '../utils/AsyncPersistentStore';

export class DataPointService implements IDataPointService {
  private persistentStore: AsyncPersistentStore<Array<IDataPoint>>;

  constructor() {
    this.persistentStore = new AsyncPersistentStore('datapoints');
  }
  async loadDataPoints(): Promise<Array<IDataPoint> | undefined> {
    return await this.persistentStore.read();
  }
  async saveDataPoints(dataPoints: Array<IDataPoint>): Promise<void> {
    return await this.persistentStore.write(dataPoints);
  }
  safeDataPointName(dataPoint: IDataPoint): string {
    return dataPoint.name.replace(/[^a-zA-Z0-9 ]/g, '');
  }
}
