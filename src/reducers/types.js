import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';
import { Alert } from 'react-native';



var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var initialState = [];

var sql = 'SELECT value, name, icon FROM ' + Constants.TYPES_TBL + ' ORDER BY `order`';

db.transaction((tx) => {
    tx.executeSql(sql, [], (tx, results) => {
        var len = results.rows.length;
        if(len > 0) {
            for(var i = 0; i < len; i++) {
                var item = results.rows.item(i);
                initialState.push(item);
            }
        }
    });
});


var myReducer = (state = initialState, action) => {
    switch(action.type) {

        case types.ADD_TYPE:

            var obj = action.formdata;

            state.splice(state.length - 1, 0, obj);

            state.join();

            return [...state];

            break;

        default:

            return state;
    }
}

export default myReducer;