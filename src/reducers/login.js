import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';

var initialState = false;

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.UPDATE_LOGIN_SUCCESS:

			return true;
			
		default:
			return state;
	}
}

export default myReducer;