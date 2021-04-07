import { inject, injectable } from 'tsyringe';
import { IUsecase } from '../../utils/IUsecase';
import { IAppSettings } from '../models/IAppSettings';
import { ISettingsService } from '../services/ISettingsService';

@injectable()
export class SaveSettingsUsecase implements IUsecase<IAppSettings, void> {
  constructor(
    @inject('ISettingsService')
    private readonly settingsService: ISettingsService,
  ) {}

  execute(settings: IAppSettings): Promise<void> {
    return this.settingsService.saveSettings(settings);
  }
}
