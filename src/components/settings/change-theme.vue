<template>
		<v-expansion-panels>
			<v-expansion-panel>
				<v-expansion-panel-header id="ThemeHeader">
					Изменить настройки темы
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<v-form ref="form" v-model="colorModel" @submit.prevent="submit">
						<v-container>
							<v-list-item>
								<v-row>
									<v-col>
										<v-color-picker v-model="color" hide-inputs></v-color-picker>
										<v-col cols="12" md="4">
											<v-sheet class="pa-4"
											>
												<pre>{{ showColor }}</pre>
											</v-sheet>
											<v-btn type="submit" :loading="loading.changing">
												Изменить
											</v-btn>
										</v-col>
									</v-col>
								</v-row>
							</v-list-item>
						</v-container>
					</v-form>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'


export default {
	name: "change-theme",

	computed: {
		...mapGetters({
			user: "auth/user"
		}),
		color: {
			get () {
				return this[this.type]
			},
			set (v) {
				this[this.type] = v
			},
		},
		showColor () {
			if (typeof this.color === 'string') return this.color

			return JSON.stringify(Object.keys(this.color).reduce((color, key) => {
				color[key] = Number(this.color[key].toFixed(2))
				return color
			}, {}), null, 2)
		},
	},
	data() {
		return {
			type: 'hex',
			hex: '#FF00FF',
			colorModel: true,
			loading: {
				changing: false
			}
		}
	},
	methods: {
		...mapActions({
			showSnackbar: "app/showSnackbar",
			changeThemeColor: "auth/changeThemeColor"
		}),
		submit() {
			const setColor = {
				'user_id' : this.user.id,
				'theme_color' : this.color
			}
			console.log(setColor, "SETCOLOR")

			this.loading.changing = true;

			this.changeThemeColor(setColor)
				.then(() => {
					this.showSnackbar({
						text: 'Цвет темы успешно изменён',
						color: 'green'
					})
				})
				.catch(e => {
					this.showSnackbar(e)
				})
				.finally(() => {
					this.loading.changing = false
				})
		},
	},
}
</script>

<style scoped>
.v-expansion-panel {
	background: none !important;
}
.v-expansion-panels {
	z-index: unset !important;
}
#ThemeHeader {
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	font-size: 1.25rem;
	font-weight: 500;
	letter-spacing: 0.0125em;
	line-height: 2rem;
	word-break: break-all;
	padding: 16px 20px !important;
}
</style>
