export default [
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/login'),
	},
	{
		path: '*',
		name: 'not-found',
		component: () => import('../views/not-found')
	}
]
