<script setup lang="ts">
import type {RecipeInterface} from "~/interfaces/recipes";

const user = useUser().get
const config = useRuntimeConfig()

const props = defineProps({
  recipes: {
    type: Array as PropType<RecipeInterface[]>,
    required: false,
    default: () => []
  }
})

</script>

<template>
  <div class="page-container recipes-page">
    <div
        class="cards"
        role="list"
        v-if="props.recipes"
    >
      <article
          v-for="recipe in props.recipes"
          :key="recipe.id"
          class="card"
      >
        <NuxtLink
            :to="`/my-recipe/get/${recipe.id}`"
            class="no-link-style"
        >
          <SectionRecipesListCard
            :recipe="recipe"
          />
        </NuxtLink>
      </article>
    </div>
    <div
        v-else
    >
      Рецептов пока что нет
    </div>
  </div>
</template>

<style scoped>

</style>
