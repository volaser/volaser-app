import React, { FunctionComponent, useEffect, useState } from 'react';
import { ICoordinates } from '../../core/dataPoints/models/ICoordinates';
import {
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Area from '../components/Area';
import { logger } from '../helpers/logger';
import { observer } from 'mobx-react';
import { MainStackNavigatorParamList } from '../navigators/MainStackNavigator';
import { printLocation } from '../helpers/printLocation';
import { Colors } from '../styles/styles';
import MeasurementCard from '../components/measurementScreen/MeasurementCard';
import VolaserButton from '../components/shared/VolaserButton';
import VolaserScreen from '../components/shared/VolaserScreen';
import { maths } from '../../core/utils/Maths';
import LocationDialog from '../components/measurementScreen/LocationDialog';
import DistanceDialog from '../components/measurementScreen/DistanceDialog';
import { IDataPoint } from '../../core/dataPoints/models/IDataPoint';

type MeasurementScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'MeasurementScreen'
>;

interface MeasurementScreenProps {
  route: MeasurementScreenRouteProp;
}

enum WorkflowStep {
  LOCATION,
  DISTANCE_BOTTOM,
  DISTANCE_SLUDGE,
  AREA,
  SAVE,
}

const MeasurementScreen: FunctionComponent<MeasurementScreenProps> = ({
  route,
}) => {
  const [location, setLocation] = useState<ICoordinates>();
  const [dialogLocation, setDialogLocation] = useState<ICoordinates>();
  const [sludgeDepth, setSludgeDepth] = useState<number>(0);
  const [bottomDepth, setBottomDepth] = useState<number>(0);
  const [dialogBottomDepth, setDialogBottomDepth] = useState<number>(0);

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string | undefined>();
  const [dialogLocationName, setDialogLocationName] = useState<
    string | undefined
  >();

  const { goBack } = useNavigation();

  const { presenter, sampleName } = route.params;

  const alertButtons = [{ text: 'OK' }];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        presenter.areaOutline = [];
      },
    );
    return () => {
      backHandler.remove();
    };
  });

  const measureDepth = async (): Promise<number | undefined> => {
    setSludgeDepth(0);
    try {
      return await presenter.measureDepth();
    } catch (e) {
      if (e === 'LASER_DISCONNECTED') {
        Alert.alert(
          'Laser not found!',
          'You must connect the laser before being able to start a measurement.',
          alertButtons,
        );
        return;
      } else if (e === 'INVALID_MEASUREMENT') {
        Alert.alert(
          'Invalid Laser Measurement',
          'Unfortunately, the laser is returning an invalid measurement. Try retargeting the laser at a closer surface, or one with different surface characteristics.',
          alertButtons,
        );
        return;
      } else {
        Alert.alert(
          'Something went wrong',
          'Something went wrong during the measurement, please try again.',
          alertButtons,
        );
      }
    }
  };

  const wasAreaMeasured = () => {
    return presenter.areaOutline.length > 0;
  };

  const measureArea = async () => {
    if (presenter.startMeasurement()) {
      logger.info('MeasurementScreen: Measuring area');
    } else {
      Alert.alert(
        'Laser not found!',
        'You must connect the laser before being able to start a measurement.',
        alertButtons,
      );
    }
  };

  const onClosePressed = () => {
    presenter.areaOutline = [];
    goBack();
  };

  const getConfirmDialogText = (dataPoint: IDataPoint) => {
    const name = `Name: ${sampleName}`;
    const sLocation = `Location: ${
      dataPoint.location
        ? printLocation(dataPoint.location)
        : dataPoint.locationName
    }`;
    const sDistanceToBottom = `Distance to bottom: ${dataPoint.bottomDepth.toFixed(
      2,
    )}`;
    const sDistanceToSludge = `Distance to sludge: ${dataPoint.sludgeDepth.toFixed(
      2,
    )}`;
    const sArea = `Area: ${dataPoint.area.toFixed(2)} m²`;
    const sContainmentVolume = `Containment Volume: ${dataPoint.containmentVolume.toFixed(
      2,
    )} m³`;
    const sFaecalSludgeVolume = `Faecal Sludge Volume: ${dataPoint.fecalSludgeVolume.toFixed(
      2,
    )}m³`;

    return `${name}\n${sLocation}\n${sDistanceToBottom}\n${sDistanceToSludge}\n${sArea}\n${sContainmentVolume}\n${sFaecalSludgeVolume}`;
  };

  const onSavePressed = async () => {
    const dataPoint = presenter.saveMeasurement(
      sampleName,
      location,
      locationName,
      bottomDepth,
      sludgeDepth,
    );

    Alert.alert('Data point saved', getConfirmDialogText(dataPoint), [
      {
        text: 'Ok',
        onPress: () => {
          presenter.areaOutline = [];
          goBack();
        },
      },
    ]);
  };

  const resetLocationDialog = () => {
    setDialogLocationName(undefined);
    setDialogLocation(undefined);
  };

  const onDialogSubmitPressed = () => {
    setDialogVisible(false);
  };

  const onBottomDistanceDialogSubmitPressed = () => {
    onDialogSubmitPressed();
    setBottomDepth(dialogBottomDepth);
    setDialogBottomDepth(0);
  };

  const onLocationDialogSubmitPressed = () => {
    onDialogSubmitPressed();
    setLocation(dialogLocation);
    setLocationName(dialogLocationName);
    resetLocationDialog();
  };

  const onLocationDialogCancelPressed = () => {
    setDialogVisible(false);
    resetLocationDialog();
  };

  const onLocationResetPressed = () => {
    setLocation(undefined);
    setLocationName(undefined);
  };

  const onBottomDistanceDialogCancelPressed = () => {
    setDialogVisible(false);
    setDialogBottomDepth(0);
  };

  const onBottomDistanceEditPressed = () => {
    setBottomDepth(0);
    setDialogVisible(true);
  };

  const onSludgeDistanceDialogCancelOrResetPressed = () => {
    setSludgeDepth(0);
    setDialogVisible(false);
  };

  const onAreaMeasurementDialogCancelOrResetPressed = () => {
    presenter.areaOutline = [];
  };

  const onListItemPressed = () => {
    setDialogVisible(true);
  };

  const onSludgeDistanceListItemPressed = async () => {
    const depth = await measureDepth();
    logger.info(`Depth: ${depth}`);
    if (depth) {
      setSludgeDepth(depth);
    }
  };

  const onStartAreaMeasurementPressed = async () => {
    await measureArea();
  };

  const onStopAreaMeasurementPressed = () => {
    presenter.stopMeasurement();
  };

  const getWorkflowStepByValidation = (): WorkflowStep => {
    const validator = [
      location || locationName,
      bottomDepth !== 0,
      sludgeDepth !== 0,
      wasAreaMeasured() && !presenter.measuring,
    ];
    const index = validator.findIndex(el => !el);
    if (index === -1) {
      return WorkflowStep.SAVE;
    }
    return index;
  };

  // Dialogs
  const renderDialog = (param: WorkflowStep) => {
    switch (param) {
      case WorkflowStep.LOCATION:
        return (
          <LocationDialog
            visible={dialogVisible}
            dialogLocation={dialogLocation}
            dialogLocationName={dialogLocationName}
            setDialogLocation={setDialogLocation}
            setDialogLocationName={setDialogLocationName}
            onLocationDialogCancelPressed={onLocationDialogCancelPressed}
            onLocationDialogSubmitPressed={onLocationDialogSubmitPressed}
          />
        );
      case WorkflowStep.DISTANCE_BOTTOM:
        return (
          <DistanceDialog
            visible={dialogVisible}
            setDialogBottomDepth={setDialogBottomDepth}
            onBottomDistanceDialogCancelPressed={
              onBottomDistanceDialogCancelPressed
            }
            onBottomDistanceDialogSubmitPressed={
              onBottomDistanceDialogSubmitPressed
            }
            dialogBottomDepth={dialogBottomDepth}
          />
        );
      default:
        return <></>;
    }
  };

  logger.info('MeasurementScreen@render');

  return (
    <VolaserScreen
      title={sampleName}
      action={
        <TouchableOpacity
          style={styles.headerCloseIcon}
          onPress={onClosePressed}
        >
          <Icon name="close" type="material" color={Colors.ACCENT} size={30} />
        </TouchableOpacity>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <MeasurementCard
          style={styles.actionCard}
          title={'Location'}
          buttonInverted={!!(location || locationName)}
          subtitle={
            location
              ? printLocation(location)
              : locationName
              ? locationName
              : "Sample's Location"
          }
          actionText={location || locationName ? 'Reset' : 'Get location'}
          onActionPress={() => {
            location || locationName
              ? onLocationResetPressed()
              : onListItemPressed();
          }}
        />
        <MeasurementCard
          style={styles.actionCard}
          title={'Distance to bottom'}
          buttonInverted={!!bottomDepth}
          subtitle={`${bottomDepth.toFixed(2)} m`}
          disabled={
            getWorkflowStepByValidation() < WorkflowStep.DISTANCE_BOTTOM
          }
          actionText={bottomDepth ? 'Edit' : 'Record depth'}
          onActionPress={() => {
            if (getWorkflowStepByValidation() >= WorkflowStep.DISTANCE_BOTTOM) {
              bottomDepth !== 0
                ? onBottomDistanceEditPressed()
                : onListItemPressed();
            }
          }}
        />
        <MeasurementCard
          style={styles.actionCard}
          title={'Distance to sludge'}
          subtitle={sludgeDepth !== 0 ? `${sludgeDepth.toFixed(2)} m` : '--'}
          buttonInverted={sludgeDepth !== 0}
          disabled={
            getWorkflowStepByValidation() < WorkflowStep.DISTANCE_SLUDGE
          }
          actionText={sludgeDepth ? 'Reset' : 'Measure sludge'}
          onActionPress={() => {
            if (getWorkflowStepByValidation() >= WorkflowStep.DISTANCE_SLUDGE) {
              sludgeDepth !== 0
                ? onSludgeDistanceDialogCancelOrResetPressed()
                : onSludgeDistanceListItemPressed();
            }
          }}
        />
        <MeasurementCard
          style={styles.actionCard}
          title={'Area'}
          subtitle={`${maths
            .areaFromOutline(presenter.areaOutline)
            .toFixed(2)} m²`}
          buttonInverted={wasAreaMeasured()}
          disabled={getWorkflowStepByValidation() < WorkflowStep.AREA}
          actionText={
            presenter.measuring
              ? 'Done'
              : wasAreaMeasured()
              ? 'Reset'
              : 'Measure area'
          }
          onActionPress={() => {
            if (getWorkflowStepByValidation() >= WorkflowStep.AREA) {
              presenter.measuring
                ? onStopAreaMeasurementPressed()
                : wasAreaMeasured()
                ? onAreaMeasurementDialogCancelOrResetPressed()
                : onStartAreaMeasurementPressed();
            }
          }}
        >
          <View
            style={
              getWorkflowStepByValidation() >= WorkflowStep.AREA
                ? styles.areaContainerEnabled
                : styles.areaContainerDisabled
            }
          >
            <View style={styles.area}>
              <Area
                points={presenter.areaOutline}
                width="100%"
                height="100%"
                viewBox="-1.5 -1.5 3 3"
                zoomable
              />
            </View>
          </View>
        </MeasurementCard>

        {renderDialog(getWorkflowStepByValidation())}

        <View style={styles.footerButtonWrapper}>
          <VolaserButton
            title="Save"
            disabled={getWorkflowStepByValidation() !== WorkflowStep.SAVE}
            onPress={() => {
              if (getWorkflowStepByValidation() === WorkflowStep.SAVE) {
                onSavePressed();
              }
            }}
            style={styles.saveButton}
            titleStyle={styles.saveButtonLabel}
          />
        </View>
      </ScrollView>
    </VolaserScreen>
  );
};

const styles = StyleSheet.create({
  headerCloseIcon: { marginTop: 10, height: 'auto' },
  areaContainerDisabled: {
    flex: 1,
    zIndex: -1,
    backgroundColor: Colors.BG2,
    padding: 16,
    marginBottom: 16,
  },
  areaContainerEnabled: {
    flex: 1,
    zIndex: -1,
    backgroundColor: Colors.BG,
    padding: 16,
    marginBottom: 16,
  },
  area: {
    backgroundColor: Colors.BG_LIGHT,
    height: 162,
  },
  footerButtonWrapper: { width: '100%', marginBottom: 8 },
  saveButton: {
    height: 46,
  },
  actionCard: {
    marginBottom: 8,
  },
  saveButtonLabel: {
    fontSize: 16,
  },
});

export default observer(MeasurementScreen);
