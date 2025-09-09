<script setup lang="ts">

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="recipes-list_title_container">
    <h1 class="title">Новый рецепт</h1>
    <NuxtLink @click="goBack">
      <n-button
          type="primary"
          :bordered="false"
          color="#4CAF50"
          size="large"
      >
        Вернуться назад
      </n-button>
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>