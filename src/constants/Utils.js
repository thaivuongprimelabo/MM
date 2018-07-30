import * as Constants from '../constants/Constants';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

const Utils = {
  formatDateString:(input) => {
    
    var format = input.format;

    year = JSON.stringify(input.year);
    month = JSON.stringify(input.month);
    day = JSON.stringify(input.day);

  	month = month.length == 1 ? '0' + month : month;
    day = day.length == 1 ? '0' + day : day;

    format = format.replace('YYYY', year);
  	format = format.replace('MM', month);
  	format = format.replace('DD', day);

    return format;
  },

  getCurrentDate: (format) => {
  	 var date = new Date();
  	 var month = JSON.stringify(month);

  	 var year = date.getFullYear();
  	 var month = date.getMonth() === 11 ? 12 : date.getMonth() + 1;
  	 month = JSON.stringify(month);
  	 month = month.length == 1 ? '0' + month : month;
  	 var day  = JSON.stringify(date.getDate());
  	 day = day.length == 1 ? '0' + day : day;

  	 var hour = JSON.stringify(date.getHours());
  	 hour = hour.length == 1 ? '0' + hour : hour;
  	 var minute = JSON.stringify(date.getMinutes());
  	 minute = minute.length == 1 ? '0' + minute : minute;
  	 var second = JSON.stringify(date.getSeconds());
  	 second = second.length == 1 ? '0' + second : second;

  	 format = format.replace('YYYY', year);
  	 format = format.replace('MM', month);
  	 format = format.replace('DD', day);
  	 format = format.replace('HH', hour);
  	 format = format.replace('II', minute);
  	 format = format.replace('SS', second); 
  	 return format

  },

  getCurrentYear : () => {
    var date = new Date();
    var year = date.getFullYear();
    return year;
  },

  formatCurrency: (nStr, decSeperate, groupSeperate) => {
  	if(nStr == null) {
  		return '0 ' + Constants.CURRENCY;
  	}
  	nStr += '';
    x = nStr.split(decSeperate);
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
    }
    return x1 + x2;
  },

  getStartEndDayInMonth : (year, month) => {
    var date = new Date(year, month, 0);
    y = date.getFullYear(); 
    m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    var start = firstDay.getDate();
    var end = lastDay.getDate();

    return {
      start: start,
      end: end
    }
  },

  getDayOfWeek: (year, month, day) => {

    month = month - 1;
    // console.log(year + month + day);
    var d = new Date(year, month, day);

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[d.getDay()];
  },

  cnvNull: (input) => {
    return input == null || input == 'null' ? '' : input;
  },

  replactParamError: (error, params) => {
    var length = params.length;
    if(length > 0) {
      for(var i = 0; i < length; i++) {
        error = error.replace('{' + i + '}', params[i]);
      }
    }
    
    return error;
  },

  doLogin: async (loginInfo) => {
    var response = [];
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
          response = JSON.parse(responseJson.data);
        }
    })
    .catch((error) =>{
        alert(error);
    });

    return response;
  },

  getActionById: (id, list) => {
    var len = list.length;
    if(len > 0) {
      for(var i = 0; i < len; i++) {
        if(list[i].id === id) {
          return list[i];
        }
      }
    }
  },

  insertToSqlite: (json, isdelete) => {
    // Types
    var typeInsertSQL = '';
    var types = json.types;
    var lenTypes = types.length;
    if(lenTypes > 0) {
      typeInsertSQL = 'INSERT INTO ' + Constants.TYPES_TBL + ' VALUES ';
      var value = '';
      for(var i = 0; i < lenTypes; i++) {
        var obj = types[i];
        value += '(' + obj.value + ', "' + obj.name + '", "' + obj.color + '", "' + obj.icon + '", ' + Constants.IS_SYNC + ', ' + obj.order + ', "' + obj.created_at + '", "' + obj.updated_at + '"),';
      }
      typeInsertSQL = typeInsertSQL + value.substring(0, value.length - 1);
    }

    // Locations
    var locationInsertSQL = '';
    var locations = json.locations;
    var lenLocations = json.locations.length;
    if(lenLocations > 0) {
      locationInsertSQL = 'INSERT INTO ' + Constants.LOCATIONS_TBL + ' VALUES ';
      var value = '';
      for(var i = 0; i < lenLocations; i++) {
        var obj = locations[i];
        value += '(' + obj.id + ', "' + obj.name + '", "' + obj.latlong + '", ' + Constants.IS_SYNC + ', "' + obj.address + '", "' + obj.desc_image + '", "' + obj.created_at + '", "' + obj.updated_at + '"),';
      }
      locationInsertSQL = locationInsertSQL + value.substring(0, value.length - 1);
    }

    // Actions
    var actionInsertSQL = '';
    var actions = json.actions;
    var lenActions = json.actions.length;
    if(lenActions > 0) {
      actionInsertSQL = 'INSERT INTO ' + Constants.ACTIONS_TBL + ' VALUES ';
      var value = '';
      for(var i = 0; i < lenActions; i++) {
        var obj = actions[i];
        value += '(' + obj.id + ', "' + obj.name + '", "' + obj.cost + '", "' + obj.time + '", ' + obj.location_id + ', "' + obj.comment + '", ' + obj.type_id + ', ' + Constants.IS_SYNC + ', ' + Constants.NOT_DELETED + ', "' + obj.created_at + '", "' + obj.updated_at + '"),';
      }
      actionInsertSQL = actionInsertSQL + value.substring(0, value.length - 1);
    }

    // Users
    var userInsertSQL = '';
    var users = json.user_info;
    if(users) {
      var userInsertSQL = 'INSERT INTO ' + Constants.USERS_TBL + ' VALUES(' + users.id + ', "' + users.loginid + '", "123456") ';
    }

    // Insert sqlite
    db.transaction((tx) =>   {
      if(typeInsertSQL !== '') {
        if(isdelete) {
          tx.executeSql('DELETE FROM ' + Constants.TYPES_TBL, [], (tx, results) => { console.log(results); });
        }
        tx.executeSql(typeInsertSQL, [], (tx, results) => { console.log(results); });
      }

      if(locationInsertSQL !== '') {
        if(isdelete) {
          tx.executeSql('DELETE FROM ' + Constants.LOCATIONS_TBL, [], (tx, results) => { console.log(results); });
        }
        tx.executeSql(locationInsertSQL, [], (tx, results) => { console.log(results); });
      }

      if(actionInsertSQL !== '') {
        if(isdelete) {
          tx.executeSql('DELETE FROM ' + Constants.ACTIONS_TBL, [], (tx, results) => { console.log(results); });
        }
        tx.executeSql(actionInsertSQL, [], (tx, results) => { console.log(results); });
      }

      if(userInsertSQL !== '') {
        if(isdelete) {
          tx.executeSql('DELETE FROM ' + Constants.USERS_TBL, [], (tx, results) => { console.log(results); });
        }
        tx.executeSql(userInsertSQL, [], (tx, results) => { console.log(results); });
      }
    });

    return {
      typeInsertSQL,
      locationInsertSQL,
      actionInsertSQL,
      userInsertSQL
    }
  },

  getDataNotSync: async () => {
    var actions = [];
    var types = [];
    var locations = [];
    var sqlActions = 'SELECT * FROM ' + Constants.ACTIONS_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;
    var sqlTypes = 'SELECT * FROM ' + Constants.TYPES_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;
    var sqlLocations = 'SELECT * FROM ' + Constants.LOCATIONS_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;
    db.transaction((tx) =>   {
      // Actions
      tx.executeSql(sqlActions, [], (tx, results) => { 
        var len = results.rows.length;
        for(var i = 0; i < len; i++) {
          var action = results.rows.item(i);
          actions.push(action);
        }
      });

      // Types
      tx.executeSql(sqlTypes, [], (tx, results) => { 
        var len = results.rows.length;
        for(var i = 0; i < len; i++) {
          var type = results.rows.item(i);
          types.push(type);
        }
      });

      // Locations
      tx.executeSql(sqlLocations, [], (tx, results) => { 
        var len = results.rows.length;
        for(var i = 0; i < len; i++) {
          var location = results.rows.item(i);
          locations.push(location);
        }
      });
    });

    return {
      actions,
      types,
      locations
    }
  }
}

export default Utils;