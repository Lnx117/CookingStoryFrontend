<script setup lang="ts">

const { signIn } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await signIn({
      email: email.value,
      password: password.value,
    }, {
      redirect: false,
    })

    if (result?.error) {
      error.value = 'Неверный email или пароль'
    } else {
      await router.push('/')
    }
  } catch (err) {
    error.value = 'Произошла ошибка при входе'
  } finally {
    loading.value = false
  }
}
</script> 

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Вход в аккаунт</h2>
      <form class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" class="form-input" placeholder="Введите email" />
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input id="password" type="password" class="form-input" placeholder="Введите пароль" />
        </div>
        <button type="submit" class="auth-button">Войти</button>
        <p class="auth-footer">
          Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 1rem;
}

.auth-card {
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 400px;
  width: 100%;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.auth-button {
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #2563eb;
}

.auth-footer {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.auth-footer a {
  color: #3b82f6;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
