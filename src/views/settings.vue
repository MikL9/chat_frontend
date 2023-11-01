<template>
	<v-container class="settings">
		<v-row>
			<v-col>
				<change-avatar/>
			</v-col>
			<v-divider/>
		</v-row>
		<v-divider/>
		<v-row>
			<v-col cols="12" sm="6" md="5" >
				<change-password/>
			</v-col>
		</v-row>
		<v-divider/>
		<v-row>
			<v-col cols="12" sm="6" md="5" >
				<change-theme/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
    import ChangeAvatar from "../components/settings/change-avatar";
    import ChangePassword from "../components/settings/change-password";
	import ChangeTheme from "../components/settings/change-theme";

    export default {
        name: "settings",
        components: {ChangePassword, ChangeAvatar, ChangeTheme}
    }
</script>

<style scoped>
html {
	overflow: visible !important; /* Hide scrollbars */
}
</style>
