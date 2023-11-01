<template>
    <base-settings-row-content name="Аватар">
		<v-form id="change-avatar-form" @submit.prevent="submit">
			<div class="avatar">
				<v-avatar class="avatar__img" color="grey" size="200">
					<v-img :src="avatar"/>
				</v-avatar>
				<v-file-input name="attachment[]"
							  class="avatar__button ma-0 pa-0"
							  hide-input
							  @change="showDialog"
							  prepend-icon="mdi-camera"
							  accept="image/png, image/jpeg"/>
			</div>
		</v-form>
<!--		Диалог подтверждения-->
		<v-dialog v-model="dialog" min-width="300" max-width="350">
			<change-avatar-card form="change-avatar-form" :image="selectedImage" :loading="loading.changing" @cancel="cancel"/>
		</v-dialog>
	</base-settings-row-content>
</template>

<script>
    import BaseSettingsRowContent from "./base-settings-row-content";
    import {mapGetters, mapActions} from 'vuex'
	import ChangeAvatarCard from "../change-avatar-card";

    export default {
        name: "change-avatar",
        components: {ChangeAvatarCard, BaseSettingsRowContent},
		computed: {
        	...mapGetters({
				user: "auth/user"
			}),
			avatar() {
        		return this.user.avatar
			}
		},
		data() {
        	return {
        		dialog: false,
				selectedImage: null,
        		loading: {
        			changing: false
				}
			}
		},
		methods: {
        	...mapActions({
				changeAvatar: "auth/changeAvatar",
				showSnackbar: "app/showSnackbar"
			}),
			showDialog(file) {
        		const reader = new FileReader();

        		reader.onload = () => {
					this.selectedImage = reader.result;
					this.dialog = true;
				};

        		reader.onerror = () => {
        			this.showSnackbar({
						text: 'Произошла ошибка при чтении фотографии'
					})
				};

        		reader.readAsDataURL(file);
			},
			cancel() {
        		this.dialog = false;
			},
			submit(e){
        		const formData = new FormData(e.target);
				formData.append('type', "user");
				formData.append('path', "avatar");
				this.loading.changing = true;

				this.changeAvatar(formData)
					.catch(e => {
						this.showSnackbar(e)
					})
					.finally(() => {
						this.loading.changing = false;
						this.dialog = false;
					})
			}
		},
	}
</script>

<style scoped>
	.avatar {
		position: relative;
		width: fit-content;
	}

	.avatar__img {

	}

	.avatar__button {
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.avatar__button >>> .v-input__prepend-outer {
		padding: 0;
		margin-right: 0;
		margin-bottom: -2px;
	}
</style>
