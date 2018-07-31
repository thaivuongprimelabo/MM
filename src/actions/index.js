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

export const loadDataLocation = (cnt) => {
	return {
		type: types.LOAD_DATA_LOCATION,
		count: cnt
	}
}

export const loadDataType = (cnt) => {
	return {
		type: types.LOAD_DATA_TYPE,
		count: cnt
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

export const addLocation = (formdata) => {
	return {
		type : types.ADD_LOCATION,
		formdata : formdata
	}
}

export const addType = (formdata) => {
	return {
		type : types.ADD_TYPE,
		formdata : formdata
	}
}

export const editAction = (formdata) => {
	return {
		type : types.EDIT_ACTION,
		formdata : formdata
	}
}

export const delAction = (index) => {
	return {
		type : types.DEL_ACTION,
		index : index
	}
}

export const loginAction = (loginInfo) => {
	return {
		type: types.LOGIN_ACTION,
		loginInfo: loginInfo
	}
}

export const updateSyncStatusAction = (status) => {
	return {
		type: types.UPDATE_SYNC_STATUS,
		status: status
	}
}

export const sendAction = () => {
	return {
		type: types.SEND_DATA,
		user_id: user_id
	}
}

export const updateSendDataCount = (count) => {
	return {
		type: types.UPDATE_SEND_DATA_COUNT,
		count: count
	}
}