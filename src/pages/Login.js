
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Logo from '../components/Logo';
import Form from '../components/Form';


export default class Login extends Component<Props> {

	static navigationOptions = {
    	header: null
  };

  onSubmitLogin = () => {
    this.props.navigation.navigate('YearScreen');
  }

	render() {
		return (
				<View style={ styles.container }>
					<Logo />
					<Form onSubmitLogin={ this.onSubmitLogin } />
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