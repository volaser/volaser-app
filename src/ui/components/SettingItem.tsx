import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Dialog from 'react-native-dialog';
import { ListItem, Slider, Text } from 'react-native-elements';
import { Colors } from '../styles/styles';

interface SettingsItemProps {
  units: string;
  minimum: number;
  maximum: number;
  title: string;
  subtitle: string;
  initialValue: number;
  slider?: any;
  onChange: (value: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const SettingItem: FunctionComponent<SettingsItemProps> = ({
  units,
  slider,
  minimum,
  maximum,
  initialValue,
  title,
  subtitle,
  onChange,
  containerStyle,
  titleStyle,
}) => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue]);

  const onItemPressed = () => {
    setDialogVisible(true);
    setCurrentValue(initialValue);
  };

  const onSubmitPressed = () => {
    onChange(currentValue);
    setDialogVisible(false);
  };

  const onCancelPressed = () => setDialogVisible(false);

  const onValueChange = (value: number) => {
    setCurrentValue(Math.round(value));
  };
  return (
    <View style={containerStyle}>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{subtitle}</Dialog.Description>
        {slider !== undefined ? (
          <View style={styles.sliderContainer}>
            <Slider
              minimumValue={minimum}
              maximumValue={maximum}
              value={currentValue}
              onValueChange={onValueChange}
            />
            <Text>Value: {currentValue + units}</Text>
          </View>
        ) : (
          <Dialog.Input
            style={{ borderBottomWidth: 0.5 }}
            placeholder={currentValue ? currentValue.toString() : ''}
            onChangeText={(event: any) => setCurrentValue(event)}
          />
        )}
        <Dialog.Button
          label="Cancel"
          onPress={onCancelPressed}
          color={Colors.ACCENT}
        />
        <Dialog.Button
          label="Submit"
          onPress={onSubmitPressed}
          color={Colors.ACCENT}
        />
      </Dialog.Container>
      <ListItem
        title={title}
        rightTitle={`${initialValue + units}`}
        onPress={onItemPressed}
        titleStyle={titleStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: { justifyContent: 'center', padding: 16 },
});

export default SettingItem;
