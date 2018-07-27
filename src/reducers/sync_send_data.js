import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';

var initialState = {
	send_data_count: 0,
	sync_status: -1
};


var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var sql = 'SELECT COUNT(id) as count FROM ' + Constants.ACTIONS_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;

db.transaction((tx) => {
	tx.executeSql(sql, [], (tx, results) => {
		var len = results.rows.length;
		if(len > 0) {
			initialState.send_data_count = results.rows.item(0).count;
		}
	});
});


var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.UPDATE_SYNC_STATUS:

			state.sync_status = action.status;

			return Object.assign({}, state);
			break;
		case types.SEND_DATA:
			

			return state;
			break;

		case types.UPDATE_SEND_DATA_COUNT:

			if(action.count === 0) {
				state.send_data_count = action.count;
			} else {
				state.send_data_count = state.send_data_count + action.count;
			}
			
			return Object.assign({}, state);
			break;
		default:
			return state;
	}
}

export default myReducer;