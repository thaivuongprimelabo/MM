import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';
import { Alert } from 'react-native';

var initialState = [];

var myReducer = (state = initialState, action) => {
	switch(action.type) {

        case types.ADD_LOCATIONS:

            state = action.list;

            return [...state];

		case types.ADD_LOCATION:

			var obj = action.formdata;

            state.push(obj);

            return [...state];

        case types.SEARCH_LOCATION:

            if(action.keyword) {
                state = state.filter((location) => {
                  return location.name.indexOf(action.keyword) !== -1;
                });
            }

            return [...state];

		default:
			return state;
	}
}

export default myReducer;