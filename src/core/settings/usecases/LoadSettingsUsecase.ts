import { inject, injectable } from 'tsyringe';
import { IAppSettings } from '../models/IAppSettings';
import { ISettingsService } from '../services/ISettingsService';
import { IUsecase } from '../../utils/IUsecase';

@injectable()
export class LoadSettingsUsecase
  implements IUsecase<void, Promise<IAppSettings | undefined>> {
  constructor(
    @inject('ISettingsService')
    private readonly settingsService: ISettingsService,
  ) {}

  async execute(): Promise<IAppSettings | undefined> {
    return await this.settingsService.loadSettings();
  }
}
