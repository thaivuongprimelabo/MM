import * as types from '../constants/ActionTypes';
import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';

var initialState = {
    status : ''
}

var myReducer = (state = initialState, action) => {
    switch(action.type) {

        case types.UPDATE_LOADING_STATUS:

            state.status = action.status;

            return Object.assign({}, state);

        default:

            return state;
    }
}

export default myReducer;