import { SET_LOADING } from "../redux/types";
import { HTTPS } from "./constant";
import { handleError } from "./handleError";

export const uploadFile = (dispatch, data) =>
	new Promise((resolve, reject) => {
		dispatch({
			type: SET_LOADING,
			payload: true,
		});
		const formData = new FormData();
		data.map((file) => {
			formData.append("files", file);
			return null;
		});
		HTTPS.post("/upload", formData)
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
