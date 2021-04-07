import { gyroscope } from 'react-native-sensors';

export const hasGyroscope = (): Promise<boolean> => {
  return new Promise<boolean>(resolve => {
    const subscription = gyroscope.subscribe(
      () => {
        subscription.unsubscribe();
        resolve(true);
      },
      () => {
        subscription.unsubscribe();
        resolve(false);
      },
    );
  });
};
