import http from "../../utils/http";
import {Message, VuexError} from "../../models/models";
import Vue from "vue";
import store from "../index";
import {VUE_APP_SITE} from "../../config";

let countNewMessages = 0;
export default {
	namespaced: true,
	actions: {
		async getChats({commit, dispatch}) {
			try {
			    const {data: chats} = await http.get('/chats')
				commit('setChats', chats);
			    commit('getChatsLogos', chats)
				commit('resetCountMessages')

				if(chats.length > 0) {
					dispatch('setCurrentChat', chats[0])
				}
			} catch (e) {
				dispatch('app/showSnackbar', new VuexError(e, 'Произошла ошибка при загрузке чатов'), {root: true})
			}
		},
		async setCurrentChat({commit, dispatch}, chat) {
			commit('setCurrentChat', chat)
			commit('resetCountMessages')
			await dispatch('getChatMessages', {chat_id: chat.id, limit: 20, offset: 0})
		},
		setCurrentChatById({dispatch, state}, chatId){
			const chat = state.chats.find(c => c.id === chatId);
			dispatch('setCurrentChat', chat)
		},
		async getChatMessages({commit, dispatch}, params) {
			try {
				const {chat_id, limit, offset} = params

				const {data: messages} =
					await http.get(`/chats/${chat_id}/messages`, {params: {limit, offset}})

				commit('setChatMessages', messages)
				commit('resetCountMessages')
			} catch (e) {
				dispatch('app/showSnackbar', new VuexError(e, 'Произошла ошибка при загрузке сообщений'), {root: true})
			}
		},
		addChatMessage({commit, state}, message) {
			if(state.currentChat.id === message.chat.id) {
				commit('addChatMessage', message)
				return
			}

			const chat = state.chats.find(ch => ch.id === message.chat.id)
			if (!chat)
				return

			countNewMessages++
			document.title = '(' + countNewMessages + ') '  + 'chat'
			Vue.toast({
				text: `${chat.name}\t\t${message.user.presentation}\n${message.text}`,
				onClick: function () {
					store.dispatch('chats/setCurrentChatById', message.chat.id)
				}
			})
		},



		getChatByUserId({dispatch}, params) {
			return new Promise((resolve, reject) => {
				http.get('/chats/byuser', {params})
					.then(res => {
						const chat = res.data;
						dispatch('setCurrentChat', chat);

						resolve(chat)
					})
					.catch(e => {
						reject(new VuexError(e, 'Произошла ошибка при загрузке чата'))
					})
			})
		},
		search({commit}, params) {
			return new Promise((resolve, reject) => {
				http.get('/quicksearch', { params })
					.then(res => {
						commit('setSearchResult', res.data);
						resolve(res.data)
					})
					.catch(e => {
						reject(new VuexError(e, 'Произошла ошибка при поиске'))
					})
			})
		},
		clearSearch({commit}) {
			commit('clearSearchResult')
		},
		async createChat({commit}, chatInfo) {
			try {
				const {data: created} = await http.post('/chats', chatInfo)
				commit('addChat', created)
				return created
			} catch (e) {
				return new VuexError(e, 'Произошла ошибка при создании чата')
			}
		},
		leaveChat({commit}, chatId) {
			return new Promise((resolve, reject) => {
				http.post(`/chats/${chatId}/leave`)
					.then(() => {
						commit('leaveChat', chatId);
						resolve(chatId)
					})
					.catch(e => {
						reject(new VuexError(e, 'Произошла ошибка при покидании чата'))
					})
			})
		},
		changeLogo({commit}, formData) {
			http.post('/file', formData)
				.then(res => {
					let chatId = new Array([formData.get('id'), res.data['FileID']])
					commit('changeLogo', chatId);
					commit('getChatsLogos')
				})
				.catch(e => {
					new VuexError(e, "Произошла ошибка при загрузке")
				})
		},
		deleteChatMessage({commit, state}, message) {
			if(state.currentChat.id === message.chat.id) {
				commit('deleteChatMessage', message.id)
			}
		},
		editChatMessage({commit, state}, message) {
			if(state.currentChat.id === message.chat.id) {
				commit('editChatMessage', message)
			}
		},
		setMessage({commit}, messageId) {
			commit('setMessage', messageId)
		},
		resetMessage({commit}) {
			console.log("RESET MESSAGE")
			commit('resetMessage')
		}
	},
	mutations: {
		setChats(state, chats) {
			state.chats = chats
		},
		setCurrentChat(state, chat) {
			state.currentChat = chat
		},
		setChatMessages(state, messages) {
			state.messages = messages
		},
		setMessage(state, message) {
			if(message !== undefined) {
				state.message.id = message['id']
				state.message.text = message['text'];
			}
		},
		resetMessage(state) {
			state.message = new Message()
		},
		addChatMessage(state, message) {
			state.messages.push(message)
		},
		deleteChatMessage(state, messageId) {
			const idx = state.messages.findIndex(m => m.id === messageId);
			state.messages.splice(idx, 1)
		},
		editChatMessage(state, message) {
			const idx = state.messages.findIndex(m => m.id === message.id);
			state.messages[idx].text = message.text;
		},


		setSearchResult(state, result) {
			state.searchResult = result
		},
		clearSearchResult(state) {
			state.searchResult = null
		},
		addChat(state, chat) {
			state.chats.push(chat)
		},
		leaveChat(state, chatId) {
			const idx = state.chats.findIndex(c => c.id === chatId);
			state.chats.splice(idx, 1)
		},
		changeLogo(state, file) {
			let idx = state.chats.findIndex(c => c.id == file[0][0]);
			http.get(`file/img/${file[0][1]}`)
				.then((res) => {
					state.chats[idx].logo = `${VUE_APP_SITE}/${res.data}`
				})
		},
		getChatsLogos(state, chats) {
			chats.forEach((element, index) => {
				if(element['logo'] !== 0) {
					http.get(`file/img/${element['logo']}`)
						.then((res) => {
							state.chats[index].logo = `${VUE_APP_SITE}/${res.data}`
						}).catch(e => {
						const res = e.response;
						if (res.status === 413) {
							alert("Ошибка загрузки аватара")
						}
					});
				}
			})
		},
		resetCountMessages() {
			countNewMessages = 0
			document.title = 'chat'
		}
	},
	state: {
		chats: [],
		currentChat: {},
		messages: [],
		message: new Message()
	},
	getters: {
		chats: s => s.chats,
		currentChat: s => s.currentChat,
		messages: s => s.messages,
		message: state => state.message,
	}
}
