
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

    var { sync } = this.props;
    var loadingText = Constants.WAITING_LOADING;
    if(sync >= 0) {
      loadingText = Constants.TXT_SYNC;
    }

		return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <ActivityIndicator size="large" color="#333333" />
          <Text style={{ color:'#333333' }}>{ loadingText }</Text>
      </View>
		)
	}
}