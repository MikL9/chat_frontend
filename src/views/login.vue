<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="auto">
				<v-card width="600">
					<v-card-title>
						Вход
					</v-card-title>
					<v-card-text>
						<v-form id="login-form" v-model="valid" @submit.prevent="authRequest">
							<v-text-field
									name="login"
									label="Логин"
									:rules="[r.required()]"
							/>
							<v-text-field
									name="password"
									label="Пароль"
									type="password"
									:rules="[r.required()]"
							/>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer/>
						<v-btn
								type="submit"
								form="login-form"
								class="primary px-5"
								:disabled="!valid"
								:loading="loading"
								depressed
						>
							Войти
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
    import {required} from "../utils/rules";
	import websocket from "../utils/websocket/websocket";

    export default {
        name: "login",
        data() {
            return {
                r: {required},
				valid: false,
				loading: false
            }
        },
        methods: {
            async authRequest(e) {
				try {
					this.loading = true
					const credentials = new FormData(e.target)
					await this.$store.dispatch("auth/login", credentials)
					await this.$router.push('/messenger')

					if(this.$store.getters['app/ENV'] === 'production')
						websocket().connect()
				} finally {
					this.loading = false
				}
            },
        }
	}
</script>

<style scoped>

</style>
