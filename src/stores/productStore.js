import { defineStore } from 'pinia';
import { supabase } from 'src/config/supabase';
import { useAuthStore } from './storeAuth'; // 1. Importar useAuthStore

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    categories: [],
    selectedProduct: null,
    selectedCategory: null,
    loading: false,
    error: null,
  }),
  getters: {
    // ... (getters sin cambios)
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
    // ... (otras acciones sin cambios)
    async fetchAllProducts() {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(id, name)');
        if (error) {
          throw error;
        }
        const defaultImageUrl =
          'https://vssnhqhfasirinocufbs.supabase.co/storage/v1/object/public/avatars/avatar-img-default.png';
        this.products = data.map((product) => ({
          ...product,
          avatar_url: product.avatar_url || defaultImageUrl,
        }));
      } catch (err) {
        this.error = err.message;
        console.error('Error trayendo productos:', err.message);
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
        if (error) {
          throw error;
        }
        const defaultImageUrl =
          'https://vssnhqhfasirinocufbs.supabase.co/storage/v1/object/public/avatars/avatar-img-default.png';
        this.selectedProduct = {
          ...data,
          avatar_url: data.avatar_url || defaultImageUrl,
        };
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching product:', err.message);
      } finally {
        this.loading = false;
      }
    },
    async createProduct(productData) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        if (error) {
          throw error;
        }
        this.products.push(data);
        return data;
      } catch (err) {
        this.error = err.message;
        console.error('Error creating product:', err.message);
        throw err;
      } finally {
        this.loading = false;
      }
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
        if (error) {
          throw error;
        }
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
          .select('id, name, icon, subcategories')
          .order('id', { ascending: true });
        if (error) {
          throw error;
        }
        this.categories = data;
      } catch (err) {
        this.error = err.message;
        console.error('Error Trayendo Categorías:', err.message);
      } finally {
        this.loading = false;
      }
    },
    setSelectedCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
    /**
     * Sube una imagen de avatar a Supabase Storage.
     * Requiere que el usuario esté autenticado.
     * @async
     * @param {File} file - El archivo de imagen a subir.
     * @returns {Promise<string>} La URL pública de la imagen subida.
     */
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
  },
});
