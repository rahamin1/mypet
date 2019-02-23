import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import store from './src/store/store';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import Sentry from 'sentry-expo';
import { Base64 } from 'js-base64';

import firebaseInit from './src/services/firebaseInit';

import { AppLoading, Asset, Font } from 'expo';

// import reducers from 'mypet/reducers';
import AppNavigator from './src/navigation/AppNavigator';
import Loading from "./src/components/Loading/Loading";

global.btoa = Base64.encode;
global.atob = Base64.decode;

console.warn('In App.js: Disabling yellowbox warning in genymotion');
console.disableYellowBox = true;

let persistor = persistStore(store);

const onBeforeLift = () => {
  // take some action before the gate lifts
  // (before rendering AppNavigator)

  // this.purgeReduxStore(); // for testing - in case we want to initialize
};

export default class App extends Component {
  state = {
    isLoadingComplete: false
  };

  componentDidMount() {
    firebaseInit();
    // tThe followingf lines are a workaround
    // in order to stop getting warnings about timer
    // See: https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-365456531
    YellowBox.ignoreWarnings(['Setting a timer']);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
      }
    };

    // Remove the following line once Sentry is correctly setup.
    Sentry.enableInExpoDevelopment = true;

    Sentry.config('https://b217dd6aee1146278fc764a6fde332a6@sentry.io/1315357').install();
  }

  // The following is for testing, when we want to start fresh
  purgeReduxStore() {
    console.error("Purging redux store - when we want to start fresh during testing");
    persistor.purge();
  }

  render() {
    // const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      console.log("rendering AppLoading");
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      console.log("rendering Provider");
      return (
        <Provider store={store}>
            {/* }{Platform.OS === 'ios' && <StatusBar barStyle="default" />} */}
            {/* console.log("rendering AppNavigator") */}
          <PersistGate
            loading={<Loading/>}
            onBeforeLift={onBeforeLift}
            persistor={persistor}>
            <AppNavigator />
          </PersistGate>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async() => {

    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/icon.png')
      ]),
      Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        // This is the font that we are using for our tab bar
        // ...Icon.Ionicons.font,
        Ionicons: require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
        Materialicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
*/
