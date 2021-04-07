import React, { FunctionComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import { container } from 'tsyringe';
import DebugScreen from '../screens/DebugScreen';
import { DebugScreenPresenter } from '../presenters/DebugScreenPresenter';
import MeasurementScreen from '../screens/MeasurementScreen';
import { MeasurementScreenPresenter } from '../presenters/MeasurementScreenPresenter';
import { DataCardScreenPresenter } from '../presenters/DataCardScreenPresenter';
import { IDataPoint } from '../../core/dataPoints/models/IDataPoint';
import DataCardScreen from '../screens/DataCardScreen';

export type MainStackNavigatorParamList = {
  TabNavigator: undefined;
  DebugScreen: {
    presenter: DebugScreenPresenter;
  };
  MeasurementScreen: {
    presenter: MeasurementScreenPresenter;
    sampleName: string;
  };
  DataCardScreen: {
    presenter: DataCardScreenPresenter;
    dataPoint: IDataPoint;
    index: number;
  };
};

const StackNavigatorDef = createStackNavigator<MainStackNavigatorParamList>();

const MainStackNavigator: FunctionComponent = () => {
  const debugScreenPresenter = container.resolve(DebugScreenPresenter);
  const measurementScreenPresenter = container.resolve(
    MeasurementScreenPresenter,
  );
  const dataCardScreenPresenter = container.resolve(DataCardScreenPresenter);

  return (
    <StackNavigatorDef.Navigator headerMode="none">
      <StackNavigatorDef.Screen name="TabNavigator" component={TabNavigator} />
      <StackNavigatorDef.Screen
        name="DebugScreen"
        component={DebugScreen}
        initialParams={{
          presenter: debugScreenPresenter,
        }}
      />
      <StackNavigatorDef.Screen
        name="MeasurementScreen"
        component={MeasurementScreen}
        initialParams={{
          presenter: measurementScreenPresenter,
        }}
      />
      <StackNavigatorDef.Screen
        name="DataCardScreen"
        component={DataCardScreen}
        initialParams={{
          presenter: dataCardScreenPresenter,
        }}
      />
    </StackNavigatorDef.Navigator>
  );
};

export default MainStackNavigator;
