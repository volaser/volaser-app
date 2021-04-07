import { inject, injectable } from 'tsyringe';
import { DataPointStore } from '../stores/DataPointStore';
import { IDataPoint } from '../../core/dataPoints/models/IDataPoint';
import { ExportDataPointsUsecase } from '../../core/dataPoints/usecases/ExportDataPointsUsecase';
import { SaveDataPointsUsecase } from '../../core/dataPoints/usecases/SaveDataPointsUsecase';
import { DeletePictureUsecase } from '../../core/dataPoints/usecases/DeletePictureUsecase';
import { TakePictureUseCase } from '../../core/dataPoints/usecases/TakePictureUseCase';
import { PickPictureFromGalleryUseCase } from '../../core/dataPoints/usecases/PickPictureFromGalleryUseCase';
import { Alert, Linking } from 'react-native';

@injectable()
export class DataCardScreenPresenter {
  constructor(
    @inject(DataPointStore)
    private readonly dataPointStore: DataPointStore,
    @inject(ExportDataPointsUsecase)
    private readonly exportDataPointsUsecase: ExportDataPointsUsecase,
    @inject(SaveDataPointsUsecase)
    private readonly saveDataPointsUsecase: SaveDataPointsUsecase,
    @inject(DeletePictureUsecase)
    private readonly deletePictureUsecase: DeletePictureUsecase,
    @inject(TakePictureUseCase)
    private readonly takePictureUseCase: TakePictureUseCase,
    @inject(PickPictureFromGalleryUseCase)
    private readonly pickPictureFromGalleryUseCase: PickPictureFromGalleryUseCase,
  ) {}

  async removeDataPoint(index: number) {
    const dataPoints = this.dataPointStore.getDataPoints();
    const dataPoint = dataPoints[index];
    if (dataPoint.pictures) {
      for await (const picture of dataPoint.pictures) {
        await this.removePicture(index, picture);
      }
    }
    this.dataPointStore.delete(index);
    this.saveDataPointsUsecase.execute(this.dataPointStore.getDataPoints());
  }

  async editNote(index: number, note: string): Promise<void> {
    const dataPoints = this.dataPointStore.getDataPoints();
    dataPoints[index].note = note;
    await this.saveDataPointsUsecase.execute(dataPoints);
  }

  async editPictures(index: number, pictures: string[]): Promise<void> {
    const dataPoints = this.dataPointStore.getDataPoints();
    dataPoints[index].pictures = pictures;
    await this.saveDataPointsUsecase.execute(dataPoints);
  }

  async removePicture(index: number, pictureURI: string): Promise<string[]> {
    const dataPoints = this.dataPointStore.getDataPoints();
    return this.deletePictureUsecase.execute(dataPoints, index, pictureURI);
  }

  async exportDataPoint(dataPoint: IDataPoint): Promise<void> {
    await this.exportDataPointsUsecase.execute([dataPoint]);
  }

  async selectPictureFromGallery(
    dataPoint: IDataPoint,
    afterAction: Function,
  ): Promise<void> {
    const picturePath = await this.pickPictureFromGalleryUseCase.execute(
      dataPoint,
    );
    afterAction(picturePath);
  }

  async takePicture(
    dataPoint: IDataPoint,
    afterAction: Function,
  ): Promise<void> {
    const picturePath = await this.takePictureUseCase.execute(dataPoint);
    afterAction(picturePath);
  }

  async openMap(dataPoint: IDataPoint) {
    if (dataPoint.location) {
      const url = `geo:${dataPoint.location.latitude},${
        dataPoint.location.longitude
      }?q=${dataPoint.location.latitude},${
        dataPoint.location.longitude
      }(Label+Name)`;
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'Could not open map!',
            'You need to have a map installed (e.g. Google Maps)',
          );
        }
      });
    }
  }
}
