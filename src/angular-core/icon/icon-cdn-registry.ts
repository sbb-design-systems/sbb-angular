import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SbbIconRegistry } from './icon-registry';

/** @docs-private */
export const SBB_MODULE_ICONS = new InjectionToken<string[]>('SBB_MODULE_ICONS');

/** Base url of icon cdn for sbb icons TODO: replace CDN-Url*/
export const SBB_ICON_CDN_URL = '/assets/';

/** @docs-private */
export function SBB_MODULE_ICON_REGISTRY_PROVIDER_FACTORY(
  parentRegistry: SbbIconRegistry,
  httpClient: HttpClient,
  sanitizer: DomSanitizer,
  errorHandler: ErrorHandler,
  icons: string[],
  document?: any
) {
  const registry =
    parentRegistry || new SbbIconRegistry(httpClient, sanitizer, document, errorHandler);

  for (const icon of icons) {
    const [namespace, iconName] = splitIconKey(icon);
    if (!registry.hasNamespaceSvgIcon(namespace, iconName)) {
      registry.addSvgIconInNamespace(
        namespace,
        iconName,
        sanitizer.bypassSecurityTrustResourceUrl(`${SBB_ICON_CDN_URL}${namespace}/${iconName}.svg`)
      );
    }
  }

  return registry;
}

/** @docs-private */
export const SBB_MODULE_ICON_REGISTRY_PROVIDER = {
  // If there is already an SbbIconRegistry available, use that. Otherwise, provide a new one.
  provide: SbbIconRegistry,
  deps: [
    [new Optional(), new SkipSelf(), SbbIconRegistry],
    [new Optional(), HttpClient],
    DomSanitizer,
    ErrorHandler,
    SBB_MODULE_ICONS,
    [new Optional(), DOCUMENT as InjectionToken<any>],
  ],
  useFactory: SBB_MODULE_ICON_REGISTRY_PROVIDER_FACTORY,
};

/** @docs-private */
function splitIconKey(iconName: string): string[] {
  return iconName.split(':', 2);
}
