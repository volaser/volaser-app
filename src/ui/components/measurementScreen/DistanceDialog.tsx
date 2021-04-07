import React, { FunctionComponent } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { Colors } from '../../styles/styles';

interface DistanceDialogProps {
  visible: boolean;
  setDialogBottomDepth: Function;
  onBottomDistanceDialogCancelPressed: Function;
  onBottomDistanceDialogSubmitPressed: Function;
  dialogBottomDepth: number;
}

const DistanceDialog: FunctionComponent<DistanceDialogProps> = ({
  visible,
  setDialogBottomDepth,
  onBottomDistanceDialogCancelPressed,
  onBottomDistanceDialogSubmitPressed,
  dialogBottomDepth,
}) => {
  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>{'Distance to bottom'}</Dialog.Title>
      <Dialog.Description>
        {
          'Please enter the distance to the bottom of the containment container as measured by the probe, in meters.'
        }
      </Dialog.Description>

      <View style={styles.inputEndTextRow}>
        <Dialog.Input
          placeholder={'Type distance'}
          onChangeText={(event: string) => {
            if (!isNaN(parseFloat(event))) {
              setDialogBottomDepth(parseFloat(event));
            }
          }}
          autoFocus={true}
          keyboardType="numeric"
        />
        <Text style={styles.inputEndText}>meters</Text>
      </View>
      <Dialog.Button
        label="Cancel"
        color={Colors.ACCENT}
        onPress={onBottomDistanceDialogCancelPressed}
      />
      <Dialog.Button
        label="Save"
        color={Colors.ACCENT}
        onPress={() => {
          if (dialogBottomDepth !== 0) {
            onBottomDistanceDialogSubmitPressed();
          } else {
            Alert.alert(
              'Invalid number',
              "Please enter a valid number that isn't 0",
            );
          }
        }}
      />
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({
  inputEndTextRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    height: 36,
    marginRight: 8,
    marginLeft: 12,
  },
  inputEndText: {
    textAlignVertical: 'center',
    color: 'grey',
  },
});

export default DistanceDialog;
