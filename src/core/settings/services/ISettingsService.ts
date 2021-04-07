import { IAppSettings } from '../models/IAppSettings';

export interface ISettingsService {
  loadSettings(): Promise<IAppSettings | undefined>;
  saveSettings(settings: IAppSettings): Promise<void>;
}
