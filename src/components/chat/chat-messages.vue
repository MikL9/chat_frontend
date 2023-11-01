<template>
	<ul class="messages" ref="messagesContainer"
		@contextmenu.prevent=""
	>
		<v-dialog v-model="pageActions.dialog" width="600px">
			<v-btn tile color="primary" @click="selectAction()">
				<v-icon left>mdi-check</v-icon>
				Select
			</v-btn>
			<v-btn tile color="primary" @click="editAction()">
			  <v-icon left>mdi-pencil-outline</v-icon>
			  Edit
			</v-btn>
		</v-dialog>
		<v-footer
			v-if="pageActions.footer"
			:fixed=true
			:padless=true
			class="red lighten-1 text-center"
			width="100%"
			flat
			tile
		>
		  <v-card
			  flat
			  tile
			  width="100%"
			  class="red lighten-1 text-center"
		  >
			<v-card-text>
			  <v-btn class="mx-4" icon @click="deleteSelected()">
				<v-icon size="24px">mdi-delete</v-icon>
			  </v-btn>
			  <v-btn class="mx-4" icon @click="resetModel()">
				  <v-icon size="24px">mdi-close</v-icon>
			  </v-btn>
			</v-card-text>
		  </v-card>
		</v-footer>

	  	<v-item-group
				v-model="model"
				multiple
		>
		<li class="message" :data-me="msg.user.id === user.id" v-for="msg in messages" :key="msg.id" @contextmenu.prevent="onRightClick(msg.id)">
		  <v-item v-slot="{ active }"
				  :value="msg.id"
		  >
			<v-card
				class="message-content"
				:color="active ? 'green' : (msg.user.id === user.id) ? 'primary' : ''"
				:data-me="msg.user.id === user.id"
				:style="(msg.user.id !== user.id) ? 'border-radius: 25px 25px 25px 0 !important;' : 'border-radius: 25px 25px 0 25px !important;'"
				tile
			>
			  <div @click="toggle(msg.id, msg.user.id)"
			  >
				<div class="sender"
					 v-if="(msg.user.id !== user.id)"
				>{{msg.user.presentation}}</div>


					<v-img class="img"
						   max-width="450"
						   contain
						   v-on:mouseover="showImgEye(msg.id)"
						   v-on:mouseleave="pageActions.showImgEye = false"
						   v-if="msg.file.type === 'image'"
						   :lazy-src="getGuid() + '/' + msg.file.guid + '/' + msg.file.name"
						   :src="getGuid() + '/' + msg.file.guid + '/' + msg.file.name">

						  <a :href="getGuid() + '/' + msg.file.guid + '/' + msg.file.name"
							 v-if="msg.file.type === 'image' && pageActions.showImgEye === msg.id"
							 target="_blank"
							 class="showImage"
							 style="text-decoration: none;"
						  ><v-icon x-large>mdi-eye</v-icon></a>

						  <a @click="DownloadFile(msg.file.id)"
							 class="downloadImage"
							 v-if="msg.file.type === 'image' && pageActions.showImgEye === msg.id"
							 style="text-decoration: none;"

						  ><v-icon v-if="msg.file.id !== 0">mdi-file</v-icon></a>

					</v-img>


				<div v-else class="text">{{msg.text}}</div>

				<div class="file" v-if="msg.file.id !== 0 && msg.file.type !== 'image'">
					<v-divider inset class="file-underline" v-if="msg.text !== ''"></v-divider>
					<a :style="(msg.user.id !== user.id) ? 'color: primary !important' : 'color: #fff !important'"
					   @click="DownloadFile(msg.file.id)"><v-icon>mdi-file</v-icon>{{msg.file.name}}</a>
				</div>
				<div class="message-info">
					<div class="date">{{ msg.created | created }}</div>
				</div>
			  </div>
			</v-card>
		  </v-item>
		</li>
		</v-item-group>

		<v-card
			v-if="this.pageActions.edit !== 0 && message.id !== undefined"
			class="message"
		>
		  <v-list-item three-line>
			<div class="text">{{this.pageActions.edit.text}}</div>
			<v-img class="img"
				   max-height="350"
				   max-width="550"
				   contain
				   v-if="this.pageActions.edit.file.type === 'image'" :src="getGuid() + '/' + this.pageActions.edit.file.guid + '/' + this.pageActions.edit.file.name"/>
		  </v-list-item>
		  <v-list-item>
			<div class="file"><v-icon v-if="this.pageActions.edit.file.id !== 0" small>mdi-file</v-icon>{{this.pageActions.edit.file.name}}</div>
		  </v-list-item>

		  <v-card-actions>
			<v-btn tile color="primary" @click="resetModel()">
			  <v-icon left>mdi-close</v-icon>
			</v-btn>
		  </v-card-actions>
		</v-card>
	</ul>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
	import moment from 'moment'
	import http from "@/utils/http";
	import {VUE_APP_SITE} from "../../config";
