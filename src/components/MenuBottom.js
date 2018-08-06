
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
  Alert
} from 'react-native';

import { connect } from 'react-redux';

import ActionSheet from 'react-native-actionsheet';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';
import Utils from '../constants/Utils';

import axios from 'axios';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

class MenuBottom extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      user_id : this.props.user_id
    }
  }

  showActionSheet = () => {
    this.refs.myActionSheet.show();
  }

  onActionSheetClick = (index) => {

    var { screen } = this.props;

    // Open type modal
    if(index === 0) {
      this.props.openTypeModal();
    }

    // Open location modal
    if(index === 1) {
      this.props.openLocationModal();
    }

    // Open action modal
    if(index === 2) {
      this.refs.myActionSheet.hide();
      this.props.openAddModal();
    }

    // sync data
    if(index === 3) {
      this._onSyncData();
    }

    // send data
    if(index === 4) {
      this._onSendData();
    }

    // logout
    if(index === 5) {
      this.refs.myActionSheet.hide();
      this._logout();
    }
  }

  _onSyncData() {

    var { user_info, screen } = this.props;

    this.props.onSyncData(user_info[0].id, screen);
    
  }

  _onSendData() {

    var { sync_send_data } = this.props;

    if(sync_send_data.send_data_count === 0) {
      Alert.alert(Constants.ALERT_TITLE_INFO, Constants.NO_DATA_SEND);
      return false;
    }

    this.props.onSendData();
    
  }

  _logout() {
    db.transaction((tx) =>   {
      tx.executeSql('DELETE FROM ' + Constants.LOCATIONS_TBL, [], (tx, results) => {});
      tx.executeSql('DELETE FROM ' + Constants.TYPES_TBL, [], (tx, results) => {});
      tx.executeSql('DELETE FROM ' + Constants.ACTIONS_TBL, [], (tx, results) => {});
      tx.executeSql('DELETE FROM ' + Constants.USERS_TBL, [], (tx, results) => { 
        if(results.rowsAffected === 1) {
          this.props.navigation.navigate('LoginScreen');
        }
      });
    });
  }

	render() {
    var { screen, sync_send_data } = this.props;

    var options = [
      Constants.TXT_ADD_TYPE,
      Constants.TXT_ADD_LOCATION,
      Constants.TXT_ADD_ACTION,
      Constants.TXT_SYNC_DATA, 
      Constants.TXT_SEND_DATA + '(' + sync_send_data.send_data_count + ')', 
      Constants.TXT_LOGOUT,
      Constants.TXT_CLOSE
    ]

    var cancelButtonIndex = 6;
    var destructiveButtonIndex = 5;

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
    sync_send_data : state.sync_send_data,
    user_info : state.user_info
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onUpdateSyncStatus: (status) => {
      dispatch(Actions.updateSyncStatusAction(status));
    },
    onSyncData: (user_id, screen) => {
      dispatch(Actions.syncData(user_id, screen));
    },
    onSendData: () => {
      dispatch(Actions.sendData());
    },
    onUpdateSendDataCount : () => {
      dispatch(Actions.updateSendDataCount(0));
      dispatch(Actions.updateRowSyncStatusAction());
    }
  };
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(MenuBottom);