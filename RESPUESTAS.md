# Respuestas de análisis

Las referencias corresponden al estado actual del proyecto. Las líneas pueden
comprobarse con el archivo indicado en cada respuesta.

## Parte B · Estado, efectos y renderizado

### B1. Ciclo de vida de `useLibros`

En [`src/hooks/useLibros.ts`](src/hooks/useLibros.ts), el primer render ocurre
con `libros = []`, `cargando = true` y `error = null`. El efecto se ejecuta
después de ese render y llama a `obtenerLibros()`. Al resolver, el segundo
render recibe los libros y todavía puede tener `cargando = true`; el `finally`
produce el render final con `cargando = false`. React puede agrupar algunas
actualizaciones, pero esos son los estados lógicos del flujo.

Si la API falla, el primer estado es el mismo. El `catch` fija el mensaje de
usuario y el `finally` apaga la carga, por lo que la pantalla muestra error y
el botón “Reintentar”. Al tocarlo, `reintentar` incrementa `intento`; ese valor
está en las dependencias del efecto y vuelve a ejecutar el pedido.

El efecto tiene una bandera `activo`. Su limpieza se ejecuta si el Catálogo se
desmonta o si cambia `intento` antes de resolver el pedido. Cambiar de pestaña
no necesariamente desmonta la pantalla porque el navegador de tabs conserva
las rutas montadas. Abrir el detalle tampoco desmonta necesariamente el
Catálogo: se agrega otra pantalla al Stack raíz.

No se pasa una función `async` directamente a `useEffect` porque una función
async devuelve una `Promise`, mientras que React espera que el efecto devuelva
`void` o una función de limpieza. En esta app se inicia la promesa dentro del
efecto y se devuelve únicamente la limpieza.

### B2. Condición de carrera del buscador

En [`src/app/buscar.tsx`](src/app/buscar.tsx), cada cambio actualiza `q` con
`router.setParams`, sin agregar una pantalla nueva al historial.

| Momento | Sin limpieza | Con la limpieza de esta app |
|---|---|---|
| t = 0 ms | Se pide `bor`; se espera 1.400 ms. | Se pide `bor`; la ejecución está activa. |
| t = 200 ms | Se pide `borges`; se espera 300 ms. | La limpieza de `bor` marca esa ejecución como inactiva y se pide `borges`. |
| t = 500 ms | Se muestran resultados de `borges`. | Se muestran resultados de `borges`. |
| t = 1.400 ms | La respuesta vieja de `bor` reemplaza la pantalla. | La respuesta de `bor` se ignora porque `activa` es `false`. |

La limpieza corre antes de ejecutar el efecto siguiente y al desmontar. El
`.then`, `.catch` y `.finally` verifican la clausura `activa` antes de cambiar
estado.

Comparar `texto === q` dentro del `then` no es una solución suficiente si `q`
es una variable de estado capturada por la clausura. Esa función ve el valor de
`q` correspondiente al render en el que fue creada, no el valor global más
reciente. La bandera de limpieza expresa directamente cuál pedido sigue siendo
válido.

Mientras se escribe, la URL cambia con `setParams` y el botón atrás no acumula
una pantalla por cada letra. Con `router.push`, cada búsqueda agregaría una
entrada al Stack y atrás tendría que recorrer todas las consultas anteriores.

### B3. Mutar o reemplazar

El ejemplo con `const [espera] = useState(() => new Cola())` muestra el número
inicial, normalmente `0`, aunque se toque “Anotarme” tres veces. `encolar`
modifica la instancia, pero no cambia la referencia guardada por React, por lo
que no hay render.

Cuando otro `TextInput` provoca un render, React vuelve a leer `espera.tamanio`
y aparece `3`. Es un error intermitente porque depende de que ocurra otro
render; los errores que aparecen solo a veces son más difíciles de reproducir
y de diagnosticar.

