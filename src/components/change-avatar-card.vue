<template>
	<v-card>
		<v-card-title>Сохранить изображение?</v-card-title>
		<v-card-text class="text-center">
			<v-avatar size="250" color="grey">
				<v-img :src="image"/>
			</v-avatar>
		</v-card-text>
		<v-card-actions>
			<v-spacer/>
			<v-btn color="secondary" text @click="cancel" :disabled="loading">Отмена</v-btn>
			<v-btn :form="form" type="submit" color="primary" text :loading="loading">Сохранить</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
    export default {
        name: "change-avatar-card",
		props: {
        	loading: {
        		type: Boolean,
				default: false
			},
			form: {
        		type: String,
				required: true
			},
			image: {
        		required: true
			}
		},
		methods: {
        	cancel() {
        		this.$emit('cancel')
			}
		}
    }
</script>

<style scoped>

</style>
