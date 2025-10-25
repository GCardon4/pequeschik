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
 * @type {object}
 * @property {object} productStore - The product store.
 * @property {object} selectedProduct - The selected product.
 * @property {Array} categories - The list of categories.
 * @property {boolean} loading - The loading status.
 */
const productStore = useProductStore();
const { selectedProduct, categories } = storeToRefs(productStore);

/**
 * @type {import('vue').Ref<object>}
 * @property {string} name - The product name.
 * @property {string} reference - The product reference.
 * @property {number|null} category_id - The product category ID.
 * @property {string} description - The product description.
 */
const productForm = ref({
  name: '',
  reference: '',
  category_id: null,
  description: '',
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
      category_id: selectedProduct.value.category.id,
      description: selectedProduct.value.description,
    };
  }
});

/**
 * Handles the form submission.
 * @returns {Promise<void>}
 */
const onSubmit = async () => {
  try {
    await productStore.updateProduct(productForm.value);
    $q.notify({
      color: 'positive',
      message: 'Product updated successfully',
    });
    router.push({ name: 'product-list' });
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error updating product',
      error: error.message,
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
