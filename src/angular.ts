import {
  afterNextRender,
  type EnvironmentProviders,
  inject,
  Injector,
  LOCALE_ID,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideEnvironmentInitializer,
} from "@angular/core";

import { claimBrandingPrint } from "./angular-state.js";
import { printLostiumBranding, type LostiumLanguage } from "./index.js";

export type { LostiumLanguage } from "./index.js";

/** Opciones de {@link provideLostiumBranding}. */
export interface LostiumBrandingOptions {
  /**
   * Idioma del banner. Si se omite, se deduce del `LOCALE_ID` de la
   * aplicación: `en*` → `"en"`, cualquier otro → `"es"`.
   */
  language?: LostiumLanguage;
}

/** Traduce un `LOCALE_ID` de Angular al idioma del banner. */
export function languageFromLocale(locale: string): LostiumLanguage {
  return locale.toLowerCase().startsWith("en") ? "en" : "es";
}

/**
 * Pinta el banner de Lostium en la consola cuando la aplicación termina su
 * primer render en el navegador.
 *
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideLostiumBranding()],
 * };
 * ```
 *
 * En SSR no hace nada, y en el navegador imprime una sola vez por carga de la
 * página aunque el provider se registre en varios injectors.
 */
export function provideLostiumBranding(options: LostiumBrandingOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      // Equivale a `isPlatformBrowser(PLATFORM_ID)`, que vive en
      // @angular/common: comparar a mano evita una segunda peerDependency.
      if (inject(PLATFORM_ID) !== "browser") return;

      const language = options.language ?? languageFromLocale(inject(LOCALE_ID));

      afterNextRender(
        () => {
          if (claimBrandingPrint()) printLostiumBranding(language);
        },
        { injector: inject(Injector) },
      );
    }),
  ]);
}
