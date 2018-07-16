import * as types from '../constants/ActionTypes';

import { NavigationActions } from 'react-navigation'

var initialState = {};

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.SUBMIT_LOGIN:
			NavigationActions.navigate('Home');
			return state;
		default:
			return state;
	}
}

export default myReducer;