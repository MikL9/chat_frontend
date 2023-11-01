<template>
  <v-container>
	<v-row>
	  <v-col>
		<users-table/>
	  </v-col>
	</v-row>
  </v-container>
</template>

<script>
import UsersTable from "../components/users/users-table";
export default {
  name: "users",
  components: {UsersTable},
}
</script>

<style scoped>

</style>
