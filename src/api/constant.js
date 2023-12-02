// eslint-disable-next-line import/no-extraneous-dependencies
import axios from "axios";

export const BASE_URL = "https://api.magnerrealestate.com/api";
// export const BASE_URL = "http://localhost:1337/api";

export const HTTPS = axios.create({
	baseURL: BASE_URL,
});
