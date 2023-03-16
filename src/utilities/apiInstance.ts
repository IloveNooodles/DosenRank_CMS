import axios from "axios";
import { API_URL, APP_API_KEY } from "./environment";

export function apiInstance({ baseURL = API_URL, headers = {} }) {
    const apiInstance = axios.create({
        baseURL,
        headers: {
            "x-api-key": APP_API_KEY,
            ...headers,
        },
    });

    return apiInstance;
}
