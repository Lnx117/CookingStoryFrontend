import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email('Некорректный email').required('Это поле обязательно для заполнения'),
  password: yup.string().min(6, 'Пароль должен содержать как минимум 6 символов').required('Это поле обязательно для заполнения'),
  rememberMe: yup.boolean(),
})
