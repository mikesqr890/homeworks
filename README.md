# De'yes | Tienda virtual y Cápsula de Outfit

> Proyecto académico: aplicación web de moda, calzado y accesorios desarrollada con React, Vite y Supabase. Estado: funcionalidades implementadas en el entorno de desarrollo; publicación en Netlify pendiente de confirmar.

## Enlaces de entrega

| Recurso | Enlace |
| --- | --- |
| Aplicación publicada en Netlify | **PENDIENTE: pegar URL HTTPS real** |
| Repositorio GitHub (rama `main`) | **PENDIENTE: pegar URL real** |
| Propuesta gráfica definitiva (Figma/Adobe/Canva) | **PENDIENTE: pegar URL compartida** |
| Informe final | [`docs/Informe_Final_DeYes.docx`](docs/Informe_Final_DeYes.docx) |

**Integrantes del equipo:** PENDIENTE: registrar nombres completos y sus aportes.  
**Institución / asignatura / docente:** PENDIENTE: completar información académica.  
**Ubicación de referencia:** Florida, Valle del Cauca, Colombia. La dirección exacta del negocio debe confirmarse antes de afirmar que el mapa muestra la tienda.

## Descripción

De'yes es una aplicación de tienda virtual para explorar prendas, zapatos y accesorios, realizar pedidos y obtener asesoría a través de un chat. Su función diferenciadora es **Cápsula de Outfit**, que permite combinar productos por categoría, consultar recomendaciones y guardar combinaciones personales.

El frontend es una aplicación de página única (SPA) en React y Vite. Supabase aporta PostgreSQL, autenticación, almacenamiento de imágenes y mensajes con Realtime. Netlify se utiliza para desplegar el frontend; no sustituye a Supabase.

## Funcionalidades

### Cliente
- Registro e inicio de sesión con Supabase Auth.
- Catálogo con productos activos, imágenes, stock, categorías, búsqueda y ordenamiento por precio.
- Carrito con cantidades, totales, eliminación y opción de deshacer cambios recientes.
- Confirmación de pedidos a través de la función SQL `create_order`, que consulta precios y stock actuales y descuenta inventario dentro de una transacción.
- Historial propio de pedidos y consulta de estados.
- **Cápsula de Outfit:** selección de ropa, calzado y accesorios; recomendaciones por grafo; cálculo estimado; guardado y recuperación de outfits en Supabase; agregar combinación al carrito.
- Chat de atención al cliente con historial y actualizaciones vía Supabase Realtime, con sondeo de respaldo.
- Vista de ubicación con mapa de referencia del municipio; dirección comercial exacta aún pendiente.

### Administrador
- Panel de administración con acceso restringido por rol.
- Gestión de catálogo e imágenes (alta, edición y eliminación de productos, según permisos configurados).
- Consulta y gestión de pedidos, con estados `pending`, `confirmed`, `ready` y `delivered`.
- Cola de pedidos pendientes ordenada por fecha de llegada.
- Bandeja de conversaciones separadas por cliente y envío de respuestas.

### Seguridad y alcance
- Políticas **Row Level Security (RLS)** para limitar acceso a datos según usuario/rol.
- Los clientes solo pueden consultar sus pedidos, mensajes y outfits autorizados, conforme a las políticas desplegadas.
- La compra representa una **solicitud de pedido**: no se ha implementado pasarela de pago, facturación ni cobro electrónico.
- Antes de uso comercial real se recomienda auditar permisos, probar transacciones concurrentes, políticas RLS y protección de datos.

## Tecnologías utilizadas

| Capa | Tecnologías |
| --- | --- |
| Frontend | React, JavaScript, Vite, JSX, CSS / SCSS Modules |
| Navegación | React Router |
| Backend administrado | Supabase |
| Datos | PostgreSQL y políticas RLS |
| Identidad | Supabase Auth |
| Imágenes | Supabase Storage |
| Mensajería | Supabase Realtime |
| Publicación frontend | Netlify |
| Versionamiento | Git y GitHub |
| Pruebas de estructuras | Node.js `node:test` |

## Cinco estructuras de datos

| Estructura | Archivo y uso | Motivo |
| --- | --- | --- |
| **Grafo (lista de adyacencia)** | `src/helpers/dataStructures/OutfitGraph.js` | Recomendar categorías complementarias en Cápsula de Outfit. |
| **Trie** | `src/helpers/dataStructures/StoreStructures.js` | Resolver búsquedas por prefijos de palabras de productos. |
| **Árbol binario de búsqueda** | `StoreStructures.js` | Obtener productos ordenados por precio. |
| **Pila (Stack)** | `StoreStructures.js`, `CartContext.jsx` | Deshacer la última operación del carrito (LIFO). |
| **Cola (Queue)** | `StoreStructures.js`, `AdminOrders.jsx` | Priorizar pedidos pendientes por llegada (FIFO). |

