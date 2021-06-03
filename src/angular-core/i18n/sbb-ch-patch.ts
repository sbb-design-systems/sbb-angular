export {};

/**
 * We want to patch the swiss locales in order to match the date format defined by SBB.
 * The locales are defined at:
 *  - https://github.com/angular/angular/blob/master/packages/common/locales/global/de-CH.js
 *  - https://github.com/angular/angular/blob/master/packages/common/locales/global/en-CH.js
 *  - https://github.com/angular/angular/blob/master/packages/common/locales/global/fr-CH.js
 *  - https://github.com/angular/angular/blob/master/packages/common/locales/global/it-CH.js
 */

declare let globalThis: any;
declare let global: any;
declare let window: any;

// TODO: Convert to es6 with version 13
// tslint:disable:no-var-keyword prefer-const
(function (context: any) {
  var locales = context?.ng?.common?.locales;
  if (!locales) {
    return;
  }

  ['de-ch', 'en-ch', 'fr-ch', 'it-ch']
    .map((l) => locales[l])
    .filter((l) => !!l)
    .forEach((l) => {
      l[2] = undefined;
      l[10] = ['dd.MM.y', 'dd.MM.y', 'd. MMMM y', 'EEEE, d. MMMM y'];
      l[12][0] = '{1} {0}';
    });
})(
  (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof global !== 'undefined' && global) ||
    (typeof window !== 'undefined' && window)
);
