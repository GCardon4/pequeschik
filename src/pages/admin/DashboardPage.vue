<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Dashboard</div>

    <div class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Gestión de Productos</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Administra el catálogo de productos de la tienda.
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            icon="add_circle"
            label="Crear Producto"
            :to="{ name: 'product-create' }"
          />
          <q-btn
            flat
            color="primary"
            icon="list"
            label="Ver Productos"
            :to="{ name: 'product-list' }"
          />
        </q-card-actions>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">Gestión de Usuarios</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Administra los usuarios y sus roles en el sistema.
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            color="secondary"
            icon="person_add"
            label="Crear Usuario"
            :to="{ name: 'user-create' }"
          />
          <q-btn
            flat
            color="secondary"
            icon="people"
            label="Ver Usuarios"
            :to="{ name: 'user-list' }"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
// No script logic needed for this view yet
</script>

<style scoped>
.q-card {
  max-width: 400px;
}
</style>
