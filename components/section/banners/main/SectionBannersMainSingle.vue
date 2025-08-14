<script setup>
const config = useRuntimeConfig()
const bannersStore = useBanners().banners
const bannerCode = 'daily_dish'
const item =  bannersStore[bannerCode][0]

</script>

<template>

    <div>
      <a
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="banner"
      >
        <div
            class="banner"
        >
          <h2 class="banner-title">{{ item.title }}</h2>

          <img
              :src="config.public.filesUrl + item.image_path"
              class="banner-image"
              alt="Banner"
          />

          <p class="banner-description">{{ item.short_description }}</p>
        </div>
      </a>
    </div>
</template>

<style scoped>
</style>