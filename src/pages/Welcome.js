
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  ActivityIndicator,
  Image,
  AsyncStorage
} from 'react-native';

import Storage from 'react-native-storage';

import { connect } from 'react-redux';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';

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
});

class Welcome extends Component<Props> {

  constructor(props) {
    super(props);
  }

	static navigationOptions = {
    	header: null
  };

  componentDidMount() {
    this.interval = setTimeout(() => {
      this._checkData();
    }, 2000);
  }

  _checkData = () => {
    Utils.getDataFromStorage('isLogin').then((islogin) => {
      if(islogin === '1') {
        this.props.navigation.navigate('YearScreen');
      } else {
        this.props.navigation.navigate('LoginScreen');
      }
    });
  }

	render() {

		return (
				<View style={ styles.container }>
          <Image source={ require('../img/icon-app.png') } style={{ width:64, height: 64 }} />
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

export default Welcome;