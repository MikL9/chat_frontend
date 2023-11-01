import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import auth from "./modules/auth";
import app from './modules/app'
import chats from './modules/chats'
import messages from './modules/messages'
import users from './modules/users'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		auth, app, messages, chats, users
	},
	plugins: [
		createPersistedState({ key: 'chat-user', paths: ['auth.user'] }),
	]
})
