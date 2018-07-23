import * as types from '../constants/ActionTypes';
import Utils from '../constants/Utils';

var initialState = [
	{ ym: '201801', name: '1', budget: '0', 'used': '0', remain: '0'},  
];

var myReducer = (state = initialState, action) => {
	switch(action.type) {
		case types.LOAD_DATA_IN_MONTH:

			var temp = [];
			var json = Utils.getStartEndDayInMonth(action.year, action.month);
			console.log(action.year, action.month);
		    for(var i = json.start; i <= json.end; i++) {
		    	var dayOfWeek = Utils.getDayOfWeek(action.year, action.month, i);
		        var day = { id: i, budget: '0', used: '0', remain: '0', dayOfWeek: dayOfWeek };
		        temp.push(day);
		    }
		    state = temp;
			return [...state];
		default:
			return state;
	}
}

export default myReducer;