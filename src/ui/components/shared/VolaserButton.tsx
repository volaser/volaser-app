import React, { FunctionComponent } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Colors } from '../../styles/styles';

interface VolaserButtonProps {
  title: string;
  onPress: Function;
  disabled?: boolean;
  inverted?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const VolaserButton: FunctionComponent<VolaserButtonProps> = ({
  title,
  onPress,
  disabled,
  inverted,
  style,
  titleStyle,
}) => {
  return (
    <View style={style}>
      <Button
        title={title}
        buttonStyle={[styles.button, inverted ? styles.inverted : null]}
        titleStyle={[
          styles.text,
          inverted ? styles.textInverted : null,
          titleStyle,
        ]}
        onPress={() => onPress()}
        disabled={disabled}
        disabledStyle={styles.disabled}
        disabledTitleStyle={styles.textDisabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.ACCENT,
  },
  inverted: {
    backgroundColor: Colors.ACCENT_LIGHTER,
  },
  disabled: {
    backgroundColor: Colors.ACCENT_LIGHT,
  },
  text: {
    fontSize: 12,
    color: 'white',
  },
  textInverted: {
    color: Colors.ACCENT,
  },
  textDisabled: {
    color: 'white',
  },
});

export default VolaserButton;
