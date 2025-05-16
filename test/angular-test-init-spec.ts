import { ErrorHandler, NgModule, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import '@angular/localize/init';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

@NgModule({
  providers: [
    provideZonelessChangeDetection(),
    {
      provide: ErrorHandler,
      useValue: {
        handleError: (e: any) => {
          throw e;
        },
      },
    },
  ],
})
export class TestModule {}

/*
 * Common setup / initialization for all unit tests in sbb-angular.
 */

TestBed.initTestEnvironment([BrowserTestingModule, TestModule], platformBrowserTesting(), {
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

(window as any).module = {};
(window as any).isNode = false;
(window as any).isBrowser = true;
(window as any).global = window;
