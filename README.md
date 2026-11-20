# Biblioteca IPF

Aplicación móvil desarrollada con Expo Router y TypeScript para consultar libros,
reservarlos, administrar listas de espera y recibir recordatorios de devolución.

## Ejecutar

```bash
npm install
npx expo start
```

Comandos de verificación:

```bash
npm run typecheck
npx expo lint
npm run doctor
npm test -- --runInBand
```

SDK utilizado: Expo SDK 58.

## Árbol de rutas y navegadores

```text
src/app/
├── _layout.tsx                 Stack raíz y Stack.Protected
├── (tabs)/
│   ├── _layout.tsx             Tabs
│   ├── index.tsx               /
│   └── reservas.tsx            /reservas
├── libro/[isbn].tsx            /libro/[isbn]
├── reservar/[isbn].tsx         /reservar/[isbn] (modal)
├── buscar.tsx                  /buscar?q=
├── escanear.tsx                /escanear
├── permisos/[recurso].tsx      /permisos/[recurso] (modal)
├── login.tsx                   /login (solo sin sesión)
├── mostrador.tsx               /mostrador (solo con sesión)
├── personal.tsx                /personal
├── reserva.tsx                 /reserva -> Redirect a /reservas
└── +not-found.tsx              404
```

El catálogo está anclado en `(tabs)` desde el Stack raíz, por lo que un deep link
a `/buscar` conserva las pestañas debajo de la navegación.

## Organización del código

```text
src/
├── app/          rutas y navegadores
├── components/   componentes visuales reutilizables
├── constants/    tema visual
├── context/      estado global de la biblioteca
├── data/         catálogo inicial
├── estructuras/  Pila y Cola
├── hooks/        useLibros y usePermiso
├── lib/          API simulada y reglas de negocio
└── types/        tipos TypeScript
```

## Permisos

| Recurso | Módulo | Cuándo se pide | Alternativa |
|---|---|---|---|
| Cámara | `expo-camera` | Al tocar “Escanear” y continuar en la pantalla previa | Escribir el ISBN manualmente |
| Notificaciones | `expo-notifications` | Al activar “Recordarme” en un préstamo | Avisos dentro de “Mis reservas” |

La app no necesita ubicación, galería ni micrófono. `RECORD_AUDIO`, ubicación fina y
ubicación aproximada están bloqueados en `app.json`; cámara está configurada con
`microphonePermission: false` y `recordAudioAndroid: false`.

El bloque de plugins relevante de `app.json` es:

```json
"plugins": [
  "expo-router",
  [
    "expo-camera",
    {
      "cameraPermission": "Usamos tu cámara para leer el código de barras del libro.",
      "microphonePermission": false,
      "recordAudioAndroid": false
    }
  ],
  "expo-notifications"
]
```

## Deep links de prueba

Con el esquema `bibliotecaipf`:

```text
bibliotecaipf://
bibliotecaipf://libro/9780140449136
bibliotecaipf://libro/123
bibliotecaipf://buscar?q=borges
bibliotecaipf://mostrador
bibliotecaipf://reserva
bibliotecaipf://escanear
bibliotecaipf://ruta-inexistente
```

Credenciales fijas de demostración:

```text
Usuario: bibliotecario
Clave: ipf2026
```

## Verificación realizada

- `npm run typecheck`: sin errores.
- `npx expo lint`: sin errores.
- `npm run doctor`: 20/20 comprobaciones correctas.
- `npm test -- --runInBand`: 23 pruebas pasando.

Las notificaciones locales funcionan en Expo Go; las notificaciones remotas de
Android requieren un development build. La cámara y el texto nativo de propósito
deben comprobarse en un dispositivo real.

## Persistencia y datos de demostración

Préstamos, listas de espera, reservas y vistos recientes se guardan localmente
con AsyncStorage. La primera carga recupera esos datos antes de guardar nuevos
cambios, evitando reemplazar el estado persistido con valores vacíos.

El catálogo incluye libros con ejemplares disponibles y sin ejemplares. También
hay listas de espera iniciales para probar el mostrador sin tener que crear
datos manualmente.
