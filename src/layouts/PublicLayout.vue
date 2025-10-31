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
        <q-toolbar-title> Peques Chik </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Menú</q-item-label>

        <!-- Botón para mostrar todos los productos -->
        <q-item clickable v-ripple @click="showAllProducts">
          <q-item-section avatar>
            <q-icon name="apps" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Todos los Productos</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Lista dinámica de categorías -->
        <q-item
          v-for="category in categories"
          :key="category.id"
          clickable
          v-ripple
          :active="selectedCategory === category.id"
          @click="selectCategory(category.id)"
        >
          <q-item-section avatar>
            <q-icon :name="category.icon || 'label'" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ category.name }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Enlace estático al Login -->
        <EssentialLink
          v-for="link in staticLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from 'src/stores/productStore';
import { useRouter } from 'vue-router';
import EssentialLink from 'components/EssentialLink.vue';

const leftDrawerOpen = ref(false);
const productStore = useProductStore();
const router = useRouter();

// Enlace estático para el login/admin
const staticLinks = [
  {
    title: 'Login',
    caption: 'Administración',
    icon: 'login',
    link: '/login', // Asegúrate de que la ruta sea correcta
  },
];

// --- Computed Properties ---
const categories = computed(() => productStore.getAllCategories);
const selectedCategory = computed(() => productStore.selectedCategory);

// --- Cargar datos ---
onMounted(() => {
  productStore.fetchAllCategories();
});

// --- Métodos ---
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

/**
 * Muestra todos los productos y resetea el filtro.
 */
function showAllProducts() {
  productStore.setSelectedCategory(null);
  navigateToHome();
}

/**
 * Filtra los productos por la categoría seleccionada.
 * @param {string} categoryId
 */
function selectCategory(categoryId) {
  productStore.setSelectedCategory(categoryId);
  navigateToHome();
}

/**
 * Navega a la página de inicio si no estamos ya en ella.
 */
function navigateToHome() {
  if (router.currentRoute.value.name !== 'home') {
    router.push({ name: 'home' });
  }
}
</script>

<style scoped>
/* Estilo para el item activo en el menú */
.q-item--active {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--q-primary);
}
</style>
