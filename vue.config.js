module.exports = {
	transpileDependencies: [
		'vuetify'
	],
	devServer: {
		proxy: {
			'^/api': {
				target: 'http://localhost:8989',
				pathRewrite: { '^/api': '' },
				ws: true,
				changeOrigin: true
			}
		}
	},
	productionSourceMap: false,
}
