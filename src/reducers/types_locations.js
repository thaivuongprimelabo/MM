import * as types from '../constants/ActionTypes';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var initialState = {
	types: [],
	locations: []
}

var sql = 'SELECT * FROM ( ';
	sql +='	SELECT value as id, name, 0 AS flag, `order` FROM types ';
	sql +='	UNION ALL ';
	sql +='	SELECT id, name, 1 AS flag, 1000 as `order` FROM locations ';
	sql +=')  ORDER BY `order` ';

db.transaction((tx) => {
    tx.executeSql(sql, [], (tx, results) => {
    	var len = results.rows.length;
    	if(len > 0) {
    		for(var i = 0; i < len; i++) {
    			var item = results.rows.item(i);
    			if(item.flag === 0) {
    				initialState.types.push(item);
    			} else {
    				initialState.locations.push(item);
    			}
    			
    		}
    	}
    });
});


var myReducer = (state = initialState, action) => {
	switch(action.type) {
		default:

			return state;
	}
}

export default myReducer;