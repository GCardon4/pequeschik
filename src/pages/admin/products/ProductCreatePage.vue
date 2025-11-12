<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-h4 q-mb-md">Crear Nuevo Producto</div>

      <q-card>
        <q-card-section>
          <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

                <q-input
                  v-model="product.name"
                  label="Nombre del Producto"
                  filled
                  :rules="[(val) => !!val || 'El nombre es requerido']"
                />

                <q-select
                  v-model="product.category"
                  :options="categories"
                  option-label="name"
                  label="Categoría"
                  filled
                />
                <q-input v-model="product.subcategory" label="Subcategoría" filled />
                <q-input v-model="product.sizes" label="Tallas" filled />
                <div class="row q-gutter-md">
                  <q-input v-model.number="product.price" label="Precio" type="number" filled prefix="COP $" class="col" />
                  <q-input v-model.number="product.stock" label="Stock" type="number" filled class="col" />
                </div>

                 <!-- Avatar (Imagen Principal) -->
                <div class="text-subtitle1 q-mt-md">Imagen del Producto</div>
                <div class="row items-center q-gutter-md">
                  <q-file ref="fileInputRef" v-model="avatarFile" label="Seleccionar nueva imagen" accept="image/*" filled style="max-width: 300px" @update:model-value="handleFileSelection" />
                  <q-avatar v-if="imagePreviewUrl" size="100px" class="cursor-pointer" @click="triggerFileInput">
                    <q-img :src="imagePreviewUrl" ratio="1" />
                  </q-avatar>
                </div>

            <!-- Sección de Galería de Imágenes -->
            <div class="q-mt-xl">
              <div class="text-h6">Galería de Imágenes</div>
              <q-file
                v-model="galleryFiles"
                label="Añadir imágenes a la galería"
                multiple
                accept="image/*"
                filled
                capture="camera"
                style="max-width: 400px"
                @update:model-value="handleGallerySelection"
              />
              <div class="q-mt-md row q-gutter-md">
                <q-img
                  v-for="(url, index) in galleryPreviewUrls"
                  :key="index"
                  :src="url"
                  class="gallery-thumbnail"
                />
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="q-mt-lg">
              <q-btn
                label="Guardar Producto"
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "src/stores/productStore";
import { useCategoryStore } from "src/stores/categoryStore"
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

// Configuración de Quasar y Router
const $q = useQuasar();
const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

// Estado del componente
const product = ref({
  name: "",
  reference: "",
  description: "",
  category_id: null,
  price: 0,
  stock_quantity: 0,
  is_active: true,
});
const avatarFile = ref(null);
const imagePreviewUrl = ref(null);
const galleryFiles = ref([]);
const galleryPreviewUrls = ref([]);
const categoryOptions = ref([]);
const loading = ref(false);

// Cargar categorías al montar el componente
onMounted(async () => {
  await categoryStore.fetchCategories();
  categoryOptions.value = productStore.categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));
});

// Manejo de la selección de la imagen principal
const handleFileSelection = (file) => {
  // Acción: Seleccionar Avatar
  avatarFile.value = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreviewUrl.value = null;
  }
};

// Manejo de la selección de imágenes de la galería
const handleGallerySelection = (files) => {
  galleryFiles.value = files;
  if (files && files.length > 0) {
    galleryPreviewUrls.value = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        galleryPreviewUrls.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  } else {
    galleryPreviewUrls.value = [];
  }
};

// Envío del formulario
const handleSubmit = async () => {
  loading.value = true;
  try {
    await productStore.createProduct(
      product.value,
      avatarFile.value,
      galleryFiles.value
    );

    $q.notify({
      color: "positive",
      message: "Producto creado exitosamente.",
      icon: "check_circle",
    });

    router.push({ name: "product-list" });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    $q.notify({
      color: "negative",
      message:
        "Hubo un error al crear el producto. " +
        (error.message || "Por favor, intente de nuevo."),
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.gallery-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
