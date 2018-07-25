import * as types from '../constants/ActionTypes';
import Utils from '../constants/Utils';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var initialState = [];

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.LOAD_DATA_IN_MONTH:

			var tempData = [];
			var json = Utils.getStartEndDayInMonth(action.year, action.month);
			var totalDayInMonth = json.end - json.start;
			var budgetEveryDay = Math.round(action.budget / totalDayInMonth);
			for(var i = json.start; i <= json.end; i++) {
    			var d = i.length === 1 ? '0' + i : i;
		    	var dayOfWeek = Utils.getDayOfWeek(action.year, action.month, i);
		        var day = { id: i, d: d, budget: budgetEveryDay, used: '0', remain: '0', dayOfWeek: dayOfWeek, count: 0 };
		        tempData.push(day);
		    }

			var strYr = JSON.stringify(action.year);
			var strMth = JSON.stringify(action.month);
			var strYm = strYr + (strMth.length === 1 ? '0' + strMth : strMth);

			var sql = 'SELECT act.name, substr(act.time, 7,2) as d, SUM(act.cost) as total_cost, count(act.id) as count FROM actions act ';
		        	sql += 'WHERE substr(time, 1, 6) = "' + strYm + '" ';
		        	sql += 'GROUP BY act.time ';

			db.transaction((tx) => {
		        tx.executeSql(sql, [], (tx, results) => {
		            var len = results.rows.length;
		            if(len > 0) {
		            	var curRemain = 0;

            			for(var j = 0; j < tempData.length; j++) {

            				var day = tempData[j];

            				var hasInDB = false;

            				for(var i = 0; i < len; i++) {

            					var d = results.rows.item(i).d;
            					var count = results.rows.item(i).count;
            					var total_cost = parseInt(results.rows.item(i).total_cost);

            					if(parseInt(d) === parseInt(day.d)) {

            						var budget = parseInt(day.budget);

				                  	budget = budget + curRemain;
				                  	
				                  	var remain = budget - total_cost;

				                  	// Set value
				                  	day.budget = budget;
				                    day.used = total_cost;
				                    day.remain = remain;
				                    day.count = count;


				                    curRemain = remain;

				                    hasInDB = true;

				                    break;

            					}

            				}

            				if(!hasInDB) {

            					var budget = parseInt(day.budget);

            					budget = budget + curRemain;

            					var remain = budget;

            					day.budget = budget;
            					day.used = 0;
            					day.remain = remain;
            					day.count = 0;

            					curRemain = remain;

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