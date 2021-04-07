import { inject, injectable } from 'tsyringe';
import { LoadSettingsUsecase } from '../../core/settings/usecases/LoadSettingsUsecase';
import { SettingsStore } from '../stores/SettingsStore';
import { IAppSettings } from '../../core/settings/models/IAppSettings';
import { SaveSettingsUsecase } from '../../core/settings/usecases/SaveSettingsUsecase';

@injectable()
export class SettingsScreenPresenter {
  constructor(
    @inject(LoadSettingsUsecase)
    private readonly loadSettingsUsecase: LoadSettingsUsecase,
    @inject(SaveSettingsUsecase)
    private readonly saveSettingsUsecase: SaveSettingsUsecase,
    @inject(SettingsStore)
    private readonly settingsStore: SettingsStore,
  ) {
    this.load();
  }

  async load(): Promise<void> {
    const appSettings = await this.loadSettingsUsecase.execute();
    if (appSettings !== undefined) {
      this.settingsStore.setAppSettings(appSettings);
    }
  }

  getSettings(): IAppSettings {
    return this.settingsStore.getAppSettings();
  }

  setMeasurementPeriod(measurementPeriod: number): void {
    this.settingsStore.setMeasurementPeriod(measurementPeriod);
    this.saveSettings();
  }

  private saveSettings() {
    this.saveSettingsUsecase.execute(this.settingsStore.getAppSettings());
  }
}
