import { defineStore } from 'pinia';
import { supabase } from 'src/config/supabase';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    categories: [],
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
      return state.products.filter(product => product.category.id === state.selectedCategory);
    },
  },
  actions: {
    /**
     * Fetches all products from the 'products' table in Supabase, including category details.
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
        this.products = data;
        console.log('Productos cargados:', data); // Add this log
      } catch (err) {
        this.error = err.message;
        console.error('Error trayendo productos:', err.message);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetches all categories from the 'categories' table in Supabase.
     * @async
     * @returns {Promise<void>}
     */
    async fetchAllCategories() {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, icon'); // Added icon to the select statement for categories
        if (error) {
          throw error;
        }
        this.categories = data;
        console.log('Categorías cargadas:', data); // Add this log
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