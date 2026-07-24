/** Idiomas en los que existe el banner. */
export type LostiumLanguage = "es" | "en";

/** Idioma de la marca: el que se usa cuando no se pide ninguno. */
export const DEFAULT_LANGUAGE: LostiumLanguage = "es";

export interface BrandingMessage {
  headline: string;
  claim: string;
  url: string;
  email: string;
}

export const MESSAGES: Record<LostiumLanguage, BrandingMessage> = {
  es: {
    headline: "Hecho con ❤️ por Lostium Innovation Studio",
    claim:
      "Diseño y desarrollo de productos digitales innovadores y hechos a medida.\nImpulsa tu negocio a través de tecnología asistida por IA.",
    url: "https://lostium.com/es/",
    email: "found@lostium.com",
  },
  en: {
    headline: "Made with ❤️ by Lostium Innovation Studio",
    claim:
      "Design and development of innovative, tailor-made digital products.\nBoost your business with AI-assisted technology.",
    url: "https://lostium.com/en/",
    email: "found@lostium.com",
  },
};
