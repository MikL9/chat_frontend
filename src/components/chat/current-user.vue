<template>
	<v-list-item class="py-3" >
		<v-list-item-avatar color="#2196f333" size="64">
			<v-img :src="avatar"/>
		</v-list-item-avatar>

		<v-list-item-content>
			{{ user.presentation }}
		</v-list-item-content>
	</v-list-item>
</template>

<script>
import {mapGetters} from 'vuex'

    export default {
        name: "current-user",
		computed: {
        	...mapGetters({
				user: "auth/user"
			}),
			avatar() {
        	  return this.user.avatar
			}
		},
    }
</script>

<style scoped>

</style>
