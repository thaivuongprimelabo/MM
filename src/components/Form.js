
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

import * as actions from '../actions/index';

import { createStackNavigator } from 'react-navigation';

class Form extends Component<Props> {

  constructor(props) {
    super(props);
  }

  onSubmitLogin = () => {
    this.props.onSubmitLogin();
  }

	render() {
		return (
      <View style={ styles.container }>
			 <TextInput style={ styles.inputBox } 
          underlineColorAndroid='transparent'
          placeholder="Email"
          placeholderTextColor="#ffffff" />

       <TextInput style={ styles.inputBox } 
          underlineColorAndroid='transparent'
          placeholder="Password"
          placeholderTextColor="#ffffff"
          secureTextEntry={true} />

       <TouchableOpacity style={ styles.button } onPress={ this.onSubmitLogin } >
          <Text style={ styles.buttonText }>{ this.props.type == 'signup' ? 'Signup' : 'Login' }</Text>
       </TouchableOpacity>
      </View>
		)
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  inputBox: {
    width: 300,
    backgroundColor: '#7D8A96',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10
  },

  button: {
    width: 300,
    backgroundColor: '#1D2F3C',
    borderRadius:25,
    marginVertical: 10,
    paddingVertical: 12
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center'
  }
});

export default Form;