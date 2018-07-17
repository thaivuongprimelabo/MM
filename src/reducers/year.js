import * as types from '../constants/ActionTypes';

var date = new Date();
var year = date.getFullYear();
var initialState = [
        { ym: year + '01', name: '1', budget: '2500000', 'used': '0', remain: '0'},  
        { ym: year + '02', name: '2', budget: '0', 'used': '0', remain: '0'},
        { ym: year + '03', name: '3',  budget: '0', 'used': '0', remain: '0'},  
        { ym: year + '04', name: '4', budget: '0', 'used': '0', remain: '0'},
        { ym: year + '05', name: '5', budget: '0', 'used': '0', remain: '0'},  
        { ym: year + '06', name: '6', budget: '0', 'used': '0', remain: '0'},
        { ym: year + '07', name: '7', budget: '0', 'used': '0', remain: '0'},  
        { ym: year + '08', name: '8', budget: '0', 'used': '0', remain: '0'},
        { ym: year + '09', name: '9', budget: '0', 'used': '0', remain: '0'},  
        { ym: year + '10', name: '10', budget: '0', 'used': '0', remain: '0'},
        { ym: year + '11', name: '11', budget: '0', 'used': '0', remain: '0'}, 
        { ym: year + '12', name: '12', budget: '0', 'used': '0', remain: '0'}
      ];

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		default:
			return state;
	}
}

export default myReducer;