import ChatMessage, {ActionType} from "../../models/websocket/ChatMessage";
import WsMessage from "../../models/websocket/WsMessage";
import websocket from "../../utils/websocket/websocket";

    export default {
        name: "chat-messages",
		filters: {
			created(date) {
				date = moment(date)
				let dateNow = new Date()

				if (date.isSame(new Date(), 'day')){
					return date.format('HH:mm')
				} else if (dateNow.getFullYear() === date.year()) {
					return date.format('DD.MM HH:mm')
				}
				return date.format('DD.MM.YYYY HH:mm')
			}
		},
		computed: {
        	...mapGetters({
				user: "auth/user",
				messages: "chats/messages",
				message: "chats/message"
			})
		},
		data() {
        	return {
				pageActions:{
					select: false,
					dialog: false,
					footer: false,
				  	edit: 	0,
					showImgEye: false
				},
			  	premodel: [],
				model: [],
        		preventScroll: false,
				filename: "",
			  	guid: VUE_APP_SITE
			}
		},
		methods: {
			...mapActions({
			  	setMessage: "chats/setMessage",
				resetMessage: "chats/resetMessage"
			}),
			toggle(msgId, userId) {
				if(this.pageActions.select && ((userId === this.user.id))) {
					this.model.push(msgId)
				}
			},
			DownloadFile(fileID) {
				http.get(`/file/info/${fileID}`).then((res) => {
					this.filename = res.data
				})
				http.get(`/file/download/${fileID}`, {
					responseType: "blob"
				}).then((res) => {
					const url = window.URL.createObjectURL(new Blob([res.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', this.filename);
					document.body.appendChild(link);
					link.click();
				}).catch(e => {
					const res = e.response;
					if (res.status === 413) {
						alert("Файл выгрузки слишком большой")
					}
				});
			},
			setScrollTimeout(){
				setTimeout(() => this.scrollDown(), 100);
			},
			scrollDown(){
				if(!this.preventScroll) {
					const el = this.$el
					el.scrollTo({behavior: 'smooth', top: el.scrollHeight})
				}
			},
			getGuid(){
				return this.guid
			},
			deleteSelected() {
				if(this.model.length > 0){
					let chatMsg = null;
					let message;
					Object.values(this.model).forEach((messageId) => {
						message = this.messages.filter(m => m.id == messageId)
						chatMsg = new ChatMessage(message[0].text, null)
						chatMsg.id = message[0].id
						chatMsg.actionType = ActionType.Delete;
						chatMsg.chat.id = this.$store.getters["chats/currentChat"].id

						const msg = new WsMessage(chatMsg)

						websocket().send(msg)
					})
					this.resetModel()
				}
			},
			selectAction(){
				this.pageActions.select = true;
				if(this.premodel.length > 0) {
				  this.model = this.premodel
				}
				this.pageActions.dialog = false;
			},
			editAction(){
			  this.pageActions.edit  = this.messages.filter(m => m.id == this.premodel[0])
			  this.pageActions.edit = this.pageActions.edit[0]
			  if(this.premodel.length > 0) {
				this.setMessage(this.pageActions.edit)
			  }
			  this.pageActions.dialog = false;
			},
			onRightClick(item) {
			  this.premodel = [];
			  if (this.pageActions.select === true) {
				this.resetModel()
				return
			  }

			  let premessage = this.messages.filter(m => m.id == item)
			  if(this.model.length === 0 && (premessage[0].user.id == this.user.id)) {
				  this.pageActions.dialog = true;
				  this.premodel.push(item)
			  }
			},
			resetModel() {
				this.pageActions.select = false;
				this.model = []
				this.pageActions.dialog = false;
				if (this.pageActions.edit !== 0) {
					this.resetMessage()
					this.pageActions.edit = 0;
				}
				this.premodel = []
			},
			showImgEye(msgId){
				this.pageActions.showImgEye = msgId
			}
		},
	  updated() {
          //console.log(this.messages)
		  if(this.model.length === 0 && this.pageActions.dialog === false) {
			  this.$nextTick(() => this.scrollDown());
			  this.$nextTick(() => this.setScrollTimeout());
			  this.pageActions.footer = false
		  } else this.pageActions.footer = true
        }
	}
</script>

<style scoped lang="scss">
@import "~vuetify/src/styles/styles";

/* width */
::-webkit-scrollbar {
  background:transparent;
  width: 5px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(63, 81, 181, 0.8);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #837c7c;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}

.custom_icon .v-btn {
  width: 18px;
  height: 18px;
  min-width: 12px;
  min-height: 12px;
}

.messages {
  padding: 20px;
  list-style-type: none;

  .message {
	display: flex;
	min-width: 400px;
	max-width: 640px;
	//background-color: transparentize(#{map-get($indigo, 'base')}, 0.5);

	&:not(:last-child) {
	  margin-bottom: 10px;
	}

	@media #{map-get($display-breakpoints, 'md-and-down')} {
	  min-width: 300px;
	  max-width: 400px;
	}

	&[data-me="true"] {
	  margin-left: auto;
	}
	@media #{map-get($display-breakpoints, 'xl-only')} {
	  margin-left: initial;
	}

	.v-divider--inset:not(.v-divider--vertical) {
	  max-width: calc(100% - 0px) !important;
	}
	.v-divider {
	  height: 7px !important;
	  max-height: 7px!important;
	  margin-left: 0 !important;
	}

	.message-content {
	  margin: inherit;
	  min-width: 300px;
	  max-width: fit-content;
	  flex: 0 1 100%;
	  padding: 10px;
	  flex-wrap: wrap;

	  //border-radius: 20px 20px 20px 0;
	  line-height: 1.5;
	  font-size: 14px;
	  font-weight: 500;
	  & + & {
		margin-top: 10px;
	  }
	  border: 1px solid gray;

	  .sender {
		margin-bottom: 5px;
		font-weight: 500;
	  }

	  .file {
		font-size: smaller;
	  }

	  .showImage{
		position: absolute;
		top: 50%;
		left: 50%;
		margin: 0 -50% 0 0;
		transform: translate(-50%, -50%);
	  }
	  .downloadImage {
		position: absolute;
		top: 100%;
		left: 96%;
		margin: -5% 0 0 0;
		transform: translate(-50%, -50%);
	  }
	}

	.message-info {
	  display: flex;
	  justify-content: flex-end;
	  flex: 1 0 auto;
	  margin-left: 5px;

	  .date {
		align-self: flex-end;
		font-size: small;
		font-weight: 400 !important;
	  }
	}
  }
}
</style>
