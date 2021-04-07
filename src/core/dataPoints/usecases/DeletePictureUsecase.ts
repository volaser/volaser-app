import { inject, injectable } from 'tsyringe';
import { IUsecase } from '../../utils/IUsecase';
import { IDataPoint } from '../models/IDataPoint';
import { IDataPointService } from '../services/IDataPointService';
import { IFileSystemService } from '../services/IFileSystemService';

@injectable()
export class DeletePictureUsecase 
  implements IUsecase<Array<IDataPoint> | number | string, void> {
  constructor(
    @inject('IDataPointService')
    private readonly dataPointService: IDataPointService,
    @inject('IFileSystemService')
    private readonly fs: IFileSystemService,
  ) {}

  /*
  * Remove picture from both FS and datapoint and returns new list of pictures for that datapoint
  */
  async execute(dataPoints: Array<IDataPoint>, index: number, pictureURI: string): Promise<string[]> {
    await this.fs.rm(pictureURI);
    dataPoints[index].pictures = dataPoints[index].pictures?.filter(picture  => picture !== pictureURI)
    await this.dataPointService.saveDataPoints(dataPoints);
    if (dataPoints[index].pictures) {
      return dataPoints[index].pictures as string[];
    } 
    return [];
  }
}
