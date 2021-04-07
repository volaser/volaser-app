import { inject, injectable } from 'tsyringe';
import { IUsecase } from '../../utils/IUsecase';
import { IDataPoint } from '../models/IDataPoint';
import { IDataPointService } from '../services/IDataPointService';

@injectable()
export class SaveDataPointsUsecase
  implements IUsecase<Array<IDataPoint>, void> {
  constructor(
    @inject('IDataPointService')
    private readonly dataPointService: IDataPointService,
  ) {}

  execute(dataPoints: Array<IDataPoint>): Promise<void> {
    return this.dataPointService.saveDataPoints(dataPoints);
  }
}
