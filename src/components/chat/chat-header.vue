<template>
	<v-sheet v-if="currentChat" elevation="1">
		<v-list-item>
			<v-list-item-avatar color="#2196f333" size="64">
<!--				<v-img :src="user.avatar"/>-->
			</v-list-item-avatar>

			<v-list-item-content>
				<v-subheader>Участники</v-subheader>
				<div class="text-left">
					<v-chip
						v-for="user in currentChat.users"
						:key="user.id"
						class="ma-2"
					>
						<v-avatar left color="#2196f333">
							<v-img :src="user.avatar"></v-img>
						</v-avatar>
						{{ user.presentation }}
					</v-chip>
				</div>
			</v-list-item-content>
		</v-list-item>
	</v-sheet>
</template>

<script>
import {mapGetters} from "vuex";

export default {
	name: "chat-header",
	computed:{
		...mapGetters({
			currentChat: "chats/currentChat"
		})
	},
	mounted() {
		console.log(this.currentChat)
	}
}
</script>

<style scoped>

</style>
