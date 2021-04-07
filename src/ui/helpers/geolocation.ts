import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { logger } from './logger';

export const requestLocationPermission = async () => {
  try {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  } catch (err) {
    logger.warn(err);
  }
};

export const getCurrentPosition = async (options?: any): Promise<any> => {
  if (!(await hasLocationPermissions())) {
    await requestLocationPermission();
  }
  return await new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, options);
  });
};

const hasLocationPermissions = async (): Promise<boolean> => {
  try {
    const finePermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );
    const coarsePermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );
    return finePermission && coarsePermission;
  } catch (err) {
    logger.warn(err);
    return false;
  }
};
