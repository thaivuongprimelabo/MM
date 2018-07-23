
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import Storage from 'react-native-storage';

import Logo from '../components/Logo';
import Form from '../components/Form';


export default class Login extends Component<Props> {

	static navigationOptions = {
    	header: null
  };

	render() {
		return (
				<View style={ styles.container }>
					<Logo />
					<Form onSubmitLogin={ this.onSubmitLogin } navigation={this.props.navigation} />
				</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },
});