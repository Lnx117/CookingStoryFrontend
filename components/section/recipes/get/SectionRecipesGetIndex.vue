<script setup lang="ts">
import type {RecipeInterface} from "~/interfaces/recipes";

const props = defineProps({
  recipe: {
    type: Object as PropType<RecipeInterface>,
    required: true,
  },
})

const config = useRuntimeConfig()

</script>

<template>
  <div class="page-container read-recipe-page">
    <n-card :title="props.recipe.title" class="card">
      <div class="card-body">

        <!-- Шапка: изображение и описание -->
        <div class="recipe-header">
          <div class="recipe-image">
            <img :src="config.public.filesUrl + props.recipe.preview_image" alt="Готовое блюдо" />
          </div>
          <div class="recipe-description">
            <p>{{ props.recipe.description }}</p>
          </div>
        </div>

        <!-- Блоки информации -->
        <div class="recipe-info">
          <!-- Группа КБЖУ -->
          <div class="info-group kbzu">
            <div class="info-box">
              <span class="label">Калории</span>
              <span class="value">{{ props.recipe.calories_total }} ккал</span>
            </div>
            <div class="info-box">
              <span class="label">Белки</span>
              <span class="value">{{ props.recipe.proteins_total }} г</span>
            </div>
            <div class="info-box">
              <span class="label">Жиры</span>
              <span class="value">{{ props.recipe.fats_total }} г</span>
            </div>
            <div class="info-box">
              <span class="label">Углеводы</span>
              <span class="value">{{ props.recipe.carbs_total }} г</span>
            </div>
          </div>

          <!-- Группа Время/Порции -->
          <div class="info-group time-servings">
            <div class="info-box">
              <span class="label">Время</span>
              <span class="value">{{ props.recipe.cooking_time }} мин</span>
            </div>
            <div class="info-box">
              <span class="label">Порции</span>
              <span class="value">{{ props.recipe.servings }}</span>
            </div>
          </div>
        </div>

        <!-- Шаги приготовления -->
        <div class="recipe-steps">
          <div
              v-for="(step, index) in props.recipe.steps"
              :key="index"
              class="step"
          >
            <div v-if="step.image" class="step-image">
              <img :src="config.public.filesUrl + step.image" :alt="`Шаг ${index + 1}`" />
            </div>
            <div class="step-text">
              <h3>Шаг {{ index + 1 }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>

      </div>
    </n-card>
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px;
}

.card-body {
  padding: 24px;
}

/* Шапка: изображение и описание */
.recipe-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.recipe-header img {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  object-fit: cover;
}

.recipe-description p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
}

/* Блок информации */
.recipe-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

/* Группы */
.info-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.kbzu .info-box {
  flex: 1 1 calc(25% - 16px);
}

.time-servings .info-box {
  flex: 1 1 calc(50% - 16px);
}

.info-box {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.info-box .label {
  display: block;
  font-size: 0.9rem;
  color: #777;
}

.info-box .value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-top: 4px;
}

/* Шаги приготовления */
.recipe-steps {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.step-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  object-fit: cover;
}

.step-text h3 {
  margin: 12px 0 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #111;
}

.step-text p {
  font-size: 1rem;
  line-height: 1.5;
  color: #444;
}

/* Адаптив */
@media (min-width: 768px) {
  .recipe-header {
    flex-direction: row;
  }
  .recipe-description {
    flex: 1;
  }
  .recipe-image {
    flex: 1;
  }

  .kbzu .info-box {
    flex: 1 1 calc(25% - 16px);
  }
  .time-servings .info-box {
    flex: 1 1 calc(50% - 16px);
  }
}
</style>