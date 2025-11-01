<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Crear Nuevo Producto</div>

    <q-card>
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <!-- Campo del Nombre -->
          <q-input
            v-model="productForm.name"
            label="Nombre del Producto"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'El nombre es requerido']"
          />

          <!-- Campo de la Referencia -->
          <q-input
            v-model="productForm.reference"
            label="Referencia"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'La referencia es requerida']"
          />

          <!-- Campo de la Descripción -->
          <q-input
            v-model="productForm.description"
            label="Descripción"
            filled
            lazy-rules
          />

          <!-- Campo de la Categoría  -->
          <q-select
            v-model="productForm.category"
            :options="categories"
            option-label="name"
            label="Categoría"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'La categoría es requerida']"
          />

          <!-- Nuevos Campos -->
          <q-input
            v-model="productForm.subcategory"
            label="Subcategoría"
            filled
            placeholder="Ej: Camisetas, Pantalones"
          />

          <q-input
            v-model="productForm.sizes"
            label="Tallas"
            filled
            placeholder="Ej: S, M, L, XL"
          />

          <div class="row q-gutter-md">
            <q-input
              v-model.number="productForm.price"
              label="Precio"
              type="number"
              filled
              prefix="COP $"
              class="col"
              :rules="[(val) => val >= 0 || 'El precio no puede ser negativo']"
            />

            <q-input
              v-model.number="productForm.stock"
              label="Stock"
              type="number"
              filled
              class="col"
              :rules="[
                (val) => val >= 0 || 'El stock no puede ser negativo',
                (val) =>
                  /^\d+$/.test(val) || 'El stock debe ser un número entero',
              ]"
            />
          </div>

          <!-- Sección del Avatar -->
          <div class="text-subtitle1 q-mt-md">Avatar del Producto</div>
          <div class="row items-center q-gutter-md">
            <q-file
              v-model="avatarFile"
              label="Seleccionar imagen principal"
              accept="image/*"
              filled
              style="max-width: 300px"
              @update:model-value="handleFileSelection"
            />
            <q-avatar v-if="imagePreviewUrl" size="100px">
              <q-img :src="imagePreviewUrl" ratio="1" />
            </q-avatar>
          </div>

          <!-- Botones de Acción -->
          <div class="q-mt-lg">
            <q-btn
              label="Crear Producto"
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
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useProductStore } from 'src/stores/productStore';

const router = useRouter();
const $q = useQuasar();
const productStore = useProductStore();

// --- State ---
const productForm = ref({
  name: '',
  reference: '',
  description: '',
  category: null, // <--- Vinculado al objeto completo
  avatar_url: '',
  subcategory: '',
  sizes: '',
  price: 0,
  stock: 0,
});
const avatarFile = ref(null);

// --- Getters and Computed Properties ---
const loading = computed(() => productStore.getLoadingStatus);
const categories = computed(() => productStore.getAllCategories);
const imagePreviewUrl = computed(() => {
  if (avatarFile.value) {
    return URL.createObjectURL(avatarFile.value);
  }
  return null;
});

// --- Lifecycle Hooks ---
onMounted(() => {
  productStore.fetchAllCategories();
});

// --- Methods ---
const handleFileSelection = (file) => {
  avatarFile.value = file;
};

const onSubmit = async () => {
  try {
    let avatarUrl = '';
    if (avatarFile.value) {
      avatarUrl = await productStore.uploadAvatarImage(avatarFile.value);
    }

    // Prepara el objeto de datos para la base de datos
    const productDataToCreate = {
      ...productForm.value,
      avatar_url: avatarUrl,
      category_id: productForm.value.category?.id, // Extrae el ID del objeto
    };
    delete productDataToCreate.category; // Elimina el objeto para evitar conflictos

    await productStore.createProduct(productDataToCreate);

    $q.notify({
      color: 'positive',
      message: 'Producto creado correctamente',
      icon: 'check_circle',
    });
    router.push({ name: 'product-list' });
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message || 'Error al crear el producto.',
      icon: 'error',
    });
  }
};
</script>
