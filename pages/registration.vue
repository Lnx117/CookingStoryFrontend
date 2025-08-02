<script setup lang="ts">
import { useNotification } from 'naive-ui'
import type {RegistrationFormInterface} from "~/interfaces/forms";
import type {RegistrationResponse} from "~/interfaces/responses";
import {useCookApi} from "~/composables/useCookApi";
import {REGISTRATION} from "~/interfaces/routes";
import SectionRegSuccess from "~/components/section/reg/SectionRegSuccess.vue";
import { useLoadingBar } from 'naive-ui'

useHead({
  title: 'Регистрация',
})

//разрешаем
definePageMeta({
  auth: {
    //Только неавторизованным
    unauthenticatedOnly: true,
    //Не редиректим
    navigateTo: false
  }
})

const notification = useNotification()
const validationStatus = ref<'error' | 'success' | ''>('')
const showRegCompliteStep = ref<boolean>(false)
const loadingBar = useLoadingBar()

function onSubmit (formData: RegistrationFormInterface) {
  loadingBar.start()
  sendForm(formData)
      .then((response) => {
        //переходим на завершающий шаг
        showRegCompliteStep.value = !showRegCompliteStep.value

        loadingBar.finish()
        notification.success({
          title: 'Регистрация',
          content: 'Регистрация прошла успешно!',
          duration: 5000,
        })
      })
      .catch((error) => {
        let message = error?.message;

        //ВЫделяем поля красным
        if (error?.code == 422) {
          validationStatus.value = 'error'
        }

        notification.error({
          title: 'Регистрация',
          content: message,
          duration: 5000,
        })
      })
}

async function sendForm(formData: RegistrationFormInterface): Promise<RegistrationResponse> {
  return new Promise((resolve, reject) => {
    useCookApi<RegistrationResponse>(REGISTRATION, {
      method: 'post',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }),
      onResponseError({ response }) {
        reject(response._data) // Передаем данные ошибки
      },
    }).then(({ data }) => {
      if (data.value) {
        resolve(data.value)
      }
    }).catch((error) => {
      console.log(11111)
      reject(error)
    })
  })
}

</script>

<template>
  <SectionReg
      v-if="!showRegCompliteStep"
      :validation-status="validationStatus"
      @on-submit="onSubmit"
  />

  <SectionRegSuccess
      v-if="showRegCompliteStep"
  />
</template>

<style scoped lang="scss">
</style>

