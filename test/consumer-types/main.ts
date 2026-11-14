// Consumidor de prueba: lo compila scripts/check-consumer-types.sh contra el
// paquete empaquetado, con versiones antiguas de TypeScript y Angular, para
// detectar si los .d.ts generados dejan de ser legibles para ellas.
import type { ApplicationConfig } from "@angular/core";
import { printLostiumBranding, type LostiumLanguage } from "@lostium/console-branding";
import { provideLostiumBranding, type LostiumBrandingOptions } from "@lostium/console-branding/angular";

const language: LostiumLanguage = "en";
const options: LostiumBrandingOptions = { language };

export const appConfig: ApplicationConfig = {
  providers: [provideLostiumBranding(), provideLostiumBranding(options)],
};

printLostiumBranding("es");

// Garantiza que los tipos se comprueban de verdad y no llegan como `any`.
// @ts-expect-error idioma no admitido
provideLostiumBranding({ language: "fr" });
