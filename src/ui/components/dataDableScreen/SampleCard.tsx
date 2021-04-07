import dateFormat from 'dateformat';
import React, { FunctionComponent } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { IDataPoint } from '../../../core/dataPoints/models/IDataPoint';
import { Colors } from '../../styles/styles';

interface SampleCardProps {
  dataPoint: IDataPoint;
  isSelected: boolean;
  onPress: Function;
  index: number;
  selectMode: boolean;
  style?: StyleProp<ViewStyle>;
}

const SampleCard: FunctionComponent<SampleCardProps> = ({
  dataPoint,
  index,
  isSelected,
  selectMode,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity style={style} onPress={() => onPress(dataPoint, index)}>
      <ListItem
        title={dataPoint.name}
        titleStyle={styles.listItemTitle}
        subtitle={`${dateFormat(dataPoint.time, 'mmm d, HH:MM')}`}
        subtitleStyle={styles.listItemSubtitle}
        rightElement={
          selectMode ? (
            <View>
              {isSelected ? (
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
          ) : (
            <></>
          )
        }
      />
      <View style={styles.listItemBottom}>
        <View style={styles.listItemBottomTextRow}>
          <Text>Containment volume</Text>
          <Text>{dataPoint.containmentVolume.toFixed(2)} m³</Text>
        </View>
        <View style={styles.listItemBottomTextRow}>
          <Text>Faecal sludge volume</Text>
          <Text>{dataPoint.fecalSludgeVolume.toFixed(2)} m³</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItemTitle: {
    fontWeight: '700',
    color: Colors.FONT,
  },
  listItemSubtitle: {
    fontSize: 12,
  },
  listItemBottom: {
    backgroundColor: Colors.BG,
    padding: 12,
    display: 'flex',
  },
  listItemBottomTextRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SampleCard;
