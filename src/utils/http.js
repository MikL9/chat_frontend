import axios from 'axios'
import router from '../router/index'
import {LOCAL_STORAGE_TOKEN_KEY} from "../models/constants";
import {VUE_APP_SITE} from "../config";

const http = axios.create({
    baseURL: VUE_APP_SITE,
});

http.interceptors.request.use(cfg => {
	if(cfg.url === '/login')
		return cfg

    cfg.headers['Authorization'] = 'Bearer ' + localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    return cfg
});

http.interceptors.response.use(
    resp => resp,
    e => {
		const {config: cfg, status} = e.response

		if(cfg.url === '/login')
			return Promise.reject(e)

        if(status === 401) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
            router.replace('/login');
        }

        return Promise.reject(e)
});

export default http
