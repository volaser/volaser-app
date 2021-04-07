import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { observer } from 'mobx-react';
import Animated from 'react-native-reanimated';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { logger } from '../helpers/logger';
import { MainStackNavigatorParamList } from '../navigators/MainStackNavigator';
import { SvgXml } from 'react-native-svg';
import { iconGyroXml } from '../assets/iconGyro';
import { Colors } from '../styles/styles';
import VolaserButton from '../components/shared/VolaserButton';

type DebugScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'DebugScreen'
>;

interface DebugScreenProps {
  route: DebugScreenRouteProp;
}

const DebugScreen: FunctionComponent<DebugScreenProps> = ({ route }) => {
  const [angle, setAngle] = useState<number>(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [strength, setStrength] = useState<number | null>(null);
  const presenter = route.params.presenter;

  const { navigate } = useNavigation();

  useEffect(() => {
    logger.info('DebugScreen@mount');
    const interval = setInterval(() => {
      setAngle(presenter.getDeviceRotation());
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, [presenter]);

  const onTestLaserPressed = async () => {
    if (presenter.isLaserConnected()) {
      const {
        strength: updatedStrength,
        distance: updatedDistance,
      } = await presenter.measureDistance();
      setStrength(updatedStrength);
      setDistance(updatedDistance);
    }
  };

  const onClosePressed = () => {
    navigate('SettingsScreen');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Test Laser and Gyroscope</Text>
            <TouchableOpacity
              style={styles.headerCloseIcon}
              onPress={onClosePressed}
            >
              <Icon
                name="close"
                type="material"
                color={Colors.ACCENT}
                size={30}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.subtitleWrapper}>
            <Text style={styles.textBold}>USB:</Text>
            <Text
              style={{
                ...styles.textNormal,
                ...styles.ml8,
              }}
            >
              {presenter.isLaserConnected() ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
        <View style={styles.laserBoxWrapper}>
          <View style={styles.laserBox}>
            <View>
              <VolaserButton
                title="Test Laser"
                style={styles.testLaserButton}
                titleStyle={styles.testLaserButtonLabel}
                disabled={!presenter.isLaserConnected()}
                onPress={onTestLaserPressed}
              />

              <View style={styles.laserDetailsWrapper}>
                <Text style={styles.textBold}>Range:</Text>
                <Text style={styles.textNormal}>{distance}</Text>
              </View>
              <View style={styles.laserDetailsWrapper}>
                <Text style={styles.textBold}>Strength:</Text>
                <Text style={styles.textNormal}>{strength}</Text>
              </View>
            </View>
          </View>
          <View style={styles.gyroWrapper}>
            <Animated.View
              style={{
                transform: [{ rotate: `${360 - angle!} deg` }],
              }}
            >
              <SvgXml xml={iconGyroXml} />
            </Animated.View>
            <View style={styles.gyroDetailsWrapper}>
              <Text style={styles.textBold}>Angle: </Text>
              <Text style={styles.textNormal}>{angle}°</Text>
            </View>
          </View>
        </View>
        <View style={styles.footerWrapper}>
          <View style={styles.footerButtonWrapper}>
            <VolaserButton
              title="Done"
              style={styles.doneButton}
              titleStyle={styles.doneButtonLabel}
              onPress={onClosePressed}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { backgroundColor: Colors.BG },
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
  subtitleWrapper: { paddingTop: 41, flexDirection: 'row' },
  textBold: { fontSize: 20, color: Colors.FONT, fontWeight: 'bold' },
  textNormal: { fontSize: 20, color: Colors.FONT, fontWeight: 'normal' },
  ml8: {
    marginLeft: 8,
  },
  laserBoxWrapper: { padding: 24, paddingTop: 0 },
  laserBox: {
    padding: 24,
    backgroundColor: Colors.BG_LIGHT,
    marginBottom: 24,
    alignItems: 'center',
  },
  testLaserButton: {
    height: 46,
    width: 160,
    marginBottom: 24,
  },
  testLaserButtonLabel: {
    fontSize: 16,
  },
  laserDetailsWrapper: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gyroWrapper: {
    flexDirection: 'row',
    height: 242,
    padding: 24,
    backgroundColor: Colors.BG_LIGHT,
    marginBottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gyroDetailsWrapper: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  footerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 24,
  },
  footerButtonWrapper: { width: '100%' },
  doneButton: {
    height: 46,
  },
  doneButtonLabel: {
    fontSize: 16,
  },
});

export default observer(DebugScreen);
