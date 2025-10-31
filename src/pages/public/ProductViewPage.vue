<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="flex flex-center">
      <q-spinner-gears size="50px" color="primary" />
    </div>

    <div v-else-if="product" class="product-view-container">
      <!-- Botón para volver al listado -->
      <q-btn
        flat
        icon="arrow_back"
        label="Volver al catálogo"
        @click="$router.go(-1)"
        class="q-mb-md"
      />

      <!-- Carrusel de Imágenes -->
      <q-carousel
        v-if="productImages.length > 0"
        animated
        v-model="slide"
        arrows
        navigation
        infinite
        class="product-carousel bg-grey-2 rounded-borders"
      >
        <q-carousel-slide
          v-for="(image, index) in productImages"
          :key="index"
          :name="index"
          :img-src="image.image_url || image"
        />
      </q-carousel>
      <!-- Imagen por defecto si no hay galería -->
      <q-img
        v-else
        :src="product.avatar_url"
        class="product-avatar-large rounded-borders"
      />

      <!-- Detalles del Producto -->
      <q-card flat bordered class="q-mt-lg">
        <q-card-section>
          <div class="text-h4 q-mb-sm">{{ product.name }}</div>
          <div class="text-subtitle1 text-grey-7">Ref: {{ product.reference }}</div>

          <q-chip
            v-if="product.category"
            :label="product.category.name"
            color="primary"
            text-color="white"
            class="q-mt-sm"
          />
          <div v-if="product.subcategory" class="text-h6 q-mt-md">{{ product.subcategory }}</div>

          <div class="text-h5 text-bold q-my-md text-primary">
            {{ formatCurrency(product.price) }}
          </div>

          <div v-if="product.sizes" class="q-my-md">
            <div class="text-subtitle2">Tallas disponibles:</div>
            <div class="row q-gutter-sm">
              <q-chip
                v-for="size in product.sizes.split(',')"
                :key="size"
                :label="size.trim()"
                outline
                color="secondary"
              />
            </div>
          </div>

          <div v-if="product.description" class="q-mt-md">
            <p>{{ product.description }}</p>
          </div>

          <q-separator class="q-my-lg" />

          <div class="row items-center justify-between">
            <div class="text-subtitle1">
              Stock: <span class="text-bold">{{ product.stock }}</span> unidades
            </div>
            <div class="row q-gutter-md">
              <q-btn
                round
                color="pink"
                icon="favorite_border"
                aria-label="Añadir a favoritos"
              />
              <q-btn
                unelevated
                color="primary"
                icon="add_shopping_cart"
                label="Añadir al carrito"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="text-center">
      <div class="text-h5">Producto no encontrado</div>
      <q-btn to="/" label="Volver al inicio" color="primary" class="q-mt-md" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from 'src/stores/productStore';

const route = useRoute();
const productStore = useProductStore();

const product = ref(null);
const gallery = ref([]);
const loading = ref(true);
const slide = ref(0);

// Combina el avatar con la galería para el carrusel
const productImages = computed(() => {
  const images = [];
  if (product.value?.avatar_url) {
    images.push(product.value.avatar_url);
  }
  if (gallery.value.length > 0) {
    images.push(...gallery.value);
  }
  return images;
});

onMounted(async () => {
  const productId = route.params.id;
  loading.value = true;
  await productStore.fetchProductById(productId);
  product.value = productStore.selectedProduct;
  if (product.value) {
    gallery.value = await productStore.fetchGallery(productId);
  }
  loading.value = false;
});

const formatCurrency = (val) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(val);
</script>

<style scoped>
.product-view-container {
  max-width: 800px;
  margin: 0 auto;
}
.product-carousel {
  height: 500px;
}
.product-avatar-large {
  max-height: 500px;
  width: 100%;
}
</style>
