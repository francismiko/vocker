export default defineNuxtConfig({
	app: {
		head: {
			link: [
				{
					rel: "stylesheet",
					href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
					integrity:
						"sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn",
					crossorigin: "anonymous",
				},
			],
		},
	},
	typescript: {
		shim: false,
	},
	devServer: {
		host: "0.0.0.0",
		port: 3000,
	},
	runtimeConfig: {
		public: {
			openAi: {
				secretKey: process.env.NUXT_OPEN_AI_SECRET_KEY,
				proxyUrl: process.env.NUXT_OPENAI_API_PROXY_URL,
			},
		},
	},
	modules: [
		"@element-plus/nuxt",
		"@nuxtjs/tailwindcss",
		"@nuxt/image",
		"dayjs-nuxt",
		"nuxt-lodash",
		"nuxt-icon",
		"@vueuse/nuxt",
	],
	dayjs: {
		locales: ["zh-cn", "en"],
		defaultLocale: "zh-cn",
	},
});
