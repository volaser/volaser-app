import { inject, injectable } from 'tsyringe';
import { DataPointStore } from '../stores/DataPointStore';
import { IDataPoint } from '../../core/dataPoints/models/IDataPoint';
import { LoadDataPointsUsecase } from '../../core/dataPoints/usecases/LoadDataPointsUsecase';
import { ExportDataPointsUsecase } from '../../core/dataPoints/usecases/ExportDataPointsUsecase';
import { SaveDataPointsUsecase } from '../../core/dataPoints/usecases/SaveDataPointsUsecase';
import { DeletePictureUsecase } from '../../core/dataPoints/usecases/DeletePictureUsecase';

@injectable()
export class DataTableScreenPresenter {
  constructor(
    @inject(LoadDataPointsUsecase)
    private readonly loadDataPointsUsecase: LoadDataPointsUsecase,
    @inject(ExportDataPointsUsecase)
    private readonly exportDataPointsUsecase: ExportDataPointsUsecase,
    @inject(SaveDataPointsUsecase)
    private readonly saveDataPointsUsecase: SaveDataPointsUsecase,
    @inject(DataPointStore)
    private readonly dataPointStore: DataPointStore,
    @inject(DeletePictureUsecase)
    private readonly deletePictureUsecase: DeletePictureUsecase,
  ) {
    this.load();
  }

  async load(): Promise<void> {
    const dataPoints = await this.loadDataPointsUsecase.execute();
    this.dataPointStore.setDataPoints(dataPoints ? dataPoints : []);
  }

  getDataPoints(): Array<IDataPoint> {
    return this.dataPointStore.getDataPoints();
  }

  async removeDataPoints(indices: number[]): Promise<void> {
    const dataPoints = this.dataPointStore.getDataPoints();
    for await (const index of indices) {
      const dataPoint: IDataPoint = dataPoints[index];
      if (dataPoint.pictures) {
        for await (const picture of dataPoint.pictures) {
          await this.removePicture(index, picture);
        }
      }
      this.dataPointStore.delete(index);
    }
    this.saveDataPointsUsecase.execute(this.dataPointStore.getDataPoints());
  }

  async removePicture(index: number, pictureURI: string): Promise<string[]> {
    const dataPoints = this.dataPointStore.getDataPoints();
    return this.deletePictureUsecase.execute(dataPoints, index, pictureURI);
  }

  async exportDataPoints(indices: number[]): Promise<void> {
    let dataPoints: Array<IDataPoint> = [
      ...this.dataPointStore.getDataPoints(),
    ];

    await this.exportDataPointsUsecase.execute(
      dataPoints.filter((_value, index) => indices.includes(index)),
    );
  }
}