En [`src/context/BibliotecaContext.tsx`](src/context/BibliotecaContext.tsx),
la mutación de `Pila` se acompaña con `recientesVersion`, que cambia la
referencia del valor del Context y fuerza la actualización visual. La ventaja
es conservar la clase pedida y sus operaciones; el costo es necesitar un
contador auxiliar.

Una alternativa sería reemplazar la cola con una copia (`setEspera([...])`):
es muy explícita para React, pero pierde la encapsulación de la clase. Otra
sería `useReducer`, que centraliza transiciones y escala mejor si aparecen más
acciones, aunque agrega estructura para una app pequeña.

### B4. ¿Dónde vive cada dato?

| Dato | Dónde vive | Justificación |
|---|---|---|
| Texto del buscador | Estado local y URL `q` | El input es local, pero la búsqueda debe poder compartirse y recuperarse con un deep link. |
| Préstamos y reservas | Context | Varias pantallas los leen y modifican. |
| Listas de espera | Context, con `Record<string, PersonaEnEspera[]>` | Las usa el detalle, “Mis reservas” y el mostrador. |
| Vistos recientemente | Context y `Pila` | Se comparte entre catálogo y detalle, y debe respetar LIFO. |
| Sesión del personal | Context | Protege rutas y permite cerrar sesión desde el mostrador. |
| Ejemplares disponibles | Context, calculados desde catálogo más cambios de préstamos | Evita duplicar el dato en cada pantalla. |
| Permiso de cámara | Estado del sistema mediante `useCameraPermissions` | El sistema operativo es la fuente de verdad. |
| Identificador de notificación | Campo del préstamo en Context | Se necesita para cancelar el recordatorio correcto. |

El `value` del Context cambia cuando cambia cualquiera de sus datos; sus
consumidores pueden renderizar nuevamente. El Catálogo consume recientes y
catálogo, por lo que un cambio en recordatorios puede hacer que se renderice
si el valor global cambia. En una app de este tamaño no vale la pena dividir
el Context, pero en una app grande separaría catálogo, sesión y préstamos o
usaría selectores.

## Parte C · Navegación y rutas

### C1. La pila

| Paso | Pilas resultantes |
|---|---|
| 1. Abre la app | Stack raíz: `(tabs)`; Stack de tabs: `index`. |
| 2. Toca un libro | Stack raíz: `(tabs)`, `libro/[isbn]`; Stack de tabs: `index`. |
| 3. Toca “Reservar” | Stack raíz: `(tabs)`, detalle, `reservar/[isbn]`; la confirmación es modal. |
| 4. Toca “Confirmar” | Stack raíz: `(tabs)`, `reservas`; la confirmación se reemplaza. |
| 5. Toca atrás | Vuelve al catálogo/tab anclado, no a la confirmación. |
| 6. Toca la tab Catálogo | Se ve el catálogo porque la tab tiene su propio Stack y es la ruta ancla. |

En el paso 4 uso `router.replace('/reservas')`: elimina la confirmación del
tope y evita que atrás vuelva a reservar. `push` conservaría la confirmación;
`replace` es suficiente para este flujo. `dismissTo` sería útil si hubiera
varios modales encadenados, pero no es necesario aquí.

### C2. Escáner que dispara de más

Sin protección, `onBarcodeScanned` podría generar muchos `push` mientras el
código permanece delante de la cámara. Esas acciones se acumularían en la
cola de navegación y producirían varias pantallas de detalle.

En [`src/app/escanear.tsx`](src/app/escanear.tsx) uso `useRef` para
`procesando`, porque el bloqueo debe ser inmediato y no necesita provocar un
render. Un `useState` se actualiza de forma asíncrona: varios callbacks podrían
leer `false` antes de que el render con `true` ocurra.

Uso `replace` para que atrás no devuelva a una cámara que sigue activa. Con
`push`, atrás volvería al escáner y podría volver a disparar el mismo código.
Si el ISBN no existe, se muestra un `Alert`, se libera el bloqueo y se puede
seguir escaneando; el aviso no se repite diez veces porque el ref bloquea las
lecturas mientras se procesa una.

