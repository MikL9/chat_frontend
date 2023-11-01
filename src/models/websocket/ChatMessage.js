export default class ChatMessage {
	id; text; user; chat; file; created; actionType;

	constructor(text, file) {
		this.text = text
		this.user = new User()
		this.chat = new Chat()
		this.file = file
		this.actionType = ActionType
	}
}

export const ActionType = {
	Send: 0,
	Delete: 1,
	Edit: 2,
}

export class User {
	id;	presentation
}

export class Chat {
	id
}
