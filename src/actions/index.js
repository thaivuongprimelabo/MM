import * as types from '../constants/ActionTypes';

export const submitLogin = () => {
	return {
		type : types.SUBMIT_LOGIN
	}
}

export const initData = (year, month, day) => {
	return {
		type : types.INIT_DATA,
		year : year,
		month : month,
		day: day
	}
}