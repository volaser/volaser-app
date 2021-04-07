import { inject, injectable } from 'tsyringe';
import { GetLaserConnectionUsecase } from '../../core/measurement/usecases/GetLaserConnectionUsecase';
import { GetDeviceRotationUsecase } from '../../core/measurement/usecases/GetDeviceRotationUsecase';
import { MeasureDistanceUsecase } from '../../core/measurement/usecases/MeasureDistanceUsecase';
import { ILaserPayload } from '../../core/measurement/models/ILaserPayload';
import { action, observable } from 'mobx';

@injectable()
export class DebugScreenPresenter {
  @observable logMessages: Array<string> = [];

  constructor(
    @inject(GetLaserConnectionUsecase)
    private readonly getLaserConnectionUsecase: GetLaserConnectionUsecase,
    @inject(GetDeviceRotationUsecase)
    private readonly getDeviceRotationUsecase: GetDeviceRotationUsecase,
    @inject(MeasureDistanceUsecase)
    private readonly measureDistanceUsecase: MeasureDistanceUsecase,
  ) {}

  isLaserConnected(): boolean {
    return this.getLaserConnectionUsecase.execute();
  }

  getDeviceRotation(): number {
    return this.getDeviceRotationUsecase.execute();
  }

  async measureDistance(): Promise<ILaserPayload> {
    return await this.measureDistanceUsecase.execute();
  }

  @action
  log(message: string) {
    this.logMessages.push(message);
  }
}
