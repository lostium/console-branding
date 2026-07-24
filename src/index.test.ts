import { afterEach, describe, expect, it, vi } from "vitest";

import { printLostiumBranding } from "./index.js";
import { MESSAGES } from "./messages.js";

/** Sustituye `console.log` y devuelve el espía para inspeccionar las llamadas. */
function spyOnConsole() {
  return vi.spyOn(console, "log").mockImplementation(() => {});
}

/** Finge un navegador cuya página declara el idioma indicado. */
function stubBrowser(lang: string): void {
  vi.stubGlobal("document", { documentElement: { lang } });
}

describe("printLostiumBranding", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("no imprime nada fuera del navegador", () => {
    const log = spyOnConsole();

    printLostiumBranding();

    expect(log).not.toHaveBeenCalled();
  });

  it("imprime el logo y el texto en dos llamadas", () => {
    stubBrowser("es");
    const log = spyOnConsole();

    printLostiumBranding();

    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[0]?.[1]).toContain("data:image/svg+xml,");
  });

  it("usa el español por defecto", () => {
    stubBrowser("es");
    const log = spyOnConsole();

    printLostiumBranding();

    const text = String(log.mock.calls[1]?.[0]);
    expect(text).toContain(MESSAGES.es.headline);
    expect(text).toContain(MESSAGES.es.url);
    expect(text).toContain(MESSAGES.es.email);
  });

  it("sigue en español aunque la página esté en inglés", () => {
    stubBrowser("en");
    const log = spyOnConsole();

    printLostiumBranding();

    expect(String(log.mock.calls[1]?.[0])).toContain(MESSAGES.es.headline);
  });

  it("imprime en inglés cuando se pide", () => {
    stubBrowser("es");
    const log = spyOnConsole();

    printLostiumBranding("en");

    const text = String(log.mock.calls[1]?.[0]);
    expect(text).toContain(MESSAGES.en.headline);
    expect(text).toContain(MESSAGES.en.url);
  });
});
