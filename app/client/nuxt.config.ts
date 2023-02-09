export default defineNuxtConfig({
	// My Nuxt config
	modules: ['@nuxtjs/apollo'],

	apollo: {
		clients: {
			default: {
				httpEndpoint: 'http://localhost:8000/',
			},
		},
	},
	css: ['~/assets/css/main.css'],

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
