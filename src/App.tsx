import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import KeepAwake from 'react-native-keep-awake';
import MainStackNavigator from './ui/navigators/MainStackNavigator';
import Toast from './ui/components/shared/Toast';
import { hasGyroscope } from './ui/helpers/gyroscope';
import { requestLocationPermission } from './ui/helpers/geolocation';

const App: FunctionComponent = () => {
  const [showGyroscopeWarning, setShowGyroscopeWarning] = useState<boolean>(
    false,
  );
  useEffect(() => {
    KeepAwake.activate();
    requestLocationPermission();
    hasGyroscope().then(has => setShowGyroscopeWarning(!has));
  }, []);
  return (
    <NavigationContainer>
      <MainStackNavigator />
      <Toast
        visible={showGyroscopeWarning}
        message="Device has no Gyroscope. Measurements might be inaccurate."
      />
    </NavigationContainer>
  );
};

export default App;
