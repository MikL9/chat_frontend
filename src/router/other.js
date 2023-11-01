export default [
	{
		path: '/users',
		name: 'users',
		component: () => import('../views/users'),
		meta: {
			sidebar: {
				name: 'Пользователи',
				icon: 'mdi-account'
			},
			auth: {
				roles: [1]
			},
		}
	},
	{
		path: '/settings',
		name: 'settings',
		component: () => import('../views/settings'),
		meta: {
			sidebar: {
				name: 'Настройки',
				icon: 'mdi-cog-outline'
			},
			auth: true,
		}
	},
]
