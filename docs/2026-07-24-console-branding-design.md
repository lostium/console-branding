# Diseño: @lostium/console-branding

Fecha: 2026-07-24

## Problema

El banner de marca que se pinta en la consola del navegador vivía copiado
dentro del frontend de `clientes.acttiv.es` (`front/src/app/console-branding.ts`).
Cualquier otro proyecto que lo quisiera tenía que copiar el fichero, y un
cambio en los textos, los colores o el logo obligaba a repetirlo en cada sitio.

## Objetivo

Un paquete propio, reutilizable desde cualquier proyecto JavaScript, con una
única fuente de verdad para el banner.

## Alcance

Solo el banner de consola. Ni tokens de marca para la UI, ni utilidades
generales: un paquete de un solo propósito es el que se puede adoptar en dos
minutos y mantener sin discusiones.

## API pública

```ts
export type LostiumLanguage = "es" | "en";

export function printLostiumBranding(language?: LostiumLanguage): void;
```

- **Idioma.** Por defecto, español. Para el inglés hay que pedirlo
  explícitamente con `printLostiumBranding("en")`. Se descartó autodetectar el
  idioma de la página: el comportamiento explícito es predecible y cada
  proyecto sabe mejor qué idioma está sirviendo.
- **Fuera del navegador no hace nada.** Si no existe `document`, la función
  retorna sin imprimir. El banner es una pieza de interfaz y ensuciar los logs
  de un servidor SSR o de un test en Node no aporta nada. Esto además permite
  llamarla sin envolverla en comprobaciones de plataforma.
- **No lanza nunca** y no devuelve valor.

Textos por idioma:

| | es | en |
| --- | --- | --- |
| Titular | Hecho con ❤️ por Lostium Innovation Studio | Made with ❤️ by Lostium Innovation Studio |
| Claim | Diseño y desarrollo de productos digitales innovadores y hechos a medida. Impulsa tu negocio a través de tecnología asistida por IA. | Design and development of innovative, tailor-made digital products. Boost your business with AI-assisted technology. |
| Enlace | https://lostium.com/es/ | https://lostium.com/en/ |
| Email | found@lostium.com | found@lostium.com |

El logo (SVG naranja embebido como data URI) y los colores `#f9620f` y
`#64748b` son comunes a ambos idiomas.

## Estructura

```
src/
├─ index.ts      → printLostiumBranding(), único punto de entrada
├─ messages.ts   → idiomas y textos (datos puros)
├─ logo.ts       → el SVG como data URI
└─ index.test.ts → tests
```

Cada módulo tiene una responsabilidad: `messages.ts` y `logo.ts` son datos sin
lógica, e `index.ts` solo compone y escribe en consola.

## Distribución

- Repo público `github.com/lostium/console-branding`, licencia MIT, rama `main`.
- **No se publica en npm.** Los proyectos lo instalan desde una etiqueta de git:
  `pnpm add github:lostium/console-branding#v1.0.0`.
- El nombre del paquete es `@lostium/console-branding`, que es como se importa.
- Versionado SemVer con etiquetas `vX.Y.Z`. Los consumidores fijan etiqueta
  exacta; apuntar a `main` no está soportado.

## Build

TypeScript compilado con `tsc` a `dist/`, y **`dist/` se commitea**: al
instalarse desde git, es el contenido del repo lo que llega al proyecto
consumidor, sin pasos de compilación en su `install`.

El riesgo de esta decisión es un `dist/` desincronizado del `src/`. Dos
guardarraíles:

1. `scripts/release.sh <version>` es el único camino a una release: exige rama
   `main`, árbol limpio, entrada en el CHANGELOG y etiqueta libre; pasa tipos y
   tests, recompila desde cero, sube la versión, commitea, etiqueta y ofrece
   hacer push.
2. Un workflow de CI recompila en cada push y hace `git diff --exit-code dist`.
   Si alguien commitea `src/` sin recompilar, falla en rojo.

## Tests

Vitest en entorno Node, sustituyendo `document` y `console` por stubs en lugar
de montar un DOM completo. Cubren: no-op sin `document`; español por defecto;
español incluso con la página en inglés; inglés al pedirlo; y que se emiten
exactamente dos `console.log` (logo y texto).

## Fuera de alcance

- Publicación en npm.
- Idiomas más allá de español e inglés.
- Personalización de colores, logo o textos por proyecto.
