import * as types from '../constants/ActionTypes';

var initialState = [
	{ ym: '201801', name: '1', budget: '0', 'used': '0', remain: '0'},  
];

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		default:
			return state;
	}
}

export default myReducer;