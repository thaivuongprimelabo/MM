
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

  _onSyncData = async () => {
    var { screen, year, user_info } = this.props;
    var url = Constants.DEFAULT_SYNC_URI + '?user_id=' + user_info[0].id;
    console.log(url);
    this.props.onUpdateSyncStatus(Constants.SYNC_WAITING);
    await fetch(url, {
        method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.code === 200) {
        var json = JSON.parse(responseJson.data);
        if(json.types.length === 0 && json.locations.length === 0 && json.actions.length === 0) {
          this.props.onUpdateSyncStatus(Constants.SYNC_SUCCESS);
          Alert.alert(Constants.ALERT_TITLE_INFO, Constants.NO_DATA_SYNC);
          return false;
        }
        Utils.insertToSqlite(json, false);
        this.props.onUpdateSyncStatus(Constants.SYNC_SUCCESS);
        // Refresh year screen
        if(screen === Constants.YEAR_SCREEN) {
          this.props.loadDataInYear(year);
        }

        // Refresh year screen
        if(screen === Constants.MONTH_SCREEN) {
          var { month, budget } = this.props;
          this.props.loadDataInMonth(year, month, budget);
        }

        // Refresh day screen
        if(screen === Constants.DAY_SCREEN) {
          var { month, day } = this.props;
          var count = 0;
          for(var i = 0; i < json.actions.length; i++) {
            var obj = json.actions[i];
            var ymd = Utils.formatDateString({ y: year, m: month, d: day });
            if(ymd === obj.time) {
              count++;
            }
          }
          this.props.loadDataInDay(year, month, day, count);
        }
        
        Alert.alert(Constants.ALERT_TITLE_INFO, Constants.SYNC_DATA_SUCCESS);
      } else {
        Alert.alert(Constants.ALERT_TITLE_ERR, responseJson.message);
      }
    })
    .catch((error) =>{
      this.props.onUpdateSyncStatus(Constants.SYNC_FAIL);
      alert(error);
    });
  }

  _onSendData = () => {

    var { sync_send_data } = this.props;

    if(sync_send_data.send_data_count === 0) {
      Alert.alert(Constants.ALERT_TITLE_INFO, Constants.NO_DATA_SEND);
      return false;
    }
    
    var data = {types: [], actions: [], locations: []};

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
          action.is_sync = Constants.IS_SYNC;
          data.actions.push(action);
        }

        tx.executeSql(sqlLocations, [], (tx, results) => { 

          var locations = [];
          var len = results.rows.length;
          for(var i = 0; i < len; i++) {
            var location = results.rows.item(i);
            location.is_sync = Constants.IS_SYNC;
            data.locations.push(location);
          }

          tx.executeSql(sqlTypes, [], (tx, results) => { 

            var types = [];
            var len = results.rows.length;
            for(var i = 0; i < len; i++) {
              var type = results.rows.item(i);
              type.is_sync = Constants.IS_SYNC;
              data.types.push(type);
            }

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
                console.log(responseJson);
                if(responseJson.code === 200) {
                  this._onUpdateDataSync();
                  this.props.onUpdateSendDataCount();
                  Alert.alert(Constants.ALERT_TITLE_INFO, Constants.SEND_DATA_SUCCESS);
                } else {
                  Alert.alert(Constants.ALERT_TITLE_ERR, responseJson.message);
                }

            })
            .catch((error) =>{
              Alert.alert(Constants.ALERT_INFO, Constants.SERVER_ERROR);
            });

          });
        });
      });
    });
  }

  _onUpdateDataSync = () => {
    console.log('_onUpdateDataSync'); 
    var sql = 'UPDATE ' + Constants.ACTIONS_TBL + ' SET is_sync = ' + Constants.IS_SYNC + ' WHERE is_sync = ' + Constants.NOT_SYNC;
    var sql1 = 'UPDATE ' + Constants.LOCATIONS_TBL + ' SET is_sync = ' + Constants.IS_SYNC + ' WHERE is_sync = ' + Constants.NOT_SYNC;
    var sql2 = 'UPDATE ' + Constants.TYPES_TBL + ' SET is_sync = ' + Constants.IS_SYNC + ' WHERE is_sync = ' + Constants.NOT_SYNC;
    db.transaction((tx) =>   {
      tx.executeSql(sql, [], (tx, results) => { console.log(results); });
      tx.executeSql(sql1, [], (tx, results) => { console.log(results); });
      tx.executeSql(sql2, [], (tx, results) => { console.log(results);  });
    });

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
    onSendData: (user_id) => {
      dispatch(Actions.sendAction(user_id));
    },
    loadDataInYear : (year) => {
      dispatch(Actions.loadDataInYear(year))
    },
    loadDataInMonth: (year, month, budget) => {
        dispatch(Actions.loadDataInMonth(year, month, budget));
    },
    loadDataInDay: (year, month, day, count) => {
        dispatch(Actions.loadDataInDay(year, month, day, count));
    },
    onUpdateSendDataCount : () => {
      dispatch(Actions.updateSendDataCount(0));
      dispatch(Actions.updateRowSyncStatusAction());
    }
  };
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(MenuBottom);