import { combineReducers } from 'redux';

import login from './login';

const myReducer = combineReducers({
	login : login
});

export default myReducer;