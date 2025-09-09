<script setup lang="ts">
import { useForm, useField, useFieldArray } from 'vee-validate'
import * as yup from 'yup'
import type {StepField, IngredientField, RecipeInterface} from "~/interfaces/recipes";
import {CREATE_RECIPE, FIND_RECIPE_INGREDIENTS} from "~/interfaces/routes";
import type { UploadFileInfo } from 'naive-ui';
import { useDebounceFn } from "@vueuse/core"
import type { SelectOption } from "naive-ui"
import {useCookApi} from "~/composables/useCookApi";
import SectionRecipesEditTitle from "~/components/section/recipes/Edit/SectionRecipesEditTitle.vue";

const props = defineProps({
  recipe: {
    type: Object as PropType<RecipeInterface>,
    required: false,
  },
})

let initOptions = ref(
    props.recipe?.ingredients
        ? props.recipe.ingredients.map((ingredient: IngredientField) => ({
          label: ingredient.name_ru,
          value: ingredient.id
        }))
        : []
)
const config = useRuntimeConfig()
const searchIngredientOptions = ref<SelectOption[]>([])

const ingredientOptions = computed(() => {
  return [...initOptions.value, ...searchIngredientOptions.value]
})

const previewFileList = ref<UploadFileInfo[]>([])

onMounted(() => {
  initOptions.value = []

  if (props.recipe?.preview_image) {
    previewFileList.value = [
      {
        id: 'preview',
        name: 'preview.jpg',
        status: 'finished',
        url: config.public.filesUrl + props.recipe.preview_image
      }
    ]
  }

  if (props.recipe?.steps) {
    props.recipe.steps.forEach((step, idx) => {
      if (step.image) {
        stepFileLists.value[idx] = [
          {
            id: `step-${idx}`,
            name: `step-${idx}.jpg`,
            status: 'finished',
            url: config.public.filesUrl + step.image // абсолютная ссылка
          }
        ]
      } else {
        stepFileLists.value[idx] = []
      }
    })
  }
})

const stepFileLists = ref<Record<number, UploadFileInfo[]>>({})

// при загрузке файла
function handleStepUpload(
    idx: number,
    step: { value: StepField },
    options: { file: UploadFileInfo; fileList: UploadFileInfo[] }
) {
  step.value.image = options.file.file as File ?? null
  stepFileLists.value[idx] = options.fileList
}

// при удалении файла
function handleStepRemove(idx: number, step: { value: StepField }) {
  step.value.image = null
  stepFileLists.value[idx] = []
}

const loadingIngredients = ref(false)

const emit = defineEmits(['onSubmit'])

const schema = yup.object({
  id: yup.number().nullable(),
  title: yup.string()
      .required('Название обязательно')
      .max(255, 'Максимальная длина 255 символов'),

  description: yup.string().nullable(),

  preview_image: yup.mixed<File | string>().nullable()
      .test('fileSize', 'Файл слишком большой (макс. 2 МБ)', (value) => {
        if (!value) return true
        if (typeof value === 'string') return true
        return value.size <= 2 * 1024 * 1024
      })
      .test('fileType', 'Неверный формат', (value) => {
        if (!value) return true
        if (typeof value === 'string') return true
        return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type)
      }),

  servings: yup.number()
      .required('Укажите количество порций')
      .min(1, 'Минимум 1'),

  cooking_time: yup.number()
      .nullable()
      .min(1, 'Минимум 1 минута'),

  is_published: yup.boolean().default(false),

  ingredients: yup.array().of(
      yup.object({
        id: yup.number().required('Выберите ингредиент'),
        weight_grams: yup.number().required('Укажите вес').min(1, 'Минимум 1 г')
      })
  ).min(1, 'Добавьте хотя бы один ингредиент'),

  steps: yup.array().of(
      yup.object({
        step_number: yup.number().required().min(1, 'Минимум 1'),
        description: yup.string().required('Описание обязательно'),
        image: yup.mixed<File | string>().nullable()
            .test('fileSize', 'Файл слишком большой (макс. 2 МБ)', (value) => {
              if (!value) return true
              if (typeof value === 'string') return true // это URL с бэка, пропускаем
              return value.size <= 2 * 1024 * 1024
            })
            .test('fileType', 'Неверный формат', (value) => {
              if (!value) return true
              if (typeof value === 'string') return true // URL не проверяем
              return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type)
            }),
      })
  ).min(1, 'Добавьте хотя бы один шаг'),

  tags: yup.array().of(yup.number()).nullable()
})

