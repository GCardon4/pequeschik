<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- Banner de instalación de PWA -->
    <q-banner
      v-if="showInstallPrompt"
      class="bg-primary text-white q-py-md q-px-lg flex flex-center"
      style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999; border-top-left-radius: 8px; border-top-right-radius: 8px;"
    >
      <q-icon name="download_for_offline" size="md" class="q-mr-md" />
      <span class="text-weight-bold">¡Instala App para mejor administración!</span>
      <q-space />
      <q-btn flat label="Instalar" @click="installPwa" class="text-white q-ml-md" />
      <q-btn flat round icon="close" @click="showInstallPrompt = false" class="text-white q-ml-sm" />
    </q-banner>
  </q-layout>
</template>

<script setup>
// Acción: Importar dependencias principales
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from 'src/config/supabase'
import { useAuthStore } from 'stores/storeAuth'
import { useQuasar } from 'quasar'


const $q = useQuasar()
const authStore = useAuthStore()

// Acción: Definir variables reactivas para PWA
const deferredPrompt = ref(null)
const showInstallPrompt = ref(false)

// Acción: Escuchar eventos de autenticación y PWA
onMounted(() => {
  // Acción: Escuchar cambios de autenticación para actualizar el store
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      authStore.user = session.user
      authStore.loadProfile()
    } else {
      authStore.user = null
      authStore.profile = null
    }
    // No redirigir aquí, solo actualizar el estado
  })

  // Acción: Detectar si la PWA es instalable
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallPrompt.value = true
  })

  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false
    deferredPrompt.value = null
    $q.notify({ type: 'positive', message: '¡Secafé se ha instalado en tu dispositivo!' })
  })
})

// Acción: Limpiar listeners al desmontar
onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', () => {})
  window.removeEventListener('appinstalled', () => {})
})

// Acción: Instalar la PWA
const installPwa = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    deferredPrompt.value = null
  }
}
</script>
