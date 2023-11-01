import http from "../../utils/http";
import {VuexError} from "../../models/models";
import {LOCAL_STORAGE_TOKEN_KEY} from "../../models/constants";
import websocket from "../../utils/websocket/websocket";
import {VUE_APP_SITE} from "../../config";

export default {
	namespaced: true,
	actions: {
        async login({commit, dispatch}, credentials) {
			try {
				const {data} = await http.post('/login', credentials)
				const {user, token} = data

				localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token)

				commit('setUser', user)
				commit('getAvatar', user)

				websocket().connect()

				return data
			} catch (e) {
				const err = new VuexError(e);

				if(e.response?.status === 401)
					err.text = 'Неверный логин или пароль';

				dispatch('app/showSnackbar', err, {root: true})
				return e
			}
        },
        async logout({commit}) {
			try {
				await http.post('/logout')
			} catch (e) {
				return new VuexError(e)
			} finally {
				commit('chats/setCurrentChat', {}, { root: true })
				commit('chats/setChats', [], { root: true })
				commit("setUser", {})
				commit('messages/clearMessages', null, { root: true })
				localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);

				websocket().disconnect()
			}
        },

		// eslint-disable-next-line no-empty-pattern
        changePassword({}, data) {
            return new Promise((resolve, reject) => {
				http.post('/user/password', data)
					.then(() => {
						resolve()
					})
					.catch(e => {
						reject(new VuexError(e, 'При изменении пароля произошла ошибка'))
					})
            })
        },
		changeAvatar({commit}, formData) {
			http.post('/file', formData)
				.then(res => {
					return new Promise((resolve, reject) => {
						http.post(`/user/avatar/`, res.data)
							.then(res => {
								commit('changeAvatar', res.data['Avatar']);
								resolve(res.data)
							})
							.catch(e => {
								reject(new VuexError(e, "Произошла ошибка при смене аватара"))
							})
					})
				})
				.catch(e => {
					new VuexError(e, "Произошла ошибка при загрузке")
				})
		},
		getAvatar({commit}) {
			commit('getAvatar');
		},
		async changeTheme({commit, dispatch}, event) {
			try {
				let {data: data} = await http.post('/user/theme/', event)
				commit('changeTheme', data)
			} catch (e) {
				dispatch('app/showSnackbar', e, { root: true })
				return new VuexError(e)
			}
		},
		async changeThemeColor({commit, dispatch}, event) {
			try {
				let {data: data} = await http.post('/user/themeColor/', event)
				commit('changeThemeColor', data)
			} catch (e) {
				dispatch('app/showSnackbar', e, { root: true })
				return new VuexError(e)
			}
		}
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
		getAvatar(state) {
			http.get(`file/img/${state.user['Avatar']}`)
				.then((res) => {
					state.user.avatar = `${VUE_APP_SITE}/${res.data}`
			}).catch(e => {
				const res = e.response;
				if (res.status === 413) {
					alert("Ошибка загрузки аватара")
				}
			});
		},
		changeAvatar(state, fileID) {
			http.get(`file/img/${fileID}`)
				.then((res) => {
					state.user.avatar = `${VUE_APP_SITE}/${res.data}`
				}).catch(e => {
				const res = e.response;
				if (res.status === 413) {
					alert("Ошибка загрузки аватара")
				}
			});
		},
		changeTheme(state, val) {
			state.user.theme = val;
		},
		changeThemeColor(state, val) {
			state.user.theme_color = val;
		},
    },
    state: {
		user: {}
    },
    getters: {
        user: state => state.user,
    }
}
