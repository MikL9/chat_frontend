import ChatMessage from "./ChatMessage";
import ChatCreated from "./ChatCreated";

export const WS_CHAT_MESSAGE = 0
export const WS_CHAT_CREATED = 1
// export const WS_USER_OFFLINE = 2

export default class WsMessage {
	kind; payload

	constructor(payload) {
		switch (payload.constructor) {
			case ChatMessage:
				this.actionType = payload.actionType
				this.kind = WS_CHAT_MESSAGE
				break
			case ChatCreated:
				this.kind = WS_CHAT_CREATED
				break
			default:
				throw Error('unsupported message kind')
		}

		this.payload = payload
	}

	static Parse(data) {
		return JSON.parse(data)
	}
}
