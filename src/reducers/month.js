import * as types from '../constants/ActionTypes';

var date = new Date();
var year = date.getFullYear();
var date = new Date();
var year = date.getFullYear();
// var initialState = [
//         { name: '1', budget: '2500000', 'used': '0', remain: '0'},  
//         { name: '2', budget: '0', 'used': '0', remain: '0'},
//         { name: '3',  budget: '0', 'used': '0', remain: '0'},  
//         { name: '4', budget: '0', 'used': '0', remain: '0'},
//         { name: '5', budget: '0', 'used': '0', remain: '0'},  
//         { name: '6', budget: '0', 'used': '0', remain: '0'},
//         { name: '7', budget: '0', 'used': '0', remain: '0'},  
//         { name: '8', budget: '0', 'used': '0', remain: '0'},
//         { name: '9', budget: '0', 'used': '0', remain: '0'},  
//         { yname: '10', budget: '0', 'used': '0', remain: '0'},
//         { yname: '11', budget: '0', 'used': '0', remain: '0'}, 
//         { name: '12', budget: '0', 'used': '0', remain: '0'}
//       ];

var initialState = [];

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		default:
			return state;
	}
}

export default myReducer;