import 'reflect-metadata';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { enableScreens } from 'react-native-screens';
import { injectAppDependencies } from './src/dependencyInjection';

enableScreens();

injectAppDependencies();
AppRegistry.registerComponent(appName, () => App);
