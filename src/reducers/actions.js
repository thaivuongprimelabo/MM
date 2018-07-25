import * as types from '../constants/ActionTypes';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var initialState = [];

var myReducer = (state = initialState, action) => {
	switch(action.type) {

		case types.ADD_ACTION:
			var data = action.formdata;
			var sql = 'INSERT INTO ' + Constants.ACTIONS_TBL + ' VALUES("' + data.name + '", "' + data.cost + '", "' +  + '")';
		        
			db.transaction((tx) => {
		        
		        tx.executeSql(sql, [], (tx, results) => {
		            var len = results.rows.length;
		            if(len > 0) {
		              for(var i = 0; i < len; i++) {
		                for(var j = 0; j < tempData.length; j++) {
		                  var month = tempData[j];
		                  if(results.rows.item(i).m === month.m) {
		                    month.used = results.rows.item(i).used;
		                    month.budget = month.budget !== '0' ? month.budget : Constants.DEFAULT_BUDGET;
		                    month.remain = parseInt(month.budget) - parseInt(month.used);
		                    break;
		                  }
		                }
		              }
		            }
		        });
		    });

			break;
		default:
			return state;
	}
}

export default myReducer;