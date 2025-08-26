<script setup lang="ts">
import type { RecipeListResponse } from "~/interfaces/responses";
import { GET_USER_RECIPES } from "~/interfaces/routes";

const user = useUser().get
const config = useRuntimeConfig()

const { data: response } = await useCookApi<RecipeListResponse>(GET_USER_RECIPES + user.id)

const recipes = response.value?.data?.data || []
const pagination = response.value?.data || null

// Resolve placeholder from /assets/images/recipe-placeholder.png
// Nuxt 3 helper that returns a public URL to an /assets resource
const placeholderImage = "/images/recipe-placeholder.png"

const getImageUrl = (preview?: string | null) => {
  if (preview && preview.trim() !== "") {
    return config.public.filesUrl + preview
  }
  return placeholderImage
}
</script>

<template>
  <div class="page-container recipes-page">
    <div class="cards" role="list">
      <article
          v-for="recipe in recipes"
          :key="recipe.id"
          class="card"
          role="listitem"
      >
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
      </article>
    </div>
  </div>
</template>

<style scoped>

</style>
