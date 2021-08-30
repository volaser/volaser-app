import { ICoordinates } from '../../core/dataPoints/models/ICoordinates';

export const printLocation = (location: ICoordinates | undefined): string => {
  if (location) {
    return `${location.latitude}°N, ${location.longitude}°E`;
  }
  return '';
};
