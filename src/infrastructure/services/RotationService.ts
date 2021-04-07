import { IRotationService } from '../../core/measurement/services/IRotationService';
import { IRotationDevice } from '../../core/measurement/models/IRotationDevice';

export class RotationService implements IRotationService {
  private rotationDevice: IRotationDevice;
  constructor(rotationDevice: IRotationDevice) {
    this.rotationDevice = rotationDevice;
  }
  getRotation(): number {
    return this.rotationDevice.getAngle();
  }
}
