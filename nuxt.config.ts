export default defineNuxtConfig({
	typescript: {
		shim: false,
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
