<template>
    <div>
		<v-card-title>{{name}}</v-card-title>
		<v-card-text>
			<slot/>
		</v-card-text>
	</div>
</template>

<script>
    export default {
        name: "base-settings-row-content",
		props: {
            name: {
                type: String,
				required: true
			}
		}
    }
</script>

<style scoped>

</style>
