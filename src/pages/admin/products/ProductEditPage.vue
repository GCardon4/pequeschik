<template>
  <q-page padding>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="text-h4">Edit Product</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="productForm.name"
              label="Name"
              filled
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please type something']"
            />
            <q-input
              v-model="productForm.reference"
              label="Reference"
              filled
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please type something']"
            />
            <q-file
              v-model="avatarFile"
              label="Avatar Image"
              filled
              accept="image/*"
            />
            <div v-if="imagePreviewUrl" class="q-mt-md">
              <q-img
                :src="imagePreviewUrl"
                style="max-width: 200px; max-height: 200px"
                contain
              />
            </div>
            <q-select
              v-model="productForm.category_id"
              :options="categoryOptions"
              label="Category"
              filled
              emit-value
              map-options
            />
            <q-editor
              v-model="productForm.description"
              min-height="5rem"
              :toolbar="[
                ['bold', 'italic', 'strike', 'underline'],
                ['hr', 'link'],
                ['unordered', 'ordered'],
                ['viewsource'],
              ]"
            />
            <div>
              <q-btn label="Update Product" type="submit" color="primary" />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from 'src/stores/productStore';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

/**
 * @type {object}
 * @property {function} notify - The Quasar notify function.
 */
const $q = useQuasar();

/**
 * @type {object}
 * @property {object} params - The route params.
 */
const route = useRoute();

/**
 * @type {object}
 * @property {function} push - The router push function.
 */
const router = useRouter();

/**
 */
const productStore = useProductStore();
const { selectedProduct, categories } = storeToRefs(productStore);

const avatarFile = ref(null);

/**
 * @type {import('vue').Ref<object>}
 * @property {string} name - The product name.
 * @property {string} reference - The product reference.
 * @property {string} avatar_url - The product avatar URL.
 * @property {number|null} category_id - The product category ID.
 * @property {string} description - The product description.
 */
const productForm = ref({
  name: '',
  reference: '',
  avatar_url: '',
  category_id: null,
  description: '',
});

/**
 * @type {import('vue').ComputedRef<string>}
 * @returns {string} The URL for the image preview.
 */
const imagePreviewUrl = computed(() => {
  if (avatarFile.value) {
    return URL.createObjectURL(avatarFile.value);
  }
  return productForm.value.avatar_url;
});

/**
 * @type {import('vue').ComputedRef<Array<object>>}
 * @returns {Array<object>} The list of categories formatted for the q-select component.
 */
const categoryOptions = computed(() =>
  categories.value.map((category) => ({
    label: category.name,
    value: category.id,
  }))
);

/**
 * Fetches the product and categories when the component is mounted.
 * @returns {void}
 */
onMounted(async () => {
  const productId = route.params.id;
  await productStore.fetchProductById(productId);
  await productStore.fetchAllCategories();
  if (selectedProduct.value) {
    productForm.value = {
      id: selectedProduct.value.id,
      name: selectedProduct.value.name,
      reference: selectedProduct.value.reference,
      avatar_url: selectedProduct.value.avatar_url,
      category_id: selectedProduct.value.category.id,
      description: selectedProduct.value.description,
    };
  }
});

/**
 * Gestiona el envío del formulario.
 * Primero, sube la imagen del avatar si se ha seleccionado una nueva.
 * Luego, actualiza los datos del producto en la base de datos.
 * @returns {Promise<void>}
 */
const onSubmit = async () => {
  try {
    // Si se ha seleccionado un nuevo archivo de imagen, subirlo primero.
    if (avatarFile.value) {
      const newAvatarUrl = await productStore.uploadAvatarImage(avatarFile.value);
      productForm.value.avatar_url = newAvatarUrl;
    }

    // Actualizar el producto con los nuevos datos.
    await productStore.updateProduct(productForm.value);

    // Notificar al usuario que la operación fue exitosa.
    $q.notify({
      color: 'positive',
      message: 'Producto actualizado correctamente',
    });

    // Redirigir al usuario a la lista de productos.
    router.push({ name: 'product-list' });
  } catch (error) {
    // Si ocurre un error, mostrar una notificación detallada.
    console.error('Fallo al actualizar el producto:', error);
    $q.notify({
      color: 'negative',
      message: 'Error al actualizar el producto',
      caption: error.message, // Usar 'caption' para mostrar los detalles del error.
    });
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
