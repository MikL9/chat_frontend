export class Message {
	id; text; user; chat

	constructor(raw = {}) {
		Object.assign(this, raw)
	}

	empty() {
		return !this.text
	}

	fromMe(iam) {
		return this.user.id === iam
	}

	string() {
		return JSON.stringify(this)
	}

	static parse(data) {
		return new Message(JSON.parse(data))
	}
}

export class User {
	id; name

	constructor(raw = {}) {
		Object.assign(this, raw)
	}
}

export class Chat {
	id; name

	constructor(raw = {}) {
		Object.assign(this, raw)
	}
}
