<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Editar Producto</div>

    <q-card v-if="productForm">
      <!-- ... (sección del formulario principal sin cambios) ... -->
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <!-- (Campos existentes: Nombre, Referencia, Categoría, etc.) -->
          <q-input v-model="productForm.name" label="Nombre" filled />
          <q-input v-model="productForm.reference" label="Referencia" filled />
          <q-input v-model="productForm.description" label="Descripcion" filled />
          <q-select
            v-model="productForm.category"
            :options="categories"
            option-label="name"
            label="Categoría"
            filled
          />
          <q-input v-model="productForm.subcategory" label="Subcategoría" filled />
          <q-input v-model="productForm.sizes" label="Tallas" filled />
          <div class="row q-gutter-md">
            <q-input v-model.number="productForm.price" label="Precio" type="number" filled prefix="COP $" class="col" />
            <q-input v-model.number="productForm.stock" label="Stock" type="number" filled class="col" />
          </div>

          <!-- Avatar (Imagen Principal) -->
          <div class="text-subtitle1 q-mt-md">Avatar del Producto</div>
          <div class="row items-center q-gutter-md">
            <q-file ref="fileInputRef" v-model="avatarFile" label="Seleccionar nueva imagen" accept="image/*" filled style="max-width: 300px" @update:model-value="handleFileSelection" />
            <q-avatar v-if="imagePreviewUrl" size="100px" class="cursor-pointer" @click="triggerFileInput">
              <q-img :src="imagePreviewUrl" ratio="1" />
            </q-avatar>
          </div>

          <!-- Botones del Formulario Principal -->
          <div class="q-mt-lg">
            <q-btn label="Actualizar Producto" type="submit" color="primary" :loading="loading" />
            <q-btn label="Cancelar" color="grey" class="q-ml-sm" :to="{ name: 'product-list' }" />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <!-- Nueva Sección de Galería de Imágenes -->
      <q-card-section>
        <div class="text-h6 q-mb-md">Galería de Imágenes</div>
        <div class="row items-start q-gutter-md q-mb-md">
          <q-file v-model="galleryFiles" label="Añadir imágenes a la galería" accept="image/*" filled multiple style="flex: 1" />
          <q-btn label="Subir" color="secondary" @click="handleGalleryUpload" :disable="!galleryFiles || galleryFiles.length === 0" :loading="loading" />
        </div>

        <q-inner-loading :showing="loadingGallery">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>

        <div v-if="gallery.length > 0" class="row q-gutter-md">
          <div v-for="image in gallery" :key="image.id" class="relative-position">
            <q-img :src="image.image_url" width="150px" height="150px" fit="cover" class="rounded-borders" />
            <q-btn flat dense round color="negative" icon="delete" class="absolute-top-right" style="background: rgba(0,0,0,0.5);" @click="handleDeleteImage(image.id)" />
          </div>
        </div>
        <div v-else>
          <q-item><q-item-section class="text-grey">Este producto aún no tiene imágenes en la galería.</q-item-section></q-item>
        </div>
      </q-card-section>
    </q-card>

    <q-inner-loading :showing="loading || !productForm">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useProductStore } from 'src/stores/productStore';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const productStore = useProductStore();

// --- State del Formulario Principal ---
const productForm = ref(null);
const avatarFile = ref(null);
const fileInputRef = ref(null);

// --- State de la Galería ---
const gallery = ref([]);
const galleryFiles = ref([]);
const loadingGallery = ref(false);

// --- Computed ---
const loading = computed(() => productStore.getLoadingStatus);
const categories = computed(() => productStore.getAllCategories);
const imagePreviewUrl = computed(() => {
  if (avatarFile.value) return URL.createObjectURL(avatarFile.value);
  return productForm.value?.avatar_url;
});

// --- Métodos de Carga ---
onMounted(async () => {
  const productId = route.params.id;
  // Carga principal del producto y categorías
  await Promise.all([
    productStore.fetchProductById(productId),
    productStore.fetchAllCategories(),
  ]);

  const productData = productStore.selectedProduct;
  if (productData) {
    productForm.value = {
      id: productData.id,
      name: productData.name,
      reference: productData.reference,
      description: productData.description,
      avatar_url: productData.avatar_url,
      category: productData.category || null,
      subcategory: productData.subcategory || '',
      sizes: productData.sizes || '',
      price: productData.price || 0,
      stock: productData.stock || 0,
    };
  }
  // Carga de la galería por separado
  loadGallery();
});

async function loadGallery() {
  loadingGallery.value = true;
  const productId = route.params.id;
  gallery.value = await productStore.fetchGallery(productId);
  loadingGallery.value = false;
}

// --- Métodos de Galería ---
async function handleGalleryUpload() {
  if (!galleryFiles.value || galleryFiles.value.length === 0) return;
  const productId = productForm.value.id;
  try {
    const newImages = await productStore.uploadGalleryImages(productId, galleryFiles.value);
    gallery.value.push(...newImages); // Añadir nuevas imágenes a la lista
    galleryFiles.value = [];
    $q.notify({ color: 'positive', message: 'Imágenes subidas correctamente.' });
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error al subir imágenes.', error });
  }
}

function handleDeleteImage(imageId) {
  $q.dialog({
    title: 'Confirmar',
    message: '¿Estás seguro de eliminar esta imagen?',
    cancel: true,
  }).onOk(async () => {
    try {
      await productStore.deleteGalleryImage(imageId);
      gallery.value = gallery.value.filter(img => img.id !== imageId); // Actualizar UI
      $q.notify({ color: 'positive', message: 'Imagen eliminada.' });
    } catch (error) {
      $q.notify({ color: 'negative', message: 'Error al eliminar la imagen.', error });
    }
  });
}

// --- Métodos del Formulario Principal ---
const handleFileSelection = (file) => { avatarFile.value = file; };
const triggerFileInput = () => { fileInputRef.value.pickFiles(); };

async function onSubmit() {
  try {
    let newAvatarUrl = productForm.value.avatar_url;
    if (avatarFile.value) {
      newAvatarUrl = await productStore.uploadAvatarImage(avatarFile.value, productForm.value.id);
    }
    const productDataToUpdate = {
      ...productForm.value,
      avatar_url: newAvatarUrl,
      category_id: productForm.value.category?.id,
    };
    delete productDataToUpdate.category;
    await productStore.updateProduct(productDataToUpdate);
    $q.notify({ color: 'positive', message: 'Producto actualizado.' });
    router.push({ name: 'product-list' });
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error al actualizar el producto.', error });
  }
}
</script>
