import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

/*
 * Common setup / initialization for all unit tests in sbb-angular.
 */

TestBed.initTestEnvironment([BrowserDynamicTestingModule], platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: true },
});
patchConsoleToDetectWarningsOrErrors();

(window as any).module = {};
(window as any).isNode = false;
(window as any).isBrowser = true;
(window as any).global = window;

/**
 * Monkey patch console warn and error to fail if a test makes calls to console.warn or console.error.
 * https://github.com/angular/angular/issues/36430
 */
function patchConsoleToDetectWarningsOrErrors(): void {
  console.warn = function (message?: any, ...optionalParams: any[]): void {
    const params = optionalParams ? `\nParams: ${optionalParams}` : '';

    // ESRI JS API Requires WebGL, which is deactivated in the capabilities in Test-Chromium on Github-CI:
    if (params.indexOf('#validate(),WebGL is required but not supported') !== -1) {
      return;
    }

    throw new Error(`Test contained console warning:\n${message}${params}`);
  };
  console.error = function (message?: any, ...optionalParams: any[]): void {
    const params = optionalParams ? `\nParams: ${optionalParams}` : '';
    throw new Error(`Test contained console error:\n${message}${params}`);
  };
}
