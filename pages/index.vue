<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold text-gray-900">
            Добро пожаловать!
          </h1>
          <button
            @click="handleLogout"
            :disabled="loading"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {{ loading ? 'Выход...' : 'Выйти' }}
          </button>
        </div>

        <div v-if="pending" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Загрузка...</p>
        </div>

        <div v-else-if="user" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Информация о пользователе</h2>
            <div class="space-y-2">
              <div class="flex">
                <span class="font-medium text-gray-700 w-20">ID:</span>
                <span class="text-gray-900">{{ user.id }}</span>
              </div>
              <div class="flex">
                <span class="font-medium text-gray-700 w-20">Имя:</span>
                <span class="text-gray-900">{{ user.name }}</span>
              </div>
              <div class="flex">
                <span class="font-medium text-gray-700 w-20">Email:</span>
                <span class="text-gray-900">{{ user.email }}</span>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="text-md font-semibold text-blue-900 mb-2">Токен доступа</h3>
            <p class="text-sm text-blue-800 break-all">
              {{ session?.accessToken ? session.accessToken.substring(0, 50) + '...' : 'Токен не найден' }}
            </p>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-600 mb-4">Вы не авторизованы</p>
          <NuxtLink
            to="/login"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Войти
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signOut } = useAuth()
const { data: session, pending } = useAuth()
const router = useRouter()

const user = computed(() => session.value?.user)
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