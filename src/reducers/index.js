import { combineReducers } from 'redux';

import login from './login';
import year from './year';
import month from './month';
import day from './day';
import types_locations from './types_locations';
import locations from './locations';
import actions from './actions';
import sync_send_data from './sync_send_data';

const myReducer = combineReducers({
	login : login,
	dataInYear : year,
	dataInMonth : month,
	dataInDay : day,
	types_locations: types_locations,
	actions: actions,
	sync_send_data: sync_send_data
});

export default myReducer;