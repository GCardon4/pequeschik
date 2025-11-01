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
        const { id, ...dataToUpdate } = productData;
        const { data, error } = await supabase
          .from('products')
          .update(dataToUpdate)
          .eq('id', id)
          .select('*, category:categories(id, name)')
          .single();
        if (error) throw error;

        // Actualizar el producto en la lista principal
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.products[index] = data;
        }

        // Asegurarse de actualizar también el producto seleccionado si es el mismo
        if (this.selectedProduct && this.selectedProduct.id === id) {
          this.selectedProduct = data;
        }

      } catch (err) {
        this.error = err.message;
        console.error('Error updating product:', err.message);
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

    // --- Acciones para la Galería ---
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

    async uploadGalleryImages(productId, files) {
      const authStore = useAuthStore();
      if (!authStore.user) throw new Error('Usuario no autenticado.');
      this.loading = true;
      this.error = null;

      const uploadPromises = files.map(async (file) => {
        const filePath = `gallery/${productId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
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