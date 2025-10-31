<template>
  <q-page class="q-pa-md">
    <!-- Pantalla de Carga -->
    <div v-if="loading" class="flex flex-center">
      <q-spinner-gears size="50px" color="primary" />
    </div>

    <!-- Contenido del Producto -->
    <div v-else-if="product" class="product-view-container">
      <!-- Botón para volver -->
      <q-btn
        flat
        icon="arrow_back"
        label="Volver al catálogo"
        @click="$router.go(-1)"
        class="q-mb-md"
      />

      <!-- Imagen Principal (Avatar) -->
      <div
        class="cursor-pointer"
        @click="openImageDialog(product.avatar_url)"
      >
        <q-img
          :src="product.avatar_url"
          class="product-avatar-large rounded-borders"
        >
          <q-tooltip>Haz clic para ver la imagen completa</q-tooltip>
        </q-img>
      </div>

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
              <q-btn round color="pink" icon="favorite_border" />
              <q-btn
                unelevated
                color="positive"
                icon="whatsapp"
                label="Compra"
                @click="buyOnWhatsApp"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Galería de Imágenes Inferior -->
      <div v-if="gallery.length > 0" class="q-mt-xl">
        <div class="text-h6 q-mb-md">Galería del Producto</div>
        <div class="row q-gutter-md">
          <q-img
            v-for="image in gallery"
            :key="image.id"
            :src="image.image_url"
            class="gallery-thumbnail cursor-pointer rounded-borders"
            @click="openImageDialog(image.image_url)"
          />
        </div>
      </div>
    </div>

    <!-- Mensaje si no se encuentra el producto -->
    <div v-else class="text-center">
      <div class="text-h5">Producto no encontrado</div>
      <q-btn to="/" label="Volver al inicio" color="primary" class="q-mt-md" />
    </div>

    <!-- Dialog para visualizar imagen en pantalla completa - CORREGIDO -->
    <q-dialog v-model="imageDialogVisible">
      <q-card style="max-width: 500px; max-height: 500px;" class="">
        <!-- La directiva v-if asegura que q-img se renderice solo con una URL válida -->
        <q-img v-if="selectedImageUrl" :src="selectedImageUrl" fit="contain" />

        <!-- Botón para cerrar el diálogo -->
        <q-btn
          round
          dense
          icon="close"
          color="white"
          text-color="black"
          class="absolute-top-right q-ma-sm"
          @click="imageDialogVisible = false"
        />
      </q-card>
    </q-dialog>

    
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from 'src/stores/productStore';

const route = useRoute();
const productStore = useProductStore();

const product = ref(null);
const gallery = ref([]);
const loading = ref(true);

const imageDialogVisible = ref(false);
const selectedImageUrl = ref('');

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

/**
 * Abre un diálogo para mostrar una imagen en tamaño completo.
 * @param {string} url - La URL de la imagen a mostrar.
 */
function openImageDialog(url) {
  selectedImageUrl.value = url;
  imageDialogVisible.value = true;
}

/**
 * Abre WhatsApp con un mensaje pre-rellenado para la compra.
 */
function buyOnWhatsApp() {
  const phoneNumber = '573215698895'; // Reemplazar con tu número
  const productName = product.value.name;
  const productRef = product.value.reference;
  const message = `Hola, estoy interesado en el producto: *${productName}* (Ref: *${productRef}*). ¿Podrías darme más información?`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

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
.product-avatar-large {
  max-height: 500px;
  width: 100%;
  border: 1px solid rgba(0,0,0,0.1);
}
.gallery-thumbnail {
  width: 100px;
  height: 100px;
  border: 1px solid rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.gallery-thumbnail:hover {
  transform: scale(1.05);
}
</style>
