<script setup>

const bannersStore = useBanners().banners

const items = [
  {
    title: "Распродажа",
    description: "Скидки до 70% на всё",
    image: 'http://localhost:9000/files/' + bannersStore.salads[0].image_path,
    link: "/sale"
  },
  {
    title: "Новая коллекция",
    description: "Успейте купить первыми",
    image: 'http://localhost:9000/files/' + bannersStore.salads[1].image_path,
    link: "/new"
  },
];
</script>

<template>
  <n-carousel autoplay :interval="3000" show-arrow>
    <n-slide v-for="(item, index) in items" :key="index">
      <div
          class="banner"
          @click="navigateTo(item.link)"
      >
        <!-- Заголовок (верх) -->
        <h2 class="banner-title">{{ item.title }}</h2>

        <!-- Фоновая картинка -->
        <img
            :src="item.image"
            class="banner-image"
            alt="Banner"
        />

        <!-- Описание (низ) -->
        <p class="banner-description">{{ item.description }}</p>
      </div>
    </n-slide>
  </n-carousel>
</template>

<style scoped>
.banner {
  position: relative;
  height: 300px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.banner-title {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 2rem;
  z-index: 2;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.banner-description {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 1.2rem;
  z-index: 2;
  padding: 0 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}
</style>