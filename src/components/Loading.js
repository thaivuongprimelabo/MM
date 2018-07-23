
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';

import * as Constants from '../constants/Constants';

export default class Loading extends Component<Props> {
	render() {
		return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={{ color:'#333333' }}>{ Constants.WAITING_LOADING }</Text>
      </View>
		)
	}
}