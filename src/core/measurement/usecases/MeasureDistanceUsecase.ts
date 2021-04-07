import { IUsecase } from '../../utils/IUsecase';
import { inject, injectable } from 'tsyringe';
import { ILaserService } from '../services/ILaserService';
import { ILaserPayload } from '../models/ILaserPayload';

@injectable()
export class MeasureDistanceUsecase
  implements IUsecase<void, Promise<ILaserPayload>> {
  constructor(
    @inject('ILaserService')
    private readonly laserService: ILaserService,
  ) {}

  async execute(): Promise<ILaserPayload> {
    return await this.laserService.measure();
  }
}
