import React, { FunctionComponent } from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../styles/styles';

interface VolaserScreenProps {
  title: string;
  action?: Element;
  style?: StyleProp<ViewStyle>;
}

const VolaserScreen: FunctionComponent<VolaserScreenProps> = ({
  title,
  action,
  children,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.vscreen, style]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <View>{action}</View>
      </View>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  vscreen: { flex: 1, padding: 24 },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 30,
    color: Colors.FONT,
    fontWeight: 'bold',
    width: '80%',
  },
});

export default VolaserScreen;
