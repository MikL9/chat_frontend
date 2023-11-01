<template>
	<v-list-item @click="onClick(user)">
		{{user.presentation}}
	</v-list-item>
</template>

<script>
	import {mapActions} from 'vuex'

    export default {
        name: "user-list-item",
		props: {
            user: {
                type: Object,
				required: true
			}
		},
		methods: {
        	...mapActions({
				getChatByUserId: "chats/getChatByUserId"
			}),
            onClick(user) {
        		this.getChatByUserId({
					user_id: user.id
				})
			}
		}
    }
</script>

<style scoped>

</style>
