import { inject, injectable } from 'tsyringe';
import { GetLaserConnectionUsecase } from '../../core/measurement/usecases/GetLaserConnectionUsecase';
import { GetDeviceRotationUsecase } from '../../core/measurement/usecases/GetDeviceRotationUsecase';
import { MeasureDistanceUsecase } from '../../core/measurement/usecases/MeasureDistanceUsecase';
import { DataPointStore } from '../stores/DataPointStore';
import { IDataPoint } from '../../core/dataPoints/models/IDataPoint';
import { SettingsStore } from '../stores/SettingsStore';
import { IPoint } from '../../core/dataPoints/models/IPoint';
import { ILaserPayload } from '../../core/measurement/models/ILaserPayload';
import { SaveDataPointsUsecase } from '../../core/dataPoints/usecases/SaveDataPointsUsecase';
import { action, observable } from 'mobx';
import { maths } from '../../core/utils/Maths';
import { ICoordinates } from '../../core/dataPoints/models/ICoordinates';
import { logger } from '../helpers/logger';

@injectable()
export class MeasurementScreenPresenter {
  @observable areaOutline: Array<IPoint> = [];
  @observable measuring: boolean = false;
  measureInterval: any = null;

  constructor(
    @inject(GetLaserConnectionUsecase)
    private readonly getLaserConnectionUsecase: GetLaserConnectionUsecase,
    @inject(MeasureDistanceUsecase)
    private readonly measureDistanceUsecase: MeasureDistanceUsecase,
    @inject(GetDeviceRotationUsecase)
    private readonly getDeviceRotationUsecase: GetDeviceRotationUsecase,
    @inject(SaveDataPointsUsecase)
    private readonly saveDataPointsUsecase: SaveDataPointsUsecase,
    @inject(DataPointStore)
    private readonly dataPointStore: DataPointStore,
    @inject(SettingsStore)
    private readonly settingsStore: SettingsStore,
  ) {}

  isLaserConnected(): boolean {
    return this.getLaserConnectionUsecase.execute();
  }

  getAreaOutline(): Array<IPoint> {
    return this.areaOutline;
  }

  getPointIndexFromAreaOutlineByAngle(angle: number) {
    return this.areaOutline.findIndex(point => {
      return point.angle === angle;
    });
  }

  async measureDistance(): Promise<ILaserPayload> {
    return await this.measureDistanceUsecase.execute();
  }

  async measureDepth(): Promise<number> {
    logger.info('MeasurementScreen: Measuring depth');
    if (!this.isLaserConnected()) {
      return Promise.reject('LASER_DISCONNECTED');
    }
    const measurement = await this.measureDistance();
    const range = measurement.distance;
    if (range > 0 && measurement.strength > 100) {
      return range + this.getVerticalOffset();
    } else {
      return Promise.reject('INVALID_MEASUREMENT');
    }
  }

  getDataPoints(): Array<IDataPoint> {
    return this.dataPointStore.getDataPoints();
  }

  addDataPoint(dataPoint: IDataPoint) {
    this.dataPointStore.push(dataPoint);
    this.saveDataPointsUsecase.execute(this.dataPointStore.getDataPoints());
  }

  getMeasurementPeriod(): number {
    return this.settingsStore.getAppSettings().measurementPeriod;
  }

  getHorizontalOffset(): number {
    return this.settingsStore.getAppSettings().horizontalOffset / 1000;
  }

  getVerticalOffset(): number {
    return this.settingsStore.getAppSettings().verticalOffset / 1000;
  }

  addPointToAreaOutline(point: IPoint): Array<IPoint> {
    this.areaOutline.push(point);
    this.areaOutline = this.areaOutline.slice().sort((a: IPoint, b: IPoint) => {
      return a.angle - b.angle;
    });
    return this.areaOutline;
  }

  saveMeasurement(
    sampleName: string,
    location: ICoordinates | undefined,
    locationName: string | undefined,
    bottomDepth: number,
    sludgeDepth: number,
  ) {
    const areaOutline = this.getAreaOutline();
    const area = maths.areaFromOutline(areaOutline);
    const containmentVolume = maths.volume(area, bottomDepth);
    const fecalSludgeVolume = maths.faecalSludgeVolume(
      area,
      bottomDepth,
      sludgeDepth,
    );

    let dataPoint: IDataPoint = {
      name: sampleName,
      location,
      locationName,
      time: Date(),
      areaOutline,
      area,
      sludgeDepth,
      bottomDepth,
      containmentVolume,
      fecalSludgeVolume,
    };
    this.addDataPoint(dataPoint);
    return dataPoint;
  }

  @action
  startMeasurement(): boolean {
    if (this.isLaserConnected()) {
      this.areaOutline = [];
      this.measuring = true;
      this.measureInterval = setInterval(
        () => this.measureAreaPoint(),
        this.getMeasurementPeriod(),
      );
      return true;
    }
    return false;
  }

  @action
  stopMeasurement(): void {
    clearInterval(this.measureInterval);
    this.measuring = false;
  }

  @action
  private async measureAreaPoint(): Promise<void> {
    const angle = this.getDeviceRotationUsecase.execute();
    const measurement = await this.measureDistance();
    const range = measurement.distance + this.getHorizontalOffset();
    const strength = measurement.strength;
    const pointIndex = this.getPointIndexFromAreaOutlineByAngle(angle);
    if (range > 0 && measurement.strength > 100) {
      let existingPoint: IPoint;
      if (pointIndex !== -1) {
        existingPoint = this.areaOutline[pointIndex];
        existingPoint.measurements++;
        existingPoint.rangeSum += range;
        existingPoint.range = maths.averageRange(
          existingPoint.rangeSum,
          existingPoint.measurements,
        );
      } else {
        const point: IPoint = {
          angle,
          range,
          rangeSum: range,
          measurements: 1,
          strength,
        };
        this.addPointToAreaOutline(point);
      }
    }
  }
}
