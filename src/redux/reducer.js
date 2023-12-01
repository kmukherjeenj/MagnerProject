import * as types from "./types";
import initialState from "./initialState";

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SET_LOADING:
			return {
				...state,
				loading: action.payload,
			};
		case types.SET_AUTHED:
			return {
				...state,
				authed: action.payload,
			};
		case types.SET_SEARCH:
			return {
				...state,
				search: action.payload,
			};
		case types.SET_TOKEN:
			return {
				...state,
				token: action.payload,
			};
		case types.SET_LOGOUT:
			return {
				...state,
				token: "",
				authed: false,
			};
		default:
			return state;
	}
};
