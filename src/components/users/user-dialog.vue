<template>
  <v-dialog v-model="dialog" width="600">
	<template #activator="data">
	  <slot name="activator" v-bind="data"/>
	</template>
	<v-card>
	  <v-form ref="form" v-model="form.valid" @submit.prevent="addUser(user); dialog = false">
		<v-card-title v-if="this.userData.id !== undefined">
		  Изменение пользователя
		</v-card-title>
		<v-card-title v-else>
		  Добавление нового пользователя
		</v-card-title>

		<v-card-text>
		  <input type="hidden" name="status" value="1">
		  <input type="hidden" name="role" value="2">

		  <v-text-field
			  v-model="user.presentation"
			  label="Имя"
			  name="presentation"
			  outlined dense
			  hint="Как его будут видеть другие пользователи"
			  :rules="[r.required(), r.minLength(5)]"
		  />

		  <v-text-field
			  v-model="user.login"
			  label="Логин"
			  name="login"
			  outlined dense
			  :rules="[r.required(), r.minLength(5)]"
		  />

		  <v-text-field v-if="this.userData.id !== undefined"
			  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
			  v-model="user.password"
			  label="Пароль"
			  name="password"
			  outlined dense
			  :type="show1 ? 'text' : 'password'"
			  @click:append="show1 = !show1"
		  />
		  <v-text-field v-else
			  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
			  v-model="user.password"
			  label="Пароль"
			  name="password"
			  outlined dense
			  :rules="[r.password()]"
			  :type="show1 ? 'text' : 'password'"
			  @click:append="show1 = !show1"
		  />

		  <v-text-field
			  v-model="user.email"
			  label="Email"
			  name="email"
			  outlined dense
			  :rules="[]"
		  />

		  <v-text-field
			  v-model="user.phone"
			  label="Номер телефона"
			  name="phone"
			  outlined dense
			  :rules="[]"
		  />
		</v-card-text>

		<v-card-actions>
		  <v-spacer/>
		  <v-btn type="submit" text color="primary" :disabled="!form.valid" v-if="this.userData.id === undefined">
			Добавить
		  </v-btn>
		  <v-btn type="submit" text color="primary" :disabled="!form.valid" v-else>
			Сохранить
		  </v-btn>
		</v-card-actions>
	  </v-form>
	</v-card>
  </v-dialog>
</template>

<script>
import {mapActions} from "vuex";
import {User} from "../../models/models";
import {required, password, minLength} from "../../utils/rules";

export default {
  name: "user-dialog",
  props: {
    userData: {
      type: Object,
	  data: new User(),
	  default() {
	    return{}
	  }
	}
  },
  data() {
	return {
	  dialog: false,
	  form: {
		valid: false,
	  },
	  user: this.userData,
	  r: { required, password, minLength },
	  show1: false,
	}
  },
  methods: {
	...mapActions({
	  addUser: 'users/addUser'
	})
  },
  mounted() {
	  this.user.password = "";
  }
}
</script>

<style scoped>

</style>
