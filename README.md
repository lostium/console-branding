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

El paquete no se publica en npm; se instala desde una etiqueta de este repo:

```bash
pnpm add github:lostium/console-branding#v1.0.0
```

Eso deja en tu `package.json`:

```json
{
  "dependencies": {
    "@lostium/console-branding": "github:lostium/console-branding#v1.0.0"
  }
}
```

Fija siempre una etiqueta concreta. Sin ella instalarías `main`, que cambia sin
previo aviso.

## Uso

```ts
import { printLostiumBranding } from "@lostium/console-branding";

printLostiumBranding();       // español (por defecto)
printLostiumBranding("en");   // inglés
```

Fuera del navegador la función no hace nada, así que puedes llamarla sin
protegerla: en SSR o en un test de Node simplemente no imprime.

### Angular

Llámala una sola vez, cuando la aplicación ya ha renderizado:

```ts
import { afterNextRender, Component } from "@angular/core";
import { printLostiumBranding } from "@lostium/console-branding";

@Component({ selector: "app-root", template: `<router-outlet />` })
export class App {
  constructor() {
    afterNextRender(() => printLostiumBranding());
  }
}
```

En una aplicación con i18n, pásale el idioma que estés sirviendo:

```ts
afterNextRender(() => printLostiumBranding($localize.locale?.startsWith("en") ? "en" : "es"));
```

## API

### `printLostiumBranding(language?)`

Escribe el banner en la consola.

| Parámetro  | Tipo               | Por defecto | Descripción                    |
| ---------- | ------------------ | ----------- | ------------------------------ |
| `language` | `"es"` \| `"en"`   | `"es"`      | Idioma en el que se imprime.   |

No devuelve nada y no lanza nunca.

### `LostiumLanguage`

Tipo de los idiomas admitidos: `"es" | "en"`.

## Desarrollo

```bash
pnpm install
pnpm test         # vitest
pnpm typecheck
pnpm build        # tsc → dist/
```

El `dist/` **se commitea**: como el paquete se instala desde git, es el
compilado del repo lo que llega a los proyectos. Un workflow de CI comprueba en
cada push que `dist/` coincide con lo que sale de `src/`.

## Publicar una versión

Documenta el cambio en `CHANGELOG.md` bajo `## [X.Y.Z]` y lanza:

```bash
./scripts/release.sh 1.1.0
```

El script verifica el árbol de trabajo y la rama, pasa tipos y tests, compila,
sube la versión del `package.json`, commitea el `dist/`, crea la etiqueta
`v1.1.0` y ofrece hacer push.

## Licencia

MIT © Lostium Innovation Studio
