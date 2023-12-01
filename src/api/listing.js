import { SET_LOADING } from "../redux/types";
import { HTTPS } from "./constant";
import { handleError } from "./handleError";

export const addListing = (dispatch, data) =>
	new Promise((resolve, reject) => {
		dispatch({
			type: SET_LOADING,
			payload: true,
		});
		HTTPS.post("/listings", { data })
			.then((res) => {
				dispatch({
					type: SET_LOADING,
					payload: false,
				});
				resolve(res.data);
			})
			.catch((err) => {
				dispatch({
					type: SET_LOADING,
					payload: false,
				});
				reject(handleError(err));
			});
	});

export const searchListings = (dispatch, data, pagination) =>
	new Promise((resolve, reject) => {
		dispatch({
			type: SET_LOADING,
			payload: true,
		});
		let query = "filters";

		if (data.status && data.status !== "Any Status") {
			query += `[listType][$eq]=${data.status}&`;
		}
		if (data.location && data.location !== "Any Location") {
			query += `[location][state][$eq]=${data.location}&`;
		}
		if (data.type && data.type !== "Any Type") {
			query += `[type][$eq]=${data.type}&`;
		}
		if (data.price && data.price !== "Any Range") {
			query += `[listType][$eq]=${data.status}&`;
		}
		console.log("query : ", query);
		HTTPS.get(`/listings?pagination[page]=${pagination.pageNumber}&pagination[pageSize]=${pagination.pageSize}&${query}`)
			.then((res) => {
				dispatch({
					type: SET_LOADING,
					payload: false,
				});
				resolve(res.data);
			})
			.catch((err) => {
				dispatch({
					type: SET_LOADING,
					payload: false,
				});
				reject(handleError(err));
			});
	});
