import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import SettingItem from '../components/SettingItem';
import { observer } from 'mobx-react';
import { TabNavigatorParamList } from '../navigators/TabNavigator';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { logger } from '../helpers/logger';
import { ListItem } from 'react-native-elements';
import VolaserScreen from '../components/shared/VolaserScreen';

type SettingsScreenRouteProp = RouteProp<
  TabNavigatorParamList,
  'SettingsScreen'
>;

interface SettingsScreenProps {
  route: SettingsScreenRouteProp;
}

const SettingsScreen: FunctionComponent<SettingsScreenProps> = ({ route }) => {
  const { navigate } = useNavigation();
  const presenter = route.params.presenter;

  const onChangeMeasurementPeriod = (newVal: number) => {
    presenter.setMeasurementPeriod(newVal);
  };

  logger.info('SettingsScreen@render');

  const onOpenDebugPressed = () => {
    navigate('DebugScreen');
  };

  return (
    <VolaserScreen title="Settings">
      <SettingItem
        slider
        maximum={2000}
        minimum={100}
        title="Measurement period"
        subtitle="This is the time in milliseconds between laser measurements"
        units="ms"
        initialValue={presenter.getSettings().measurementPeriod}
        onChange={onChangeMeasurementPeriod}
        containerStyle={styles.listItem}
        titleStyle={styles.listItemTitle}
      />
      <ListItem
        title="Test Laser and Gyroscope"
        rightTitle=""
        onPress={onOpenDebugPressed}
        style={styles.listItem}
        titleStyle={styles.listItemTitle}
      />
    </VolaserScreen>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginBottom: 16,
  },
  listItemTitle: {
    color: 'black',
  },
});

export default observer(SettingsScreen);
