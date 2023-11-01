export default {
	install(Vue) {
		Vue.prototype.$locale = window.navigator.language
	}
}
