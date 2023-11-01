import Vue from 'vue'
import VueRouter from 'vue-router'
import {LOCAL_STORAGE_TOKEN_KEY} from "../models/constants";
import messenger from "./messenger";
import other from "./other";
import common from "./common";
//import test from "./test";

Vue.use(VueRouter);

const routes = [
	...common,
	...messenger,
	...other,
	//...test
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

router.beforeEach((to, from, next) => {
	const userData = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
	if(userData) {
		if(to.path === '/login') {
			next('/');
		} else {
			next()
		}
	} else {
		if(to.meta.auth) {
			next('/login');
		} else {
			next()
		}
	}
});

export default router
