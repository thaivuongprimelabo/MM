import * as types from '../constants/ActionTypes';

var date = new Date();
var year = date.getFullYear();
var initialState = [
        { id: 1, budget: '0', used: '0', remain: '0'},  
        { id: 2, budget: '0', used: '0', remain: '0'},
        { id: 3,  budget: '0', used: '0', remain: '0'},  
        { id: 4, budget: '0', used: '0', remain: '0'},
        { id: 5, budget: '0', used: '0', remain: '0'},  
        { id: 6, budget: '0', used: '0', remain: '0'},
        { id: 7, budget: '0', used: '0', remain: '0'},  
        { id: 8, budget: '0', used: '0', remain: '0'},
        { id: 9, budget: '0', used: '0', remain: '0'},  
        { id: 10, budget: '0', used: '0', remain: '0'},
        { id: 11, budget: '0', used: '0', remain: '0'}, 
        { id: 12, budget: '0', used: '0', remain: '0'}
      ];

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		default:
			return state;
	}
}

export default myReducer;