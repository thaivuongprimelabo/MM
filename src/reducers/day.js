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
					var object = { id: 1, name: '', time: '', location: '', location_id: '', price: '', type_id: '', icon: '' };
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
			        			tempData[i].location_id = work.location_id;
			        			tempData[i].type_id = work.type_id;
			        		}
			        		
			        	}
			        });
			    });
			} else {
				tempData.push({id: 999});
			}
			
			state = tempData;

			return [...state];

		case types.ADD_ACTION:

			if(state[0].id === 999) {
				state.splice(0, 1);
			}

			var obj = {id: 999, name: '', time: '', location: '', location_id: 0, price: '', icon: Constants.DEFAULT_ICON, type_id: 0};

			var data = action.formdata;
			var created_at = Utils.getCurrentDate('YYYY-MM-DD HH:II:SS');
			var updated_at = Utils.getCurrentDate('YYYY-MM-DD HH:II:SS');
			
			var sql = 'INSERT INTO ' + Constants.ACTIONS_TBL + '(name,cost,time,location_id,comment,type_id,is_sync,created_at,updated_at) ';
				sql +='VALUES("' + data.name + '", "' + data.price + '", "' + data.ymd  + '", ' + data.location + ', "", ' + data.type + ', ' + Constants.NOT_SYNC + ', "' + created_at + '", "' + updated_at + '")';

			db.transaction((tx) => {
		        tx.executeSql(sql, [], (tx, results) => {
		        	console.log(results);
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

		        		obj.id = results.insertId;
		        		obj.name = data.name;
		        		obj.time = created_at;
		        		obj.location = location;
		        		obj.location_id = data.location;
		        		obj.price = data.price;
		        		obj.icon = icon;
		        		obj.type_id = data.type;
		        		
		        	}
		        });
		    });

		    state.push(obj);

		 	return [...state];

		case types.EDIT_ACTION:

			var formdata = action.formdata;
			var updated_at = Utils.getCurrentDate('YYYY-MM-DD HH:II:SS');

			var sql = 'UPDATE ' + Constants.ACTIONS_TBL + ' ';
				sql += 'SET name = "' + formdata.name + '", type_id = ' + formdata.type + ', location_id = ' + formdata.location + ', cost = "' + formdata.price + '", is_sync = ' + Constants.NOT_SYNC + ', updated_at = "' + updated_at + '" ';
				sql += ' WHERE id = ' + formdata.id;

			db.transaction((tx) => {
		        tx.executeSql(sql, [], (tx, results) => { console.log(results) });
		    });

		    var currentAction = state[formdata.index];

		    var len = formdata.types_locations.locations.length;
    		var location = '';
    		for(var i = 0; i < len; i++) {
    			if(formdata.types_locations.locations[i].id === formdata.location) {
    				location = formdata.types_locations.locations[i].name;
    				break;
    			}
    		}

    		len = formdata.types_locations.types.length;
    		var icon = '';
    		for(var i = 0; i < len; i++) {
    			if(formdata.types_locations.types[i].id === formdata.type) {
    				icon = formdata.types_locations.types[i].icon;
    				break;
    			}
    		}

		    currentAction.name = formdata.name;
		    currentAction.price = formdata.price;
		    currentAction.location = location;
		    currentAction.icon = icon;

			return [...state];

		case types.DEL_ACTION:
			var currentAction = state[action.index];
			
			var sql = 'DELETE FROM ' + Constants.ACTIONS_TBL + ' WHERE id = ' + currentAction.id + ' AND IS_SYNC = ' + Constants.NOT_SYNC;

			db.transaction((tx) => {
		        tx.executeSql(sql, [], (tx, results) => { console.log(results) });
		    });

			state.splice(action.index, 1);

			if(state.length === 0) {
				var obj = { id: 999 }
				state.push(obj);
			}
		    
			return [...state];
		default:
			return state;
	}
}

export default myReducer;