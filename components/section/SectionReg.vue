<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useNotification } from 'naive-ui'
import { useCookApi} from "~/composables/useCookApi";

const props = defineProps({
  validationStatus: {
    type: String,
    required: false,
    default: false,
  },
})

console.log(useUser().get)
async function test() {
  await useCookApi('/pingAuth', {
    cache: 'no-cache',
    onResponseError() {
      // обработка ошибки
    }
  })
}

const emit = defineEmits(['onSubmit'])

const schema = yup.object({
  email: yup.string().email('Проверьте правильность Email').required('Email обязателен для заполнения'),
  password: yup.string().min(6, 'Минимальная длина пароля - 6 символов').required('Пароль обязателен для заполнения'),
  confirmPassword: yup.string().min(6, 'Минимальная длина пароля - 6 символов').required('Пароль обязателен для заполнения'),
})

//values и meta для того чтобы видеть статистику, что валидно, что нет и тд
const { handleSubmit, errors, values, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
  },
})

const { value: email, errorMessage: emailError, handleBlur: emailBlur } = useField('email');
const { value: password, errorMessage: passwordError, handleBlur: passwordBlur } = useField('password');
const { value: confirmPassword, errorMessage: confirmPasswordError, handleBlur: confirmPasswordBlur } = useField('confirmPassword');

//Нужно вызывать результат работы handleSubmit(проверяет валидацию перед вызовом)
const submitForm = handleSubmit(onSubmit)

async function onSubmit (formData: { email: string; password: string }) {
  emit('onSubmit', formData)
}

</script>

<template>
  <div class="auth-container">
    <div class="login-container">
      <img src="~/assets/images/auth/logo.svg" alt="Логотип" class="logo">
      <h1>Регистрация на сайте</h1>
      <p>Позвольте с Вами познакомиться!</p>
      <n-form
          @submit.prevent="test"
      >
        <n-form-item
            :show-label="false"
            :feedback="errors.email"
            :validation-status="validationStatus"
        >
          <n-input
              v-model:value="email"
              placeholder="Email*"
              :status="validationStatus"
          />
        </n-form-item>
        <n-form-item
            :show-label="false"
            :feedback="errors.password"
            :validation-status="validationStatus"
        >
          <n-input
              v-model:value="password"
              type="password"
              placeholder="Пароль*"
              :status="validationStatus"
          />
        </n-form-item>
        <n-form-item
            :show-label="false"
            :feedback="errors.password"
            :validation-status="validationStatus"
        >
          <n-input
              v-model:value="confirmPassword"
              type="password"
              placeholder="Подтверждение пароля*"
              :status="validationStatus"
          />
        </n-form-item>
        <n-button
            type="primary"
            attr-type="submit"
            :bordered="false"
            color="#994b3a"
        >
          Зарегистрироваться
        </n-button>
      </n-form>
      <div class="slogan">Каждый рецепт — это история</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.n-button {
  height: 44px;
}
.auth-container {
  margin: 0;
  font-family: 'Merriweather', serif;
  background: linear-gradient(rgba(255, 248, 240, 0.8), rgba(255, 248, 240, 0.8)),
  url('~/assets/images/auth/family-kitchen-bg.png') center/cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f5f0;

  .login-container {
    background: rgba(255, 255, 255, 0.95);
    padding: 40px 30px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    width: 90%;
    text-align: center;
    border: 8px solid transparent;
    border-image: url('embroidery-border.png') 30 round;
  }
}

.logo {
  width: 80px;
  margin-bottom: 20px;
}

h1 {
  font-size: 26px;
  color: #6b3e26;
  margin-bottom: 8px;
}

p {
  font-size: 14px;
  color: #7b5e47;
  margin-bottom: 24px;
}

// input[type="email"],
// input[type="password"] {
//   width: 100%;
//   padding: 12px;
//   margin: 10px 0;
//   border: 1px solid #d8c3b3;
//   border-radius: 6px;
//   font-family: 'Open Sans', sans-serif;
// }

button {
  width: 100%;
  padding: 12px;
  background-color: #b45f4d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #994b3a;
}

.footer-note {
  margin-top: 16px;
  font-size: 13px;
  color: #a0846a;
}

.slogan {
  margin-top: 30px;
  font-style: italic;
  font-size: 14px;
  color: #8d6e58;
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
  }

  h1 {
    font-size: 22px;
  }

  .logo {
    width: 60px;
  }
}
</style>

