
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

    if(screen === 'DayScreen') {

      if(index === 0) {
        this.refs.myActionSheet.hide();
        this.props.openAddModal();
      }

      // sync data
      if(index === 1) {
        this._onSyncData();
      }

      // send data
      if(index === 2) {
        this._onSendData();
      }

      // logout
      if(index === 3) {
        this.refs.myActionSheet.hide();
        this._logout();
      }

    } else {

      // sync data
      if(index === 0) {
        //this.props.onSyncData(user_id);
        this._onSyncData();
      }

      // send data
      if(index === 1) {
        // this.props.onSendData();
        this._onSendData();
      }

      // Logout
      if(index === 2) {
        this.refs.myActionSheet.hide();
        this._logout();
      }

    }
  }

  _onSyncData = async () => {
    var url = Constants.DEFAULT_SYNC_URI + '?user_id=' + this.state.user_id;
    this.props.onUpdateSyncStatus(Constants.SYNC_WAITING);
    await fetch(url, {
        method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.code === 200) {
        var json = JSON.parse(responseJson.data);
        Utils.insertToSqlite(json, false);
        Alert.alert(Constants.ALERT_TITLE_INFO, Constants.SYNC_DATA_SUCCESS);
        this.props.onUpdateSyncStatus(Constants.SYNC_SUCCESS);
        this.props.loadDataInYear('2018');
      } else {
        Alert.alert(Constants.ALERT_TITLE_ERR, responseJson.message);
      }
    })
    .catch((error) =>{
      this.props.onUpdateSyncStatus(Constants.SYNC_FAIL);
      alert(error);
    });
  }

  _onSendData = async () => {
    
    var sqlActions = 'SELECT * FROM ' + Constants.ACTIONS_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;
    var sqlTypes = 'SELECT * FROM ' + Constants.TYPES_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;
    var sqlLocations = 'SELECT * FROM ' + Constants.LOCATIONS_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;
    db.transaction((tx) =>   {
      // Actions
      tx.executeSql(sqlActions, [], (tx, results) => { 

        var actions = [];
        var len = results.rows.length;
        for(var i = 0; i < len; i++) {
          var action = results.rows.item(i);
          actions.push(action);
        }

        var data = {types: [], actions: actions};

        var url = Constants.DEFAULT_BACKUP_URI;
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: data}),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.code === 200) {
              Alert.alert(Constants.ALERT_TITLE_INFO, Constants.SEND_DATA_SUCCESS);
              this.props.onUpdateSendDataCount();
            } else {
              Alert.alert(Constants.ALERT_TITLE_ERR, responseJson.message);
            }

        })
        .catch((error) =>{
          Alert.alert(Constants.ALERT_INFO, Constants.SERVER_ERROR);
        });
      });

      // // Types
      // tx.executeSql(sqlTypes, [], (tx, results) => { 
      //   var types = [];
      //   var len = results.rows.length;
      //   for(var i = 0; i < len; i++) {
      //     var type = results.rows.item(i);
      //     types.push(type);
      //   }
      // });

      // // Locations
      // tx.executeSql(sqlLocations, [], (tx, results) => { 
      //   var locations = [];
      //   var len = results.rows.length;
      //   for(var i = 0; i < len; i++) {
      //     var location = results.rows.item(i);
      //     locations.push(location);
      //   }
      // });
    });

    

    //Utils.getDataNotSync();
    //console.log(data);
    //console.log(JSON.stringify(data));
    // var url = Constants.DEFAULT_BACKUP_URI;
    // fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ data: data}),
    // })
    // .then((response) => response.json())
    // .then((responseJson) => {
    //     console.log(responseJson);
    //     // if(responseJson.code === 200) {
    //     //   this.props.onUpdateSendDataCount();
    //     // }

    // })
    // .catch((error) =>{
    //   Alert.alert(Constants.ALERT_INFO, Constants.SERVER_ERROR);
    // });
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
    var { screen, sync_send_data } = this.props;

    var options = [
      Constants.TXT_SYNC_DATA, 
      Constants.TXT_SEND_DATA + '(' + sync_send_data.send_data_count + ')', 
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
    sync_send_data : state.sync_send_data
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onUpdateSyncStatus: (status) => {
      dispatch(Actions.updateSyncStatusAction(status));
    },
    onSendData: (user_id) => {
      dispatch(Actions.sendAction(user_id));
    },
    loadDataInYear : (year) => {
      dispatch(Actions.loadDataInYear(year))
    },
    onUpdateSendDataCount : () => {
      dispatch(Actions.updateSendDataCount(0));
    }
  };
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(MenuBottom);