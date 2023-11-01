import store from '../../store'
import {LOCAL_STORAGE_TOKEN_KEY} from "../../models/constants";
import WsMessage, {WS_CHAT_CREATED, WS_CHAT_MESSAGE} from "../../models/websocket/WsMessage";
import Vue from "vue";
import http from "../../utils/http";
import {VuexError} from "../../models/models";
import {ActionType} from "../../models/websocket/ChatMessage";

export default () => {
	if(!instance)
		throw Error("call InitWS on app start")

	return instance
}

let instance

export const InitWS = (options = {}) => {
	if(instance)
		return

	instance = new Websocket(options)
}

class Websocket {
	conn
	options
	files

	constructor(options = {}) {
		this.options = options
	}

	connected()	{
		return !!this.conn
	}

	connect() {
		if (!('WebSocket' in window)) {
			console.warn('Вебсокеты не поддерживаются браузером')
			return
		}

		if(this.conn) {
			console.info('Соединение по ws уже открыто')
			return
		}

		const opts = {
			...this.options
		}

		const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)

		const url = `${opts.url}?token=` + token
		this.conn = new WebSocket(url, ['json'])

		this.conn.onopen = e => console.info('[WS]: соединение с вебсокетом открыто', e)
		this.conn.onclose = e => console.info('[WS]: соединение с вебсокетом закрыто', e)
		this.conn.onerror = e => console.warn('Ошибка ', e)

		window.addEventListener('beforeunload', this.disconnect)

		this.conn.onmessage = e => {
			const msg = WsMessage.Parse(e.data)
			if((msg.payload.file['id'] !== 0)) {
				http.post('/file/link/', [msg.payload.file['id'], msg.payload.id])
					.catch(e => {
						new VuexError(e, "Произошла ошибка при привязке")
					})
			}

			switch (msg.kind) {
				case WS_CHAT_MESSAGE:
					switch (msg.actionType) {
						case ActionType.Send:
							store.dispatch('chats/addChatMessage', msg.payload)
							break;
						case ActionType.Delete:
							store.dispatch('chats/deleteChatMessage', msg.payload)
							break;
						case ActionType.Edit:
							store.dispatch('chats/editChatMessage', msg.payload)
							break;
					}
					return
				case WS_CHAT_CREATED:
					store.commit('chats/addChat', msg.payload)
					Vue.toast({
						text: `Вы добавлены в чат\n${msg.payload.name}`,
						onClick: function () {
							store.dispatch('chats/setCurrentChat', msg.payload)
						}
					})
					return;
			}
		}
	}

	disconnect(reason) {
		if(!this.conn) {
			console.info('Соединение по ws ещё не установлено')
			return
		}
		this.conn.close(reason)
		window.removeEventListener('beforeunload', this.disconnect)
		this.conn = null
	}

	async send(data) {
		this.files = data.payload.file
		delete data.payload.file
		if(this.files != null) {
			this.files.append('id', data.payload.chat.id)
			data.payload.file = await this.saveFile(this.files)
			data.payload.file['Id'] = data.payload.file['FileID']
			data.payload.file['Name'] = data.payload.file['FileName']
			delete data.payload.file['FileID']
			delete data.payload.file['FileName']
		}
		if(!this.conn) return
		this.conn.send(JSON.stringify(data))
	}

	 saveFile(file) {
		 return new Promise(function (resolve) {
			 http.post('/file', file)
				 .then(res => {
					 let result = res.data;
					 resolve(result);
				 })
				 .catch(e => {
					 new VuexError(e, "Произошла ошибка при загрузке")
				 })
		 });
	}
}
