import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';
import { Alert } from 'react-native';

var initialState = {};

var myReducer = (state = initialState, action) => {
    switch(action.type) {
            
        case types.SELECT_LOCATION:
        
            state = action.item;

            return state;

        default:

            return state;
    }
}

export default myReducer;