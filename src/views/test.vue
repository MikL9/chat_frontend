<template>
	<v-container>
		<v-row justify="space-around">
			<v-col cols="auto">
				<chat-window :user="users.alex" :chat="chats['1']"/>
			</v-col>
			<v-col cols="auto">
				<chat-window :user="users.pavel" :chat="chats['1']"/>
			</v-col>
		</v-row>

		<v-row justify="space-around">
			<v-col cols="auto">
				<chat-window :user="users.alex" :chat="chats['2']"/>
			</v-col>
			<v-col cols="auto">
				<chat-window :user="users.anna" :chat="chats['2']"/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import ChatWindow from "../components/test/chat-window";
import {User, Chat} from "../components/test/models";

export default {
	name: "test",
	components: {ChatWindow},
	data() {
		return {
			users: {
				'alex': new User({id: 1, name: 'Alex'}),
				'anna': new User({id: 2, name: 'Anna'}),
				'pavel': new User({id: 3, name: 'Pavel'}),
			},
			chats: {
				1: new Chat({id: 1, name: 'Курилка'}),
				2: new Chat({id: 2, name: 'Беседка'}),
			},
		}
	}
}
</script>

<style scoped>

</style>
