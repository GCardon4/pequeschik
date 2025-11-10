import { register } from 'register-service-worker'
import { Notify } from 'quasar'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready (/* registration */) {
    // console.log('Service worker is active.')
  },

  registered (/* registration */) {
    // console.log('Service worker has been registered.')
  },

  cached (/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound (/* registration */) {
    // console.log('New content is downloading.')
  },

  updated (/* registration */) {
    // console.log('New content is available; please refresh.')
    Notify.create({
      message: 'Nuevo contenido disponible, por favor refresque la aplicación.',
      color: 'primary',
      textColor: 'white',
      icon: 'cloud_download',
      closeBtn: 'Actualizar',
      timeout: 10000,
      onDismiss: () => {
        window.location.reload(true)
      }
    })
  },

  offline () {
    // console.log('No internet connection found. App is running in offline mode.')
    Notify.create({
      message: 'No se ha encontrado conexión a Internet. La aplicación está funcionando en modo offline.',
      color: 'primary',
      textColor: 'white',
      icon: 'signal_wifi_connected_no_internet_4',
      closeBtn: 'Cerrar',
      timeout: 10000

    })
  },

  error (/* err */) {
    // console.error('Error during service worker registration:', err)
  }
})
