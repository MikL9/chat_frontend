import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

import colors from 'vuetify/lib/util/colors'

export default new Vuetify({
	theme: {
		options: {
			customProperties: true
		},
		themes: {
			dark: {
				primary: colors.indigo.base,
				secondary: colors.blueGrey.base,
				accent: colors.purple.base,
				error: colors.red.base,
				warning: colors.orange.base,
				info: colors.blue.base,
				success: colors.green.base,
			},
			light: {
				primary: colors.indigo.base,
				secondary: colors.blueGrey.base,
				accent: colors.purple.base,
				error: colors.red.base,
				warning: colors.orange.base,
				info: colors.blue.base,
				success: colors.green.base,
			}
		},
	}
});
