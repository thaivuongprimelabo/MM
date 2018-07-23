
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class TrashButton extends Component<Props> {
	render() {
		return (
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }} ><Image source={ require('../img/icon-trash.png') } /></View>
		)
	}
}