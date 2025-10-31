// Importar las dependencias necesarias
import { useAuthStore } from 'stores/storeAuth';
import { supabase } from 'src/config/supabase';

export default async ({ store }) => {
  // Obtener el store de autenticación
  const authStore = useAuthStore(store);

  // Comprobar si hay un usuario autenticado al iniciar la aplicación
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    authStore.user = session.user;
    await authStore.loadProfile();
  }

  // Escuchar los cambios en el estado de autenticación
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      authStore.user = session.user;
      authStore.loadProfile();
    } else if (event === 'SIGNED_OUT') {
      authStore.user = null;
      authStore.profile = null;
    }
  });
};
