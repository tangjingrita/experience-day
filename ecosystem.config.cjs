module.exports = {
	apps: [{
		name: 'experience-day',
		port: '3002',
		exec_mode: 'cluster',
		instances: 'max',
		script: '/home/nuxt/experience-day/.output/server/index.mjs'
	}]
}


