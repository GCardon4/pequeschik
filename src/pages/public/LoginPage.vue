<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-2 rounded-borders text-center" style="width: 350px; max-width: 90vw;">
      <div class="text-h6 text-center q-mb-md">Iniciar Sesión</div>

      <q-form @submit.prevent="onLogin" class="q-gutter-md">
        <q-input
          filled
          v-model="email"
          type="email"
          label="Correo electrónico"
          lazy-rules
          :rules="[val => !!val || 'El correo es obligatorio']"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-input
          filled
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Contraseña"
          lazy-rules
          :rules="[val => !!val || 'La contraseña es obligatoria']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-btn
          label="Ingresar"
          color="primary"
          class="full-width"
          type="submit"
          :loading="loading"
        />

        <div v-if="errorMessage" class="text-negative text-center text-caption q-mt-sm">
          {{ errorMessage }}
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/storeAuth'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const onLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)

    // Redirección según rol
    if (authStore.userRole === 'admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>
