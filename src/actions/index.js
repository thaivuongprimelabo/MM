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

export const loadDataInMonth = (year, month, budget) => {
	return {
		type : types.LOAD_DATA_IN_MONTH,
		year : year,
		month : month,
		budget: budget
	}
}

export const loadDataInDay = (year, month, day, count) => {
	return {
		type : types.LOAD_DATA_IN_DAY,
		year : year,
		month : month,
		day : day,
		count: count
	}
}

export const getDataFromSqlite = () => {
	return {
		type : types.GET_DATA_FROM_SQLITE,
	}
}

export const addAction = (formdata) => {
	return {
		type : types.ADD_ACTION,
		formdata : formdata
	}
}

export const editAction = (formdata) => {
	return {
		type : types.EDIT_ACTION,
		formdata : formdata
	}
}

export const delAction = (id) => {
	return {
		type : types.DEL_ACTION,
		id : id
	}
}

export const loginAction = (loginInfo) => {
	return {
		type: types.LOGIN_ACTION,
		loginInfo: loginInfo
	}
}