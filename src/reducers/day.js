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
			
			state = action.list;

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
		    currentAction.cost = formdata.price;
		    currentAction.location = location;
		    currentAction.icon = icon;
		    currentAction.is_sync = Constants.NOT_SYNC;

		    Alert.alert(Constants.ALERT_TITLE_INFO, Constants.UPDATE_DATA_SUCCESS); 

			return [...state];

		case types.DEL_ACTION:

			state.splice(action.index, 1);
		    
			return [...state];
			
		default:
			return state;
	}
}

export default myReducer;