import React, { FunctionComponent, useState } from 'react';
import { Icon, Text } from 'react-native-elements';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { IDataPoint } from '../../core/dataPoints/models/IDataPoint';
import { observer } from 'mobx-react';
import { logger } from '../helpers/logger';
import { TabNavigatorParamList } from '../navigators/TabNavigator';
import { Colors } from '../styles/styles';
import VolaserScreen from '../components/shared/VolaserScreen';
import SampleCard from '../components/dataDableScreen/SampleCard';

type DataTableScreenRouteProp = RouteProp<
  TabNavigatorParamList,
  'DataTableScreen'
>;

interface DataCardScreenProps {
  route: DataTableScreenRouteProp;
}
const DataTableScreen: FunctionComponent<DataCardScreenProps> = ({ route }) => {
  const { navigate } = useNavigation();
  const presenter = route.params.presenter;

  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [areAllSelected, setAreAllSelected] = useState<boolean>(false);
  const [actionCommited, setActionCommited] = useState<boolean>(false);

  const onElementPressed = (dataPoint: IDataPoint, index: number) => {
    if (selectMode) {
      toggleSelect(index);
    } else {
      navigate('DataCardScreen', {
        dataPoint,
        index,
      });
    }
  };

  const onSelectButtonPressed = () => {
    setSelectedIndices([]);
    setActionCommited(false);
    setSelectMode(mode => !mode);
  };

  const isSelected = (index: number): boolean => {
    return selectedIndices.includes(index);
  };

  const toggleSelect = (index: number): void => {
    if (selectedIndices.includes(index)) {
      const tmpArr = [...selectedIndices];
      tmpArr.splice(selectedIndices.indexOf(index), 1);
      setSelectedIndices(tmpArr);
    } else {
      setSelectedIndices([index, ...selectedIndices]);
    }
  };

  const toggleSelectAll = () => {
    if (!areAllSelected) {
      setSelectedIndices(presenter.getDataPoints().map((el, index) => index));
    } else {
      setSelectedIndices([]);
    }
    setAreAllSelected(!areAllSelected);
  };

  if (
    selectedIndices.length === presenter.getDataPoints().length &&
    !areAllSelected
  ) {
    setAreAllSelected(true);
  }
  if (
    presenter.getDataPoints().length > 0 &&
    selectedIndices.length === 0 &&
    areAllSelected
  ) {
    setAreAllSelected(false);
  }

  const onSharePressed = async () => {
    await presenter.exportDataPoints(selectedIndices);
    setActionCommited(true);
  };

  const onTrashPressed = () => {
    Alert.alert(
      'Delete Samples',
      `Do you want to delete the selected ${selectedIndices.length} sample${
        selectedIndices.length > 1 ? 's' : ''
      }?`,
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: deleteSelectedSamples,
        },
      ],
    );
  };

  const deleteSelectedSamples = () => {
    presenter.removeDataPoints(selectedIndices);
    setAreAllSelected(false);
    setSelectedIndices([]);
    setActionCommited(true);
  };

  logger.info('DataTableScreen@render');

  return (
    <VolaserScreen
      title="Samples"
      action={
        <TouchableOpacity onPress={onSelectButtonPressed}>
          <Text style={styles.headerSelect}>
            {selectMode ? (actionCommited ? 'Done' : 'Cancel') : 'Select'}
          </Text>
        </TouchableOpacity>
      }
    >
      {selectMode && (
        <View style={styles.topButtonRow}>
          <View style={styles.leftButtonGroup}>
            <Icon
              name="trash-o"
              type="font-awesome"
              color={Colors.ACCENT}
              onPress={onTrashPressed}
            />
            <Icon
              name="share"
              type="material"
              color={Colors.ACCENT}
              onPress={onSharePressed}
            />
          </View>
          <TouchableOpacity
            onPress={toggleSelectAll}
            style={styles.selectAllButton}
          >
            <Text style={{ ...styles.headerSelect, ...styles.headerSelectAll }}>
              Select all
            </Text>
            <View>
              {areAllSelected ? (
                <Icon
                  name="check-circle"
                  type="material"
                  color={Colors.ACCENT}
                />
              ) : (
                <Icon
                  name="radio-button-unchecked"
                  type="material"
                  color={Colors.ACCENT}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {presenter.getDataPoints().map((dataPoint, index) => (
          <SampleCard
            style={styles.sampleCard}
            dataPoint={dataPoint}
            isSelected={isSelected(index)}
            selectMode={selectMode}
            index={index}
            onPress={onElementPressed}
            key={index}
          />
        ))}
      </ScrollView>
    </VolaserScreen>
  );
};

const styles = StyleSheet.create({
  headerSelect: {
    marginTop: 20,
    color: Colors.ACCENT,
  },
  sampleCard: {
    marginBottom: 24,
  },
  topButtonRow: {
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectAllButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 120,
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    bottom: 16,
  },
  headerSelectAll: {
    marginRight: 5,
    top: -3,
  },
  leftButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'space-between',
  },
});

export default observer(DataTableScreen);
