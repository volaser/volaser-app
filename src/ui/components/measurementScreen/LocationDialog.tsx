import React, { FunctionComponent } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { ICoordinates } from '../../../core/dataPoints/models/ICoordinates';
import { Colors } from '../../styles/styles';
import VolaserButton from '../shared/VolaserButton';
import { getCurrentPosition } from '../../helpers/geolocation';
import { logger } from '../../helpers/logger';
import { printLocation } from '../../helpers/printLocation';

interface LocationDialogProps {
  visible: boolean;
  dialogLocation: ICoordinates | undefined;
  dialogLocationName: string | undefined;
  setDialogLocation: Function;
  setDialogLocationName: Function;
  onLocationDialogCancelPressed: Function;
  onLocationDialogSubmitPressed: Function;
}

const LocationDialog: FunctionComponent<LocationDialogProps> = ({
  visible,
  dialogLocation,
  dialogLocationName,
  setDialogLocation,
  setDialogLocationName,
  onLocationDialogCancelPressed,
  onLocationDialogSubmitPressed,
}) => {
  const getLocationPressed = async (): Promise<ICoordinates | undefined> => {
    try {
      const position = await getCurrentPosition();
      logger.info('MeasurementScreen: Fetching location');
      return position.coords;
    } catch (err) {
      Alert.alert(
        'Permissions denied',
        "You need to grant volaser access to this device's location for the gps to work",
      );
      return;
    }
  };

  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>{'Get Location'}</Dialog.Title>
      <Dialog.Description>
        {
          'Please use the GPS to detect your position or enter your position manually.'
        }
      </Dialog.Description>
      <VolaserButton
        title={dialogLocation ? 'Reset' : 'Get GPS location'}
        style={styles.getGPSLocationButton}
        inverted={!!dialogLocation}
        onPress={
          dialogLocation
            ? () => setDialogLocation(undefined)
            : async () => setDialogLocation(await getLocationPressed())
        }
      />
      <View style={styles.dialogEntry}>
        <Text style={styles.dialogText}>GPS:</Text>
        <Text style={styles.dialogText}>{printLocation(dialogLocation)}</Text>
      </View>

      <Dialog.Input
        style={styles.dialogInput}
        placeholder={'Type location'}
        onChangeText={(event: any) => setDialogLocationName(event)}
      />
      <Dialog.Button
        label="Cancel"
        color={Colors.ACCENT}
        onPress={onLocationDialogCancelPressed}
      />
      <Dialog.Button
        label="Save"
        color={Colors.ACCENT}
        onPress={() => {
          if (dialogLocation || dialogLocationName) {
            onLocationDialogSubmitPressed();
          } else {
            Alert.alert(
              'No location added',
              'Please either get your location using GPS or enter a name manually',
            );
          }
        }}
      />
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({
  getGPSLocationButton: {
    height: 46,
    marginHorizontal: 12,
  },
  dialogEntry: {
    marginLeft: 12,
    marginRight: 12,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dialogText: {},
  dialogInput: {
    borderBottomWidth: 0.5,
    marginTop: 10,
    marginLeft: 4,
    marginRight: 4,
  },
});

export default LocationDialog;