Cumple la distribución solicitada: 2 estructuras de listas/pilas/colas, 2 de árboles/tries/heaps y 1 grafo. La implementación del Trie trabaja sobre productos cargados; el árbol ordena en memoria. La cola presenta el orden de atención, no despacha automáticamente pedidos.

## Estructura general

```text
deyes/
├── public/
├── src/
│   ├── components/Shared/     # Navegación común
│   ├── context/               # AuthContext y CartContext
│   ├── helpers/dataStructures/# Grafo, Trie, árbol, pila y cola
│   ├── pages/                 # Home, Login, Register, Catalog, Cart,
│   │                          # Orders, Outfits, Chat, Location, Admin
│   ├── routes/                # AppRoutes y ProtectedRoute
│   ├── services/supabase.js   # Cliente de Supabase
│   ├── App.jsx
│   └── main.jsx
├── tests/                     # Pruebas de estructuras
├── docs/                      # Informe final
├── netlify.toml
├── .env.example
└── package.json
```

> La estructura refleja los módulos desarrollados en las sesiones del proyecto. Verificar los nombres exactos antes de subir, especialmente `tests/` y `docs/`.

## Instalación local

Requisitos: Node.js y npm, y un proyecto de Supabase configurado con tablas, funciones SQL, políticas y bucket correspondientes.

```bash
git clone URL_DEL_REPOSITORIO
cd deyes
npm install
```

Crea `.env.local` (no subir a Git) con los nombres que utiliza `src/services/supabase.js`:

```dotenv
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA_O_ANON
```

Inicia el proyecto:

```bash
npm run dev
```

> Nunca colocar `service_role`, contraseñas o claves privadas en archivos `VITE_*`, porque Vite incluye esas variables en el frontend compilado. La clave publishable/anon es pública, pero la seguridad depende de RLS.

## Pruebas y build

```bash
node --test tests/structures.test.js
npm run build
npm run preview
```

Comprobar adicionalmente: acceso a páginas, alta de productos, pedido y descuento de inventario, estados del pedido, aislamiento por cliente de chat y outfits, inicio de sesión y recarga de rutas en producción.

## Publicación del frontend en Netlify

1. Subir el código a GitHub y **mezclar las ramas de todos los integrantes en `main`**.
2. En Netlify, crear un proyecto desde el repositorio GitHub.
3. Seleccionar la rama `main`, directorio base la raíz del proyecto (donde está `package.json`), comando `npm run build` y directorio de publicación `dist`.
4. En la configuración de variables de entorno de Netlify, definir `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` con los valores de la instancia existente, usando únicamente la clave pública.
5. Verificar que `netlify.toml` tiene una regla SPA para servir `index.html` cuando se cargan rutas internas.
6. Publicar y copiar la dirección real `https://NOMBRE-DEL-SITIO.netlify.app`.
7. En **Supabase > Authentication > URL Configuration**, ajustar **Site URL** a esa dirección y añadir la URL permitida de producción y, si se necesita, `http://localhost:5173/**` para desarrollo.
8. Probar en la URL pública: registro/login, chat, pedidos, outfits y acceso directo/recarga de `/admin/orders`.
9. Actualizar los enlaces de esta sección y los de la tabla inicial.

**Backend:** no hay servidor propio que desplegar; Supabase ya es un servicio alojado. Verificar que el proyecto Supabase permanece operativo y documentar su uso sin exponer credenciales privadas.

## Referencias y documentación

- [Vite en Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/)
- [Variables de entorno en Netlify](https://docs.netlify.com/build/configure-builds/environment-variables/)
- [Redirect URLs de Supabase](https://supabase.com/docs/guides/auth/redirect-urls)

## Pendientes de entrega

- [ ] Incorporar enlace definitivo a Netlify y probarlo.
- [ ] Incorporar URL del repositorio GitHub, asegurando que `main` contiene todas las ramas acordadas.
- [ ] Adjuntar enlace a la propuesta gráfica definitiva.
- [ ] Completar nombres de integrantes y aportes por rama.
- [ ] Copiar `docs/Informe_Final_DeYes.docx` al repositorio.
- [ ] Confirmar ubicación exacta de la tienda o identificar el mapa como referencia municipal.
- [ ] Incorporar capturas reales de interfaz al informe si el docente las solicita.

---

Documento preparado para la entrega final del proyecto académico De'yes. Los enlaces y resultados de publicación son campos pendientes de completar; no se afirma que el sitio ya esté desplegado.
