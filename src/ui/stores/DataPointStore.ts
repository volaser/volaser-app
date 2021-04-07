import { action, observable } from 'mobx';
import { IDataPoint } from '../../core/dataPoints/models/IDataPoint';
import { singleton } from 'tsyringe';

@singleton()
export class DataPointStore {
  @observable
  private dataPoints: Array<IDataPoint> = [];

  @action
  setDataPoints(dataPoints: Array<IDataPoint>) {
    this.dataPoints = dataPoints;
  }

  getDataPoints(): Array<IDataPoint> {
    return this.dataPoints;
  }

  @action
  push(dataPoint: IDataPoint): void {
    if (!dataPoint.note) {
      dataPoint.note = '';
    }
    if (!dataPoint.pictures) {
      dataPoint.pictures = [];
    }
    this.dataPoints.unshift(dataPoint);
  }

  @action
  delete(index: number): void {
    this.dataPoints = this.dataPoints.filter((item, _index) => {
      return index !== _index;
    });
  }
}
