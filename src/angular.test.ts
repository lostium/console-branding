// @vitest-environment jsdom
import { ApplicationRef, LOCALE_ID, PLATFORM_ID, provideZonelessChangeDetection, type Provider } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BrowserTestingModule, platformBrowserTesting } from "@angular/platform-browser/testing";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { languageFromLocale, provideLostiumBranding, type LostiumBrandingOptions } from "./angular.js";
import { resetBrandingPrint } from "./angular-state.js";
import { MESSAGES } from "./messages.js";

/** Arranca un injector raíz con el provider y devuelve el ApplicationRef. */
function setup(options?: LostiumBrandingOptions, extra: Provider[] = []): ApplicationRef {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), provideLostiumBranding(options), ...extra],
  });
  return TestBed.inject(ApplicationRef);
}

function spyOnConsole() {
  return vi.spyOn(console, "log").mockImplementation(() => {});
}

/** Texto del banner (la segunda llamada a `console.log`; la primera es el logo). */
function printedText(log: ReturnType<typeof spyOnConsole>): string {
  return String(log.mock.calls[1]?.[0]);
}

describe("provideLostiumBranding", () => {
  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    resetBrandingPrint();
    vi.restoreAllMocks();
  });

  it("no imprime con PLATFORM_ID de servidor", () => {
    const log = spyOnConsole();
    const appRef = setup({}, [{ provide: PLATFORM_ID, useValue: "server" }]);

    appRef.tick();

    expect(log).not.toHaveBeenCalled();
  });

  it("espera al primer render para imprimir", () => {
    const log = spyOnConsole();
    const appRef = setup();

    expect(log).not.toHaveBeenCalled();
    appRef.tick();
    expect(log).toHaveBeenCalledTimes(2);
  });

  it("imprime una sola vez aunque haya varios renders", () => {
    const log = spyOnConsole();
    const appRef = setup();

    appRef.tick();
    appRef.tick();
    appRef.tick();

    expect(log).toHaveBeenCalledTimes(2);
  });

  it("imprime una sola vez por carga aunque se arranque otra aplicación", () => {
    const log = spyOnConsole();
    setup().tick();
    TestBed.resetTestingModule();

    setup().tick();

    expect(log).toHaveBeenCalledTimes(2);
  });

  it("usa el inglés si LOCALE_ID es en-*", () => {
    const log = spyOnConsole();
    setup({}, [{ provide: LOCALE_ID, useValue: "en-GB" }]).tick();

    expect(printedText(log)).toContain(MESSAGES.en.headline);
  });

  it("usa el español si LOCALE_ID no es inglés", () => {
    const log = spyOnConsole();
    setup({}, [{ provide: LOCALE_ID, useValue: "ca" }]).tick();

    expect(printedText(log)).toContain(MESSAGES.es.headline);
  });

  it("la opción language manda sobre LOCALE_ID", () => {
    const log = spyOnConsole();
    setup({ language: "en" }, [{ provide: LOCALE_ID, useValue: "es-ES" }]).tick();

    expect(printedText(log)).toContain(MESSAGES.en.headline);
  });
});

describe("languageFromLocale", () => {
  it.each([
    ["en", "en"],
    ["en-US", "en"],
    ["EN-gb", "en"],
    ["es", "es"],
    ["es-ES", "es"],
    ["fr", "es"],
  ] as const)("%s → %s", (locale, expected) => {
    expect(languageFromLocale(locale)).toBe(expected);
  });
});
