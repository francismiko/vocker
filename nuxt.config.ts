export default defineNuxtConfig({
	typescript: {
		shim: false,
	},
	devServer: {
		host: "0.0.0.0",
		port: 3000,
	},
	modules: [
		"@element-plus/nuxt",
		"@nuxtjs/tailwindcss",
		"@nuxt/image",
		"dayjs-nuxt",
		"nuxt-lodash",
		"nuxt-icon",
	],
	dayjs: {
		locales: ["zh-cn", "en"],
		defaultLocale: "zh-cn",
	},
});
