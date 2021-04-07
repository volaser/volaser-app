import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { FunctionComponent } from 'react';
import { container } from 'tsyringe';
import IconData from '../assets/icon_data.svg';
import IconMeasure from '../assets/icon_measure.svg';
import IconSettings from '../assets/icon_settings.svg';
import SettingsScreen from '../screens/SettingsScreen';
import { SettingsScreenPresenter } from '../presenters/SettingsScreenPresenter';
import MeasurementHomeScreen from '../screens/MeasurementHomeScreen';
import { DataTableScreenPresenter } from '../presenters/DataTableScreenPresenter';
import DataTableScreen from '../screens/DataTableScreen';
import { Colors } from '../styles/styles';

export type TabNavigatorParamList = {
  MeasurementHomeScreen: undefined;
  SettingsScreen: {
    presenter: SettingsScreenPresenter;
  };
  DataTableScreen: {
    presenter: DataTableScreenPresenter;
  };
};

const TabNavigatorDef = createMaterialTopTabNavigator<TabNavigatorParamList>();

const TabNavigator: FunctionComponent = () => {
  const settingsScreenPresenter = container.resolve(SettingsScreenPresenter);
  const dataTableScreenPresenter = container.resolve(DataTableScreenPresenter);

  return (
    <TabNavigatorDef.Navigator
      initialRouteName="MeasurementHomeScreen"
      tabBarPosition="bottom"
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: '#ffffff', // Hide indicator
        },
        showIcon: true,
        style: { backgroundColor: '#ffffff', height: 68 },
        labelStyle: {
          fontSize: 12,
          textTransform: 'none',
          paddingTop: 5,
        },
        activeTintColor: Colors.ACCENT,
        inactiveTintColor: '#a1a6b9',
      }}
    >
      <TabNavigatorDef.Screen
        name="MeasurementHomeScreen"
        component={MeasurementHomeScreen}
        options={{
          title: 'Measure',
          tabBarIcon: (
            props: { focused: boolean; color: string }, // props.color is given by active/inactiveTintColor
          ) => (
            <IconMeasure
              width={26}
              height={24}
              stroke={props.color}
              strokeWidth={props.focused ? '1.8' : '1'}
            />
          ),
        }}
      />
      <TabNavigatorDef.Screen
        name="DataTableScreen"
        component={DataTableScreen}
        options={{
          title: ' Data',
          tabBarIcon: (props: { focused: boolean; color: string }) => (
            <IconData
              width={28}
              height={24}
              stroke={props.color}
              strokeWidth={props.focused ? '1.8' : '1'}
            />
          ),
        }}
        initialParams={{
          presenter: dataTableScreenPresenter,
        }}
      />
      <TabNavigatorDef.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: '  Settings',
          tabBarIcon: (props: { focused: boolean; color: string }) => (
            <IconSettings
              width={32}
              height={24}
              stroke={props.color}
              strokeWidth={props.focused ? '1.8' : '1'}
            />
          ),
        }}
        initialParams={{
          presenter: settingsScreenPresenter,
        }}
      />
    </TabNavigatorDef.Navigator>
  );
};

export default TabNavigator;
