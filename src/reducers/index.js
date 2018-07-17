import { combineReducers } from 'redux';

import login from './login';
import year from './year';
import month from './month';
import initData from './initData';

const myReducer = combineReducers({
	login : login,
	initData : initData
});

export default myReducer;