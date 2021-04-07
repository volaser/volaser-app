import { action, observable } from 'mobx';
import { singleton } from 'tsyringe';
import { IAppSettings } from '../../core/settings/models/IAppSettings';

@singleton()
export class SettingsStore {
  @observable
  private appSettings: IAppSettings = {
    measurementPeriod: 100,
    horizontalOffset: 11.6,
    verticalOffset: -3,
  };

  getAppSettings(): IAppSettings {
    return this.appSettings;
  }

  @action
  setAppSettings(appSettings: IAppSettings) {
    this.appSettings = appSettings;
  }

  @action
  setMeasurementPeriod(measurementPeriod: number) {
    this.appSettings.measurementPeriod = measurementPeriod;
  }
}
