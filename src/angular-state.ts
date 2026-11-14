/**
 * Estado compartido de la entrada de Angular.
 *
 * Vive en un módulo aparte para que los tests puedan reiniciarlo sin que la
 * función de reinicio forme parte de la API pública: este fichero no aparece
 * en el `exports` del package.json, así que los consumidores no pueden
 * importarlo.
 */

let printed = false;

/** Marca el banner como impreso. Devuelve `false` si ya lo estaba. */
export function claimBrandingPrint(): boolean {
  if (printed) return false;
  printed = true;
  return true;
}

/** Solo para tests: permite volver a imprimir el banner. */
export function resetBrandingPrint(): void {
  printed = false;
}
