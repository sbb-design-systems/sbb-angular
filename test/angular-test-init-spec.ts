import { TestBed } from '@angular/core/testing';
import '@angular/localize/init';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

/*
 * Common setup / initialization for all unit tests in sbb-angular.
 */

TestBed.initTestEnvironment([BrowserDynamicTestingModule], platformBrowserDynamicTesting(), {
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

(window as any).module = {};
(window as any).isNode = false;
(window as any).isBrowser = true;
(window as any).global = window;
