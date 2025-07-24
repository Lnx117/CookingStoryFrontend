// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://api.host.local:8000'
    }
  },

  css: [
    '@/assets/styles/variables.scss',
  ],

  modules: [
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
  ],

  //автоматический импорт всего из папки store
  imports: {
    dirs: ['stores'],
  },

  components: {
    dirs: ['~/components'],
  },

  //автоимпорт defineStore
  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore'],
    ],
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },

  // @ts-ignore - Sidebase auth types
  auth: {
    globalAppMiddleware: {
      isEnabled: true,
    },
    baseURL: process.env.NUXT_PUBLIC_API_BASE || 'http://api.host.local:8000',
    provider: {
      //кастомные пути для sidebase
      pages: {
        login: '/authorization'
      },
      type: 'local',
      endpoints: {
        signIn: { path: '/api/auth/login', method: 'post' },
        signOut: { path: '/api/auth/logout', method: 'post' },
        signUp: { path: '/api/auth/register', method: 'post' },
        getSession: { path: '/api/auth/getSession', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/data/access_token',
        type: 'Bearer',
        maxAgeInSeconds: 14400,
        cookie: {
          name: 'auth.token',
          domain: 'host.local',
          sameSite: 'lax',
          secure: false
        }
      },
      sessionData: {
        name: '/data/user/name',
        email: '/data/user/email'
      }
    }
  },
})
