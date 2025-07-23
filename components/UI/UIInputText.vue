<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    default: false,
    required: false,
  },
  value: {
    type: String || null,
    required: false,
  },
  errorMessage: {
    type: String,
    default: '',
    required: false,
  },
  tooltip: {
    type: String,
    default: '',
    required: false,
  },
  pattern: {
    type: String, // Добавляем свойство для паттерна, пример: :pattern='/[^а-яА-ЯёЁa-zA-Z]/g'
    required: false,
  },
  mask: {
    type: String, // Добавляем свойство для маски, пример: :mask="'+7 (###) ###-##-##'"
    required: false,
  },
  toLowerCase: {
    type: Boolean, // Приведение к нижнему регистру
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean, // Делает поле серым (неактивным)
    required: false,
  },
  errorStyle: {
    type: Boolean, // Визуально выделить поле при ошибке
    required: false,
  },
  isPassword: {
    type: Boolean, // Добавляет функционал показать/скрыть поле
    required: false,
  },
  maxLength: { // ограничение длины
    type: Number,
    required: false,
  },
  min: { // минимальное число
    type: Number,
    required: false,
  },
  max: { // максимальное число
    type: Number,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const thisValue = ref<string>(props.value || '')
const showPassword = ref<boolean>(false) // Состояние для показа/скрытия пароля

watch(() => props.value, (newValue) => {
  thisValue.value = newValue || ''
  validateMinMax()
},
)

watch(thisValue, (newValue) => {
  if (props.toLowerCase) {
    thisValue.value = newValue.toLowerCase()
  }

  if (props.pattern) {
    const regex = new RegExp(props.pattern)

    const filteredValue = newValue.replace(regex, '')

    if (filteredValue !== newValue) {
      thisValue.value = filteredValue
    }
  }

  validateMinMax()
  emit('update:modelValue', thisValue.value)
})

function validateMinMax() {
  if (props.min !== undefined || props.max !== undefined) {
    const numericValue = parseInt(thisValue.value, 10)
    if (!isNaN(numericValue)) {
      if (props.min !== undefined && numericValue < props.min) {
        thisValue.value = props.min.toString()
      }
      if (props.max !== undefined && numericValue > props.max) {
        thisValue.value = props.max.toString()
      }
    }
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <!--  :value="value" -->
  <label
    class="form-elem"
    :class="{ error: errorMessage }"
  >
    <span
      class="form-elem__input-wr"
      :class="{ 'error-style': props.errorStyle, 'form-elem__input-wr--with-tooltip': tooltip }"
    >
      <input
        v-if="props.mask"
        v-model="thisValue"
        v-mask="props.mask"
        class="form-elem__input"
        type="text"
        :name="name"
        :placeholder="placeholder"
        :disabled="props.disabled"
        :maxlength="props.maxLength"
      >
      <input
        v-else
        v-model="thisValue"
        class="form-elem__input"
        :type="props.isPassword && !showPassword ? 'password' : 'text'"
        :name="name"
        :placeholder="placeholder"
        :disabled="props.disabled"
        :maxlength="props.maxLength"
      >
      <span class="form-elem__pseudo-placeholder">{{ label }}<sup v-if="required">*</sup></span>
      <span
        v-if="tooltip"
        class="tooltip"
      >
        <span class="tooltip__trigger question-icon" />
        <span class="tooltip__body">
          {{ tooltip }}
        </span>
      </span>
      <button
        v-if="props.isPassword"
        type="button"
        class="eye-btn"
        @click="togglePasswordVisibility"
      >
        <span
          class="eye-btn__show-icon eye-icon"
          :style="{ opacity: showPassword ? 1 : 0 }"
        />
        <span
          class="eye-btn__hide-icon eye-crossed-icon"
          :style="{ opacity: showPassword ? 0 : 1 }"
        />
      </button>
    </span>
    <span
      v-if="errorMessage"
      class="form-elem__error-message"
    >{{ errorMessage }}</span>
  </label>
</template>

<style scoped lang="scss">
.form-elem__input[disabled] {
    background-color: var(--bg);
}

.error-style input {
    border: 1px solid #E83333; /* Цвет рамки */
    color: #C62626; /* Цвет текста */
}

.error-style .form-elem__pseudo-placeholder {
    color: #C62626; /* Цвет текста */
}
</style>
