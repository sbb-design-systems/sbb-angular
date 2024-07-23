import { ErrorHandler, NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import '@angular/localize/init';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

@NgModule({
  providers: [
    provideExperimentalZonelessChangeDetection(),
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

TestBed.initTestEnvironment(
  [BrowserDynamicTestingModule, TestModule],
  platformBrowserDynamicTesting(),
  {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
);

(window as any).module = {};
(window as any).isNode = false;
(window as any).isBrowser = true;
(window as any).global = window;
