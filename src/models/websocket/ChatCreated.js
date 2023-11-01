export default class ChatCreated {
	id; is_group; logo; name; users

	constructor(createChatResponse) {
		Object.assign(this, {...createChatResponse})
	}
}
