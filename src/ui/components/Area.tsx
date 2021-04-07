import React, { FunctionComponent, useState } from 'react';
import { IPoint } from '../../core/dataPoints/models/IPoint';
import Svg, { Line, Polygon } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from '../styles/styles';
import { maths, Maths } from '../../core/utils/Maths';

interface AreaProps {
  points: Array<IPoint>;
  height?: string;
  width?: string;
  viewBox: string;
  zoomable?: boolean;
}

const Area: FunctionComponent<AreaProps> = ({
  points,
  height,
  width,
  viewBox = '-1 -1 2 2',
  zoomable,
}) => {
  // @ts-ignore
  const [zoomLevel, setZoomLevel] = useState<number>(+viewBox.split('').pop());

  const nLines = 20;
  const scale = 1;

  const xGrid = [...Array(nLines).keys()].map((value, index) => (
    <Line
      key={'x' + index}
      x1={scale * value - nLines / 2}
      y1="-10"
      x2={scale * value - nLines / 2}
      y2="10"
      stroke="white"
      strokeWidth="0.04"
    />
  ));
  const yGrid = [...Array(nLines).keys()].map((value, index) => (
    <Line
      key={'y' + index}
      y1={scale * value - nLines / 2}
      x1="-10"
      y2={scale * value - nLines / 2}
      x2="10"
      stroke="white"
      strokeWidth="0.04"
    />
  ));

  return (
    <View style={{ height, width }}>
      <Svg
        height={height}
        width={width}
        viewBox={
          zoomable
            ? `-${zoomLevel / 2} -${zoomLevel / 2} ${zoomLevel} ${zoomLevel}`
            : viewBox
        }
        preserveAspectRatio="xMinYMin meet"
      >
        {xGrid}
        {yGrid}
        <Polygon
          points={maths.getAreaOutline(points)}
          fill={Colors.ACCENT_DARKER}
          fillOpacity="0.5"
          stroke="black"
          strokeWidth="0"
        />
      </Svg>

      {zoomable && (
        <View style={styles.buttonGroup}>
          <Icon
            containerStyle={styles.firstButton}
            name="plus"
            type="material-community"
            color={Colors.ACCENT}
            size={32}
            onPress={() => {
              if (zoomLevel > 1) {
                setZoomLevel(zl => zl - 1);
              }
            }}
          />
          <Icon
            name="minus"
            type="material-community"
            color={Colors.ACCENT}
            size={32}
            onPress={() => {
              setZoomLevel(zl => zl + 1);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    backgroundColor: Colors.BG,
  },
  firstButton: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey',
  },
});

export default Area;
