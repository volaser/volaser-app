import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { TabNavigatorParamList } from '../navigators/TabNavigator';
import Dialog from 'react-native-dialog';
import { Icon } from 'react-native-elements';
import { Colors } from '../styles/styles';
import VolaserScreen from '../components/shared/VolaserScreen';

type MeasurementHomeScreenRouteProp = RouteProp<
  TabNavigatorParamList,
  'MeasurementHomeScreen'
>;

interface MeasurementHomeScreenProps {
  route: MeasurementHomeScreenRouteProp;
}

const MeasurementHomeScreen: FunctionComponent<MeasurementHomeScreenProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}) => {
  const { navigate } = useNavigation();

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [sampleName, setSampleName] = useState<string>('');

  const onStartPressed = () => {
    setDialogVisible(true);
  };

  const onCancelPressed = () => {
    setDialogVisible(false);
    setSampleName('');
  };

  const onSubmitPressed = () => {
    if (sampleName.length > 0) {
      navigate('MeasurementScreen', { sampleName });
      setDialogVisible(false);
      setSampleName('');
    }
  };

  return (
    <VolaserScreen title="Volaser">
      <View style={styles.body}>
        <View style={styles.contentWrapper}>
          <TouchableHighlight
            style={styles.buttonWrapper}
            onPress={onStartPressed}
          >
            <Icon
              name="plus"
              type="material-community"
              color="#ffffff"
              size={50}
            />
          </TouchableHighlight>
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipMessage}>Create a new measurement</Text>
          </View>
          <View style={styles.tooltipArrow} />
        </View>

        <Dialog.Container visible={dialogVisible}>
          <Dialog.Title style={styles.dialogTitle}>Sample Name</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            Please enter the name of the sample you are measuring, so you can
            identify it in your records later.
          </Dialog.Description>

          <Dialog.Input
            style={{ borderBottomWidth: 0.5 }}
            placeholder="Name"
            onChangeText={(event: any) => setSampleName(event)}
          />

          <Dialog.Button
            label="Cancel"
            onPress={onCancelPressed}
            color={Colors.ACCENT}
          />
          <Dialog.Button
            label="Submit"
            onPress={onSubmitPressed}
            color={Colors.ACCENT}
          />
        </Dialog.Container>
      </View>
    </VolaserScreen>
  );
};

const styles = StyleSheet.create({
  body: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: 70,
    height: 70,
    borderRadius: 1000,
    backgroundColor: Colors.ACCENT,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dialogTitle: {
    color: 'black',
  },
  dialogDescription: {
    color: 'grey',
  },
  tooltipContainer: {
    position: 'absolute',
    top: -100,
    width: '70%',
    height: 72,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  tooltipArrow: {
    top: -100,
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    borderRightWidth: 20,
    borderRightColor: 'transparent',
    borderTopWidth: 20,
    borderTopColor: 'white',
  },
  tooltipMessage: {
    color: Colors.ACCENT,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '700',
  },
  contentWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default observer(MeasurementHomeScreen);
