<script setup lang="ts">
import type {RecipeResponse} from "~/interfaces/responses";
import type {RecipeInterface} from "~/interfaces/recipes";
import {UPDATE_RECIPE_BY_ID, GET_RECIPE_BY_ID} from "~/interfaces/routes";
import SectionRecipesEditTitle from "~/components/section/recipes/Edit/SectionRecipesEditTitle.vue";
import SectionRecipesEditIndex from "~/components/section/recipes/Edit/SectionRecipesEditIndex.vue";
import {useCookApi} from "~/composables/useCookApi";
import {useLoadingBar, useNotification} from "naive-ui";

const route = useRoute()
const recipeId = route.params.id
const notification = useNotification()
const loadingBar = useLoadingBar()
const router = useRouter();

const user = useUser().get

const { data: response, refresh } = await useCookApi<RecipeResponse>(
    GET_RECIPE_BY_ID + recipeId,
)

const recipe = computed(() => response.value?.data || null)

function onSubmit (formData: any) {
  loadingBar.start()
  sendForm(formData)
      .then((response) => {
        console.log(response);
        loadingBar.finish()
        notification.success({
          title: 'Добавление рецепта',
          content: 'Ваш рецепт успешно добавлен и отправлен на модерацию!',
          duration: 5000,
        })
        router.push('/my-recipe');
      })
      .catch((error) => {
        let message = error?.message;

        notification.error({
          title: 'Добавление рецепта',
          content: message,
          duration: 5000,
        })
      })
}

async function sendForm(formData: any): Promise<any> {
  const fd = new FormData()

  fd.append('id', recipeId)
  fd.append('title', formData.title)
  fd.append('description', formData.description ?? '')
  fd.append('servings', String(formData.servings))
  if (formData.cooking_time) fd.append('cooking_time', String(formData.cooking_time))
  fd.append('is_published', String(formData.is_published ?? false))

  if (formData.preview_image) {
    fd.append('preview_image', formData.preview_image)
  }

  // ингредиенты
  formData.ingredients.forEach((ing: any, idx: number) => {
    fd.append(`ingredients[${idx}][id]`, String(ing.id))
    fd.append(`ingredients[${idx}][weight_grams]`, String(ing.weight_grams))
  })

  // шаги
  formData.steps.forEach((step: any, idx: number) => {
    fd.append(`steps[${idx}][step_number]`, String(step.step_number))
    fd.append(`steps[${idx}][description]`, step.description)
    if (step.image) {
      fd.append(`steps[${idx}][image]`, step.image)
    }
  })

  // теги
  formData.tags?.forEach((tag: number, idx: number) => {
    fd.append(`tags[${idx}]`, String(tag))
  })

  return new Promise((resolve, reject) => {
    useCookApi<any>(UPDATE_RECIPE_BY_ID, {
      method: 'post',
      body: fd,
      onResponseError({ response }) {
        reject(response._data)
      },
    }).then(({ data }) => {
      if (data.value) {
        resolve(data.value)
      }
    }).catch((error) => reject(error))
  })
}

</script>

<template>
  <SectionRecipesEditIndex
      :recipe="recipe"
      @on-submit="onSubmit"
  />
</template>