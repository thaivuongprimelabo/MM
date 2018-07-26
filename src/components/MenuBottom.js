
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

import { connect } from 'react-redux';

import ActionSheet from 'react-native-actionsheet';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

class MenuBottom extends Component<Props> {

  showActionSheet = () => {
    this.refs.myActionSheet.show();
  }

  onActionSheetClick = (index) => {
    var { screen, user_id } = this.props;

    if(screen === 'DayScreen') {

      if(index === 0) {
        this.refs.myActionSheet.hide();
        this.props.openAddModal();
      }

      // sync data
      if(index === 1) {
        this.props.onSyncData(user_id);
      }

      // send data
      if(index === 2) {
        this.props.onSendData();
      }

      // logout
      if(index === 3) {
        this.refs.myActionSheet.hide();
        this._logout();
      }

    } else {

      // sync data
      if(index === 0) {
        this.props.onSyncData(user_id);
      }

      // send data
      if(index === 1) {
        this.props.onSendData();
      }

      // Logout
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
    var { screen, menuBottom } = this.props;

    var options = [
      Constants.TXT_SYNC_DATA, 
      Constants.TXT_SEND_DATA + '(' + menuBottom.send_data_count + ')', 
      Constants.TXT_LOGOUT,
      Constants.TXT_CLOSE
    ]

    var cancelButtonIndex = 3;
    var destructiveButtonIndex = 2;

    if(screen === 'DayScreen') {
      options.splice(0, 0, Constants.TXT_ADD_ACTION);
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

const mapStateToProps = (state) => {
  return {
    menuBottom : state.menuBottom
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onSyncData: (user_id) => {
      dispatch(Actions.syncAction(user_id));
    },
    onSendData: (user_id) => {
      dispatch(Actions.sendAction(user_id));
    }
  };
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(MenuBottom);