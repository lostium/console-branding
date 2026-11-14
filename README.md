# @lostium/console-branding

Banner de [Lostium Innovation Studio](https://lostium.com) para la consola del
navegador: el logo y la firma que aparecen al abrir las devtools de los
proyectos que hacemos.

```
Hecho con ❤️ por Lostium Innovation Studio
Diseño y desarrollo de productos digitales innovadores y hechos a medida.
Impulsa tu negocio a través de tecnología asistida por IA.

https://lostium.com/es/

found@lostium.com
```

Sin dependencias, ESM y agnóstico del framework: funciona igual en Angular,
React, Vue o en un `<script type="module">`.

## Instalación

```bash
pnpm add @lostium/console-branding
```

## Uso

```ts
import { printLostiumBranding } from "@lostium/console-branding";

printLostiumBranding();       // español (por defecto)
printLostiumBranding("en");   // inglés
```

Fuera del navegador la función no hace nada, así que puedes llamarla sin
protegerla: en SSR o en un test de Node simplemente no imprime.

### Angular

Añade `provideLostiumBranding()` a los providers de la aplicación:

```ts
// app.config.ts
import type { ApplicationConfig } from "@angular/core";
import { provideLostiumBranding } from "@lostium/console-branding/angular";

export const appConfig: ApplicationConfig = {
  providers: [provideLostiumBranding()],
};
```

- Imprime el banner una sola vez, cuando la aplicación termina su primer render.
- El idioma sale del `LOCALE_ID`: `en`, `en-US`… → inglés; cualquier otro →
  español. Para forzarlo: `provideLostiumBranding({ language: "en" })`.
- **SSR:** en el servidor no hace nada. Solo actúa cuando `PLATFORM_ID` es el
  del navegador y espera a `afterNextRender`, que nunca se ejecuta en el
  servidor. No hace falta ninguna protección extra en `app.config.server.ts`.

Requiere Angular 19 o superior. `@angular/core` es una `peerDependency`
opcional: si usas el paquete sin Angular (React, Vue, vanilla) no se instala
ni se carga nada de Angular, porque la entrada principal no lo importa.

## API

### `printLostiumBranding(language?)`

Escribe el banner en la consola.

| Parámetro  | Tipo               | Por defecto | Descripción                    |
| ---------- | ------------------ | ----------- | ------------------------------ |
| `language` | `"es"` \| `"en"`   | `"es"`      | Idioma en el que se imprime.   |

No devuelve nada y no lanza nunca.

### `provideLostiumBranding(options?)`

Desde `@lostium/console-branding/angular`. Devuelve `EnvironmentProviders`.

| Opción     | Tipo             | Por defecto            | Descripción                  |
| ---------- | ---------------- | ---------------------- | ---------------------------- |
| `language` | `"es"` \| `"en"` | Deducido de `LOCALE_ID` | Idioma en el que se imprime. |

### `LostiumLanguage`

Tipo de los idiomas admitidos: `"es" | "en"`.

## Desarrollo

```bash
pnpm install
pnpm test         # vitest
pnpm typecheck
pnpm build        # tsc → dist/
```

`dist/` no se commitea: se genera en CI justo antes de publicar en npm.

## Publicar una versión

Documenta el cambio en `CHANGELOG.md` bajo `## [X.Y.Z]`, mergea en `main` y
lanza desde `main`:

```bash
./scripts/release.sh 1.1.0
```

El script comprueba la rama, el árbol de trabajo y el CHANGELOG, sube la
versión del `package.json`, crea la etiqueta `v1.1.0` y ofrece hacer push. Al
llegar la etiqueta a GitHub, el workflow `publish.yml` verifica que coincide
con el `package.json`, pasa tipos y tests, compila y publica en npm con
[Trusted Publishing](https://docs.npmjs.com/trusted-publishers) y provenance,
sin tokens.

## Licencia

MIT © Lostium Innovation Studio
