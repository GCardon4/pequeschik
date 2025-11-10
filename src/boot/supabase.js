// Importar las dependencias necesarias
import { useAuthStore } from 'stores/storeAuth';
import { supabase } from 'src/config/supabase';

// Acción: Inicializar autenticación Supabase y listeners
export default async ({ app }) => {
  const authStore = useAuthStore();

  // Acción: Verificar sesión inicial
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    authStore.user = session.user;
    await authStore.loadProfile();
  }

  // Acción: Listener de cambios de autenticación
  if (typeof window !== "undefined") {
    if (window.__supabaseAuthListener) {
      window.__supabaseAuthListener.unsubscribe();
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        authStore.user = session.user;
        authStore.loadProfile();
      } else if (event === 'SIGNED_OUT') {
        authStore.user = null;
        authStore.profile = null;
      }
    });
    window.__supabaseAuthListener = subscription;
  }

  // Acción: Hacer supabase global si lo necesitas
  app.config.globalProperties.$supabase = supabase;
};
