<script setup lang="ts">
// Логика для кнопки будет здесь
const handleAddRecipe = () => {
  // Навигация или открытие модального окна
  console.log('Добавить рецепт')
}
</script>

<template>
  <div class="recipes-list_title_container">
    <h1 class="title">Мои рецепты</h1>
    <NuxtLink to="/my-recipe/create-recipe">
      <n-button
          type="primary"
          :bordered="false"
          color="#4CAF50"
          size="large"
      >
        Добавить рецепт
      </n-button>
    </NuxtLink>
  </div>
</template>

<style scoped>




/* Адаптивность для мобильных устройств */

</style>