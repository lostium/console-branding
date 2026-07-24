/** Idiomas en los que existe el banner. */
export type LostiumLanguage = "es" | "en";
/** Idioma de la marca: el que se usa cuando no se pide ninguno. */
export declare const DEFAULT_LANGUAGE: LostiumLanguage;
export interface BrandingMessage {
    headline: string;
    claim: string;
    url: string;
    email: string;
}
export declare const MESSAGES: Record<LostiumLanguage, BrandingMessage>;
//# sourceMappingURL=messages.d.ts.map