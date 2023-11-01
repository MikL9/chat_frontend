<template>
  <base-settings-row-content name="Изменить пароль">
    <v-form ref="form" v-model="valid" @submit.prevent="submit">
      <input type="hidden" name="id" :value="user.id">
      <v-text-field v-model="password.model" label="Новый пароль" name="password" outlined dense
                    :rules="password.rules"/>
      <v-text-field v-model="confirm.model" label="Повторите пароль" name="confirm" outlined dense
                    :rules="password.rules.concat(confirm.rules)"/>
      <div class="d-flex">
        <v-spacer/>
        <v-btn type="submit" :disabled="!valid || password.model !== confirm.model" :loading="loading.changing">
          Изменить
        </v-btn>
      </div>
    </v-form>
  </base-settings-row-content>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import BaseSettingsRowContent from "./base-settings-row-content";

export default {
  name: "change-password",
  components: {BaseSettingsRowContent},
  computed: {
    ...mapGetters({
      user: "auth/user"
    })
  },
  data() {
    return {
      valid: false,
      password: {
        model: '',
        rules: [
          v => !!v || 'Введите пароль',
          v => v && v.length >= 6 || 'Минимум 6 символов'
        ]
      },
      confirm: {
        model: '',
        rules: [
          v => !!v || 'Повторите пароль',
          v => v === this.password.model || 'Пароли не совпадают'
        ]
      },
      loading: {
        changing: false
      }
    }
  },
  methods: {
    ...mapActions({
      showSnackbar: "app/showSnackbar",
      changePassword: "auth/changePassword"
    }),
    submit(e) {
      const formData = new FormData(e.target);

      formData.set('password', btoa(formData.get('password')));
      formData.set('confirm', btoa(formData.get('confirm')));

      this.loading.changing = true;

      this.changePassword(formData)
          .then(() => {
            this.showSnackbar({
              text: 'Пароль успешно изменён',
              color: 'green'
            })
          })
          .catch(e => {
            this.showSnackbar(e)
          })
          .finally(() => {
            this.loading.changing = false
          })
    }
  }
}
</script>

<style scoped>

</style>
