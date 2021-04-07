import { IUsecase } from '../../utils/IUsecase';
import { inject, injectable } from 'tsyringe';
import { ILaserService } from '../services/ILaserService';

@injectable()
export class GetLaserConnectionUsecase implements IUsecase<void, boolean> {
  constructor(
    @inject('ILaserService')
    private readonly laserService: ILaserService,
  ) {}

  execute(): boolean {
    return this.laserService.isConnected();
  }
}