### C3. Deep links y rutas protegidas

| Link | Qué ve | Qué queda debajo | Código |
|---|---|---|---|
| `bibliotecaipf://libro/9780140449136` | Detalle del libro | `(tabs)` anclado | `src/app/libro/[isbn].tsx` |
| `bibliotecaipf://libro/123` | Mensaje de ISBN inválido | `(tabs)` | Validación `esIsbnValido` |
| `bibliotecaipf://buscar?q=borges` | Resultados de Borges | `(tabs)` | `buscar.tsx` y `router.setParams` |
| `bibliotecaipf://mostrador` sin sesión | Login por `Stack.Protected` | Catálogo | `src/app/_layout.tsx` |
| `bibliotecaipf://reserva` | Redirección a `/reservas` | Tab de reservas | `reserva.tsx` |
| `bibliotecaipf://escanear` sin cámara | Pantalla previa del permiso | Catálogo | `permisos/[recurso].tsx` |

El detalle recibe cualquier parámetro que coincida con la forma de la ruta,
aunque el libro no exista. La responsabilidad de responder correctamente es
de la pantalla de detalle, que valida formato y existencia antes de mostrar el
botón de reserva.

### C4. Foco, montaje y primer plano

`useEffect([])` detecta el montaje; `useFocusEffect` detectaría que una pantalla
entra en foco; `AppState` detecta cambios entre activo, inactivo y background.
Si la persona vuelve desde Ajustes, `AppState` es el evento que detecta el
regreso aunque la pantalla siga montada. Si cambia a Catálogo y vuelve a
“Mis reservas”, el foco cambia.

Esta versión consulta el permiso al activar el interruptor, que es el momento
en que realmente se necesita. Una mejora para una pantalla que mostrara el
estado de permisos continuamente sería usar `useFocusEffect` al volver de
Ajustes; con una consulta solo al montar podría quedar un estado viejo.

## Parte D · Permisos

### D1. Recorrido de cámara

En Android, al tocar “Escanear” se muestra la ruta `/permisos/camara`. El hook
clasifica la respuesta:

1. `permiso = null`: muestra “Consultando permiso...”.
2. `granted = false`, `canAskAgain = true`: muestra “Continuar”.
3. Después de rechazar, vuelve a mostrar la previa y permite intentar otra vez.
4. Cuando el sistema responde `canAskAgain = false`, muestra “Abrir Ajustes”.
5. Al habilitar el permiso y volver, el siguiente montaje de `/escanear`
   muestra la cámara.

En iOS el sistema puede mostrar una única decisión de cámara y, después de
rechazarla, llevar directamente al estado bloqueado según la versión y la
decisión de la persona. La app conserva la alternativa de ingresar el ISBN.

La decisión entre “Continuar” y “Abrir Ajustes” está en
[`src/lib/permisos.ts`](src/lib/permisos.ts):

```ts
return permiso.canAskAgain ? 'preguntable' : 'bloqueado';
```

No alcanza con mirar `status`: un permiso denegado puede todavía preguntarse o
estar bloqueado permanentemente. La pantalla vuelve a consultar el permiso al
montarse; una versión más avanzada podría usar `AppState` para actualizarse
inmediatamente al volver de Ajustes.

### D2. Notificaciones y consistencia

Si no se cancela la notificación al devolver, el aviso llegaría aunque el
préstamo ya no exista. El identificador se guarda en
`Prestamo.identificadorNotificacion`. Si la app se cierra, la notificación
programada continúa en el sistema, pero el identificador guardado solo vive en
memoria en esta versión; persistiría ambos datos con AsyncStorage en una
versión que requiriera recuperación después de cerrar la app.

En Android 13 o superior se crea primero el canal `prestamos` para que el
sistema pueda asociar correctamente la solicitud al canal. En Android 12 el
permiso de notificaciones no se solicita con el mismo flujo de runtime, pero
el canal sigue siendo necesario para configurar importancia y comportamiento.

