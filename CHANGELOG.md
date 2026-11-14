# Changelog

Todas las novedades relevantes de este paquete se documentan aquí, siguiendo
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y
[SemVer](https://semver.org/lang/es/).

## [1.1.0]

### Añadido

- Entrada para Angular, `@lostium/console-branding/angular`, con
  `provideLostiumBranding(options?)`: imprime el banner tras el primer render,
  solo en el navegador (nada en SSR) y una sola vez por carga. El idioma se
  deduce del `LOCALE_ID` (`en*` → inglés, resto → español) y se puede forzar con
  la opción `language`.
- `@angular/core` (>= 19) como `peerDependency` opcional. La entrada principal
  sigue sin depender de ningún framework.

### Cambiado

- El paquete se publica en npm: `pnpm add @lostium/console-branding`. Ya no hace
  falta instalarlo desde una etiqueta de git.
- `dist/` deja de commitearse; lo genera CI al publicar.

## [1.0.0]

Primera versión, extraída del frontend de `clientes.acttiv.es`.

### Añadido

- `printLostiumBranding(language?)`: pinta el logo y el mensaje de Lostium en la
  consola del navegador.
- Textos en español e inglés. Sin argumento se imprime en español.
- La función no hace nada fuera del navegador, así que es segura en SSR y en
  tests.

[1.1.0]: https://github.com/lostium/console-branding/releases/tag/v1.1.0
[1.0.0]: https://github.com/lostium/console-branding/releases/tag/v1.0.0
