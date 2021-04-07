import { inject, injectable } from 'tsyringe';
import { IUsecase } from '../../utils/IUsecase';
import { IDataPoint } from '../models/IDataPoint';
import { IDataPointService } from '../services/IDataPointService';

@injectable()
export class LoadDataPointsUsecase
  implements IUsecase<void, Promise<Array<IDataPoint> | undefined>> {
  constructor(
    @inject('IDataPointService')
    private readonly dataPointService: IDataPointService,
  ) {}

  async execute(): Promise<Array<IDataPoint> | undefined> {
    return await this.dataPointService.loadDataPoints();
  }
}
