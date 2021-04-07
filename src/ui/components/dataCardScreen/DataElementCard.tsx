import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../styles/styles';
import VolaserButton from '../shared/VolaserButton';

interface DataElementCardProps {
  title: string;
  subtitle: string;
  actionText: string;
  onActionPress: Function;
  isActionDisabled?: boolean;
  disabled?: boolean;
  footer?: Element;
  overlay?: Element;
  styleOverride?: StyleProp<ViewStyle>;
  headerStyleOverride?: StyleProp<ViewStyle>;
  contentStyleOverride?: StyleProp<ViewStyle>;
  overlayStyleOverride?: StyleProp<ViewStyle>;
}

const DataElementCard: FunctionComponent<DataElementCardProps> = ({
  title,
  subtitle,
  children,
  actionText,
  onActionPress,
  isActionDisabled = false,
  disabled = false,
  footer,
  overlay,
  styleOverride,
  headerStyleOverride,
  contentStyleOverride,
  overlayStyleOverride,
}) => {
  return (
    <View>
      <View style={[styles.card, styleOverride]}>
        <View style={[styles.header, headerStyleOverride]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.actionsContainer}>
            <VolaserButton
              title={actionText}
              style={styles.actionButton}
              titleStyle={styles.actionButtonText}
              onPress={() => onActionPress()}
              disabled={isActionDisabled || disabled}
            />
          </View>
        </View>
        <View style={[styles.content, contentStyleOverride]}>{children}</View>
        <View style={styles.footer}>{footer}</View>
      </View>
      <View style={[styles.overlay, overlayStyleOverride]}>{overlay}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.BG_LIGHT,
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.FONT,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.FONT,
  },
  titleContainer: {},
  actionsContainer: {},
  content: {
    width: '100%',
    minHeight: 110,
    paddingHorizontal: 20,
  },
  actionButton: {
    marginTop: 2,
    height: 38,
    width: 100,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.FONT_INVERSE,
  },
  footer: {},
  overlay: {
    position: 'absolute',
  },
});

export default DataElementCard;
