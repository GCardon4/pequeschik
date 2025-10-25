<template>
  <!-- ... existing layout structure ... -->
  <q-list>
    <EssentialLink
      v-for="link in adminLinks"
      :key="link.title"
      v-bind="link"
    />
  </q-list>
  <!-- ... rest of the layout ... -->
</template>

<script setup>
  import EssentialLink from 'components/EssentialLink.vue';
  import { useNavigationStore } from 'src/stores/navigationStore';
  import { computed } from 'vue';

  // ... other script logic ...

  const navigationStore = useNavigationStore();
  const adminLinks = computed(() => navigationStore.getAdminLinks);
</script>
