import React, { FunctionComponent, useState } from 'react';
import {
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Icon } from 'react-native-elements';
import ImageView from 'react-native-image-viewing';
import DataElementCard from './DataElementCard';
import { toJS } from 'mobx';
import { YellowBox } from 'react-native';
import { Colors } from '../../styles/styles';
import VolaserButton from '../shared/VolaserButton';

interface PicturesCardProps {
  pictures: string[];
  onOpenGallery: Function;
  onOpenCamera: Function;
  onRemovePicture: Function;
  onPickerOpen?: Function;
  onPickerClose?: Function;
  style?: StyleProp<ViewStyle>;
}

interface imageSource {
  uri: string;
}

const PicturesCard: FunctionComponent<PicturesCardProps> = ({
  pictures,
  onOpenGallery,
  onOpenCamera,
  onRemovePicture,
  onPickerOpen,
  onPickerClose,
  style,
}) => {
  const [isEditingPictures, setIsEditingPictures] = useState<boolean>(false);
  const [isImageOverlayVisible, setIsImageOverlayVisible] = useState<boolean>(
    false,
  );
  const [pictureOverlayIndex, setPictureOverlayIndex] = useState<number>(0);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState<boolean>(false);

  const imageSources: imageSource[] = [];
  for (const picture of pictures) {
    imageSources.push({
      uri: picture,
    });
  }

  YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // Our flatlist is not scrollable, we can safely ignore this
  ]);

  const openRemovePicture = (pictureURI: string, imageIndex: number) => {
    if (!isEditingPictures) {
      // Open picture overlay
      setPictureOverlayIndex(imageIndex);
      setIsImageOverlayVisible(!isEditingPictures);
    } else {
      removePicture(pictureURI);
    }
  };

  const openGallery = async () => {
    toggleImagePicker();
    onOpenGallery();
  };

  const openCamera = async () => {
    toggleImagePicker();
    onOpenCamera();
  };

  const removePicture = async (pictureURI: string) => {
    onRemovePicture(pictureURI);
  };

  const toggleImagePicker = () => {
    if (isImagePickerOpen) {
      if (onPickerClose) {
        onPickerClose();
      }
    } else {
      if (onPickerOpen) {
        onPickerOpen();
      }
    }
    setIsImagePickerOpen(!isImagePickerOpen);
    setIsEditingPictures(false);
  };

  const cardFooter = () => {
    return (
      <View style={styles.cardFooter}>
        <TouchableOpacity
          onPress={() => {
            toggleImagePicker();
          }}
        >
          <View style={styles.addPictureButtonWrap}>
            <Icon
              name="plus"
              type="material-community"
              color={Colors.ACCENT}
              size={50}
            />
            <Text style={styles.addPictureLabel}>Add picture</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const cardStyle = () => {
    if (isImagePickerOpen) {
      return {
        opacity: 0.5,
      };
    }
    return null;
  };

  const imagePicker = () => {
    return (
      isImagePickerOpen && (
        <View>
          <VolaserButton
            title={'Take a picture'}
            style={styles.imagePickerButton}
            titleStyle={styles.imagePickerButtonLabel}
            onPress={() => openCamera()}
          />
          <VolaserButton
            title={'Choose from gallery'}
            style={styles.imagePickerButton}
            titleStyle={styles.imagePickerButtonLabel}
            onPress={() => openGallery()}
          />
          <VolaserButton
            title={'Cancel'}
            style={styles.imagePickerButton}
            titleStyle={styles.imagePickerButtonLabel}
            onPress={() => toggleImagePicker()}
          />
        </View>
      )
    );
  };

  const renderPictures = ({ item, index }: { item: string; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.pictureButton}
        onPress={() => {
          openRemovePicture(item, index);
        }}
        disabled={isImagePickerOpen}
      >
        <View
          style={[
            styles.pictureOverlay,
            isEditingPictures ? styles.pictureOverlayVisible : null,
          ]}
        >
          <View style={styles.pictureOpaqueOverlay} />
          <Icon
            name="delete"
            type="material-community"
            color="#fff"
            size={50}
          />
        </View>
        <Image style={styles.pictureThumb} source={{ uri: item }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={style}>
      <DataElementCard
        title={'Pictures'}
        subtitle={'Attach Picture'}
        footer={cardFooter()}
        actionText={isEditingPictures ? 'Done' : 'Manage'}
        onActionPress={() => {
          setIsEditingPictures(!isEditingPictures);
        }}
        overlay={imagePicker()}
        styleOverride={cardStyle()}
        overlayStyleOverride={styles.imagePicker}
        disabled={isImagePickerOpen}
      >
        <View style={styles.picturesContainer}>
          <FlatList
            data={toJS(pictures)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPictures}
            numColumns={4}
            scrollEnabled={false}
          />
          <ImageView
            images={imageSources}
            imageIndex={pictureOverlayIndex}
            visible={isImageOverlayVisible}
            onRequestClose={() => setIsImageOverlayVisible(false)}
            swipeToCloseEnabled={true}
          />
        </View>
      </DataElementCard>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 112,
    maxWidth: 156,
    height: 46,
  },
  pictureThumb: {
    width: '100%',
    height: '100%',
  },
  pictureOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  pictureOverlayVisible: {
    opacity: 1,
  },
  pictureOpaqueOverlay: {
    position: 'absolute',
    opacity: 0.4,
    backgroundColor: Colors.ACCENT,
    width: '100%',
    height: '100%',
  },
  picturesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  pictureButton: {
    width: '22.9%',
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    margin: 4,
  },
  imagePicker: {
    alignItems: 'center',
    width: '100%',
    bottom: 65,
  },
  imagePickerButton: {
    width: 175,
    height: 45,
    marginBottom: 6,
  },
  imagePickerButtonLabel: {
    fontSize: 16,
  },
  cardFooter: {
    width: '100%',
    height: 60,
    borderTopColor: 'white',
    borderTopWidth: 1,
  },
  addPictureButtonWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPictureLabel: {
    color: Colors.ACCENT,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default PicturesCard;
