
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';

import Storage from 'react-native-storage';

import * as Actions from '../actions/index';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';

var storage = new Storage({
  // maximum capacity, default 1000 
  size: 1000,

  // Use AsyncStorage for RN, or window.localStorage for web.
  // If not set, data would be lost after reload.
  storageBackend: AsyncStorage,
  
  // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: 1000 * 3600 * 24,
  
  // cache data in the memory. default is true.
  enableCache: false,
  
  // if data was not found in storage or expired,
  // the corresponding sync method will be invoked and return 
  // the latest data.
  sync : {
    // we'll talk about the details later.
  }
})

class Form extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      loginid : Constants.DEFAULT_USER,
      password: Constants.DEFAULT_PASSWORD,
      showLoading: false
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
      var data = {
        loginid: this.state.loginid,
        password: this.state.password
      }
      this._doLogin(data);

    } else {
      Alert.alert(Constants.ALERT_TITLE_INFO, error);
    }
    
  }

  _storeData = (response) => {
    storage.save({
      key: 'loginState',   // Note: Do not use underscore("_") in key!
      data: { 
        response : response,
        isLogin: '1'
      },
      
      // if not specified, the defaultExpires will be applied instead.
      // if set to null, then it will never expire.
      expires: 1000 * 3600
    });
  }

  _doLogin = async (loginInfo) => {
    this.setState({ showLoading: true });
    var checkLogin = false;
    var url = Constants.DEFAULT_AUTH_URI;
    await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.code === 200) {
          //await AsyncStorage.setItem('data', responseJson.data);
          //await AsyncStorage.setItem('isLogin', true);
          this._storeData(responseJson.data);
          checkLogin = true;
        }
    })
    .catch((error) =>{
        alert(error);
    });

    if(checkLogin) {
      this.props.navigation.navigate('YearScreen');
    } else {
      Alert.alert(Constants.ALERT_TITLE_ERR, Constants.LOGIN_FAILED);
    }
    this.setState({ showLoading: false });
  }

	render() {

    var { showLoading } = this.state;
    var loginLoading;
    if(showLoading) {
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

// const mapStateToProps = (state) => {
//   return {
//     response: state.login
//   };
// }

// const mapDispatchToProps = (dispatch, props) => {
//   return {

//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Form);

export default Form;