<script setup lang="ts">

const AUTH_NAMES = [
  'authorization',
  'registration',
  'recovery',
]

//Определяем, находимся ли мы на странице авторизации? на нейне нужны футеры с хедером
const isAuthPage = computed(() => AUTH_NAMES.some(
  v => (useRouter().currentRoute.value.name?.toString() ?? '').includes(v),
),
)
const isAuth = computed(() => !!useAuth().token?.value)

// Если страница раздела "регистрация", то шаблон authreg
// Иначе если пользователь авторизован, то шаблон default
// Иначе шаблон public (не авторизован и не на странице регистрации)
const layout = computed(() => isAuthPage.value ? 'authreg' : (isAuth.value ? 'default' : 'public'))

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'http-equiv', content: 'IE=edge' },
  ],
  titleTemplate: (titleLower) => {
    return (titleLower ?? 'test') ?? ''
  },
})

import { NConfigProvider } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

//Переопределяем стили у naiveUI
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#b45f4d'
  },
  Button: {
    textColor: 'white',
    colorHoverPrimary: '#994b3a',
    colorPressed: '#994b3a',
    colorPressedPrimary: '#994b3a',
    
  },
  Input: {
    colorHover: '#994b3a',
    heightMedium: '44px',
    border: '1px solid #d8c3b3',
    borderRadius: '6px',
    placeholderColor: '#994b3a',
    borderFocus: '1px solid #994b3a',
    borderHover: '1px solid #994b3a',
  },
}

</script>

<template>
  <n-loading-bar-provider>
    <n-notification-provider>
      <NuxtLayout :name="layout">
        <n-config-provider :theme-overrides="themeOverrides">
          <NuxtPage />
        </n-config-provider>
      </NuxtLayout>
    </n-notification-provider>
  </n-loading-bar-provider>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
