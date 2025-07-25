<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useNotification } from 'naive-ui'

useHead({
  title: 'Регистрация',
})

//азрешаем
definePageMeta({
  auth: {
    //Только неавторизованным
    unauthenticatedOnly: false,
    //Не редиректим
    navigateTo: false
  }
})


const { signIn } = useAuth()
const notification = useNotification()
const route = useRoute()
const validationStatus = ref<'error' | 'success' | ''>('')

async function onSubmit (formData: { email: string; password: string }) {
  //sidebase Логин
  const result = await signIn({
        email: formData.email,
        password: formData.password,
      }, {
        redirect: false,
      }
  ).then(() => {
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
  <SectionReg
      :validation-status="validationStatus"
      @on-submit="onSubmit"
  />
</template>

<style scoped lang="scss">
</style>