Cuando el mostrador entrega un libro a Lautaro, consulta el permiso en ese
momento. Si está concedido, programa una notificación inmediata; si no,
agrega un aviso a `avisos`, que se muestra en `/reservas`. Consultarlo en el
momento evita usar un valor guardado que podría haber cambiado en Ajustes.

### D3. Qué pide la app

| Plataforma | Permiso o clave | Función | Quién lo agrega |
|---|---|---|---|
| Android | `android.permission.CAMERA` | Escanear EAN-13 | `expo-camera` |
| Android | Notificaciones | Recordatorio local | `expo-notifications` / sistema |
| iOS | `NSCameraUsageDescription` | Escanear EAN-13 | Plugin de `expo-camera` |
| iOS | Notificaciones | Recordatorio local | `expo-notifications` / sistema |
| Android | `RECORD_AUDIO` bloqueado | No se graban videos con audio | `app.json` |
| Android | Ubicación bloqueada | La app no usa ubicación | `app.json` |

`recordAudioAndroid: false` y `microphonePermission: false` evitan declarar
micrófono aunque `expo-camera` permita grabar video en otros escenarios.

Si mañana se pidiera elegir una portada, usaría `expo-image-picker`. La
selección de galería puede requerir permiso de fotos y, por agregar un módulo
nativo, una build nueva; una actualización OTA no puede agregar código nativo
ausente en la build instalada.

En Expo Go no se verifica completamente el texto nativo de propósito ni todos
los detalles de canales Android. Se verificarían con una development build en
un teléfono Android real y una build iOS para los textos de `Info.plist`.

## Parte E · Buenas prácticas y decisiones

### E1. Revisión del código entregado

Problemas encontrados en el fragmento:

1. Línea 10: `any[]`; es mala práctica y pierde seguridad de tipos. Usaría
   `Libro[]`.
2. Línea 11: el permiso se pide al montar el Catálogo; es mala práctica de UX
   y mínimo privilegio. Se pide solo al entrar al escáner.
3. Línea 15: se piden notificaciones sin acción de la persona; es mala
   práctica y viola el requisito de pedirlas al activar el recordatorio.
4. Línea 13-16: el efecto no limpia ni tiene dependencias explícitas; puede
   repetir pedidos y dejar efectos colgados.
5. Línea 18: falta el array de dependencias; es un error de rendimiento y
   ejecución porque corre después de cada render.
6. Línea 19: no hay `catch`, estado de carga ni estado de error; una falla
   queda sin salida para la persona.
7. Línea 22: `Fila` está declarada dentro de `Catalogo`; viola la regla de
   declarar componentes a nivel de módulo y recrea el componente en cada
   render.
8. Línea 24: `router.push` no evita lecturas duplicadas ni registra recientes.
9. Línea 25: hay estilos en línea; deben estar en `StyleSheet.create`.
10. Línea 34: usa `map` dentro de `ScrollView`; para un catálogo se necesita
    `FlatList` con virtualización.
11. Línea 35: `key={i}` usa el índice; debe usarse `libro.isbn`.
12. Línea 38: el ícono no tiene `accessibilityLabel`.
13. El `Pressable` de la línea 37 no define un área táctil mínima clara.
14. Se importa `useCameraPermissions` pero no se usa el valor para renderizar
    la cámara; el escaneo no está realmente implementado.

Durante el primer minuto, el efecto sin dependencias pide libros en cada
render. Cada `setLibros` genera otro render, que dispara otro pedido, y así se
forma una cascada de solicitudes. Que la API devuelva el mismo array no evita
la ejecución del efecto: el efecto no depende de la identidad del resultado,
sino de la ausencia del array de dependencias.

