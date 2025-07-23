declare module '#auth' {
  interface Session {
    accessToken?: string
    user: {
      id: string
      email: string
      name: string
    }
  }
}

declare module '@auth/core/types' {
  interface User {
    accessToken?: string
  }
}

// Расширение типов Nuxt конфигурации для Sidebase auth
declare module 'nuxt/schema' {
  interface NuxtConfig {
    auth?: any
  }
}

// Добавляем глобальные типы для useAuth
declare module '#app' {
  interface NuxtApp {
    $auth: any
  }
}

declare global {
  const useAuth: () => {
    signIn: (provider: string, options?: any) => Promise<any>
    signOut: (options?: any) => Promise<any>
    status: Ref<string>
    data: Ref<any>
    pending: Ref<boolean>
  }
} 