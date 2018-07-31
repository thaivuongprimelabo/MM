import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';
import { Alert } from 'react-native';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var initialState = [];

var myReducer = (state = initialState, action) => {
	switch(action.type) {

        case types.LOAD_DATA_TYPE:

            console.log(action);

            var tempData = [];

            for(var i = 0; i < action.count; i++) {
                var object = { value: i, name: '' };
                tempData.push(object);
            }

            var sql = 'SELECT value, name FROM ' + Constants.TYPES_TBL + ' ORDER BY `order`';

            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    var len = results.rows.length;
                    if(len > 0) {
                        for(var i = 0; i < len; i++) {
                            var item = results.rows.item(i);
                            tempData[i].value = item.value;
                            tempData[i].name = item.name;
                        }
                        console.log(tempData);
                    }
                });
            });

            state = tempData;

            return [...state];

        case types.ADD_TYPE:

            var tempData = [];

            var obj = {value: 999, name: ''};

            var formdata = action.formdata;
            var created_at = updated_at = Utils.getCurrentDate();
            var id = Utils.generateId();
            var sql = 'INSERT INTO ' + Constants.TYPES_TBL + '(value, name, color, icon, is_sync, `order`, created_at, updated_at) VALUES ';
            sql += '(' + id  +',"' + formdata.name + '", "", "' + formdata.icon + '", "' + Constants.NOT_SYNC + '",90,"' + created_at + '", "' + updated_at + '")';
              
            db.transaction((tx) => {
                tx.executeSql(sql, [], (tx, results) => {
                    if(results.rowsAffected > 0) {
                        obj.value = results.insertId;
                        obj.name = formdata.name;
                        Alert.alert(Constants.ALERT_TITLE_INFO, Constants.REGISTER_DATA_SUCCESS);
                    }
                });
            });

            state.splice(state.length - 1, 0, obj);

            state.join();

            return [...state];

            break;
		default:

			return state;
	}
}

export default myReducer;