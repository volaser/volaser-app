import React, { FunctionComponent } from 'react';
import { Icon } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import { observer } from 'mobx-react';

interface CompassArrowProps {
  angle: number;
}

const CompassArrow: FunctionComponent<CompassArrowProps> = ({ angle }) => {
  return (
    <Animated.View
      style={{
        transform: [{ rotate: `${360 - angle}deg` }],
      }}
    >
      <Icon name="location-arrow" type="font-awesome" size={96} color="white" />
    </Animated.View>
  );
};

export default observer(CompassArrow);
