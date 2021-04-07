import { inject, injectable } from 'tsyringe';
import { IUsecase } from '../../utils/IUsecase';
import { IDataPoint } from '../models/IDataPoint';
import {
  CameraOptions,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import { Alert, PermissionsAndroid } from 'react-native';
import { IFileSystemService } from '../services/IFileSystemService';
import { IDataPointService } from '../services/IDataPointService';

@injectable()
export class PickPictureFromGalleryUseCase
  implements IUsecase<IDataPoint, Promise<string>> {
  constructor(
    @inject('IFileSystemService')
    private readonly fs: IFileSystemService,
    @inject('IDataPointService')
    private readonly dataPointService: IDataPointService,
  ) {}

  async execute(dataPoint: IDataPoint): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const readPermission = await this.requestReadPermission();
      if (readPermission) {
        const safeName = this.dataPointService.safeDataPointName(dataPoint);
        const nowString = Date.now().toString();
        launchImageLibrary(this.galleryOptions, async response => {
          if (response.uri) {
            const path = `${this.fs.workingDir}/${safeName}_${nowString}.jpg`;
            await this.fs.mv(response.uri, path);
            resolve(path);
          }
        });
      } else {
        Alert.alert(
          'You need to grant Volaser the permission to read your Gallery in order to be able to use choose a picture',
        );
        reject('NO_GALLERY_PERMISSION');
      }
    });
  }

  private galleryOptions: CameraOptions = {
    mediaType: 'photo' as MediaType,
  };

  private async requestReadPermission(): Promise<boolean> {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Volaser Gallery Permission',
        message: 'Volaser needs access to your gallery',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
}
