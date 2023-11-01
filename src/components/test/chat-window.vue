<template>
  <v-card class="chat">
	  <div class="d-flex align-center justify-space-between px-3">
		  <div>
			  <p class="mb-1">{{ chat.name }}</p>
			  <p class="mb-0">{{ user.name }}</p>
		  </div>
		  <v-switch v-model="connected" color="green"/>
	  </div>

	  <v-list dense ref="messages" class="chat-messages" two-line>
		  <v-list-item v-for="(msg, i) in messages" :key="i">
			  <v-list-item-content :class="{'text-end': msg.fromMe(user.id)}">
				  <v-list-item-title>
					  {{ msg.text }}
				  </v-list-item-title>
				  <v-list-item-subtitle>
					  {{ msg.user.name }}
				  </v-list-item-subtitle>
			  </v-list-item-content>
		  </v-list-item>
	  </v-list>

	  <v-card-actions>
		  <v-form class="form flex-grow-1" @submit.prevent="submit(msg)">
			  <v-text-field
					  v-model="msg.text"
					  placeholder="Текст сообщения"
					  hide-details
					  append-icon="mdi-send-circle"
					  @click:append="submit(msg)"
			  />
		  </v-form>
	  </v-card-actions>
  </v-card>
</template>

<script>
import {Message, Chat, User} from "./models";

export default {
	name: "chat",
	props: {
		chat: {
			type: Chat,
			required: true
		},
		user: {
			type: User,
			required: true
		}
	},
	watch: {
		connected(val) {
			val ? this.connect() : this.disconnect()
		}
	},
	data() {
		return {
			connected: false,
			messages: [],
			msg: this.scaffoldMessage(),
		}
	},
	methods: {
		scaffoldMessage() {
			const msg = new Message()
			msg.chat = this.chat
			msg.user = this.user
			return msg
		},
		addMessage(msg) {
			this.messages.push(Message.parse(msg.data))
		},
		scrollDown() {
			const messagesEl = this.$refs.messages.$el
			messagesEl.scrollTo({behavior: 'smooth', top: messagesEl.scrollHeight})
		},
		connect() {
			this.wsOpen()

			this.ws.addEventListener('message', this.addMessage)
			this.ws.addEventListener('message', this.scrollDown)
		},
		disconnect() {
			this.ws.removeEventListener('message', this.addMessage)
			this.ws.removeEventListener('message', this.scrollDown)
			this.wsClose()
		},
		submit(msg) {
			if(!msg.text) return
			this.wsSend(msg.string())
			this.msg = this.scaffoldMessage()
		},
	}
}
</script>

<style scoped>
.chat {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr auto;
	height: 300px;
	width: 300px;
	background-color: #68acf821;
}

.chat-title {
	display: flex;
	justify-content: space-between;
}

.chat-messages {
	overflow: auto;
}
</style>
