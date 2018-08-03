import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var initialState = [];

var sql = 'SELECT * FROM ' + Constants.USERS_TBL;

db.transaction((tx) => {
	tx.executeSql(sql, [], (tx, results) => {
		var info = results.rows.item(0);
		initialState.push(info);
	});
});

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		default:
			return state;
	}
}

export default myReducer;