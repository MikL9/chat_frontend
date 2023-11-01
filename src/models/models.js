export class VuexError {
	error; text;

	constructor(error, text = 'Произошла ошибка') {
		this.error = error;
		this.text = text;
	}
}

export class Message {
	id = undefined
	text = '';
	files = []
}

export class CreateChatModel {
	name = '';
	users = [];
	is_group = true;
}

export class User {
	id = undefined
	presentation = ''
	login = ''
	password = ''
	email = ''
	phone = ''
	role = 0
}
