import {useBanners} from "~/stores/banners";

export default defineNuxtPlugin(async (nuxtApp) => {
    const bannersStore = useBanners()

    if (bannersStore.banners && bannersStore.banners.length > 0) {
        return
    }

    await bannersStore.fetchBanners()
})
