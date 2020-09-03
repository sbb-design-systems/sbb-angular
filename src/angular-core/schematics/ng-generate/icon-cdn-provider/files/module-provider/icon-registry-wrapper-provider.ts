import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { SbbIconRegistry } from './icon-registry';
import { SbbIconRegistryWrapper } from './icon-registry-wrapper';

/**
 * This providers registers the necessary icons for this module.
 * @docs-private
 */
export const SBB_ICON_REGISTRY_WRAPPER_PROVIDER = {
  // If there is already an SbbIconRegistry available, use that. Otherwise, provide a new one.
  provide: SbbIconRegistry,
  deps: [
    [new Optional(), new SkipSelf(), SbbIconRegistry],
    [new Optional(), HttpClient],
    DomSanitizer,
    ErrorHandler,
    [new Optional(), DOCUMENT as InjectionToken<any>],
  ],
  useFactory: SBB_ICON_REGISTRY_WRAPPER_PROVIDER_FACTORY,
};

/**
 * Generated from version <%= cdnIndex.version %> of the icon CDN.
 * @docs-private
 */
export function SBB_ICON_REGISTRY_WRAPPER_PROVIDER_FACTORY(
  parentRegistry: SbbIconRegistry,
  httpClient: HttpClient,
  sanitizer: DomSanitizer,
  errorHandler: ErrorHandler,
  document?: any
) {
  const registry = new SbbIconRegistryWrapper(parentRegistry, httpClient, sanitizer, document, errorHandler);
  const cdnUrl = '<%= cdnBaseUrl %>';
  const namespacedIcons = [<% for (const namespace of namespacedIcons) { %>
    {
      namespace: '<%= namespace[0] %>',
      icons: [<% for (const icon of namespace[1]) { %>
        '<%= icon %>',<% } %>
      ]
    },<% } %>
  ];
  for (const entry of namespacedIcons) {
    for (const icon of entry.icons) {
      registry.addSvgIconInNamespace(
        entry.namespace,
        icon,
        sanitizer.bypassSecurityTrustResourceUrl(`${cdnUrl}/${entry.namespace}/${icon}.svg`));
    }
  }
  return registry;
}
