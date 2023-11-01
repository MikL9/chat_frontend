<template>
	<v-sheet class="left-panel">
		<current-user/>

		<v-divider/>

		<chat-list/>
	</v-sheet>
</template>

<script>
	import {mapGetters} from 'vuex'

    import CurrentUser from "./current-user";
	import ChatList from "./chat-list";

	export default {
        name: "chat-left-panel",
		components: {ChatList, CurrentUser},
		data() {
            return {
                models: {
                    newChatDialog: false
				}
			}
		},
		computed: {
        	...mapGetters({
				searchResult: "chats/searchResult"
			})
		}
	}
</script>

<style scoped lang="sass">
.left-panel
  height: 100%
  overflow-y: auto
  border-right: 1px solid lightgrey
</style>
