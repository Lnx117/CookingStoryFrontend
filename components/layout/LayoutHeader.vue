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
        <img src="~/assets/icons/zoom.svg" alt="Поиск" />
        <img src="~/assets/icons/bell.svg" alt="Уведомления" />
        <img src="~/assets/icons/user-circle.svg" alt="Профиль" />
        <img
            src="~/assets/icons/logout.svg"
            alt="Выход"
            @click="handleLogout"
        />
      </div>
    </div>

    <div class="container">
      <aside :class="['sidebar', { collapsed: isSidebarCollapsed }]">
        <div class="sidebar-toggle-inner" @click="toggleSidebar">
          <span :class="{ rotated: isSidebarCollapsed }"><img src="~/assets/icons/arrow-narrow-left.svg" alt="Свернуть/развернуть" /></span>
        </div>

        <div class="menu-items">
          <a href="#">
            <span class="icon"><img src="~/assets/icons/book.svg" alt="Свернуть/развернуть" /></span>
            <span v-if="!isSidebarCollapsed" class="label">Общие рецепты</span>
          </a>
          <a href="#">
            <span class="icon"><img src="~/assets/icons/book.svg" alt="Свернуть/развернуть" /></span>
            <span v-if="!isSidebarCollapsed" class="label">Мои рецепты</span>
          </a>
          <a href="#">
            <span class="icon"><img src="~/assets/icons/users.svg" alt="Свернуть/развернуть" /></span>
            <span v-if="!isSidebarCollapsed" class="label">Мои подписки</span>
          </a>
          <a href="#">
            <span class="icon"><img src="~/assets/icons/zoom.svg" alt="Поиск" /></span>
            <span v-if="!isSidebarCollapsed" class="label">Найти друзей</span>
          </a>
        </div>
      </aside>

      <div
          :class="[{ 'mainWithFullMenu': !isSidebarCollapsed }, { 'mainWithCollapsedSidebar': isSidebarCollapsed }]">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
