<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Тест API подключения</h1>
    
    <div class="space-y-4">
      <button 
        @click="testApi" 
        :disabled="loading"
        class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {{ loading ? 'Тестируем...' : 'Тест API' }}
      </button>
      
      <div v-if="result" class="bg-gray-100 p-4 rounded">
        <h3 class="font-semibold mb-2">Результат:</h3>
        <pre>{{ result }}</pre>
      </div>
      
      <div v-if="error" class="bg-red-100 p-4 rounded text-red-700">
        <h3 class="font-semibold mb-2">Ошибка:</h3>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)
const result = ref('')
const error = ref('')

const testApi = async () => {
  loading.value = true
  result.value = ''
  error.value = ''
  
  try {
    const response = await fetch('http://api.host.local:8000/api/ping', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      result.value = JSON.stringify(data, null, 2)
    } else {
      error.value = `HTTP ${response.status}: ${response.statusText}`
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script> 