<script setup lang="ts">
import {useLoadingBar, useNotification} from 'naive-ui'
import type {AuthFormInterface} from "~/interfaces/forms";

useHead({
  title: 'Авторизация',
})

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
  },
})

const { signIn } = useAuth()
const notification = useNotification()
const route = useRoute()
const validationStatus = ref<'error' | 'success' | ''>('')
const loadingBar = useLoadingBar()

async function onSubmit (formData: AuthFormInterface) {
  loadingBar.start()
  //sidebase Логин
  const result = await signIn({
      email: formData.email,
      password: formData.password,
    }, {
      redirect: false,
    }
  ).then(() => {
    loadingBar.finish()
    //проверка куда нужен редирект и сам редирект
    let redirectPath = route.query.redirect ?? '/'

    if (Array.isArray(redirectPath)) {
      redirectPath = redirectPath[0] ?? '/'
    }

    reloadNuxtApp({
      path: redirectPath,
    })
  })
  .catch((error) => {
    let message = error?.data?.message;

    //ВЫделяем поля красным
    if (error?.data?.code == 401) {
      validationStatus.value = 'error'
    }

    notification.error({
      title: 'Авторизация',
      content: message,
      duration: 5000,
    })
  })
}

</script>

<template>
  <SectionAuth
      :validation-status="validationStatus"
      @on-submit="onSubmit"
  />
</template>

<style scoped lang="scss">
</style>

