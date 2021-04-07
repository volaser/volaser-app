import React, { FunctionComponent, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Area from '../components/Area';
import dateFormat from 'dateformat';
import { logger } from '../helpers/logger';
import { MainStackNavigatorParamList } from '../navigators/MainStackNavigator';
import { printLocation } from '../helpers/printLocation';
import PicturesCard from '../components/dataCardScreen/PicturesCard';
import NoteCard from '../components/dataCardScreen/NoteCard';
import { Colors } from '../styles/styles';
import VolaserButton from '../components/shared/VolaserButton';

type DataCardScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'DataCardScreen'
>;

interface DataCardScreenProps {
  route: DataCardScreenRouteProp;
}

const DataCardScreen: FunctionComponent<DataCardScreenProps> = ({ route }) => {
  const { goBack } = useNavigation();
  const dataPoint = route.params.dataPoint;
  const presenter = route.params.presenter;
  const [pictures, setPictures] = useState<string[]>(
    dataPoint.pictures ? dataPoint.pictures : [],
  );
  const [isImagePickerOpen, setIsImagePickerOpen] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const afterPictureAction = (picturePath: string) => {
    if (picturePath) {
      const pictureList = [...pictures, 'file://' + picturePath];
      setPictures(pictureList);
      presenter.editPictures(route.params.index, pictureList);
      ToastAndroid.show('Your picture is saved', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Could not save picture', ToastAndroid.SHORT);
    }
  };

  const openGallery = async () => {
    await presenter.selectPictureFromGallery(dataPoint, afterPictureAction);
  };

  const openCamera = async () => {
    await presenter.takePicture(dataPoint, afterPictureAction);
  };

  const onClosePressed = () => {
    goBack();
  };

  const onImagePickerOpen = () => {
    setIsImagePickerOpen(true);
  };
  const onImagePickerClose = () => {
    setIsImagePickerOpen(false);
  };

  const saveNote = (note: string) => {
    presenter.editNote(route.params.index, note);
    ToastAndroid.show('Your note is saved', ToastAndroid.SHORT);
  };

  const removePicture = async (pictureURI: string) => {
    const newPictures = await presenter.removePicture(
      route.params.index,
      pictureURI,
    );
    setPictures(newPictures);
    ToastAndroid.show('Image is deleted', ToastAndroid.SHORT);
  };

  const onDeleteSamplePressed = () => {
    Alert.alert(
      'Delete Sample',
      'Are you sure you want to delete the selected sample?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Submit',
          onPress: () => {
            presenter.removeDataPoint(route.params.index);
            goBack();
          },
        },
      ],
    );
  };

  const onShareSamplePressed = async () => {
    setIsSharing(true);
    try {
      await presenter.exportDataPoint(dataPoint);
    } catch (e) {
      logger.warn(e);
    } finally {
      setIsSharing(false);
    }
  };

  const openMapButtonPressed = () => {
    presenter.openMap(dataPoint);
  };

  logger.info('DataCardScreen@render');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{dataPoint.name}</Text>
        <TouchableOpacity
          style={styles.headerCloseIcon}
          onPress={onClosePressed}
        >
          <Icon name="close" type="material" color={Colors.ACCENT} size={30} />
        </TouchableOpacity>
      </View>
      <Text>{dateFormat(dataPoint.time, 'mmm d, HH:MM')}</Text>
      <View style={styles.leftButtonGroup}>
        <Icon
          name="trash-o"
          type="font-awesome"
          color={Colors.ACCENT}
          disabled={isImagePickerOpen}
          disabledStyle={styles.iconDisabled}
          onPress={onDeleteSamplePressed}
        />
        <Icon
          name="share"
          type="material"
          color={Colors.ACCENT}
          disabled={isImagePickerOpen || isSharing}
          disabledStyle={styles.iconDisabled}
          onPress={onShareSamplePressed}
        />
      </View>
      <ScrollView
        style={styles.dataCardBody}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isImagePickerOpen}
      >
        <View style={styles.entryRow}>
          <View style={styles.entry}>
            <Text style={styles.entryTitle}>Location</Text>
            <Text style={styles.entrySubtitle}>
              {dataPoint.location
                ? printLocation(dataPoint.location)
                : dataPoint.locationName}
            </Text>
          </View>
          {dataPoint.location && (
            <View style={styles.buttonContainer}>
              <VolaserButton
                style={styles.openMapButton}
                inverted={true}
                titleStyle={styles.openMapButtonLabel}
                title="Open in map"
                onPress={openMapButtonPressed}
              />
            </View>
          )}
        </View>

        <View style={styles.entryRow}>
          <View style={styles.entry}>
            <Text style={styles.entryTitle}>Distance to bottom</Text>
            <Text style={styles.entrySubtitle}>
              {dataPoint.bottomDepth.toFixed(2)} m
            </Text>
          </View>
          <View style={styles.entry}>
            <Text style={styles.entryTitle}>Distance to sludge</Text>
            <Text style={styles.entrySubtitle}>
              {dataPoint.sludgeDepth.toFixed(2)} m
            </Text>
          </View>
        </View>

        <View style={styles.entryRow}>
          <View style={styles.entry}>
            <Text style={styles.entryTitle}>Containment volume</Text>
            <Text style={styles.entrySubtitle}>
              {dataPoint.containmentVolume.toFixed(2)} m³
            </Text>
          </View>
          <View style={styles.entry}>
            <Text style={styles.entryTitle}>Faecal sludge volume</Text>
            <Text style={styles.entrySubtitle}>
              {dataPoint.fecalSludgeVolume.toFixed(2)} m³
            </Text>
          </View>
        </View>

        <View style={styles.entryRow}>
          <View style={styles.entry}>
            <Text style={styles.entryTitle}>Area</Text>
            <Text style={styles.entrySubtitle}>
              {dataPoint.area.toFixed(2)} m²
            </Text>
          </View>
        </View>

        <View style={styles.area}>
          <Area
            points={dataPoint.areaOutline}
            width="100%"
            height="100%"
            viewBox="-1.5 -1.5 3 3"
            zoomable
          />
        </View>
        <NoteCard
          style={styles.cards}
          note={dataPoint.note ? dataPoint.note : ''}
          onNoteSave={saveNote}
          disabled={isImagePickerOpen}
        />
        <PicturesCard
          style={styles.cards}
          pictures={pictures}
          onOpenGallery={openGallery}
          onOpenCamera={openCamera}
          onRemovePicture={removePicture}
          onPickerOpen={onImagePickerOpen}
          onPickerClose={onImagePickerClose}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 24,
    height: '100%',
    backgroundColor: '#fff',
  },
  headerWrapper: { padding: 24, paddingBottom: 12 },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 30,
    color: Colors.FONT,
    fontWeight: 'bold',
    width: '80%',
  },
  headerCloseIcon: { marginTop: 10, height: 'auto' },
  entryRow: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entry: {
    width: '45%',
    maxWidth: 156,
    display: 'flex',
  },
  entryTitle: {
    fontWeight: '700',
    color: Colors.FONT,
  },
  entrySubtitle: {},
  buttonContainer: {
    width: '50%',
    maxWidth: 156,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  openMapButton: {
    minWidth: 112,
    maxWidth: 156,
    height: 46,
  },
  openMapButtonLabel: {
    fontSize: 15,
  },
  area: {
    marginTop: 24,
    backgroundColor: Colors.BG_LIGHT,
    height: 260,
    marginBottom: 12,
  },
  leftButtonGroup: {
    marginTop: 12,
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'space-between',
  },
  noteInput: {
    textAlign: 'left',
    textAlignVertical: 'top',
    backgroundColor: Colors.BG,
  },
  dialogButtonTitle: {
    fontSize: 12,
    color: Colors.FONT_INVERSE,
  },
  cards: {
    marginBottom: 12,
  },
  iconDisabled: {
    backgroundColor: Colors.BG,
    opacity: 0.6,
  },
  dataCardBody: {
    flex: 1,
  },
});

export default DataCardScreen;
