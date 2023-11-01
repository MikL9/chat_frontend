<template>
	<v-list-item @click="onClick(message)">
		<v-list-item-content>
			<v-list-item-title v-html="getChatName(message)"/>
			<v-list-item-subtitle class="text-right" v-html="message.message"/>
		</v-list-item-content>
	</v-list-item>
</template>

<script>
	import {mapActions} from 'vuex'

    export default {
        name: "message-list-item",
		props: {
            message: {
                type: Object,
				required: true
			}
		},
        methods: {
            ...mapActions({
                setCurrentChatById: "chats/setCurrentChatById",
                scrollToMessage: "messages/scrollToMessage",
            }),
			onClick(message) {
                this.setCurrentChatById(message.chat_id)
                    .then(() => {
						this.scrollToMessage(message)
                    })
			},
			getChatName(message) {
                return message.chat_name ?? `Чат ID: ${message.chat_id}`
			}
        }
    }
</script>

<style scoped>

</style>
