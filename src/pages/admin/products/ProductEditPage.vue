<template>
  <q-page padding>
    <div class="q-pa-md" v-if="product">
      <div class="text-h4 q-mb-md">Editar Producto</div>

      <q-card>
        <q-card-section>
          <q-form @submit.prevent="handleSubmit">
            <div class="row q-col-gutter-md">
              <!-- Columna Izquierda: Detalles y Avatar -->
              <div class="col-xs-12 col-md-4">
                <q-img
                  :src="imagePreviewUrl || product.avatar_url"
                  style="max-height: 300px; border-radius: 8px"
                  fit="contain"
                  class="q-mb-md"
                >
                  <template v-slot:error>
                    <div
                      class="absolute-full flex flex-center bg-grey-3 text-grey-8"
                    >
                      <q-icon name="image" size="3rem" />
                      <div>No hay imagen</div>
                    </div>
                  </template>
                </q-img>

                <q-file
                  v-model="avatarFile"
                  label="Cambiar imagen principal"
                  accept="image/*"
                  filled
                  capture="camera"
                  style="max-width: 400px"
                  @update:model-value="handleFileSelection"
                />
              </div>

              <!-- Columna Derecha: Formulario de Edición -->
              <div class="col-xs-12 col-md-8">
                <q-input
                  v-model="product.name"
                  label="Nombre del Producto"
                  filled
                  :rules="[(val) => !!val || 'El nombre es requerido']"
                />

                <q-input
                  v-model="product.reference"
                  label="Referencia"
                  filled
                  class="q-mt-md"
                />

                <q-editor
                  v-model="product.description"
                  label="Descripción"
                  filled
                  class="q-mt-md"
                  min-height="150px"
                />

                <q-select
                  v-model="product.category_id"
                  :options="categoryOptions"
                  label="Categoría"
                  emit-value
                  map-options
                  filled
                  class="q-mt-md"
                  :rules="[
                    (val) => val !== null || 'La categoría es requerida',
                  ]"
                />

                <q-input
                  v-model.number="product.price"
                  label="Precio"
                  type="number"
                  step="0.01"
                  filled
                  class="q-mt-md"
                />

                <q-input
                  v-model.number="product.stock_quantity"
                  label="Cantidad en Stock"
                  type="number"
                  filled
                  class="q-mt-md"
                />

                <q-toggle
                  v-model="product.is_active"
                  label="Producto Activo"
                  class="q-mt-md"
                />
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="q-mt-lg">
              <q-btn
                label="Guardar Cambios"
                type="submit"
                color="primary"
                :loading="loading"
              />
              <q-btn
                label="Cancelar"
                color="grey"
                class="q-ml-sm"
                :to="{ name: 'product-list' }"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <div v-else class="flex flex-center" style="height: 80vh">
      <q-spinner-gears size="50px" color="primary" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useProductStore } from "src/stores/productStore";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

// Configuración de Quasar, Router y Route
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const productStore = useProductStore();

// Estado del componente
const product = ref(null);
const avatarFile = ref(null);
const imagePreviewUrl = ref(null);
const categoryOptions = ref([]);
const loading = ref(false);

// Cargar datos del producto y categorías
onMounted(async () => {
  const productId = route.params.id;

  // Cargar categorías
  await productStore.fetchCategories();
  categoryOptions.value = productStore.categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  // Cargar producto
  await productStore.fetchProductById(productId);
  if (productStore.currentProduct) {
    product.value = { ...productStore.currentProduct };
  } else {
    $q.notify({
      color: "negative",
      message: "No se pudo cargar el producto.",
      icon: "error",
    });
    router.push({ name: "product-list" });
  }
});

// Manejo de la selección de archivos
const handleFileSelection = (file) => {
  avatarFile.value = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Envío del formulario
const handleSubmit = async () => {
  loading.value = true;
  try {
    await productStore.updateProduct(product.value, avatarFile.value);
    $q.notify({
      color: "positive",
      message: "Producto actualizado con éxito.",
      icon: "check_circle",
    });
    router.push({ name: "product-list" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    $q.notify({
      color: "negative",
      message:
        "Error al actualizar el producto. " +
        (error.message || "Por favor, intente de nuevo."),
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Observar cambios en el producto actual de la tienda
watch(
  () => productStore.currentProduct,
  (newProduct) => {
    if (newProduct) {
      product.value = { ...newProduct };
    }
  }
);
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
