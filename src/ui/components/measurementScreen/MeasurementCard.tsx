import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../styles/styles';
import VolaserButton from '../shared/VolaserButton';

interface MeasurementCardProps {
  title: string;
  subtitle: string;
  actionText: string;
  onActionPress: Function;
  disabled?: boolean;
  buttonInverted?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyleOverride?: StyleProp<ViewStyle>;
}

const MeasurementCard: FunctionComponent<MeasurementCardProps> = ({
  title,
  subtitle,
  actionText,
  onActionPress,
  children,
  disabled = false,
  buttonInverted = false,
  contentStyleOverride,
  style,
}) => {
  return (
    <View
      style={[
        styles.MeasurementCard,
        style,
        disabled ? styles.cardDisabled : null,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, disabled ? styles.textDisabled : null]}>
            {title}
          </Text>
          <Text
            style={[styles.subtitle, disabled ? styles.textDisabled : null]}
          >
            {subtitle}
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <VolaserButton
            title={actionText}
            onPress={() => onActionPress()}
            disabled={disabled}
            inverted={buttonInverted}
            style={styles.actionButton}
          />
        </View>
      </View>
      <View style={contentStyleOverride}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  MeasurementCard: {
    backgroundColor: Colors.BG,
  },
  cardDisabled: {
    backgroundColor: Colors.BG2,
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  titleContainer: {},
  actionsContainer: {
    width: '40%',
  },
  title: {
    color: Colors.FONT,
    fontWeight: '700',
    fontSize: 16,
  },
  subtitle: {
    color: Colors.FONT,
  },
  textDisabled: {
    color: Colors.FONT_DISABLED,
  },
  actionButton: {
    marginTop: 2,
    height: 38,
  },
});

export default MeasurementCard;
