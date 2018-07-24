
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

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

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

  _saveToSqlite = (responseJson) => {
    var json = JSON.parse(responseJson);
    var typeInsertSQL = locationInsertSQL = actionInsertSQL = '';

    // Types
    var types = json.types;
    var lenTypes = types.length;
    if(lenTypes > 0) {
      typeInsertSQL = 'INSERT INTO ' + Constants.TYPES_TBL + ' VALUES ';
      var value = '';
      for(var i = 0; i < lenTypes; i++) {
        var obj = types[i];
        value += '(' + obj.value + ', "' + obj.name + '", "' + obj.color + '", "' + obj.icon + '", ' + obj.is_sync + ', ' + obj.order + ', "' + obj.created_at + '", "' + obj.updated_at + '"),';
      }
      typeInsertSQL = typeInsertSQL + value.substring(0, value.length - 1);
    }

    // Locations
    var locations = json.locations;
    var lenLocations = locations.length;
    if(lenLocations > 0) {
      locationInsertSQL = 'INSERT INTO ' + Constants.LOCATIONS_TBL + ' VALUES ';
      var value = '';
      for(var i = 0; i < lenLocations; i++) {
        var obj = locations[i];
        value += '(' + obj.id + ', "' + obj.name + '", "' + obj.latlong + '", ' + obj.is_sync + ', "' + obj.address + '", "' + obj.desc_image + '", "' + obj.created_at + '", "' + obj.updated_at + '"),';
      }
      locationInsertSQL = locationInsertSQL + value.substring(0, value.length - 1);
    }

    // Actions
    var actions = json.actions;
    var lenActions = actions.length;
    if(lenActions > 0) {
      actionInsertSQL = 'INSERT INTO ' + Constants.ACTIONS_TBL + ' VALUES ';
      var value = '';
      for(var i = 0; i < lenActions; i++) {
        var obj = actions[i];
        value += '(' + obj.id + ', "' + obj.name + '", "' + obj.cost + '", "' + obj.time + '", ' + obj.location_id + ', "' + obj.comment + '", ' + obj.type_id + ', ' + obj.is_sync + ', "' + obj.created_at + '", "' + obj.updated_at + '"),';
      }
      actionInsertSQL = actionInsertSQL + value.substring(0, value.length - 1);
    }

    // Users
    var users = json.user_info;
    var userInsertSQL = 'INSERT INTO ' + Constants.USERS_TBL + ' VALUES(' + users.id + ', "' + users.loginid + '", "123456") ';

    // Insert sqlite
    db.transaction((tx) =>   {
      if(typeInsertSQL !== '') {
        tx.executeSql('DELETE FROM ' + Constants.TYPES_TBL, [], (tx, results) => { console.log(results); });
        tx.executeSql(typeInsertSQL, [], (tx, results) => { console.log(results); });
      }

      if(locationInsertSQL !== '') {
        tx.executeSql('DELETE FROM ' + Constants.LOCATIONS_TBL, [], (tx, results) => { console.log(results); });
        tx.executeSql(locationInsertSQL, [], (tx, results) => { console.log(results); });
      }

      if(actionInsertSQL !== '') {
        tx.executeSql('DELETE FROM ' + Constants.ACTIONS_TBL, [], (tx, results) => { console.log(results); });
        tx.executeSql(actionInsertSQL, [], (tx, results) => { console.log(results); });
      }

      if(userInsertSQL !== '') {
        tx.executeSql('DELETE FROM ' + Constants.USERS_TBL, [], (tx, results) => { console.log(results); });
        tx.executeSql(userInsertSQL, [], (tx, results) => { console.log(results); });
      }

      tx.executeSql('SELECT * FROM ' + Constants.USERS_TBL, [], (tx, results) => { 
        var len = results.rows.length;
        if(len === 0) {
          this.props.navigation.navigate('LoginScreen');
        } else {
          this.props.navigation.navigate('YearScreen');
        }
      });
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
          this._saveToSqlite(responseJson.data);
          checkLogin = true;
        }
    })
    .catch((error) =>{
        alert(error);
    });

    if(checkLogin) {
      //this.props.navigation.navigate('YearScreen');
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