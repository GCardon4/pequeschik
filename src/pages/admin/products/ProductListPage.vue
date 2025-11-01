<template>
  <q-page padding>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="text-h4">Lista de Productos</h1>
        </div>
      </div>
      <div class="row q-mb-md">
        <div class="col-12">
          <q-btn
            color="primary"
            label="Crear Producto"
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
                  @click="confirmDeleteProduct(props.row.id)"
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
import { useQuasar } from 'quasar';

const router = useRouter();
const productStore = useProductStore();
const { products, loading } = storeToRefs(productStore);
const $q = useQuasar();

/** Columnas Que traemos a la Tabla */
const columns = [
  {
    name: 'avatar_url',
    label: 'Imagen',
    field: 'avatar_url',
    align: 'left',
  },
  {
    name: 'name',
    label: 'Nombre',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'category',
    label: 'Categoria',
    field: (row) => row.category.name,
    align: 'left',
    sortable: true,
  },
  {
    name: 'reference',
    label: 'Código',
    field: 'reference',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Descripción',
    field: 'description',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'right',
  },
];


onMounted(() => {
  productStore.fetchAllProducts();
});


const goToCreateProduct = () => {
  router.push({ name: 'product-create' });
};

const editProduct = (id) => {
  router.push({ name: 'product-edit', params: { id } });
};


const confirmDeleteProduct = (id) => {
  $q.dialog({
    title: 'Confirmar',
    message: '¿Estás seguro de que quieres eliminar este producto?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await productStore.deleteProduct(id);
      $q.notify({
        color: 'positive',
        message: 'Producto eliminado correctamente',
      });
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: `Error al eliminar el producto: ${error.message}`,
      });
    }
  });
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
