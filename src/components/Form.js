
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';

import * as Actions from '../actions/index';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';

import axios from 'axios';

class Form extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      loginid : Constants.DEFAULT_USER,
      password: Constants.DEFAULT_PASSWORD
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    
  }

  onSubmitLogin = () => {
    var error = '';
    if(this.state.username === '') {
      error += Utils.replactParamError(Constants.ERR_REQUIRED,[Constants.TXT_USERNAME]) + "\n";
    }

    if(this.state.password === '') {
      error += Utils.replactParamError(Constants.ERR_REQUIRED,[Constants.TXT_PASSWORD]) + "\n";
    }

    if(error === '') {
      var loginInfo = {
        loginid: this.state.loginid,
        password: this.state.password
      }
      this.props.onSubmitLogin(loginInfo);

    } else {
      Alert.alert(Constants.ALERT_TITLE_INFO, error);
    }
    
  }

	render() {

    var { loading } = this.props;
    var loginLoading;
    if(loading.status === Constants.LOADING_WAITING) {
      loginLoading = <ActivityIndicator size="small" color="#ffffff" />;
    }

		return (
      <View style={ styles.container }>
			 <TextInput style={ styles.inputBox } 
          underlineColorAndroid='transparent'
          placeholder={ Constants.TXT_USERNAME }
          placeholderTextColor="#ffffff"
          onChangeText={(text) => this.setState({ loginid: text })}
          value={ this.state.loginid } />

       <TextInput style={ styles.inputBox } 
          underlineColorAndroid='transparent'
          placeholder={ Constants.TXT_PASSWORD }
          placeholderTextColor="#ffffff"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
          value={ this.state.password } />

       <TouchableOpacity style={ styles.button } onPress={ this.onSubmitLogin } >
          <Text style={ styles.buttonText }>{ Constants.TXT_BUTTON_LOGIN }</Text>
       </TouchableOpacity>
       { loginLoading }
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
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center'
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    loading : state.loading
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onSubmitLogin : (loginInfo) => {
      dispatch(Actions.submitLogin(loginInfo, props.navigation));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);

// export default Form;