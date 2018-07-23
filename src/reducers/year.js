import * as types from '../constants/ActionTypes';
import Utils from '../constants/Utils';

var date = new Date();
var year = date.getFullYear();
var initialState = [];

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.LOAD_DATA_IN_YEAR:
			//var data = JSON.parse(Utils.getDataFromStorage('response'));
			Utils.getDataFromStorage('response').then((response) => {
      			var json = JSON.parse(response);
      			var actions = json.actions;
    		});
			var tempData = [
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
		    state = tempData;
			return [...state];
		default:
			return state;
	}
}

export default myReducer;