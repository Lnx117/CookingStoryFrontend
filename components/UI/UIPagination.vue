<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  pageCount: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()
</script>

<template>
  <n-pagination
      v-model:page="props.modelValue"
      :page-count="props.pageCount"
      @update:page="emit('update:modelValue', $event)"
  />
</template>