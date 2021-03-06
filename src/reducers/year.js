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
			
		    state = action.list;
		    
			return [...state];
		default:
			return state;
	}
}

export default myReducer;