import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';


var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var date = new Date();
var year = date.getFullYear();
var initialState = [];

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.LOAD_DATA_IN_YEAR:

			var tempData = [
		        { id: 1, m: '01', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
		        { id: 2, m: '02', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
		        { id: 3, m: '03', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
		        { id: 4, m: '04', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
		        { id: 5, m: '05', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
		        { id: 6, m: '06', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
		        { id: 7, m: '07', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
		        { id: 8, m: '08', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
		        { id: 9, m: '09', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
		        { id: 10, m: '10', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
		        { id: 11, m: '11', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'}, 
		        { id: 12, m: '12', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'}
	      	];

	      	var sql = 'SELECT substr(act.time,5,2) as m, sum(act.cost) as used FROM actions act ';
	      		sql += 'WHERE substr(act.time,1,4) = "' + year + '" AND (is_deleted = ' + Constants.NOT_DELETED + ' OR is_deleted IS NULL) ';
		        sql += 'GROUP BY substr(act.time,5,2) ';
		        sql += 'ORDER BY act.created_at DESC';
		        
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
			
		    state = tempData;
			return [...state];
		default:
			return state;
	}
}

export default myReducer;