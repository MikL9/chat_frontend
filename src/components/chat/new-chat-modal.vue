<template>
    <v-card>
		<v-card-title>Новый чат</v-card-title>
		<v-card-text>
			<v-container class="pa-0">
				<v-row no-gutters>
					<v-col>
						<v-text-field v-model="newChat.name" label="Название" outlined dense/>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-autocomplete
								v-model="newChat.users"
								:disabled="loading.users"
								:items="users"
								filled
								chips
								color="blue-grey lighten-2"
								label="Участники"
								multiple
								:item-value="getVal"
								dense
						>
							<template v-slot:selection="data">
								<v-chip
										v-bind="data.attrs"
										:input-value="data.selected"
										close
										@click="data.select"
										@click:close="remove(data.item)"
								>
									<v-avatar left>
										<v-img v-if="data.item.guid !== ''" :src="getDomain() + '/' + data.item.guid + '/' + data.item['file_name']"></v-img>
									</v-avatar>
									{{ data.item.presentation }}
								</v-chip>
							</template>
							<template v-slot:item="data">
								<template>
									<v-list-item-avatar>
										<img v-if="data.item.guid !== ''" :src="getDomain() + '/' + data.item.guid + '/' + data.item['file_name']">
									</v-list-item-avatar>
									<v-list-item-content>
										<v-list-item-title v-html="data.item.presentation"></v-list-item-title>
									</v-list-item-content>
								</template>
							</template>
						</v-autocomplete>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
		<v-card-actions>
			<v-spacer/>
			<v-btn class="px-3"
				   text
				   :loading="loading.creatingChat"
				   :disabled="!newChatValid"
				   @click="createChat(newChat)"
			>
				Создать
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex'
    import {CreateChatModel} from "@/models/models";
	import ChatCreated from "../../models/websocket/ChatCreated";
	import WsMessage from "../../models/websocket/WsMessage";
	import websocket from "../../utils/websocket/websocket";
	import {VUE_APP_SITE} from "../../config";

    export default {
        name: "new-chat-modal",
		computed: {
            ...mapGetters({
				users: "users/users"
			}),
			newChatValid() {
                return this.newChat.name && this.newChat.users.length > 0
			}
		},
		data() {
            return {
                newChat: new CreateChatModel(),
				loading: {
                    users: false,
					creatingChat: false
				},
				domain: VUE_APP_SITE
			}
		},
		methods: {
            ...mapActions({
				create: "chats/createChat",
				getUsers: "users/getUsers",
				showSnackbar: "app/showSnackbar"
			}),
			async createChat(newChat) {
				try {
					this.loading.creatingChat = true;

					const created = await this.create(newChat)

					this.$emit('chat:created');
					this.$toast({
						text: `Чат "${newChat.name}" успешно создан`,
					});

					this.newChat = new CreateChatModel()

					const chatCreated = new ChatCreated(created)

					websocket().send(new WsMessage(chatCreated))
				} catch (e) {
					this.showSnackbar(e)
				} finally {
					this.loading.creatingChat = false
				}
			},
			remove(item) {
            	const index = this.newChat.users.findIndex(e => e.id === item.id)
				if (index >= 0) this.newChat.users.splice(index, 1)
			},
			getVal(i){
            	return {id: i.id, presentation: i.presentation}
			},
			getDomain(){
				return this.domain
			}
		},
		mounted() {
			this.getUsers()
		}
	}
</script>

<style scoped lang="sass">
	.users-list-container
		max-height: 50vh
		overflow-y: auto
</style>
