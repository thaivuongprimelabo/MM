import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';

import Utils from '../constants/Utils';


var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var initialState = [];

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

			var obj = {id: 9999, name: '', time: '', location: '', price: '', icon: Constants.DEFAULT_ICON};

			var data = action.formdata;
			var created_at = Utils.getCurrentDate('YYYY-MM-DD HH:II:SS');
			var updated_at = Utils.getCurrentDate('YYYY-MM-DD HH:II:SS');
			
			var sql = 'INSERT INTO ' + Constants.ACTIONS_TBL + '(name,cost,time,location_id,comment,type_id,is_sync,created_at,updated_at) ';
				sql +='VALUES("' + data.name + '", "' + data.price + '", "' + data.ymd  + '", ' + data.location + ', "", ' + data.type + ', ' + Constants.NOT_SYNC + ', "' + created_at + '", "' + updated_at + '")';

			db.transaction((tx) => {
		        tx.executeSql(sql, [], (tx, results) => { 
		        	if(results.rowsAffected > 0) {

		        		var len = data.types_locations.locations.length;
		        		var location = '';
		        		for(var i = 0; i < len; i++) {
		        			if(data.types_locations.locations[i].id === data.location) {
		        				location = data.types_locations.locations[i].name;
		        				break;
		        			}
		        		}

		        		len = data.types_locations.types.length;
		        		var icon = '';
		        		for(var i = 0; i < len; i++) {
		        			if(data.types_locations.types[i].id === data.type) {
		        				icon = data.types_locations.types[i].icon;
		        				break;
		        			}
		        		}

		        		console.log(data.types_locations);

		        		obj.id = results.insertId;
		        		obj.name = data.name;
		        		obj.time = created_at;
		        		obj.location = location; 
		        		obj.price = data.price;
		        		obj.icon = icon;
		        		
		        	}
		        });
		    });

		    state.push(obj);

		 	return [...state];

		case types.EDIT_ACTION:
			console.log(action);
			return [...state];

		case types.DEL_ACTION:
			


			return [...state];
		default:
			return state;
	}
}

export default myReducer;