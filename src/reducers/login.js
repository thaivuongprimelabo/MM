import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';

var initialState = {};

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.LOGIN_ACTION:
			console.log(action);
			return [...state];
		default:
			return state;
	}
}

export default myReducer;