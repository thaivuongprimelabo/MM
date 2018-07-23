import * as types from '../constants/ActionTypes';

export const submitLogin = () => {
	return {
		type : types.SUBMIT_LOGIN
	}
}

export const loadDataInYear = (year) => {
	return {
		type : types.LOAD_DATA_IN_YEAR,
		year : year
	}
}

export const loadDataInMonth = (year, month) => {
	return {
		type : types.LOAD_DATA_IN_MONTH,
		year : year,
		month : month
	}
}

export const loadDataInDay = (year, month, day) => {
	return {
		type : types.LOAD_DATA_IN_DAY,
		year : year,
		month : month,
		day : day
	}
}

export const addAction = (action) => {
	return {
		type : types.ADD_ACTION,
		action : action
	}
}

export const editAction = (action) => {
	return {
		type : types.EDIT_ACTION,
		action : action
	}
}

export const loginAction = (loginInfo) => {
	return {
		type: types.LOGIN_ACTION,
		loginInfo: loginInfo
	}
}