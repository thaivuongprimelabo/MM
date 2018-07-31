import { combineReducers } from 'redux';

import login from './login';
import year from './year';
import month from './month';
import day from './day';
import types from './types';
import locations from './locations';
import actions from './actions';
import sync_send_data from './sync_send_data';

const myReducer = combineReducers({
	login : login,
	dataInYear : year,
	dataInMonth : month,
	dataInDay : day,
	types: types,
	actions: actions,
	sync_send_data: sync_send_data,
	locations : locations
});

export default myReducer;