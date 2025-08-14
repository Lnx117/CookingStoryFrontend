import { defineStore } from 'pinia'
import type { BannerInterface } from '~/interfaces/banners'
import type { BannersResponse } from '~/interfaces/responses'
import { GET_BANNERS } from '~/interfaces/routes'

export const useBanners = defineStore('banners', {
    state: (): { banners: BannerInterface[] } => ({
        banners: [],
    }),

    getters: {
        getBanners: (state) => state.banners,
        getBannerById: (state) => (id: number) =>
            state.banners.find((banner) => banner.id === id) ?? null,
    },

    actions: {
        async fetchBanners() {
            try {
                const { data } = await useCookApi<BannersResponse>(GET_BANNERS, {
                    method: 'get',
                })

                if (data.value?.data) {
                    this.banners = data.value.data
                } else {
                    this.banners = []
                }
            } catch (error) {
                console.error('Ошибка загрузки баннеров:', error)
                this.banners = []
            }
        },
    },
})
