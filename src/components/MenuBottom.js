
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';

import * as Constants from '../constants/Constants';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

export default class MenuBottom extends Component<Props> {

  showActionSheet = () => {
    this.refs.myActionSheet.show();
  }

  onActionSheetClick = (index) => {
    var { screen } = this.props;

    if(screen === 'DayScreen') {

      if(index === 3) {
        this.refs.myActionSheet.hide();
        this._logout();
      }

    } else {

      if(index === 2) {
        this.refs.myActionSheet.hide();
        this._logout();
      }

    }
  }

  _logout() {
    db.transaction((tx) =>   {
      tx.executeSql('DELETE FROM ' + Constants.USERS_TBL, [], (tx, results) => { 
        if(results.rowsAffected === 1) {
          this.props.navigation.navigate('LoginScreen');
        }
      });
    });
  }

	render() {
    var { screen } = this.props;

    var options = [
      'Đồng bộ dữ liệu', 
      'Gửi dữ liệu', 
      'Đăng xuất',
      'Đóng'
    ]

    var cancelButtonIndex = 3;
    var destructiveButtonIndex = 2;

    if(screen === 'DayScreen') {
      options.splice(0, 0, 'Đăng ký hoạt động');
      cancelButtonIndex = 4;
      destructiveButtonIndex = 3;
    }
		return (
      <ActionSheet
        ref={'myActionSheet'}
        options={ options }
        cancelButtonIndex={ cancelButtonIndex }
        destructiveButtonIndex={ destructiveButtonIndex }
        onPress={(index) => this.onActionSheetClick(index) }
      />
		)
	}
}