<template>
    <v-card>
		<v-card-title>
			Управление чатом {{chat.name}}
		</v-card-title>
		<v-card-text>
			<div class="logo-container">
				<v-form id="change-logo-form" @submit.prevent="changeLogoSubmit">
					<div class="logo">
						<v-avatar class="logo__img" color="grey" size="128">
							<v-img v-if="chat.logo" :src="logo"/>
						</v-avatar>
						<v-file-input name="attachment[]"
									  class="logo__button ma-0 pa-0"
									  hide-input
									  @change="showChangeLogoDialog"
									  prepend-icon="mdi-camera"
									  accept="image/png, image/jpeg"/>
					</div>
				</v-form>
				<v-dialog v-model="dialog.changeLogo" min-width="300" max-width="350">
					<change-avatar-card form="change-logo-form" :image="selectedImage" :loading="loading.changing" @cancel="changeLogoCancel"/>
				</v-dialog>
				<v-dialog v-model="dialog.fileList" min-width="300" max-width="350">
					<v-list shaped>
						<v-subheader>Файлы чата</v-subheader>
						<v-list-item-group
								v-model="selectedItem"
								color="primary"
						>
							<v-list-item
									v-for="(item, i) in items"
									:key="i"
									@click="DownloadFile(item.id)"
							>
								<v-list-item-icon>
									<v-avatar left>
										<v-img v-if="item.Mtype == 'image'" :src="getGuid() + '/' + item.Guid + '/' + item.name"></v-img>
										<v-icon v-else>mdi-file</v-icon>
									</v-avatar>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title v-text="item.name"></v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-dialog>
			</div>
		</v-card-text>
		<v-card-actions>
			<v-btn color="primary" @click="showFilesDialog()" :loading="loading.changing" text>Файлы чата</v-btn>
			<v-spacer/>
			<v-btn color="primary" @click="delChat(chat)" :loading="loading.delete" text>Покинуть чат</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
	import {mapActions} from 'vuex'
	import ChangeAvatarCard from "../change-avatar-card";
	import http from "@/utils/http";
	import {VUE_APP_SITE} from "../../config";

    export default {
        name: "chat-settings",
		components: {ChangeAvatarCard},
		props: {
        	chat: {
        		type: Object,
				required: true
			}
		},
		computed: {
        	logo() {
        		return this.chat.logo
			},
			files() {
				return this.items
			}
		},
		data() {
        	return {
				dialog: {
					changeLogo: false,
					fileList: false,
				},
				loading: {
					delete: false,
					changing: false
				},
				selectedImage: null,
				filename: '',
				selectedItem: 1,
				guid: VUE_APP_SITE,
				items: [
					{ id: '', name: '', Guid: '', Mtype: '' }
				],
			}
		},
		beforeMount() {
			this.getChatFiles(this.chat)
		},
		methods: {
        	...mapActions({
				leaveChat: "chats/leaveChat",
				showSnackbar: "app/showSnackbar",
				changeLogo: "chats/changeLogo"
			}),
			delChat(chat) {
        		this.loading.delete = true;

				this.leaveChat(chat.id)
					.then(() => {
						this.$toast({
							text: `Вы покинули чат ${chat.name}`,
						})
					})
					.catch(e => {
						this.showSnackbar(e)
					})
					.finally(() => {
						this.loading.delete = false
					})
			},
			showChangeLogoDialog(file) {
				const reader = new FileReader();

				reader.onload = () => {
					this.selectedImage = reader.result;
					this.dialog.changeLogo = true
				};

				reader.onerror = () => {
					this.showSnackbar({
						text: 'Произошла ошибка при чтении фотографии'
					})
				};

				reader.readAsDataURL(file);
			},
			changeLogoCancel() {
				this.dialog.changeLogo = false
			},
			changeLogoSubmit(e) {
				const formData = new FormData(e.target);

				formData.append('type', 'chat');
				formData.append('path', "avatar");
				formData.append('id', this.chat.id);

				this.loading.changing = true;

				this.changeLogo(formData)
					.catch(e => {
						this.showSnackbar(e)
					})
					.finally(() => {
						this.loading.changing = false;
						this.dialog.changeLogo = false
					})
			},
			showFilesDialog() {
				this.dialog.fileList = true
				this.getChatFiles(this.chat)
			},
			getChatFiles(chat){
				http.get(`/file/getFiles/${chat.id}`).then((res) => {
					this.items = res.data
				})
				return this.items
			},
			getGuid(){
				return this.guid
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
		},
    }
</script>

<style scoped>
	.logo-container {
		display: flex;
		justify-content: center;
	}

	.logo {
		position: relative;
	}

	.logo__button {
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.logo__button >>> .v-input__prepend-outer {
		padding: 0;
		margin-right: -3px;
		margin-bottom: -3px;
	}
</style>
