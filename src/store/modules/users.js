import http from "../../utils/http";
import {VuexError} from "../../models/models";

export default {
	namespaced: true,
	actions: {
		async getUsers({commit, dispatch}, params) {
			try {
				const {data: users, headers} = await http.get('/user', {params})
				commit('setUsers', {
					users,
					totalCount: headers['x-total-count']
				})
			} catch (e) {
				dispatch('app/showSnackbar', e, { root: true })
				return new VuexError(e)
			}
		},
		async addUser({commit, dispatch}, event) {
			try {
				const {data: created} = await http.post('/user', event)
				commit('addUser', created)
			} catch (e) {
				dispatch('app/showSnackbar', e, { root: true })
				return new VuexError(e)
			}
		},
		async deleteUser({commit, dispatch}, {item, index}) {
			try {
				await http.delete(`/user/${item.id}`)
				commit('deleteUser', index)
			} catch (e) {
				dispatch('app/showSnackbar', e, { root: true })
				return new VuexError(e)
			}
		},
		searchUsers({commit}, params) {
			return new Promise((resolve, reject) => {
				http.get('/user', {params})
					.then(res => {
						commit('setFoundUsers', res.data);
						resolve(res.data)
					})
					.catch(e => {
						reject(new VuexError(e))
					})
			})
		},
	},
	mutations: {
		setFoundUsers(state, found) {
			state.foundUsers = found
		},
		setUsers(state, {users, totalCount}) {
			state.users = users
			state.totalCount = totalCount
		},
		addUser(state, created) {
			let index = state.users.findIndex(item => {
				return (created.id === item.id)
			})
			if(index !== -1) {
				state.users.splice(index, 1, created)
			} else {
				state.users.push(created)
				state.totalCount++
			}
		},
		deleteUser(state, index) {
			state.users.splice(index, 1)
			state.totalCount--
		},
	},
	state: {
		foundUsers: [],
		users: [],
		totalCount: 0
	},
	getters: {
		// eslint-disable-next-line no-unused-vars
		foundUsers: (state, getters, rootState, rootGetters) => {
			return state.foundUsers.filter(u => u.id != rootGetters['auth/userId'])
		},
		users: state => state.users,
		totalCount: state => state.totalCount,
	}
}
