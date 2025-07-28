<script setup lang="ts">
const { signOut } = useAuth()
const { status } = useAuth()
const router = useRouter()

console.log(status.value)
const loading = ref(false)

const handleLogout = async () => {
  loading.value = true

  try {
    await signOut({ redirect: false })
    await router.push('/login')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <button
      @click="handleLogout"
      :disabled="loading"
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
  >
    {{ loading ? 'Выход...' : 'Выйти' }}
  </button>
</template>
