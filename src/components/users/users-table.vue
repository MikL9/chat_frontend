<template>
 <v-data-table
	 :headers="headers"
	 :items="users"
	 hide-default-footer
	 disable-sort
	 :items-per-page="p.limit"
 >
   <template #top>
	 <v-container>
	   <v-row justify="space-between" align="center">
		 <v-col cols="3">
		   <v-form @submit.prevent="page = 1">
			 <v-text-field
				 v-model="p.quicksearch"
				 label="Поиск"
				 prepend-inner-icon="mdi-magnify"
				 @click:clear="onSearchClear"
				 outlined clearable dense hide-details
				 @keyup.enter="getData"
			 >
			 </v-text-field>
		   </v-form>
		 </v-col>

		 <v-col cols="auto">
		   <user-dialog>
			 <template #activator="{on, attrs}">
			   <v-btn v-on="on" v-bind="attrs" icon dark class="primary">
				 <v-icon>mdi-plus</v-icon>
			   </v-btn>
			 </template>
		   </user-dialog>
		 </v-col>
	   </v-row>
	 </v-container>
   </template>

   <template #item.actions="data">
	 <user-dialog :user-data="data.item">
	   <template #activator="{on, attrs}">
		 <v-btn v-on="on" icon small v-bind="attrs">
		   <v-icon small>mdi-account-edit-outline</v-icon>
		 </v-btn>
	   </template>
	 </user-dialog>
	<v-btn icon small @click.stop="deleteUser(data)">
	  <v-icon small>mdi-delete</v-icon>
	</v-btn>
   </template>

   <template #footer>
	 <v-pagination v-model="page" :length="Math.ceil(totalCount/ p.limit)"/>
   </template>

 </v-data-table>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import UserDialog from "./user-dialog";

export default {
  name: "users-table",
  components: {UserDialog},
  computed: {
    ...mapGetters({
	  users: 'users/users',
	  totalCount: 'users/totalCount'
	}),
	params() {
      const {order, quicksearch} = this.p
      return {
		...this.p,
		start: this.p.limit * (this.page - 1),
		order: order ? order : undefined,
		quicksearch: quicksearch ? quicksearch : undefined,
	  }
	}
  },
  watch: {
    page() {
	  this.loadUsers()
	}
  },
  data() {
    return {
      page: 1,
      p: {
        start: 0,
		step: 0,
		limit: 10,
		order: undefined,
		quicksearch: undefined,
	  },
	  headers: [
		{text: 'id', value: 'id'},
		{text: 'Имя', value: 'presentation'},
		{text: 'Логин', value: 'login'},
		{text: 'Email', value: 'email'},
		{text: 'Телефон', value: 'phone'},
		{text: '', value: 'actions'},
	  ],
	}
  },
  methods: {
    ...mapActions({
	  getUsers: "users/getUsers",
	  deleteUser: "users/deleteUser",
	}),
	onSearchClear() {
      this.p.quicksearch = undefined
	  this.loadUsers()
	},
	loadUsers() {
	  this.getUsers(this.params)
	},
	getData(){
	  this.loadUsers();
	},
  },
  mounted() {
    this.loadUsers()
  }
}
</script>

<style scoped>

</style>
