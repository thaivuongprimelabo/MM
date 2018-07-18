import { combineReducers } from 'redux';

import login from './login';
import year from './year';
import month from './month';

const myReducer = combineReducers({
	login : login,
	dataInYear : year,
	dataInMonth : month
});

export default myReducer;