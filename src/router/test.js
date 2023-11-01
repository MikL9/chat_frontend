export default [
	{
		path: '/test',
		name: 'test',
		component: () => import('../views/test'),
		meta: {
			sidebar: {
				name: 'Тест',
				icon: 'mdi-test-tube'
			}
		}
	},
]
