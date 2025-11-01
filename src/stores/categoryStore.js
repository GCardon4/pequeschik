// Almacenamiento de Categorías
import { defineStore } from "pinia";
import { supabase } from "boot/supabase";
import { useQuasar } from "quasar";

export const useCategoryStore = defineStore("categoryStore", {
  state: () => ({
    categories: [],
    loading: false,
  }),

  actions: {
    // Obtener todas las categorías
    async fetchCategories() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        this.categories = data;
      } catch (error) {
        console.error("Error al obtener las categorías:", error.message);
        const $q = useQuasar();
        $q.notify({
          color: "negative",
          message: "Error al cargar las categorías: " + error.message,
          icon: "report_problem",
        });
      } finally {
        this.loading = false;
      }
    },

    // Crear una nueva categoría
    async createCategory(category) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from("categories")
          .insert([category])
          .select();

        if (error) throw error;

        this.categories.push(data[0]);
        const $q = useQuasar();
        $q.notify({
          color: "positive",
          message: "Categoría creada con éxito.",
          icon: "check_circle",
        });
        return data[0];
      } catch (error) {
        console.error("Error al crear la categoría:", error.message);
        const $q = useQuasar();
        $q.notify({
          color: "negative",
          message: "Error al crear la categoría: " + error.message,
          icon: "report_problem",
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Actualizar una categoría existente
    async updateCategory(category) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from("categories")
          .update(category)
          .eq("id", category.id)
          .select();

        if (error) throw error;

        const index = this.categories.findIndex((c) => c.id === category.id);
        if (index !== -1) {
          this.categories[index] = data[0];
        }
        const $q = useQuasar();
        $q.notify({
          color: "positive",
          message: "Categoría actualizada con éxito.",
          icon: "check_circle",
        });
        return data[0];
      } catch (error) {
        console.error("Error al actualizar la categoría:", error.message);
        const $q = useQuasar();
        $q.notify({
          color: "negative",
          message: "Error al actualizar la categoría: " + error.message,
          icon: "report_problem",
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Eliminar una categoría
    async deleteCategory(categoryId) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", categoryId);

        if (error) throw error;

        this.categories = this.categories.filter((c) => c.id !== categoryId);
        const $q = useQuasar();
        $q.notify({
          color: "positive",
          message: "Categoría eliminada con éxito.",
          icon: "check_circle",
        });
        return true;
      } catch (error) {
        console.error("Error al eliminar la categoría:", error.message);
        const $q = useQuasar();
        $q.notify({
          color: "negative",
          message: "Error al eliminar la categoría: " + error.message,
          icon: "report_problem",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
