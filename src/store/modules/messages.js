import http from "../../utils/http";
import {VuexError} from "../../models/models";

export default {
	namespaced: true,
    actions: {
		getMessages({commit}, chatId) {
			return new Promise((resolve, reject) => {
				http.get(`/message/select/?chat_id=${chatId}`)
					.then(res => {
						res.data.forEach(message => setMessageAttachment(message));

						commit('setMessages', res.data);
						resolve(res.data)
					})
					.catch(e => {
						reject(new VuexError(e, 'Произошла ошибка при загрузке сообщений'))
					})
			})
		},
		sendMessage({commit}, formData) {
    		return new Promise((resolve, reject) => {
				http.post('/message', formData)
					.then(res => {
						setMessageAttachment(res.data);
						commit('addMessage', res.data);
						resolve(res.data)
					})
					.catch(e => {
						reject(new VuexError(e, 'Произошла ошибка при отправке сообщения'))
					})
			})
		},
		clearMessages({commit}) {
			commit('clearMessages')
		},
		scrollToMessage({dispatch}, message) {
			const messageDiv = document.querySelector(`*[data-message-id='${message.id}']`);
			if(messageDiv) {
			 	messageDiv.scrollIntoView()
			} else {
				dispatch('app/showSnackbar', {
					text: `Сообщение ${message.id} не найдено`
				}, {root: true})
			}
		},
		deleteMessage({commit}, messageId) {
			return new Promise((resolve, reject) => {
				http.delete(`/message/${messageId}`)
					.then(() => {
						commit('deleteMessage', messageId);
						resolve(messageId)
					})
					.catch(e => {
						reject(new VuexError(e, 'Произошла ошибка при удалении сообщения'))
					})
			})
		}
    },
    mutations: {
		setMessages(state, messages) {
			state.messages = messages
		},
		addMessage(state, message) {
    		state.messages.push(message)
		},
		clearMessages(state) {
			state.messages = []
		},
		deleteMessage(state, messageId) {
			const idx = state.messages.findIndex(m => m.id === messageId);
			state.messages.splice(idx, 1)
		}
    },
    state: {
        messages: [],
    },
    getters: {
        messages: state => state.messages,
    }
}

const setMessageAttachment = message => {
	message.attachment = message.attachment ? JSON.parse(message.attachment) : []
}
