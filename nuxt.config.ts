// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: ["@nuxt/fonts", "@nuxt/image", "@vueuse/nuxt"],
	css: ["@/assets/css/main.css"],
	nitro: {
		storage: {
			image: {
				driver: "fs",
				base: "./.data/image",
			},
			config: {
				driver: "memory",
			},
		},
	},
	image: {
		dir: ".data/image",
	},
});