//values и meta для того чтобы видеть статистику, что валидно, что нет и тд
const { handleSubmit, errors, values, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    id:  props.recipe?.id,
    title: props.recipe?.title ?? '',
    description: props.recipe?.description ?? '',
    preview_image: null as File | null,
    servings: props.recipe?.servings ?? 1,
    cooking_time: props.recipe?.cooking_time ?? null,
    is_published: false,
    ingredients: props.recipe?.ingredients
        ? props.recipe.ingredients.map(ing => ({
          id: ing.id,
          weight_grams: ing.pivot?.weight_grams ? Number(ing.pivot.weight_grams) : null,
          name_ru: ing.name_ru
        }))
        : [{ id: null, weight_grams: null, name_ru: '' }],
    steps: props.recipe?.steps ?? [
      { step_number: 1, description: '', image: null }
    ],
    tags: []
  }
})

const { value: id, errorMessage: idError, handleBlur: idBlur } = useField('id');
const { value: title, errorMessage: titleError, handleBlur: titleBlur } = useField('title');
const { value: description, errorMessage: descriptionError, handleBlur: descriptionBlur } = useField('description');
const { value: servings, errorMessage: servingsError, handleBlur: servingsBlur } = useField('servings');
const { value: cooking_time, errorMessage: cooking_timeError, handleBlur: cooking_timeBlur } = useField('cooking_time');
const { value: preview_image, errorMessage: preview_imageError, handleBlur: preview_imageBlur } =  useField<File | null>("preview_image")
const { fields: ingredientFields, push: addIngredient, remove: removeIngredient } = useFieldArray<IngredientField>('ingredients')
const { fields: stepFields, push: addStep, remove: removeStep } = useFieldArray<StepField>('steps')
const { fields: tagFields, push: addTag, remove: removeTag } = useFieldArray('tags')

//Нужно вызывать результат работы handleSubmit(проверяет валидацию перед вызовом)
const submitForm = handleSubmit(onSubmit)

async function onSubmit (formData: any) {
  emit('onSubmit', formData)
}

function handleUploadChange(options: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  preview_image.value = options.file.file as File ?? null
}

function handleUploadRemove() {
  preview_image.value = null
}

// // Коллбэк для on-change
// function handleStepUpload(
//     step: { value: StepField },
//     options: { file: UploadFileInfo }
// ) {
//   step.value.image = options.file.file as File ?? null
// }
//
// // Коллбэк для on-remove
// function handleStepRemove(step: { value: StepField }) {
//   step.value.image = null
// }

async function fetchIngredients(query: string) {
  if (!query) {
    searchIngredientOptions.value = []
    return
  }
  loadingIngredients.value = true
  try {
    const res = await useCookApi<any>(FIND_RECIPE_INGREDIENTS, {
      method: "GET",
      query: { q: query, limit: 10 }
    })
    searchIngredientOptions.value = res.data.value.data.map((item: any) => ({
      label: item.name,
      value: item.id
    }))
  } catch (e) {
    searchIngredientOptions.value = []
  } finally {
    loadingIngredients.value = false
  }
}

// дебаунсим на 1 сек
const handleIngredientSearch = useDebounceFn(fetchIngredients, 1000)
const handleIngredientSelect = () => {
  searchIngredientOptions.value = []
}

</script>

