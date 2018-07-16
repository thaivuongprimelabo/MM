
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class Logo extends Component<Props> {
	render() {
		return (
      <View style={ styles.container }>

			 <Image style={ {width:100, height:100} } source={ require('../img/logo.png') } />
      </View>
		)
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  logoText: {
    fontSize: 16,
    color: '#C0C0C0'
  }
});