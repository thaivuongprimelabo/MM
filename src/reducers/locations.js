import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';
import { Alert } from 'react-native';

var initialState = [];

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var sql = 'SELECT id, name FROM ' + Constants.LOCATIONS_TBL + ' ORDER BY created_at DESC ';

db.transaction((tx) => {
    tx.executeSql(sql, [], (tx, results) => {
    	var len = results.rows.length;
    	if(len > 0) {
    		for(var i = 0; i < len; i++) {
    			var item = results.rows.item(i);
    			initialState.push(item);
    		}
    	}
    });
});

var myReducer = (state = initialState, action) => {
	switch(action.type) {

		case types.ADD_LOCATION:

			var obj = action.formdata;

            state.push(obj);

            return [...state];

		default:
			return state;
	}
}

export default myReducer;