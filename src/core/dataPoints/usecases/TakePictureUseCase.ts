import { inject, injectable } from 'tsyringe';
import { IUsecase } from '../../utils/IUsecase';
import { IDataPoint } from '../models/IDataPoint';
import {
  CameraOptions,
  launchCamera,
  MediaType,
} from 'react-native-image-picker';
import { Alert, PermissionsAndroid } from 'react-native';
import { IFileSystemService } from '../services/IFileSystemService';
import { IDataPointService } from '../services/IDataPointService';

@injectable()
export class TakePictureUseCase
  implements IUsecase<IDataPoint, Promise<string>> {
  constructor(
    @inject('IFileSystemService')
    private readonly fs: IFileSystemService,
    @inject('IDataPointService')
    private readonly dataPointService: IDataPointService,
  ) {}

  async execute(dataPoint: IDataPoint): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const cameraPermission = await this.requestCameraPermission();
      const writePermission = await this.requestWritePermission(); // Needed for Android < 10
      if (cameraPermission && writePermission) {
        const safeName = this.dataPointService.safeDataPointName(dataPoint);
        const nowString = Date.now().toString();
        launchCamera(this.cameraOptions, async response => {
          if (response.uri) {
            const path = `${this.fs.workingDir}/${safeName}_${nowString}.jpg`;
            await this.fs.mv(response.uri, path);
            resolve(path);
          }
        });
      } else {
        Alert.alert(
          'You need to grant Volaser the camera permission in order to take pictures',
        );
        reject('NO_CAMERA_PERMISSION');
      }
    });
  }

  private cameraOptions: CameraOptions = {
    mediaType: 'photo' as MediaType,
    saveToPhotos: true,
  };

  private async requestCameraPermission(): Promise<boolean> {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Volaser Camera Permission',
        message: 'Volaser needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  private async requestWritePermission(): Promise<boolean> {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Volaser Camera Permission',
        message: 'Volaser needs access to your gallery',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
}
