<script setup>
const config = useRuntimeConfig()
const bannersStore = useBanners().banners
const bannerCode = 'daily_dish'
const bannerItems = bannersStore[bannerCode]
const item = bannerItems && bannerItems.length > 0 ? bannerItems[0] : null

</script>

<template>
  <div v-if="item">
    <a
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="banner"
    >
      <div class="banner">
        <h2 class="banner-title">{{ item.title }}</h2>

        <img
            :src="config.public.filesUrl + item.image_path"
            :alt="item.title"
            class="banner-image"
        />

        <p class="banner-description">{{ item.short_description }}</p>
      </div>
    </a>
  </div>

  <!-- Fallback если данных нет -->
  <div v-else class="banner-placeholder">
    <p>Баннер временно недоступен</p>
  </div>
</template>

<style scoped>
</style>