La reescritura actual separa responsabilidades: `useLibros` maneja estados y
limpieza, `CatalogoScreen` compone la pantalla, `TarjetaLibro` representa una
fila y `FlatList` usa el ISBN como clave. El problema que podría provocar un
rechazo en una tienda es pedir permisos no relacionados sin justificación.
El que probablemente desinstalaría primero la persona es la cascada de
pedidos y la pantalla que se vuelve lenta o inestable.

### E2. Organización y acoplamiento

La dependencia principal es:

```text
app -> components -> context/hooks/lib
context -> hooks/lib/estructuras/types
hooks -> lib/types
lib -> data/types
components -> constants/types/context
estructuras -> tipos genéricos propios
```

No hay imports desde `src/app` hacia `hooks`, `lib` o `context`; las capas
inferiores no conocen pantallas. Un hook que importara una ruta acoplaría la
lógica a navegación y dificultaría las pruebas.

Si el catálogo pasara a una API real cambiarían principalmente
`src/lib/api.ts` y posiblemente `src/hooks/useLibros.ts`. Si hubiera que tocar
componentes, contexto y rutas, sería señal de que la API está filtrándose fuera
de la capa `lib`.

Un componente genérico `ConPermiso` podría reducir repetición en cámara y
notificaciones, pero perdería el control específico de cuándo pedir cada
recurso. Para notificaciones no encaja igual porque el pedido nace en un
interruptor de un préstamo, no al abrir una pantalla. Mantener la pantalla
previa para cámara y el servicio para notificaciones hace explícita esa
diferencia.

### E3. Mapa de fallas

| Situación | Qué ve la persona | Dónde se maneja |
|---|---|---|
| Falla `obtenerLibros` | Mensaje y botón “Reintentar” | `src/hooks/useLibros.ts`, `src/components/EstadoCatalogo.tsx` |
| `/libro/abc` | ISBN inválido y link al catálogo | `src/app/libro/[isbn].tsx` |
| ISBN escaneado inexistente | Aviso y posibilidad de seguir escaneando | `src/app/escanear.tsx` |
| Cámara bloqueada | “Abrir Ajustes” y entrada manual | `src/app/permisos/[recurso].tsx`, `escanear.tsx` |
| Notificaciones denegadas | Aviso dentro de “Mis reservas” | `src/app/(tabs)/reservas.tsx` y Context |
| Reserva duplicada | Mensaje sin crear otro préstamo | `src/app/reservar/[isbn].tsx`, `BibliotecaContext.tsx` |
| Entrega con cola vacía | “No hay personas esperando este libro” | `src/app/mostrador.tsx` |
| Login incorrecto | Mensaje de usuario o clave incorrectos | `src/app/login.tsx` |

### E4. Decisiones con argumentos

**Identificador.** Uso ISBN como parámetro y `key` porque identifica la edición
concreta que la biblioteca presta, permite deep links legibles y ya es el dato
que devuelve el escáner. Un id numérico propio sería mejor si el catálogo
aceptara libros sin ISBN o múltiples registros sin identificador externo.

**Estructuras.** `Pila` con `#items` hace visible la operación LIFO y cumple el
objetivo didáctico. La dificultad es que una clase muta internamente y React
no detecta ese cambio; por eso el Context usa `recientesVersion`. Un array
inmutable sería más natural para React, pero ocultaría el ejercicio de la
estructura.

**Memorización.** `useMemo` se usa para construir el `value` del Context y no
crear una nueva referencia en cada render. `useCallback` estabiliza acciones
que consumen componentes y efectos. Memorizar un texto estático o un
componente pequeño sería ruido. Lo comprobaría con React DevTools Profiler y
comparando renders antes y después, no suponiendo que memorizar siempre mejora
el rendimiento.

**Datos duplicados.** El catálogo conserva los ejemplares iniciales y el
Context guarda solo los cambios de disponibilidad. Cada pantalla obtiene el
valor con `disponiblesDe`. Si se guardara el mismo número también en cada
tarjeta, una devolución podría actualizar un lugar y dejar el otro obsoleto.
Centralizar el cálculo evita esa inconsistencia.
