import { container } from 'tsyringe';
import { Gyroscope } from './infrastructure/devices/Gyroscope';
import { LaserService } from './infrastructure/services/LaserService';
import { DataPointService } from './infrastructure/services/DataPointService';
import { SettingsService } from './infrastructure/services/SettingsService';
import { RotationService } from './infrastructure/services/RotationService';
import { FileSystemService } from './infrastructure/services/FileSystemService';
import { GetLaserConnectionUsecase } from './core/measurement/usecases/GetLaserConnectionUsecase';
import { LoadDataPointsUsecase } from './core/dataPoints/usecases/LoadDataPointsUsecase';
import { SaveDataPointsUsecase } from './core/dataPoints/usecases/SaveDataPointsUsecase';
import { GetDeviceRotationUsecase } from './core/measurement/usecases/GetDeviceRotationUsecase';
import { MeasureDistanceUsecase } from './core/measurement/usecases/MeasureDistanceUsecase';
import { LoadSettingsUsecase } from './core/settings/usecases/LoadSettingsUsecase';
import { SaveSettingsUsecase } from './core/settings/usecases/SaveSettingsUsecase';
import { SettingsStore } from './ui/stores/SettingsStore';
import { DataCardScreenPresenter } from './ui/presenters/DataCardScreenPresenter';
import { DataPointStore } from './ui/stores/DataPointStore';
import { DataTableScreenPresenter } from './ui/presenters/DataTableScreenPresenter';
import { DebugScreenPresenter } from './ui/presenters/DebugScreenPresenter';
import { MeasurementScreenPresenter } from './ui/presenters/MeasurementScreenPresenter';
import { SettingsScreenPresenter } from './ui/presenters/SettingsScreenPresenter';
import { ExportDataPointsUsecase } from './core/dataPoints/usecases/ExportDataPointsUsecase';
import { DeletePictureUsecase } from './core/dataPoints/usecases/DeletePictureUsecase';
import { TakePictureUseCase } from './core/dataPoints/usecases/TakePictureUseCase';
import { PickPictureFromGalleryUseCase } from './core/dataPoints/usecases/PickPictureFromGalleryUseCase';

export const injectAppDependencies = () => {
  /* SERVICES */
  container.register('IRotationDevice', { useValue: new Gyroscope() });

  container.register('IDataPointService', { useClass: DataPointService });
  container.register('ILaserService', { useClass: LaserService });
  container.register('IRotationService', {
    useValue: new RotationService(container.resolve('IRotationDevice')),
  });
  container.register('ISettingsService', { useClass: SettingsService });
  container.register('IFileSystemService', { useClass: FileSystemService });

  /* USECASES */
  container.register(LoadDataPointsUsecase, {
    useValue: new LoadDataPointsUsecase(container.resolve('IDataPointService')),
  });
  container.register(SaveDataPointsUsecase, {
    useValue: new SaveDataPointsUsecase(container.resolve('IDataPointService')),
  });
  container.register(ExportDataPointsUsecase, {
    useValue: new ExportDataPointsUsecase(
      container.resolve('IDataPointService'),
      container.resolve('IFileSystemService'),
    ),
  });
  container.register(DeletePictureUsecase, {
    useValue: new DeletePictureUsecase(
      container.resolve('IDataPointService'),
      container.resolve('IFileSystemService'),
    ),
  });
  container.register(TakePictureUseCase, {
    useValue: new TakePictureUseCase(
      container.resolve('IFileSystemService'),
      container.resolve('IDataPointService'),
    ),
  });
  container.register(PickPictureFromGalleryUseCase, {
    useValue: new PickPictureFromGalleryUseCase(
      container.resolve('IFileSystemService'),
      container.resolve('IDataPointService'),
    ),
  });
  container.register(GetDeviceRotationUsecase, {
    useValue: new GetDeviceRotationUsecase(
      container.resolve('IRotationService'),
    ),
  });
  container.register(GetLaserConnectionUsecase, {
    useValue: new GetLaserConnectionUsecase(container.resolve('ILaserService')),
  });
  container.register(MeasureDistanceUsecase, {
    useValue: new MeasureDistanceUsecase(container.resolve('ILaserService')),
  });
  container.register(LoadSettingsUsecase, {
    useValue: new LoadSettingsUsecase(container.resolve('ISettingsService')),
  });
  container.register(SaveSettingsUsecase, {
    useValue: new SaveSettingsUsecase(container.resolve('ISettingsService')),
  });

  /* PRESENTERS */
  container.register(DataCardScreenPresenter, {
    useValue: new DataCardScreenPresenter(
      container.resolve(DataPointStore),
      container.resolve(ExportDataPointsUsecase),
      container.resolve(SaveDataPointsUsecase),
      container.resolve(DeletePictureUsecase),
      container.resolve(TakePictureUseCase),
      container.resolve(PickPictureFromGalleryUseCase),
    ),
  });
  container.register(DataTableScreenPresenter, {
    useValue: new DataTableScreenPresenter(
      container.resolve(LoadDataPointsUsecase),
      container.resolve(ExportDataPointsUsecase),
      container.resolve(SaveDataPointsUsecase),
      container.resolve(DataPointStore),
      container.resolve(DeletePictureUsecase),
    ),
  });
  container.register(DebugScreenPresenter, {
    useValue: new DebugScreenPresenter(
      container.resolve(GetLaserConnectionUsecase),
      container.resolve(GetDeviceRotationUsecase),
      container.resolve(MeasureDistanceUsecase),
    ),
  });
  container.register(MeasurementScreenPresenter, {
    useValue: new MeasurementScreenPresenter(
      container.resolve(GetLaserConnectionUsecase),
      container.resolve(MeasureDistanceUsecase),
      container.resolve(GetDeviceRotationUsecase),
      container.resolve(SaveDataPointsUsecase),
      container.resolve(DataPointStore),
      container.resolve(SettingsStore),
    ),
  });
  container.register(SettingsScreenPresenter, {
    useValue: new SettingsScreenPresenter(
      container.resolve(LoadSettingsUsecase),
      container.resolve(SaveSettingsUsecase),
      container.resolve(SettingsStore),
    ),
  });
};
