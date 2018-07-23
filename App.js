/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { createStackNavigator } from 'react-navigation';

import Login from './src/pages/Login';
import Year from './src/pages/Year';
import Month from './src/pages/Month';
import Welcome from './src/pages/Welcome';
import Day from './src/pages/Day';

// Store
import { createStore } from 'redux';
import myReducer from './src/reducers/index';
import { Provider } from 'react-redux';

const RootStack = createStackNavigator(
  {
    LoginScreen: Login,
    YearScreen: Year,
    MonthScreen: Month,
    WelcomeScreen: Welcome,
    DayScreen : Day
  },
  {
    initialRouteName: 'WelcomeScreen',
  }
);

const store = createStore(myReducer);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return <Provider store={ store }><RootStack /></Provider>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  }
});
