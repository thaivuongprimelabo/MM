
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import * as Constants from '../constants/Constants';

export default class Loading extends Component<Props> {
	render() {
		return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ color:'#333333' }}>{ Constants.NO_ACTION_FOUND }</Text>
      </View>
		)
	}
}