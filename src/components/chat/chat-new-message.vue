<template>
	<v-card class="new-message-form" flat tile>
		<v-card-text>
			<v-form @submit.prevent="onFormSubmit">
				<input type="hidden" name="chat_id" :value="currentChat.id">

				<v-row align="center">
					<v-col>
						<v-text-field
								v-model="message.text"
								name="message"
								outlined
								clearable
								label="Сообщение"
								type="text"
								hide-details
								dense
								autocomplete="off"
						/>
					</v-col>

					<v-col cols="auto" class="pr-2">
						<!--						TODO: сделать меню со списком выбранных файлов с возможностью удаления-->
						<v-badge :content="message.files.length" overlap bordered :value="message.files.length">
							<v-file-input v-model="message.files" class="pa-0" name="attachment[]" hide-input/>
						</v-badge>
					</v-col>

					<v-col cols="auto">
						<v-btn type="submit" :disabled="!message.text && message.files.length < 1">
							Отправить
						</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</v-card-text>
	</v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import websocket from "../../utils/websocket/websocket";
import ChatMessage, {ActionType} from "../../models/websocket/ChatMessage";
import WsMessage from "../../models/websocket/WsMessage";

export default {
	name: "new-message-form",
	computed: {
		...mapGetters({
			currentChat: "chats/currentChat",
		    message: "chats/message"
		})
	},
	data() {
		return {
			loading: {
				send: false
			}
		}
	},
	methods: {
		...mapActions({
			sendMessage: "messages/sendMessage",
			showSnackbar: "app/showSnackbar",
		    resetMessage: "chats/resetMessage"
		}),
		onFormSubmit(e) {
			const message = new FormData(e.target);

			let chatMsg = null;
			if (this.message.files.length < 1) {
				message.delete('attachment[]');
				chatMsg = new ChatMessage(message.get('message'), null)
			} else {
				message.append('type', 'chat');
				message.append('path', "file");
				chatMsg = new ChatMessage(message.get('message'), message)
			}
			chatMsg.chat.id = this.$store.getters["chats/currentChat"].id
			if(this.message.id !== undefined) {
				chatMsg.id = this.message.id
				chatMsg.actionType = ActionType.Edit
			} else chatMsg.actionType = ActionType.Send;

			const msg = new WsMessage(chatMsg)

			websocket().send(msg)

			this.resetMessage()
		},
	}
}
</script>

<style scoped lang="scss">
.new-message-form {
  width: 100%;
  background-color: transparent;
}
</style>
