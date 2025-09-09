<script setup lang="ts">
import type {RecipeResponse} from "~/interfaces/responses";

import {GET_RECIPE_BY_ID} from "~/interfaces/routes";
import {useCookApi} from "~/composables/useCookApi";
import SectionRecipesGetIndex from "~/components/section/recipes/get/SectionRecipesGetIndex.vue";

const route = useRoute()
const recipeId = route.params.id

const { data: response, refresh } = await useCookApi<RecipeResponse>(
    GET_RECIPE_BY_ID + recipeId,
)

const recipe = computed(() => response.value?.data || null)

</script>

<template>
  <SectionRecipesGetIndex
      :recipe="recipe"
  />
</template>