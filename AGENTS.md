#Descripción del Proyecto
Landing Page con Cátalogo de productos con sus especificaciones de cada uno, (categoría, nombre, referencia, descripción, avatar_url)


#Agents Rules
-   Cada función nueva debe incluir un bloque de comentario encima.
-   Todas las variables y funciones deben escribirse en camelCase
-   No uses snake_case
-   Trabajar todas las acciones y getters con stores, en la carpeta store
-   Folder /stores, se cargan los nuevos stores creados
-   Los estilos se deben cargar sobre app.scss para implementar en otras divs las clases


## Características Implementadas

### Funcionalidades Principales

- **Autenticación y gestión de usuarios** con roles (admin)
- **Gestión de productos** con CRUD completo
- **Gestión de Categorías** con subcategorías

###  Módulos Implementados

1. **Autenticación** - Login, registro y gestión de perfiles
2. **Gestión de Productos** - CRUD de productos y categorías

##  Stack Tecnológico

- **Frontend**: Vue 3 + Quasar Framework
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Estado**: Pinia
- **Base de Datos Local**: IndexedDB
- **PWA**: Workbox (configurado)