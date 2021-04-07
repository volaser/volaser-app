import { IAppSettings } from '../../core/settings/models/IAppSettings';
import { ISettingsService } from '../../core/settings/services/ISettingsService';
import { AsyncPersistentStore } from '../utils/AsyncPersistentStore';

export class SettingsService implements ISettingsService {
  private persistentStore: AsyncPersistentStore<IAppSettings>;

  constructor() {
    this.persistentStore = new AsyncPersistentStore('settings');
  }
  async loadSettings(): Promise<IAppSettings | undefined> {
    return await this.persistentStore.read();
  }
  async saveSettings(settings: IAppSettings): Promise<void> {
    return await this.persistentStore.write(settings);
  }
}
