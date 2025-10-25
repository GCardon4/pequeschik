// Ejemplo de conexión en un archivo de arranque de Quasar (src/boot/firebase.js)
import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase con las URL del emulador
const firebaseConfig = {
  apiKey: 'http://localhost:9099', // Ajusta la URL según tu configuración de emulador
  authDomain: 'localhost',
  projectId: 'tu-proyecto-firebase',
  storageBucket: 'localhost',
  messagingSenderId: 'tu-id',
  appId: 'tu-app-id',
};

const firebaseApp = initializeApp(firebaseConfig);

export default boot(({ app }) => {
  app.config.globalProperties.$firebaseApp = firebaseApp;
  app.config.globalProperties.$auth = getAuth(firebaseApp);
  app.config.globalProperties.$db = getFirestore(firebaseApp);
  app.config.globalProperties.$storage = getStorage(firebaseApp);
});
