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
      // Obtener todos los productos
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(id, name)');
        if (error) throw error;

        const defaultImageUrl = 'https://iqnxgapixnukuqpwftfn.supabase.co/storage/v1/object/public/avatars/avatar-img-default.png';

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
      // Obtener un producto por su ID
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(id, name)')
          .eq('id', productId)
          .single();
        if (error) throw error;

        const defaultImageUrl = 'https://iqnxgapixnukuqpwftfn.supabase.co/storage/v1/object/public/avatars/avatar-img-default.png';

        if (data) {
          this.selectedProduct = {
            ...data,
            avatar_url: data.avatar_url || defaultImageUrl,
          };
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(productData) {
      // Crear un nuevo producto
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        if (error) throw error;
        this.products.push(data);
        return data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(productData) {
      // Actualizar un producto existente
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
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(productId) {
      // Eliminar un producto
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) throw error;
        this.products = this.products.filter((p) => p.id !== productId);
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchAllCategories() {
      // Obtener todas las categorías
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase.from('categories').select('id, name, icon');
        if (error) throw error;
        this.categories = data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    setSelectedCategory(categoryId) {
      // Establecer la categoría seleccionada para filtrar
      this.selectedCategory = categoryId;
    },

    async uploadAvatarImage(file, productId) {
      // Subir imagen de avatar y devolver la URL pública
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      if (!authStore.user) throw new Error('Usuario no autenticado.');

      try {
        const filePath = `products/${productId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return data.publicUrl;
        
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
