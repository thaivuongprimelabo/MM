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
import Test from './src/pages/Test';

// Store
import { createStore, applyMiddleware } from 'redux';
import myReducer from './src/reducers/index';
import { Provider } from 'react-redux';

import thunk from 'redux-thunk';

const RootStack = createStackNavigator(
  {
    LoginScreen: Login,
    YearScreen: Year,
    MonthScreen: Month,
    WelcomeScreen: Welcome,
    DayScreen : Day,
    TestScreen: Test
  },
  {
    initialRouteName: 'WelcomeScreen',
  }
);

const store = createStore(myReducer, applyMiddleware(thunk));

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
