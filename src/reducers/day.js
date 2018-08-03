import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import { Alert } from 'react-native';

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
					var object = { id: 1, name: '', time: '', location: '', location_id: '', price: '', type_id: '', icon: '', created_at: '', is_sync: Constants.NOT_SYNC };
					tempData.push(object);
				}

				var strYr = JSON.stringify(action.year);
				var strMth = JSON.stringify(action.month);
				var strD = JSON.stringify(action.day);
				var strYmd = strYr + (strMth.length === 1 ? '0' + strMth : strMth) + (strD.length === 1 ? '0' + strD : strD);
				
				var sql =  'SELECT act.*, lo.name as location, t.icon as icon FROM actions act ';
					sql += 'LEFT JOIN locations lo ON lo.id = act.location_id ';
					sql += 'LEFT JOIN types t ON t.value = act.type_id ';
			       	sql += 'WHERE time = "' + strYmd + '" AND (is_deleted = ' + Constants.NOT_DELETED + ' OR is_deleted IS NULL)';

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
			        			tempData[i].created_at = work.created_at;
			        			tempData[i].is_sync = work.is_sync;
			        		}
			        		
			        	}
			        });
			    });
			} else {
				tempData.push({id: 999});
			}
			
			state = tempData;

			return [...state];

		case types.UPDATE_ROW_SYNC_STATUS:

			var len = state.length;
			for(var i = 0; i < len; i++) {
				var obj = state[i];
				obj.is_sync = Constants.IS_SYNC;
			}

			return [...state];

		case types.ADD_ACTION:

		 	var obj = action.formdata;
		 	obj.is_sync = Constants.NOT_SYNC;

		    state.push(obj);

		    Alert.alert(Constants.ALERT_TITLE_INFO, Constants.REGISTER_DATA_SUCCESS);

		 	return [...state];

		case types.EDIT_ACTION:

		 	var formdata = action.formdata;

		    var currentAction = state[formdata.index];

		    var len = formdata.locations.length;
    		var location = '';
    		for(var i = 0; i < len; i++) {
    			if(formdata.locations[i].id === formdata.location) {
    				location = formdata.locations[i].name;
    				break;
    			}
    		}

    		len = formdata.types.length;
    		var icon = '';
    		for(var i = 0; i < len; i++) {
    			if(formdata.types[i].value === formdata.type) {
    				icon = formdata.types[i].icon;
    				break;
    			}
    		}

		    currentAction.name = formdata.name;
		    currentAction.price = formdata.price;
		    currentAction.location = location;
		    currentAction.icon = icon;
		    currentAction.is_sync = Constants.NOT_SYNC;

		    Alert.alert(Constants.ALERT_TITLE_INFO, Constants.UPDATE_DATA_SUCCESS); 

			return [...state];

		case types.DEL_ACTION:
			// var currentAction = state[action.index];

			// var sql = 'DELETE FROM ' + Constants.ACTIONS_TBL + ' WHERE id = ' + currentAction.id;

			// if(currentAction.is_sync === Constants.IS_SYNC) {

			// 	sql = 'UPDATE ' + Constants.ACTIONS_TBL + ' SET is_deleted = ' + Constants.IS_DELETED  + ' WHERE id = ' + currentAction.id;
			// }
			
			// console.log(sql);

			// db.transaction((tx) => {
		 //        tx.executeSql(sql, [], (tx, results) => { console.log(results) });
		 //    });

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