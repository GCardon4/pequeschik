<template>
  <q-page class="q-pt-lg">
    <!-- Menú de Filtros de categoría -->
    <div class="row menu-filtres justify-around text-center">
      <div
        v-for="cat in productStore.getAllCategories"
        :key="cat.id"
        class="col col-md-4"
      >
        <q-btn
          class="btn-filter"
          :icon="cat.icon"
          :label="cat.name"
          @click="filterCategory(cat.id)"
          :flat="productStore.selectedCategory !== cat.id"
          :unelevated="productStore.selectedCategory === cat.id"
        />
      </div>
    </div>

    <!-- Lista de productos -->
    <div class="column items-center">
      <q-card
        v-for="product in productStore.getFilteredProducts"
        :key="product.id"
        class="q-mb-md q-pa-md q-mt-lg product-card"
        flat
        bordered
        style="max-width: 600px; width: 100%;"
      >
        <!-- Enlace a la vista de detalle del producto -->
        <router-link
          :to="{ name: 'product-view', params: { id: product.id } }"
          class="product-link"
        >
          <div class="row items-center q-col-gutter-md">
            <div class="col-4">
              <q-img
                :src="product.avatar_url"
                ratio="1"
                class="rounded-borders"
                spinner-color="teal"
              />
            </div>
            <div class="col">
              <div class="text-h6">{{ product.name }}</div>
              <div class="text-caption color-primary">{{ product.subcategory }}</div>
              <div class="text-caption text-grey">
                {{ product.description }}
              </div>
              <div class="text-subtitle1 text-bold q-mt-sm">
                {{ formatCurrency(product.price) }}
              </div>
            </div>
          </div>
        </router-link>

        <!-- Botones de acción fuera del enlace -->
        <div class="row justify-end q-pt-sm">
          <q-btn flat round icon="favorite_border" color="pink" class="icon-product"/>
          <q-btn flat round icon="shopping_cart" color="primary" class="icon-product"/>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from 'src/stores/productStore';

const productStore = useProductStore();

// Función para filtrar
const filterCategory = (catId) => {
  productStore.setSelectedCategory(catId);
};

// Cargar productos y categorías desde el store
onMounted(() => {
  productStore.fetchAllProducts();
  productStore.fetchAllCategories();
});

// Formatear precios
const formatCurrency = (val) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(val);
</script>

<style scoped>
.product-card {
  transition: box-shadow 0.3s;
}
.product-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.product-link {
  text-decoration: none;
  color: inherit; /* Hereda el color del texto del padre */
  display: block; /* Para que el enlace ocupe todo el espacio de la tarjeta */
}
.icon-product {
  margin-left: 8px;
}
</style>
