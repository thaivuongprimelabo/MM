
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  ActivityIndicator,
  Image
} from 'react-native';

import { connect } from 'react-redux';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';

import Utils from '../constants/Utils';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

class Welcome extends Component<Props> {

  constructor(props) {
    super(props);

  }

  errorCB(err) {
    console.log(err);
  }

  successCB(err) {
    console.log(err);
  }

	static navigationOptions = {
    	header: null
  };

  componentDidMount() {
    this.interval = setTimeout(() => {
      this._checkLogin();
    }, 1000);
  }

  _checkLogin() {
    try {
      db.transaction((tx) =>   {
        tx.executeSql('SELECT id FROM ' + Constants.USERS_TBL, [], (tx, results) => { 
          var len = results.rows.length;
          if(len === 0) {
            this.props.navigation.navigate(Constants.LOGIN_SCREEN);
          } else {

            var params = { user_id: results.rows.item(0).id };

            this.props.navigation.navigate(Constants.YEAR_SCREEN, params);
          }
        });
      });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
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