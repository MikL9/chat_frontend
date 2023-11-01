export default [
	{
		path: '/',
		redirect: { name: 'messenger' }
	},
	{
		path: '/messenger',
		name: 'messenger',
		component: () => import('../views/messenger'),
		meta: {
			sidebar: {
				name: 'Чаты',
				icon: 'mdi-chat-outline'
			},
			auth: true,
		}
	},
]
