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
            <div class="text-caption text-grey">
              {{ product.description }}
            </div>

            <div class="text-subtitle1 text-bold q-mt-sm">
              {{ formatCurrency(product.price) }}
              <div class="row justify-end">
                <q-btn flat round icon="favorite_border" color="pink" class="icon-product"/>
                  <q-btn flat round icon="shopping_cart" color="primary" class="icon-product"/>
              </div>
            </div>
            
          </div>
        </div>
      </q-card>
    </div>

  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from 'src/stores/productStore'

const productStore = useProductStore()

// Función para filtrar
const filterCategory = catId => {
  productStore.setSelectedCategory(catId)
}

// Cargar productos y categorías desde el store
onMounted(() => {
  productStore.fetchAllProducts()
  productStore.fetchAllCategories()
})

// Formatear precios
const formatCurrency = val =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val)
</script>
