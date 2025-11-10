import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

/** Acción: Crear cliente Supabase singleton */
const createSupabaseClient = () => {
  // Verificar si ya existe una instancia
  if (typeof window !== "undefined" && window.__supabaseClient) {
    return window.__supabaseClient;
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: `sb-${supabaseUrl}-auth-token`,
      storage: typeof window !== "undefined" ? window.localStorage : null
    }
  });

  if (typeof window !== "undefined") {
    window.__supabaseClient = client;
  }

  return client;
};

/** Acción: Gestionar listener de autenticación */
const setupAuthListener = (client) => {
  if (typeof window === "undefined") return;

  // Limpiar listener anterior si existe
  if (window.__authListener) {
    window.__authListener.unsubscribe();
  }

  // Establecer nuevo listener
  const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
    // Acción: Actualizar estado de autenticación
    console.debug('[Auth] Estado:', event, session?.user?.email ?? 'sin sesión');
  });

  window.__authListener = subscription;
};

// Acción: Exportar cliente singleton
export const supabase = createSupabaseClient();

// Acción: Inicializar auth listener
setupAuthListener(supabase);

// Acción: Configurar boot para Quasar
export default function ({ app }) {
  // Disponible globalmente en la app
  app.config.globalProperties.$supabase = supabase;
}
