export {};

/**
 * We want to patch the swiss locales in order to match the date format defined by SBB.
 * The locales are defined at:
 *  - https://github.com/angular/angular/blob/main/packages/common/locales/global/de-CH.js
 *  - https://github.com/angular/angular/blob/main/packages/common/locales/global/en-CH.js
 *  - https://github.com/angular/angular/blob/main/packages/common/locales/global/fr-CH.js
 *  - https://github.com/angular/angular/blob/main/packages/common/locales/global/it-CH.js
 */

declare var global: unknown;

// tslint:disable:no-var-keyword prefer-const
(function (context: any) {
  const locales = context?.ng?.common?.locales;
  if (!locales) {
    return;
  }

  ['de-ch', 'en-ch', 'fr-ch', 'it-ch']
    .map((l) => locales[l])
    .filter((l) => !!l)
    .forEach((l) => {
      l[2] = undefined;
      l[10] = ['dd.MM.yy', 'dd.MM.y', 'd. MMMM y', 'EEEE, d. MMMM y'];
      l[12][0] = '{1} {0}';
    });
})(
  (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof global !== 'undefined' && global) ||
    (typeof window !== 'undefined' && window),
);
