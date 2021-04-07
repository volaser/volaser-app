import { IUsecase } from '../../utils/IUsecase';
import { IRotationService } from '../services/IRotationService';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetDeviceRotationUsecase implements IUsecase<void, number> {
  constructor(
    @inject('IRotationService')
    private readonly rotationService: IRotationService,
  ) {}

  execute(): number {
    return this.rotationService.getRotation();
  }
}
