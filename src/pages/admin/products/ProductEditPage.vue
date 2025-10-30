<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Editar Producto</div>

    <q-card v-if="productForm">
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

          <!-- Campo de la Categoría (Corregido) -->
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
              ref="fileInputRef"
              v-model="avatarFile"
              label="Seleccionar nueva imagen"
              accept="image/*"
              filled
              style="max-width: 300px"
              @update:model-value="handleFileSelection"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <q-avatar
              v-if="imagePreviewUrl"
              size="100px"
              class="cursor-pointer"
              @click="triggerFileInput"
            >
              <q-img :src="imagePreviewUrl" ratio="1" />
            </q-avatar>
          </div>

          <!-- Botones de Acción -->
          <div class="q-mt-lg">
            <q-btn
              label="Actualizar Producto"
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

// --- Composables ---
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const productStore = useProductStore();

// --- State ---
const productForm = ref(null);
const avatarFile = ref(null);
const fileInputRef = ref(null);

// --- Getters and Computed Properties ---
const loading = computed(() => productStore.getLoadingStatus);
const categories = computed(() => productStore.getAllCategories);
const imagePreviewUrl = computed(() => {
  if (avatarFile.value) {
    return URL.createObjectURL(avatarFile.value);
  }
  return productForm.value?.avatar_url;
});

// --- Lifecycle Hooks ---
onMounted(async () => {
  const productId = route.params.id;
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
      avatar_url: productData.avatar_url,
      // Se asigna el objeto de categoría completo
      category: productData.category || null,
      subcategory: productData.subcategory || '',
      sizes: productData.sizes || '',
      price: productData.price || 0,
      stock: productData.stock || 0,
    };
  }
});

// --- Methods ---

const handleFileSelection = (file) => {
  avatarFile.value = file;
};

const triggerFileInput = () => {
  fileInputRef.value.pickFiles();
};

const onSubmit = async () => {
  try {
    let newAvatarUrl = productForm.value.avatar_url;
    if (avatarFile.value) {
      newAvatarUrl = await productStore.uploadAvatarImage(avatarFile.value);
    }

    // Se prepara el objeto para la base de datos
    const productDataToUpdate = {
      ...productForm.value,
      avatar_url: newAvatarUrl,
      category_id: productForm.value.category?.id, // Se extrae el ID
    };
    // Se elimina el objeto anidado para evitar conflictos con Supabase
    delete productDataToUpdate.category;

    await productStore.updateProduct(productDataToUpdate);

    $q.notify({
      color: 'positive',
      message: 'Producto actualizado correctamente',
      icon: 'check_circle',
    });

    router.push({ name: 'product-list' });
  } catch (error) {
    $q.notify({
      color: 'negative',
      message:
        error.message || 'Error al actualizar el producto. Intente de nuevo.',
      icon: 'error',
    });
  }
};
</script>
