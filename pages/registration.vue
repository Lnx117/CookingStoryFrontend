<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useNotification } from 'naive-ui'
import type {RegistrationFormInterface} from "~/interfaces/forms";
import type {RegistrationResponse} from "~/interfaces/responses";
import {useCookApi} from "~/composables/useCookApi";
import {REGISTRATION} from "~/interfaces/routes";

useHead({
  title: 'Регистрация',
})

//азрешаем
definePageMeta({
  auth: {
    //Только неавторизованным
    unauthenticatedOnly: true,
    //Не редиректим
    navigateTo: false
  }
})


const { signIn } = useAuth()
const notification = useNotification()
const route = useRoute()
const validationStatus = ref<'error' | 'success' | ''>('')

function onSubmit (formData: RegistrationFormInterface) {
  sendForm(formData)
      .then(() => {
        console.log(111)
      })
      .catch(() => {
        console.log(222)
      })


}

async function sendForm<T>(formData: RegistrationFormInterface): Promise<void> {
  return new Promise((resolve, reject) => {
    useCookApi<RegistrationResponse>(REGISTRATION, {
      method: 'post',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }),
      onResponseError() {
        reject()
      },
    }).then(() => resolve())
        .catch(() => reject())
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

