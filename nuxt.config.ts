// https://nuxt.com/docs/api/configuration/nuxt-config
let gtmId = process.env.GTM_ID;
let useProxy = process.env.USE_PROXY;
let baseURL4Server =  process.env.BASE_URL;
let baseURL4Proxy =  process.env.BASE_URL_PROXY;
console.info("useProxy---------------------",useProxy);
console.info("gtmId---------------------",gtmId);
console.info("baseURL4Server---------------------",baseURL4Server);
console.info("baseURL4Proxy---------------------",baseURL4Proxy);
export default defineNuxtConfig({
  css: ['~/assets/css/common.scss'],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
     baseURL: '/experience-day/',
    head:
    {
   script: [
     {
       hid: 'gtmHead',
       innerHTML: `
       (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','`+gtmId+`');`,
     },
     ],
    noscript: [{
   innerHTML: `
     <iframe src="https://www.googletagmanager.com/ns.html?id=`+gtmId+`"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
   },]
    }
   },
 //運行時的全局變量
 runtimeConfig:
 {
   //只能在服務端期獲取
   count: 1,
   //服務端客戶端都可以獲取
   public:
   {
     baseURL4Server: baseURL4Server,
     baseURL4Proxy:baseURL4Proxy,
   }
 },
 //初始化樣式
 //css:["~/assets/css/base.scss"],
 //css: ['swiper/css/swiper.css'],
 //plugins: ['@/plugins/vue-swiper'],
 // imports: {
  //   autoImport: true
 //  },
 //使用樣式變量
 vite:
 {
  server:  useProxy
	    ?{
		open: true,
		proxy: {
			// 代理路径
			'/xapi': {
				// 目标地址
				target: 'http://192.168.199.44:8080/x',
				// 是否改变请求的源地址，这里设置为 true，表示强制使用绝对路径
				changeOrigin: true,
				// 路径重写规则，这里将 /api 开头的请求路径替换为空字符串，即去掉 /api 前缀
				rewrite: (path) => path.replace(/^\/xapi/, '')
			},
		}
	}: {},
   css:
   {
     preprocessorOptions:
     {
       scss:
       {
         additionalData: '@use "@/assets/css/global.scss" as *;'
       }
     }
   }
 },
 build:
 {
  transpile: ['pinia-plugin-persistedstate']
 },
 // build modules
 modules: [
   '@element-plus/nuxt',
   '@pinia/nuxt',
   '@pinia-plugin-persistedstate/nuxt',
 ], 
// elementPlus:{},
  routeRules: {
     // 为了SEO目的，在构建时生成
     '/': { prerender: true },
     // 缓存1小时
    // '/api/*': { cache: { maxAge: 60 * 60 } },
     // 重定向以避免404
     '/old-page': {
       redirect: { to:  '/new-page', statusCode: 302 }
     }
   },
  
   
})

