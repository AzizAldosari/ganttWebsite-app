import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

if (document.getElementById('root') === null) {
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.createElement('div'),
  });
}
