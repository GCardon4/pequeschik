<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Admin Panel
        </q-toolbar-title>

        <q-btn flat round dense icon="home" @click="goToHome" />
        <q-btn flat round dense icon="logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Admin Menu
        </q-item-label>

        <EssentialLink
          v-for="link in adminLinks"
          :key="link.title"
          v-bind="link"
        />

        <q-separator />

        <q-item clickable v-ripple @click="handleLogout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cerrar Sesión</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
import { useNavigationStore } from 'src/stores/navigationStore'
import { useAuthStore } from 'src/stores/storeAuth'

const leftDrawerOpen = ref(false)
const navigationStore = useNavigationStore()
const authStore = useAuthStore()
const router = useRouter()

const adminLinks = computed(() => navigationStore.getAdminLinks)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goToHome() {
  router.push({ name: 'home' })
}

async function handleLogout() {
  try {
    await authStore.logout()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>
