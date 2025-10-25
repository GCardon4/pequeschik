<template>
  <q-page padding>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="text-h4">Product List</h1>
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col-12">
          <q-btn
            color="primary"
            label="Create Product"
            @click="goToCreateProduct"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-table
            :rows="products"
            :columns="columns"
            row-key="id"
            :loading="loading"
          >
            <template v-slot:body-cell-avatar_url="props">
              <q-td :props="props">
                <q-img
                  :src="props.row.avatar_url"
                  style="height: 50px; max-width: 50px"
                  contain
                />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  icon="edit"
                  @click="editProduct(props.row.id)"
                />
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteProduct(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from 'src/stores/productStore';
import { storeToRefs } from 'pinia';

/**
 * @type {object}
 * @property {function} push - The router push function.
 */
const router = useRouter();

/**
 * @type {object}
 * @property {object} productStore - The product store.
 * @property {Array} products - The list of products.
 * @property {boolean} loading - The loading status.
 */
const productStore = useProductStore();
const { products, loading } = storeToRefs(productStore);

/**
 * @type {Array<object>}
 * @property {string} name - The column name.
 * @property {string} label - The column label.
 * @property {string} field - The column field.
 * @property {string} align - The column alignment.
 * @property {boolean} sortable - Whether the column is sortable.
 */
const columns = [
  {
    name: 'avatar_url',
    label: 'Image',
    field: 'avatar_url',
    align: 'left',
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'category',
    label: 'Category',
    field: (row) => row.category.name,
    align: 'left',
    sortable: true,
  },
  {
    name: 'reference',
    label: 'Reference',
    field: 'reference',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'right',
  },
];

/**
 * Fetches all products when the component is mounted.
 * @returns {void}
 */
onMounted(() => {
  productStore.fetchAllProducts();
});

/**
 * Navigates to the product creation page.
 * @returns {void}
 */
const goToCreateProduct = () => {
  router.push({ name: 'product-create' });
};

/**
 * Navigates to the product edit page.
 * @param {number} id - The ID of the product to edit.
 * @returns {void}
 */
const editProduct = (id) => {
  router.push({ name: 'product-edit', params: { id } });
};

/**
 * Deletes a product.
 * @param {number} id - The ID of the product to delete.
 * @returns {void}
 */
const deleteProduct = (id) => {
  // Implement delete logic here
  console.log('Delete product with id:', id);
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
