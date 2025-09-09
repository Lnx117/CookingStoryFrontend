<script setup lang="ts">
import type {RecipeInterface} from "~/interfaces/recipes";

const config = useRuntimeConfig()

const props = defineProps({
  recipe: {
    type: Object as PropType<RecipeInterface>,
    required: false,
    default: () => []
  }
})

// Правильный способ - импортировать изображение
import placeholderImage from '@/assets/images/recipe-placeholder.png'

const getImageUrl = (preview?: string | null) => {
  if (preview && preview.trim() !== "") {
    return config.public.filesUrl + preview
  }
  return placeholderImage // здесь будет корректный URL
}
</script>

<template>
    <div class="image-wrap">
      <img
          class="image"
          :src="getImageUrl(recipe.preview_image)"
          :alt="recipe.title || 'recipe preview'"
          loading="lazy"
          decoding="async"
      />
    </div>
    <h3 class="title">{{ recipe.title }}</h3>
</template>