import * as types from '../constants/ActionTypes';

var initialState = {};

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.SUBMIT_LOGIN:
			console.log(action);
			return state;
		default:
			return state;
	}
}

export default myReducer;