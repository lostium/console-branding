import { type LostiumLanguage } from "./messages.js";
export type { LostiumLanguage } from "./messages.js";
/**
 * Pinta el banner de Lostium Innovation Studio en la consola del navegador.
 *
 * Fuera del navegador no hace nada, así que es seguro llamarla desde código
 * que también corre en SSR o en tests.
 *
 * @param language Idioma del banner. Por defecto, español.
 */
export declare function printLostiumBranding(language?: LostiumLanguage): void;
//# sourceMappingURL=index.d.ts.map