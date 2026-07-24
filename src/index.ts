import { LOSTIUM_LOGO_DATA_URI } from "./logo.js";
import { DEFAULT_LANGUAGE, MESSAGES, type LostiumLanguage } from "./messages.js";

export type { LostiumLanguage } from "./messages.js";

const LOGO_STYLE = `font-size: 1px; padding: 30px 72px; background: url("${LOSTIUM_LOGO_DATA_URI}") no-repeat center / contain;`;
const HEADLINE_STYLE = "font-size: 12px; font-weight: bold; color: #f9620f; margin-top: 8px;";
const CLAIM_STYLE = "font-size: 11px; color: #64748b; margin-top: 4px;";
const URL_STYLE = "font-size: 11px; color: #f9620f; text-decoration: underline;";
const EMAIL_STYLE = "font-size: 11px; color: #64748b;";

/**
 * Pinta el banner de Lostium Innovation Studio en la consola del navegador.
 *
 * Fuera del navegador no hace nada, así que es seguro llamarla desde código
 * que también corre en SSR o en tests.
 *
 * @param language Idioma del banner. Por defecto, español.
 */
export function printLostiumBranding(language: LostiumLanguage = DEFAULT_LANGUAGE): void {
  if (typeof document === "undefined") return;

  const message = MESSAGES[language];

  console.log("%c ", LOGO_STYLE);
  console.log(
    `%c${message.headline}\n%c${message.claim}\n\n%c${message.url}\n\n%c${message.email}`,
    HEADLINE_STYLE,
    CLAIM_STYLE,
    URL_STYLE,
    EMAIL_STYLE,
  );
}
