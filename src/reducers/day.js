import * as types from '../constants/ActionTypes';
import Utils from '../constants/Utils';

var initialState = [];

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.LOAD_DATA_IN_DAY:
			var tempData = [
		        { id: 1, name: 'Vòng Tròn', time: '18-07-2018 18:22:30', location: 'Bắc Hải, Q10', price: '1000000', type: 1},  
		        { id: 2, name: 'Thánh bường', time: '18-07-2018 18:22:30', location: 'Bắc Hải, Q10', price: '2000000', type: 2},
		      ];
			state = tempData;
			return [...state];
		case types.ADD_ACTION:
			console.log(action);
			return [...state];
		case types.EDIT_ACTION:
			console.log(action);
			return [...state];
		default:
			return state;
	}
}

export default myReducer;