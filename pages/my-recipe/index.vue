<script setup lang="ts">
import type {RecipeListResponse} from "~/interfaces/responses";
import {GET_USER_RECIPES} from "~/interfaces/routes";

const user = useUser().get
const currentPage = ref(1)

const { data: response, refresh } = await useCookApi<RecipeListResponse>(
    GET_USER_RECIPES + user.id,
    {
      params: {
        page: currentPage,
        per_page: 15,
      }
    }
)

const recipes = computed(() => response.value?.data?.data || [])
const pagination = computed(() => response.value?.data || null)

watch(currentPage, () => {
  refresh()
})

</script>

<template>
  <SectionRecipesListTitle />
  <SectionRecipesListIndex
    :recipes="recipes"
  />
  <div
      style="display: flex; align-items: center; justify-content: center; flex-direction: column;"
  >
    <UIPagination
        v-if="pagination?.last_page && pagination?.last_page > 1"
        v-model="currentPage"
        :page-count="pagination?.last_page || 1"
    />
  </div>
</template>

