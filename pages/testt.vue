<script setup lang="ts">
import { onMounted } from 'vue'

// Получаем методы из Sidebase Auth
const { status, data, signIn, signOut, getSession } = useAuth()

onMounted(async () => {
  // Получаем текущую сессию
  const session = await getSession()

  console.log('Статус 1111111111111:', data.value?.id)
  console.log('Данные сессии (из useAuth):', data.value)
  console.log('Данные сессии (из useAuth):', data.value)
  console.log('Результат getSession():', session)
})
</script>

<template>
  <div>
    <h1>Проверка аутентификации</h1>
    <p>Откройте консоль (F12) чтобы увидеть данные.</p>
  </div>
</template>

<style scoped>
</style>