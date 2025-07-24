<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useNotification } from 'naive-ui'

definePageMeta({
  auth: {
    navigateTo: false
  }
})

const { signIn } = useAuth()
const router = useRouter()
const notification = useNotification()
const route = useRoute()
const validationStatus = ref<'error' | 'success' | ''>('')

const schema = yup.object({
  email: yup.string().email('Проверьте правильность Email').required('Email обязателен для заполнения'),
  password: yup.string().min(6, 'Минимальная длина пароля - 6 символов').required('Пароль обязателен для заполнения'),
})

//values и meta для того чтобы видеть статистику, что валидно, что нет и тд
const { handleSubmit, errors, values, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
  },
})

const { value: email, errorMessage: emailError, handleBlur: emailBlur } = useField('email');
const { value: password, errorMessage: passwordError, handleBlur: passwordBlur } = useField('password');

//Убираем выделение красным у инпутов после ошибки при их изменении
watchEffect(() => {
  if(email.value || password.value) {
    validationStatus.value = '';
  }
})

//Нужно вызывать результат работы handleSubmit(проверяет валидацию перед вызовом)
const submitForm = handleSubmit(onSubmit)

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
  <div class="auth-container">
    <div class="login-container">
      <img src="~/assets/images/auth/logo.svg" alt="Логотип" class="logo">
      <h1>Добро пожаловать домой</h1>
      <p>Войдите, чтобы открыть семейные рецепты, передающиеся из поколения в поколение</p>
      <n-form 
        @submit.prevent="submitForm"
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
        <n-button
          type="primary" 
          attr-type="submit"
          :bordered="false"
          color="#994b3a"
        >
          Войти
        </n-button>
      </n-form>
      <div class="footer-note">Забыли пароль? <a href="#" style="color:#b45f4d;">Восстановить</a></div>
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

