import { NativeEventEmitter } from 'react-native';
import { IRotationDevice } from '../../core/measurement/models/IRotationDevice';
import { DeviceRotation } from '../nativeModules/DeviceRotation';

export class Gyroscope implements IRotationDevice {
  angle = 0;
  lastTime = 0;

  constructor() {
    DeviceRotation.setUpdateInterval(1);

    const orientationEvent = new NativeEventEmitter(DeviceRotation);
    orientationEvent.addListener('DeviceRotation', event => {
      const _angle = Math.round(event.azimuth);
      if (_angle !== this.angle) {
        this.angle = _angle;
      }
    });
    DeviceRotation.start();
  }
  getAngle(): number {
    return this.angle;
  }
}
