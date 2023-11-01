<template>
	<v-skeleton-loader v-if="loading.chats" type="list-item@3"/>
	<v-list v-else style="position: relative">
		<v-list-item class="py-3">
			<v-text-field v-model="filter"
						  outlined
						  clearable
						  append-icon="mdi-magnify"
						  placeholder="Поиск"
						  hide-details dense
			/>
		</v-list-item>

		<v-list-item v-for="chat in chats" :key="chat.id"
					 @click="$store.dispatch('chats/setCurrentChat', chat)"
		>
			<v-badge avatar
					 overlap
					 bottom
					 offset-x="30px"
					 offset-y="15px"
					 icon="mdi-chat"
					 :value="chat.is_group"
			>
				<v-list-item-avatar class="ml-0 my-0" size="40" color="grey">
					<v-img v-if="chat.logo" :alt="`${chat.name} avatar`" :src="logo(chat)"/>
				</v-list-item-avatar>
			</v-badge>

			<v-list-item-content>
				<v-list-item-title v-text="`${chat.name || chat.presentation}`"/>
			</v-list-item-content>

			<v-list-item-icon>
				<v-icon :color="chat.active ? 'deep-purple accent-4' : 'grey'">
					mdi-message-outline
				</v-icon>
			</v-list-item-icon>

			<v-list-item-action>
				<v-dialog width="600">
					<template v-slot:activator="{on}">
						<v-btn small icon v-on="on">
							<v-icon small>mdi-cog-outline</v-icon>
						</v-btn>
					</template>

					<chat-settings :chat="chat"/>
				</v-dialog>

			</v-list-item-action>
		</v-list-item>

		<v-dialog v-model="models.newChatDialog" max-width="600">
			<template v-slot:activator="{on}">
				<v-btn fab v-on="on" x-small top right absolute class="primary">
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</template>
			<new-chat-modal @chat:created="models.newChatDialog = false"/>
		</v-dialog>
	</v-list>
</template>

<script>
	import ChatSettings from "./chat-settings";
	import NewChatModal from "./new-chat-modal";

    export default {
        name: "chat-list",
        components: {NewChatModal, ChatSettings},
		computed: {
			chats() {
				const chats = this.$store.getters['chats/chats']

				if(this.filter)
					return chats.filter(c => c.name.includes(this.filter))

				return chats
			}
		},
		data() {
        	return {
				filter: '',
				models: {
					newChatDialog: false
				},
        		loading: {
        			chats: false
				},
			}
		},
		methods: {
			logo(chat) {
			   	if (typeof(chat.logo) != 'number') {
				  return chat.logo
				}
			}
		},
		async mounted() {
			try {
				this.loading.chats = true
				await this.$store.dispatch('chats/getChats')
			} finally {
				this.loading.chats = false
			}
		}
	}
</script>

<style scoped>

</style>
