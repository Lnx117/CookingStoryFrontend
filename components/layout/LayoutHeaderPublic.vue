<script setup lang="ts">
const { signOut } = useAuth()
const { status } = useAuth()
const router = useRouter()

const isSidebarCollapsed = ref<boolean>(false);
const loading = ref(false)

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

const handleLogout = async () => {
  loading.value = true

  try {
    await signOut({ redirect: false })
    await router.push('/login')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="header">
      <div class="logo">Family Recipe Book</div>
      <div class="nav-icons">
        <NuxtLink :to="'/authorization'">
          <span>Войти</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<style lang="scss">

</style>
