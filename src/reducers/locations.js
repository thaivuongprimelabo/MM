import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';
import { Alert } from 'react-native';

var initialState = [];

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var myReducer = (state = initialState, action) => {
	switch(action.type) {

		case types.LOAD_DATA_LOCATION:

			var tempData = [];

			for(var i = 0; i < action.count; i++) {
				var object = { id: i, name: '' };
				tempData.push(object);
			}

			var sql = 'SELECT id, name FROM ' + Constants.LOCATIONS_TBL + ' ORDER BY created_at DESC ';

			db.transaction((tx) => {
			    tx.executeSql(sql, [], (tx, results) => {
			    	var len = results.rows.length;
			    	if(len > 0) {
			    		for(var i = 0; i < len; i++) {
			    			var item = results.rows.item(i);
			    			tempData[i].id = item.id;
			    			tempData[i].name = item.name;
			    		}
			    	}
			    });
			});

			state = tempData;

			return [...state];

		case types.ADD_LOCATION:

			var tempData = [];

            var obj = {id: 999, name: ''};

            var formdata = action.formdata;
            var created_at = updated_at = Utils.getCurrentDate();
            var id = Utils.generateId();
            var sql = 'INSERT INTO ' + Constants.LOCATIONS_TBL + '(id, name, latlong, is_sync, address, desc_image, created_at, updated_at) VALUES ';
            sql += '(' + id + ', "' + formdata.name  +'", "' + formdata.latlong + '", ' + Constants.NOT_SYNC + ', "' + formdata.address + '","","' + created_at + '", "' + updated_at + '")';
              
            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    if(results.rowsAffected > 0) {
                        obj.id = results.insertId;
                        obj.name = formdata.name;
                        Alert.alert(Constants.ALERT_TITLE_INFO, Constants.REGISTER_DATA_SUCCESS);
                    }
                });
            });

            state.push(obj);

            return [...state];

		default:
			return state;
	}
}

export default myReducer;