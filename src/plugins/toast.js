import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import '../sass/toastify.scss'

const showToast = (settings = {}, options = {}) => {
	Toastify({
		...settings,
		...options,
	}).showToast()
}

export default {
	install(Vue, settings = {}) {
		Vue.prototype.$toast = function (options = {}) {
			showToast(settings, options)
		}

		Vue.toast = function (options = {}) {
			showToast(settings, options)
		}
	}
}
