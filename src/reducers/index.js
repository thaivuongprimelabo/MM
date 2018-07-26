import { combineReducers } from 'redux';

import login from './login';
import year from './year';
import month from './month';
import day from './day';
import types_locations from './types_locations';
import locations from './locations';
import actions from './actions';
import menuBottom from './menuBottom';

const myReducer = combineReducers({
	login : login,
	dataInYear : year,
	dataInMonth : month,
	dataInDay : day,
	types_locations: types_locations,
	actions: actions,
	menuBottom: menuBottom
});

export default myReducer;