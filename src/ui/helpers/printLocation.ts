import { ICoordinates } from '../../core/dataPoints/models/ICoordinates';

export const printLocation = (location: ICoordinates | undefined): string => {
  if (location) {
    return `${location.latitude.toFixed(1)}°N, ${location.longitude.toFixed(
      1,
    )}°E`;
  }
  return '';
};
