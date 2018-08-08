import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';
import { Alert } from 'react-native';

import axios from 'axios';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

export const submitLogin = (loginInfo, navigation) => {
	return async (dispatch) => {

		dispatch(updateLoadingStatus(Constants.LOADING_WAITING));

		var checkLogin = false;
		var url = Constants.DEFAULT_AUTH_URI;

	    await axios({
	      method: 'POST',
	      url : url,
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json',
	      },
	      data : JSON.stringify(loginInfo)
	    })
	    .then(res => {
	      var responseJson = res.data;
	      console.log(responseJson);
	      if(responseJson.code === 200) {
	        checkLogin = true;

	        var json = JSON.parse(responseJson.data);
	        Utils.insertToSqlite(json, true);
	      }
	    })
	    .catch((error) =>{
	      alert(error);
	    });
	    
	    if(checkLogin) {
	      navigation.push(Constants.YEAR_SCREEN);
	    } else {
	      Alert.alert(Constants.ALERT_TITLE_ERR, Constants.LOGIN_FAILED);
	    }
	}
}

export const loadDataInYear = (year) => {
	return (dispatch) => {
		console.log('loadDataInYear')
		dispatch(updateLoadingStatus(Constants.LOADING_WAITING));

		var list = [
	        { id: 1, m: '01', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
	        { id: 2, m: '02', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
	        { id: 3, m: '03', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
	        { id: 4, m: '04', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
	        { id: 5, m: '05', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
	        { id: 6, m: '06', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
	        { id: 7, m: '07', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
	        { id: 8, m: '08', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
	        { id: 9, m: '09', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},  
	        { id: 10, m: '10', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'},
	        { id: 11, m: '11', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'}, 
	        { id: 12, m: '12', budget: Constants.DEFAULT_BUDGET, used: '0', remain: '0'}
      	];

      	var sql = 'SELECT substr(act.time,5,2) as m, sum(act.cost) as used FROM actions act ';
      		sql += 'WHERE substr(act.time,1,4) = "' + year + '" AND (is_deleted = ' + Constants.NOT_DELETED + ' OR is_deleted IS NULL) ';
	        sql += 'GROUP BY substr(act.time,5,2) ';
	        sql += 'ORDER BY act.created_at DESC';

	    db.transaction((tx) => {      
	        tx.executeSql(sql, [], (tx, results) => {
	            var len = results.rows.length;
	            if(len > 0) {
	              for(var i = 0; i < len; i++) {
	                for(var j = 0; j < list.length; j++) {
	                  var month = list[j];
	                  if(results.rows.item(i).m === month.m) {
	                    month.used = results.rows.item(i).used;
	                    month.budget = month.budget !== '0' ? month.budget : Constants.DEFAULT_BUDGET;
	                    month.remain = parseInt(month.budget) - parseInt(month.used);
	                    break;
	                  }
	                }
	              }
	            }
	            dispatch(addDataInYear(list));
	            dispatch(updateLoadingStatus(Constants.LOADING_SUCCESS));
	        });
	    });
	}
}

export const addDataInYear = (list) => {
	return {
		type : types.LOAD_DATA_IN_YEAR,
		list : list
	}
}

export const loadDataInMonth = (year, month, budget) => {
	return (dispatch) => {
		
		dispatch(updateLoadingStatus(Constants.LOADING_WAITING));

		var list = [];
		var json = Utils.getStartEndDayInMonth(year, month);
		var totalDayInMonth = json.end - json.start;
		var budgetEveryDay = Math.round(budget / totalDayInMonth);
		for(var i = json.start; i <= json.end; i++) {
			var d = i.length === 1 ? '0' + i : i;
	    	var dayOfWeek = Utils.getDayOfWeek(year, month, i);
	        var day = { id: i, d: d, budget: budgetEveryDay, used: '0', remain: '0', dayOfWeek: dayOfWeek, count: 0 };
	        list.push(day);
	    }

		var strYm = Utils.formatDateString({ y: year, m: month, d: 0, format: 'YYYYMM' });
		var sql = 'SELECT act.name, substr(act.time, 7,2) as d, SUM(act.cost) as total_cost, count(act.id) as count FROM actions act ';
	        	sql += 'WHERE substr(time, 1, 6) = "' + strYm + '" AND (is_deleted = ' + Constants.NOT_DELETED + ' OR is_deleted IS NULL) ';
	        	sql += 'GROUP BY act.time ';

	    db.transaction((tx) => {
	        tx.executeSql(sql, [], (tx, results) => {
	            var len = results.rows.length;
	            if(len > 0) {
	            	var curRemain = 0;

        			for(var j = 0; j < list.length; j++) {

        				var day = list[j];

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

        			dispatch(addDataInMonth(list));
        			dispatch(updateLoadingStatus(Constants.LOADING_SUCCESS));
	            }
	        });
	    });

	}
}

export const addDataInMonth = (list) => {
	return {
		type : types.LOAD_DATA_IN_MONTH,
		list : list
	}
}

export const loadDataInDay = (year, month, day) => {
	return (dispatch) => {
		
		dispatch(updateLoadingStatus(Constants.LOADING_WAITING));

		var strYr = JSON.stringify(year);
		var strMth = JSON.stringify(month);
		var strD = JSON.stringify(day);
		var strYmd = strYr + (strMth.length === 1 ? '0' + strMth : strMth) + (strD.length === 1 ? '0' + strD : strD);
		
		var sql =  'SELECT act.*, lo.name as location, t.icon as icon FROM actions act ';
			sql += 'LEFT JOIN locations lo ON lo.id = act.location_id ';
			sql += 'LEFT JOIN types t ON t.value = act.type_id ';
	       	sql += 'WHERE time = "' + strYmd + '" AND (is_deleted = ' + Constants.NOT_DELETED + ' OR is_deleted IS NULL)';

	    db.transaction((tx) => {
	        tx.executeSql(sql, [], (tx, results) => {
	        	var len = results.rows.length;
	        	var list = [];
	        	if( len > 0 ) {
	        		
	        		for(var i = 0; i < len; i++) {

	        			var work = results.rows.item(i);
	        			
	        			list.push(work);
	        		}
	        	}
				dispatch(addDataInDay(list));
	        	dispatch(updateLoadingStatus(Constants.LOADING_SUCCESS));
	        });
	    });

	}
}

export const updateLoadingStatus = (status) => {
	return {
		type : types.UPDATE_LOADING_STATUS,
		status : status
	}
}

export const addDataInDay = (list) => {
	return {
		type : types.LOAD_DATA_IN_DAY,
		list : list
	}
}

export const loadDataLocation = () => {
	return (dispatch) => {
		var sql = 'SELECT id, name FROM ' + Constants.LOCATIONS_TBL + ' ORDER BY created_at DESC ';

		db.transaction((tx) => {
		    tx.executeSql(sql, [], (tx, results) => {
		    	var len = results.rows.length;
		    	if(len > 0) {
		    		var list = [];
		    		for(var i = 0; i < len; i++) {
		    			var item = results.rows.item(i);
		    			list.push(item);
		    		}
		    		dispatch(addLocations(list));
		    	}
		    });
		});
	}
}

export const loadDataType = () => {
	return (dispatch) => {
		var sql = 'SELECT value, name, icon FROM ' + Constants.TYPES_TBL + ' WHERE `order` != 9999 ORDER BY `order`';

		db.transaction((tx) => {
		    tx.executeSql(sql, [], (tx, results) => {
		        var len = results.rows.length;
		        if(len > 0) {
		        	var list = [];
		            for(var i = 0; i < len; i++) {
		                var item = results.rows.item(i);
		                list.push(item);
		            }
		            dispatch(addTypes(list));
		        }
		    });
		});
	}
}

export const getDataFromSqlite = () => {
	return {
		type : types.GET_DATA_FROM_SQLITE,
	}
}

export const addAction = (data) => {
	return (dispatch) => {
		var screen = data.screen;
		var created_at = data.created_at;
    	var updated_at = Utils.getCurrentDate('YYYY-MM-DD HH:II:SS');
    	var id = Utils.generateId();
    	var sql = 'INSERT INTO ' + Constants.ACTIONS_TBL + '(id,name,cost,time,location_id,comment,type_id,is_sync, is_deleted, created_at,updated_at) ';
        	sql +='VALUES("' + id + '", "' + data.name + '", "' + data.price + '", "' + data.ymd  + '", ' + data.location + ', "", ' + data.type + ', ' + Constants.NOT_SYNC + ', ' + Constants.NOT_DELETED + ', "' + created_at + '", "' + updated_at + '")';

        db.transaction((tx) => {
        	tx.executeSql(sql, [], (tx, results) => {

        		if(results.rowsAffected > 0) {

		            var obj = {id: 999, name: '', time: '', location: '', location_id: 0, price: '', icon: Constants.DEFAULT_ICON, type_id: 0};

		            var len = data.locations.length;
		            var location = '';
		            for(var i = 0; i < len; i++) {
		              if(data.locations[i].id === data.location) {
		                location = data.locations[i].name;
		                break;
		              }
		            }

		            len = data.types.length;
		            var icon = '';
		            for(var i = 0; i < len; i++) {
		              if(data.types[i].value === data.type) {
		                icon = data.types[i].icon;
		                break;
		              }
		            }

		            obj.id = results.insertId;
		            obj.name = data.name;
		            obj.created_at = created_at;
		            obj.location = location;
		            obj.location_id = data.location;
		            obj.cost = data.price;
		            obj.icon = icon;
		            obj.type_id = data.type;

		            dispatch(addActionToList(obj));

		            if(screen === Constants.YEAR_SCREEN) {
				       dispatch(loadDataInYear(data['y']));
				    }

				    if(screen === Constants.MONTH_SCREEN) {
				       dispatch(loadDataInMonth(data['y'], data['m'], Constants.DEFAULT_BUDGET));
				    }

				    dispatch(updateSendDataCount());
		        }
        	});
        });
	}
}

export const addActionToList = (formdata) => {
	return {
		type : types.ADD_ACTION,
		formdata : formdata
	}
}

export const addLocations = (list) => {
	return {
		type : types.ADD_LOCATIONS,
		list : list
	}
}

export const addLocation = (formdata) => {
	return (dispatch) => {
		var id = Utils.generateId();
	    var created_at = updated_at = Utils.getCurrentDate();
	    var sql = 'INSERT INTO ' + Constants.LOCATIONS_TBL + '(id, name, latlong, is_sync, address, desc_image, created_at, updated_at) VALUES ';
	    sql += '(' + id + ', "' + formdata.name  +'", "' + formdata.latlong + '", ' + Constants.NOT_SYNC + ', "' + formdata.address + '","","' + created_at + '", "' + updated_at + '")';
	    db.transaction((tx) => {
	        tx.executeSql(sql, [], (tx, results) => {
	          if(results.rowsAffected > 0) {
	              var obj = {id: id, name: formdata.name};
	              dispatch(addLocationToList(obj));
	              Alert.alert(Constants.ALERT_TITLE_INFO, Constants.REGISTER_DATA_SUCCESS);
	          }
	        });
	    });
	}
}

export const addLocationToList = (formdata) => {
	return {
		type : types.ADD_LOCATION,
		formdata : formdata
	}
}

export const addType = (formdata) => {
	return (dispatch) => {
		var created_at = updated_at = Utils.getCurrentDate();
	    var id = Utils.generateId();
	    var sql = 'INSERT INTO ' + Constants.TYPES_TBL + '(value, name, color, icon, is_sync, `order`, created_at, updated_at) VALUES ';
	        sql += '(' + id  +',"' + formdata.name + '", "", "' + formdata.icon + '", "' + Constants.NOT_SYNC + '",90,"' + created_at + '", "' + updated_at + '")';
	        
	    db.transaction((tx) => {
	        tx.executeSql(sql, [], (tx, results) => {
	            if(results.rowsAffected > 0) {
	            	formdata['value'] = id;
	            	dispatch(addTypeToList(formdata));
	                Alert.alert(Constants.ALERT_TITLE_INFO, Constants.REGISTER_DATA_SUCCESS);
	            }
	        });
	    });
	}
}

export const addTypeToList = (formdata) => {
	return {
		type : types.ADD_TYPE,
		formdata : formdata
	}
}

export const addTypes = (list) => {
	return {
		type : types.ADD_TYPES,
		list : list
	}
}

export const editAction = (formdata) => {
	return (dispatch) => {

		var screen = formdata.screen;
	    var updated_at = Utils.getCurrentDate('YYYY-MM-DD HH:II:SS');

	    var sql = 'UPDATE ' + Constants.ACTIONS_TBL + ' ';
	        sql += ' SET name = "' + formdata.name + '", type_id = ' + formdata.type + ', location_id = ' + formdata.location + ', cost = "' + formdata.price + '", is_sync = ' + Constants.NOT_SYNC + ', created_at = "' + formdata.created_at + '", updated_at = "' + updated_at + '" ';
	        sql += ' WHERE id = ' + formdata.id;

	    db.transaction((tx) => {
	        tx.executeSql(sql, [], (tx, results) => {

	          dispatch(updateActionToList(formdata));

	          dispatch(updateSendDataCount());

	          if(screen === Constants.YEAR_SCREEN) {
			    dispatch(loadDataInYear(formdata['y']));
			  }

			  if(screen === Constants.MONTH_SCREEN) {
			    dispatch(loadDataInMonth(formdata['y'], formdata['m'], Constants.DEFAULT_BUDGET));
			  }

	        });
	    });

		
	}
}

export const updateActionToList = (formdata) => {
	return {
		type : types.EDIT_ACTION,
		formdata : formdata
	}
}

export const delAction = (action) => {

	return (dispatch) => {

	    var sql = 'DELETE FROM ' + Constants.ACTIONS_TBL + ' WHERE id = ' + action.id;

	    if(action.is_sync === Constants.IS_SYNC) {

	      sql = 'UPDATE ' + Constants.ACTIONS_TBL + ' SET is_deleted = ' + Constants.IS_DELETED  + ', is_sync = ' + Constants.NOT_SYNC + ' WHERE id = ' + action.id;
	    }

	    db.transaction((tx) => {
	      tx.executeSql(sql, [], (tx, results) => {

	        dispatch(delActionToList(action.index));

	        dispatch(updateSendDataCount());
	        
	      });
	    });
	}
}

export const delActionToList = (index) => {
	return {
		type : types.DEL_ACTION,
		index : index
	}
}

export const loginAction = (loginInfo) => {
	return {
		type: types.LOGIN_ACTION,
		loginInfo: loginInfo
	}
}

export const updateRowSyncStatusAction = () => {
	return {
		type: types.UPDATE_ROW_SYNC_STATUS
	}
}

export const updateSyncStatusAction = (status) => {
	return {
		type: types.UPDATE_SYNC_STATUS,
		status: status
	}
}

export const sendData = () => {
	return (dispatch) => {
		var data = {types: [], actions: [], locations: []};

	    var sqlActions = 'SELECT * FROM ' + Constants.ACTIONS_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;
	    var sqlTypes = 'SELECT * FROM ' + Constants.TYPES_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;
	    var sqlLocations = 'SELECT * FROM ' + Constants.LOCATIONS_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC;

	    db.transaction((tx) =>   {
	      // Actions
	      tx.executeSql(sqlActions, [], (tx, results) => {
	      	var actions = [];
	        var len = results.rows.length;
	        for(var i = 0; i < len; i++) {
	          var action = results.rows.item(i);
	          action.is_sync = Constants.IS_SYNC;
	          data.actions.push(action);
	        }

	        tx.executeSql(sqlLocations, [], (tx, results) => { 

	          var locations = [];
	          var len = results.rows.length;
	          for(var i = 0; i < len; i++) {
	            var location = results.rows.item(i);
	            location.is_sync = Constants.IS_SYNC;
	            data.locations.push(location);
	          }

	          tx.executeSql(sqlTypes, [], (tx, results) => { 

	            var types = [];
	            var len = results.rows.length;
	            for(var i = 0; i < len; i++) {
	              var type = results.rows.item(i);
	              type.is_sync = Constants.IS_SYNC;
	              data.types.push(type);
	            }

	            var url = Constants.DEFAULT_BACKUP_URI;
	            fetch(url, {
	              method: 'POST',
	              headers: {
	                Accept: 'application/json',
	                'Content-Type': 'application/json',
	              },
	              body: JSON.stringify({ data: data}),
	            })
	            .then((response) => response.json())
	            .then((responseJson) => {
	                console.log(responseJson);
	                if(responseJson.code === 200) {
	                  dispatch(updateDataSync());
	                  dispatch(updateSendDataCount());
	                  dispatch(updateRowSyncStatusAction());
	                  Alert.alert(Constants.ALERT_TITLE_INFO, Constants.SEND_DATA_SUCCESS);
	                } else {
	                  Alert.alert(Constants.ALERT_TITLE_ERR, responseJson.message);
	                }
	            })
	            .catch((error) =>{
	              Alert.alert(Constants.ALERT_INFO, Constants.SERVER_ERROR);
	            });

	          });
	        });
	      });

	    });
	}
}

export const updateDataSync = () => {
	return (dispatch) => {
		var sql =  'UPDATE ' + Constants.ACTIONS_TBL + ' SET is_sync = ' + Constants.IS_SYNC + ' WHERE is_sync = ' + Constants.NOT_SYNC;
	    var sql1 = 'UPDATE ' + Constants.LOCATIONS_TBL + ' SET is_sync = ' + Constants.IS_SYNC + ' WHERE is_sync = ' + Constants.NOT_SYNC;
	    var sql2 = 'UPDATE ' + Constants.TYPES_TBL + ' SET is_sync = ' + Constants.IS_SYNC + ' WHERE is_sync = ' + Constants.NOT_SYNC;
	    db.transaction((tx) =>   {
	      tx.executeSql(sql, [], (tx, results) => { console.log(results); });
	      tx.executeSql(sql1, [], (tx, results) => { console.log(results); });
	      tx.executeSql(sql2, [], (tx, results) => { console.log(results);  });
	    });
	}
	
}

export const updateSendDataCount = () => {
	
	return (dispatch) => {
		var sql = 'SELECT SUM(count) as count FROM ( ';
	      	sql += ' SELECT COUNT(id) as count FROM ' + Constants.ACTIONS_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC + ' UNION ALL ';
	      	sql += ' SELECT COUNT(id) as count FROM ' + Constants.LOCATIONS_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC + ' UNION ALL ';
	      	sql += ' SELECT COUNT(value) as count FROM ' + Constants.TYPES_TBL + ' WHERE is_sync = ' + Constants.NOT_SYNC + ' )';

		db.transaction((tx) => {
		    tx.executeSql(sql, [], (tx, results) => {
		      var len = results.rows.length;
		      if(len > 0) {
		        var send_data_count = results.rows.item(0).count;
		        dispatch(updateToMenuBottom(send_data_count));
		      }
		    });
		});
	}
}

export const updateToMenuBottom = (count) => {

	return {
		type: types.UPDATE_SEND_DATA_COUNT,
		count: count
	}
}

export const syncData = (user_id, screen) => {
	return (dispatch) => {

		dispatch(updateLoadingStatus(Constants.SYNC_WAITING));

		var url = Constants.DEFAULT_SYNC_URI + '?user_id=' + user_id;

		axios.get(url)
	    .then(res => {
	        var responseJson = res.data;
	        if(responseJson.code === 200) {
	        	var json = JSON.parse(responseJson.data);
		        if(json.types.length === 0 && json.locations.length === 0 && json.actions.length === 0) {
		          Alert.alert(Constants.ALERT_TITLE_INFO, Constants.NO_DATA_SYNC);
		          dispatch(updateLoadingStatus(Constants.SYNC_SUCCESS));
		          return false;
		        }
	        }

	        Utils.insertToSqlite(json, false);

	        if(screen === Constants.YEAR_SCREEN) {
		       dispatch(loadDataInYear(data['y']));
		    }

		    if(screen === Constants.MONTH_SCREEN) {
		       dispatch(loadDataInMonth(data['y'], data['m'], Constants.DEFAULT_BUDGET));
		    }

	        dispatch(updateLoadingStatus(Constants.SYNC_SUCCESS));
	    });
	}
}

export const selectType = (item) => {
	return {
		type: types.SELECT_TYPE,
		item : item
	}
}

export const selectLocation = (item) => {
	return {
		type: types.SELECT_LOCATION,
		item : item
	}
}

export const searchType = (keyword) => {
	return {
		type : types.SEARCH_TYPE,
		keyword : keyword
	}
}

export const searchLocation = (keyword) => {
	return {
		type : types.SEARCH_LOCATION,
		keyword : keyword
	}
}