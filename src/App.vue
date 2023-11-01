<template>
	<v-app id="inspire">
		<v-app-bar class="primary"
				   dark app>

			<v-app-bar-nav-icon v-if="$route.name !== 'login'" @click="openDrawer()"/>

			<v-toolbar-title>
				<span v-if="$route.name === 'messenger'">{{currentChat.name}}</span>
				<span v-else>{{$route.meta.label}}</span>
			</v-toolbar-title>

			<v-spacer/>

			<v-btn v-if="ENV !== 'production' && $route.name !== 'login'" icon @click="connectWS">
				<v-icon :color="connected ? 'green' :'red'">{{ connected ? 'mdi-lan-connect' : 'mdi-lan-disconnect' }}</v-icon>
			</v-btn>

			<v-btn v-if="$route.name !== 'login'" icon @click="logoutRequest">
				<v-icon>mdi-logout</v-icon>
			</v-btn>
		</v-app-bar>

		<v-navigation-drawer v-model="drawer" absolute temporary id="app_drawer">
			<v-card-title>
				Меню
				<div class="darkThemeActivator">
				  <v-btn  v-if="$vuetify.theme.dark"
						  icon @click="changeTheme(false)"><v-icon>mdi-white-balance-sunny</v-icon></v-btn>
				  <v-btn  v-else
						  icon @click="changeTheme(true)"><v-icon>mdi-weather-night</v-icon></v-btn>
				</div>
			</v-card-title>

			<v-list nav>
				<v-list-item
						v-for="route in sidebarRoutes"
						:key="route.path"
						link :to="route.path"
				>
					<v-list-item-icon>
						<v-icon>{{route.meta.sidebar.icon}}</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>
							{{route.meta.sidebar.name}}
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-main>
			<router-view/>
		</v-main>

		<v-snackbar
				vertical
				v-model="snackbar.model"
				:color="snackbar.color"
				:timeout="snackbar.timeout"
				:right="snackbar.right"
		>
			{{snackbar.text}}
		</v-snackbar>
	</v-app>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'
	import websocket from "./utils/websocket/websocket";

	export default {
		name: "App",
		computed: {
			...mapGetters({
				currentChat: "chats/currentChat",
				user: "auth/user",
				snackbar: "app/snackbar",
				ENV: 'app/ENV'
			}),
			sidebarRoutes() {
				return this.$router.getRoutes().filter(r => {
					const sidebar = r.meta.sidebar

					const authorized = typeof r.meta.auth === 'object' ?
						r.meta.auth.roles.includes(this.user.role) :
						true

					return sidebar && authorized
				})
			}
		},
		data() {
		    return {
		  		drawer: false,
				connected: false
			}
		},
		methods: {
			...mapActions({
				logout: "auth/logout",
				changeUserTheme: "auth/changeTheme"
			}),
			testClick() {
				console.log('clicked')
			},
			async logoutRequest() {
				await this.logout()
				await this.$router.push('/login')

				if(this.$store.getters['app/ENV'] === 'production')
					websocket().disconnect()
			},
			connectWS() {
				if (websocket().connected()) {
					websocket().disconnect()
					this.connected = false
				} else {
					websocket().connect()
					this.connected = true
				}
			},
			async changeTheme(v) {
				if(v === true) {
					this.user.theme = 1;
				} else this.user.theme = 0;
				await this.changeUserTheme(this.user)
				this.$vuetify.theme.dark = v;
			},
			openDrawer() {
			  this.drawer = true
			  let top = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
			  if (top > 0)
			    document.getElementById("app_drawer").style.top = top + 'px'
			}
		},
		mounted() {
			if(this.ENV === 'production' && !window.location.href.includes('/login')) {
				this.connectWS()
			}
		},
		updated() {
			if(this.user.id === undefined && !window.location.href.includes('/login')) {
				location.reload()
			} else {
				this.$vuetify.theme.dark = this.user.theme === 1;
				if(this.user.theme_color !== null && this.user.theme_color !== undefined) {
					this.$vuetify.theme.themes.dark.primary = this.user.theme_color
					this.$vuetify.theme.themes.light.primary = this.user.theme_color
				}
			}
			if(this.drawer === false) {
			  document.getElementById("app_drawer").style.top = '0px'
			}
		}
	}
</script>

<style>
.darkThemeActivator {
	margin-left: 5px;
}
html {
	overflow: auto !important; /* Hide scrollbars */
}
/* width */
::-webkit-scrollbar {
	background:transparent;
	width: 5px;
}
/* Handle */
::-webkit-scrollbar-thumb {
	background: rgba(70, 70, 70, 0.8);
}
::-webkit-scrollbar-thumb:hover {
	background: #837c7c;
}
</style>
