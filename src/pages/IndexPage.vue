<template>
  <q-page class="q-pt-lg">

    <!-- Menú de Filtros de categoría -->
    <div class="row menu-filtres justify-around text-center">
      <div class="col col-md-4">
        <q-btn
          class="btn-filter"
          icon="child_hat"
          label="Niños"
         />
      </div>
      <div class="col col-md-4">
        <q-btn
          class="btn-filter"
          icon="child_hat"
          label="Niñas"
         />
      </div>
      <div class="col col-md-4">
        <q-btn
          class="btn-filter"
          icon="child_hat"
          label="Accesorios"
         />
      </div>
    </div>

    <!-- Filtros de categoría -->
    <div class="row q-col-gutter-md justify-around q-mb-xl">
      <q-btn
        v-for="cat in categories"
        :key="cat.value"
        :label="cat.label"
        icon="child_hat"
        color="teal-7"
        class="q-pa-lg text-white"
        rounded
        @click="filterCategory(cat.value)"
        :flat="selectedCategory !== cat.value"
        :unelevated="selectedCategory === cat.value"
      />
    </div>

    <!-- Lista de productos -->
    <div class="column items-center">
      <q-card
        v-for="product in filteredProducts"
        :key="product.id"
        class="q-mb-md q-pa-md"
        flat
        bordered
        style="max-width: 600px; width: 100%;"
      >
        <div class="row items-center q-col-gutter-md">
          <div class="col-4">
            <q-img
              :src="product.image"
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
            </div>
            <div class="row justify-end q-gutter-sm q-mt-sm">
              <q-btn flat round icon="favorite_border" color="pink" />
              <q-btn flat round icon="shopping_cart" color="primary" />
            </div>
          </div>
        </div>
      </q-card>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from 'src/config/supabase' // si usas Supabase

// Categorías disponibles
const categories = [
  { label: 'Niños', value: 'ninos' },
  { label: 'Niñas', value: 'ninas' },
  { label: 'Accesorios', value: 'accesorios' }
]

const selectedCategory = ref('ninas')
const products = ref([])

// Filtro computado
const filteredProducts = computed(() =>
  products.value.filter(p => p.category === selectedCategory.value)
)

// Función para filtrar
const filterCategory = cat => {
  selectedCategory.value = cat
}

// Cargar productos desde Supabase
onMounted(async () => {
  const { data, error } = await supabase.from('products').select('*')
  if (!error) products.value = data
})

// Formatear precios
const formatCurrency = val =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val)
</script>

<style scoped>
.text-primary {
  color: #4c8b87;
}
.q-btn {
  width: 180px;
}
</style>
