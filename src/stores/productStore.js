import { defineStore } from 'pinia';
import { supabase } from 'src/config/supabase';

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
    /**
     * @returns {Array} The list of all products.
     */
    getAllProducts: (state) => state.products,
    /**
     * @returns {Array} The list of all categories.
     */
    getAllCategories: (state) => state.categories,
    /**
     * @returns {boolean} The loading status.
     */
    getLoadingStatus: (state) => state.loading,
    /**
     * @returns {string|null} Any error that occurred.
     */
    getError: (state) => state.error,
    /**
     * @returns {Array} The list of products filtered by the selected category.
     */
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
    /**
     * Fetches all products from the 'products' table in Supabase, including category details and handles default image if avatar_url is empty.
     * @async
     * @returns {Promise<void>}
     */
    async fetchAllProducts() {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(id, name)'); // Fetch category details
        if (error) {
          throw error;
        }

        const defaultImageUrl =
          'https://vssnhqhfasirinocufbs.supabase.co/storage/v1/object/public/Products/Avatar/avatar-img-default.png'; // Defualt Image

        this.products = data.map((product) => ({
          ...product,
          avatar_url: product.avatar_url || defaultImageUrl,
        }));
        console.log('Productos cargados:', this.products);
      } catch (err) {
        this.error = err.message;
        console.error('Error trayendo productos:', err.message);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetches a single product by its ID from the 'products' table in Supabase.
     * @async
     * @param {string} productId The ID of the product to fetch.
     * @returns {Promise<void>}
     */
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
        this.selectedProduct = data;
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching product:', err.message);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Creates a new product in the 'products' table in Supabase.
     * @async
     * @param {object} productData The data of the product to create.
     * @returns {Promise<object>} The newly created product.
     */
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

    /**
     * Updates a product in the 'products' table in Supabase.
     * @async
     * @param {object} productData The data of the product to update.
     * @returns {Promise<void>}
     */
    async updateProduct(productData) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productData.id);
        if (error) {
          throw error;
        }
        // Update the local products array
        const index = this.products.findIndex((p) => p.id === productData.id);
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...data[0] };
        }
      } catch (err) {
        this.error = err.message;
        console.error('Error updating product:', err.message);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetches all categories from the 'categories' table in Supabase and orders them by the 'index' field.
     * @async
     * @returns {Promise<void>}
     */
    async fetchAllCategories() {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, icon')
          .order('id', { ascending: true }); // Order by ID
        if (error) {
          throw error;
        }
        this.categories = data;
        console.log('Categorias cargadas:', data);
      } catch (err) {
        this.error = err.message;
        console.error('Error Trayendo Categorías:', err.message);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Sets the selected category for filtering products.
     * @param {string|null} categoryId The ID of the selected category, or null to show all products.
     */
    setSelectedCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
  },
});
