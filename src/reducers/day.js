import * as types from '../constants/ActionTypes';
import Utils from '../constants/Utils';

var initialState = [];

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.LOAD_DATA_IN_DAY:
			


			var tempData = [];

			if(action.count > 0) {

				for(var i = 0; i < action.count; i++) {
					var object = { id: 1, name: '', time: '', location: '', price: '', type: '', icon: '' };
					tempData.push(object);
				}

				var strYr = JSON.stringify(action.year);
				var strMth = JSON.stringify(action.month);
				var strD = JSON.stringify(action.day);
				var strYmd = strYr + (strMth.length === 1 ? '0' + strMth : strMth) + (strD.length === 1 ? '0' + strD : strD);
				
				var sql =  'SELECT act.*, lo.name as location, t.icon as icon FROM actions act ';
					sql += 'LEFT JOIN locations lo ON lo.id = act.location_id ';
					sql += 'LEFT JOIN types t ON t.value = act.type_id ';
			       	sql += 'WHERE time = "' + strYmd + '" ';

			    db.transaction((tx) => {
			        tx.executeSql(sql, [], (tx, results) => {
			        	var len = results.rows.length;
			        	if( len > 0 ) {

			        		for(var i = 0; i < len; i++) {

			        			var work = results.rows.item(i);
			        			
			        			tempData[i].id = work.id;
			        			tempData[i].name = work.name;
			        			tempData[i].time = work.created_at;
			        			tempData[i].location = work.location;
			        			tempData[i].price = work.cost;
			        			tempData[i].icon = work.icon;
			        		}
			        		
			        	}
			        });
			    });
			}
			
			state = tempData;

			return [...state];
		case types.ADD_ACTION:
			console.log(action);
			return [...state];
		case types.EDIT_ACTION:
			console.log(action);
			return [...state];
		default:
			return state;
	}
}

export default myReducer;