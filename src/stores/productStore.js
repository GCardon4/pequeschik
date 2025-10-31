import { defineStore } from 'pinia';
import { supabase } from 'src/config/supabase';
import { useAuthStore } from './storeAuth';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    categories: [],
    selectedProduct: null,
    loading: false,
    error: null,
  }),
  getters: {
    getAllProducts: (state) => state.products,
    getAllCategories: (state) => state.categories,
    getLoadingStatus: (state) => state.loading,
    getError: (state) => state.error,
    getFilteredProducts: (state) => {
      if (!state.selectedCategory) {
        return state.products;
      }
      return state.products.filter(
        (product) => product.category.id === state.selectedCategory
      );
    },
  },
  actions: {
    async fetchAllProducts() {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(id, name)');
        if (error) throw error;
        const defaultImageUrl =
          'https://vssnhqhfasirinocufbs.supabase.co/storage/v1/object/public/avatars/avatar-img-default.png';
        this.products = data.map((product) => ({
          ...product,
          avatar_url: product.avatar_url || defaultImageUrl,
        }));
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchProductById(productId) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(id, name)')
          .eq('id', productId)
          .single();
        if (error) throw error;
        const defaultImageUrl =
          'https://vssnhqhfasirinocufbs.supabase.co/storage/v1/object/public/avatars/avatar-img-default.png';
        this.selectedProduct = {
          ...data,
          avatar_url: data.avatar_url || defaultImageUrl,
        };
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async createProduct() {
      // ... (sin cambios)
    },

    async updateProduct(productData) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productData.id)
          .select('*, category:categories(id, name)')
          .single();
        if (error) throw error;
        const index = this.products.findIndex((p) => p.id === productData.id);
        if (index !== -1) {
          this.products[index] = data;
        }
      } catch (err) {
        this.error = err.message;
        console.error('Error updating product:', err.message);
      } finally {
        this.loading = false;
      }
    },

    async fetchAllCategories() {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, icon');
        if (error) {
          throw error;
        }
        this.categories = data;
        console.log('Categorias cargadss:', data);
      } catch (err) {
        this.error = err.message;
        console.error('Error Trayendo Categorías:', err.message);
      } finally {
        this.loading = false;
      }
    },

    // *Selección por Filtros de Categoría
    setSelectedCategory(categoryId) {
      this.selectedCategory = categoryId;
    },

    async uploadAvatarImage(file) {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();

      // 2. Verificar si el usuario está autenticado
      if (!authStore.user) {
        this.error = 'Usuario no autenticado. No se puede subir la imagen.';
        console.error(this.error);
        this.loading = false;
        throw new Error(this.error);
      }

      try {
        // 3. Crear una ruta de archivo específica para el usuario
        const userId = authStore.user.id;
        const filePath = `${userId}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        return data.publicUrl;
      } catch (err) {
        this.error = err.message;
        console.error('Error al subir la imagen del avatar:', err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // --- Acciones para la Galería ---

    /**
     * Obtiene la galería de imágenes de un producto específico.
     * @param {string} productId - El ID del producto.
     * @returns {Promise<Array>} La lista de imágenes de la galería.
     */
    async fetchGallery(productId) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('product_images')
          .select('id, image_url')
          .eq('product_id', productId);
        if (error) throw error;
        return data || [];
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching gallery:', err.message);
        return [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Sube una o más imágenes a la galería de un producto.
     * @param {string} productId - El ID del producto.
     * @param {File[]} files - Un array de archivos a subir.
     * @returns {Promise<Object[]>} Los registros de las nuevas imágenes.
     */
    async uploadGalleryImages(productId, files) {
      const authStore = useAuthStore();
      if (!authStore.user) throw new Error('Usuario no autenticado.');
      this.loading = true;
      this.error = null;

      const uploadPromises = files.map(async (file) => {
        const filePath = `gallery/${productId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars') // Asumiendo que usas el mismo bucket
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        return {
          product_id: productId,
          image_url: publicUrlData.publicUrl,
        };
      });

      try {
        const newImageRecords = await Promise.all(uploadPromises);
        const { data, error } = await supabase
          .from('product_images')
          .insert(newImageRecords)
          .select();
        if (error) throw error;
        return data;
      } catch (err) {
        this.error = err.message;
        console.error('Error subiendo imágenes a galería:', err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**  * Elimina una imagen de la galería.   */
    async deleteGalleryImage(imageId) {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabase
          .from('product_images')
          .delete()
          .eq('id', imageId);
        if (error) throw error;
      } catch (err) {
        this.error = err.message;
        console.error('Error eliminando imagen de galería:', err.message);
        throw err;
      } finally {
        this.loading = false;
      }
    },

   


  },
});
