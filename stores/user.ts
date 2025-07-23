import { defineStore } from 'pinia'
import type { SessionData } from '#auth'
import type { UserStoreInterface } from '~/interfaces/user'

export const useUser = defineStore('user', {
    state: (): { user: UserStoreInterface } => ({
        user: {
            email: 'public',
            name: 'guest',
        },
    }),
  getters: {
    get: (): SessionData => <SessionData>useAuth().data?.value ?? { email: 'public', role: 'guest' },
  },
  actions: {

    }

})
