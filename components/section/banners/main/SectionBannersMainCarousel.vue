<script setup>
const config = useRuntimeConfig()
const bannersStore = useBanners().banners
const bannerCode = 'main_page_carousel'
</script>

<template>
  <n-carousel
      autoplay
      :interval="10000"
      show-arrow
  >
    <div v-for="(item, index) in bannersStore[bannerCode]" :key="index">
      <div class="banner-wrapper">
        <div
            class="banner"
            @click="navigateTo(item.url)"
        >
          <h2 class="banner-title">{{ item.title }}</h2>

          <img
              :src="config.public.filesUrl + item.image_path"
              class="banner-image"
              alt="Banner"
          />

          <p class="banner-description">{{ item.short_description }}</p>
        </div>
      </div>
    </div>
  </n-carousel>
</template>

<style scoped>

</style>