<template>
  <div class="page-container edit-recipe-page">


    <n-form @submit.prevent="submitForm" label-placement="top">
      <SectionRecipesEditTitle
          class="card"
      />
      <!-- Основная информация -->
      <n-card title="Основная информация" class="card">
        <div class="grid-basic">
          <n-form-item
              label="Название рецепта*"
              :feedback="errors.title"
              :validation-status="errors.title ? 'error' : undefined"
          >
            <n-input v-model:value="title" placeholder="Название рецепта*" />
          </n-form-item>

          <n-form-item
              label="Время приготовления (мин.)"
              :feedback="errors.cooking_time"
              :validation-status="errors.cooking_time ? 'error' : undefined"
          >
            <n-input-number v-model:value="cooking_time" :min="1" placeholder="Время приготовления" />
          </n-form-item>

          <n-form-item
              label="Количество порций*"
              :feedback="errors.servings"
              :validation-status="errors.servings ? 'error' : undefined"
          >
            <n-input-number v-model:value="servings" :min="1" placeholder="Количество порций" />
          </n-form-item>
        </div>

        <n-form-item
            label="Описание"
            :feedback="errors.description"
            :validation-status="errors.description ? 'error' : undefined"
        >
          <n-input
              v-model:value="description"
              type="textarea"
              rows="3"
              placeholder="Краткое описание рецепта"
          />
        </n-form-item>

        <n-form-item
            label="Изображение готового блюда*"
            :feedback="errors.preview_image"
            :validation-status="errors.preview_image ? 'error' : undefined"
        >
          <n-upload
              class="upload-preview"
              list-type="image-card"
              :max="1"
              accept="image/png, image/jpeg, image/webp"
              v-model:file-list="previewFileList"
              :on-change="handleUploadChange"
              :on-remove="handleUploadRemove"
          >
            Загрузить превью
          </n-upload>
        </n-form-item>
      </n-card>

      <!-- Ингредиенты -->
      <n-card title="Ингредиенты" class="card">
        {{ ingredientFields }}
        <div class="space-y-3">
          <div
              v-for="(ingredient, idx) in ingredientFields"
              :key="ingredient.key"
              class="ingredient-row"
          >
            <n-form-item
                label="Ингредиент*"
                :feedback="errors[`ingredients[${idx}].id`]"
                :validation-status="errors[`ingredients[${idx}].id`] ? 'error' : undefined"
            >
              <n-select
                  v-model:value="ingredient.value.id"
                  :options="ingredientOptions"
                  :loading="loadingIngredients"
                  filterable
                  remote
                  placeholder="Начните вводить название ингредиента"
                  @search="handleIngredientSearch"
                  @update:value="handleIngredientSelect"
              />
            </n-form-item>

            <n-form-item
                label="Вес (г)*"
                :feedback="errors[`ingredients[${idx}].weight_grams`]"
                :validation-status="errors[`ingredients[${idx}].weight_grams`] ? 'error' : undefined"
            >
              <n-input-number
                  v-model:value="ingredient.value.weight_grams"
                  placeholder="Вес (г)"
                  :min="1"
              />
            </n-form-item>

            <n-button size="small" type="error" ghost @click="removeIngredient(idx)">
              Удалить
            </n-button>
          </div>
        </div>

        <div class="actions">
          <n-button type="primary" ghost @click="addIngredient({ id: null, weight_grams: null, name_ru: '' })">
            Добавить ингредиент
          </n-button>
        </div>
      </n-card>

      <!-- Шаги -->
      <n-card title="Шаги приготовления" class="card">
        <div class="space-y-4">
          <n-card
              v-for="(step, idx) in stepFields"
              :key="step.key"
              size="small"
              class="step-card"
          >
            <div class="step-header">
              <span class="step-title">Шаг {{ idx + 1 }}</span>
              <n-button size="tiny" type="error" ghost @click="removeStep(idx)">Удалить</n-button>
            </div>

            <n-form-item
                label="Описание шага*"
                :feedback="errors[`steps[${idx}].description`]"
                :validation-status="errors[`steps[${idx}].description`] ? 'error' : undefined"
            >
              <n-input
                  v-model:value="step.value.description"
                  type="textarea"
                  rows="2"
                  placeholder="Опишите, что нужно сделать"
              />
            </n-form-item>

            <n-form-item
                label="Фото"
                :feedback="errors[`steps[${idx}].image`]"
                :validation-status="errors[`steps[${idx}].image`] ? 'error' : undefined"
            >
              <n-upload
                  class="upload-step"
                  list-type="image-card"
                  :max="1"
                  accept="image/png, image/jpeg, image/webp"
                  v-model:file-list="stepFileLists[idx]"
                  :on-change="(options) => handleStepUpload(idx, step, options)"
                  :on-remove="() => handleStepRemove(idx, step)"
              >
                Добавить фото
              </n-upload>
            </n-form-item>
          </n-card>
        </div>

        <div class="actions">
          <n-button type="primary" ghost @click="addStep({ step_number: stepFields.length + 1, description: '', image: null })">
            Добавить шаг
          </n-button>
        </div>
      </n-card>

      <!-- Сохранение -->
      <div class="form-actions">
        <n-button
            type="primary"
            attr-type="submit"
            size="large"
            color="#994b3a"
        >
          Сохранить рецепт
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<style scoped>

</style>
