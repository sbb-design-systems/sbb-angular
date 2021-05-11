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
 * Generated from version v1.14.0 of the icon CDN.
 * @docs-private
 */
export function SBB_ICON_REGISTRY_WRAPPER_PROVIDER_FACTORY(
  parentRegistry: SbbIconRegistry,
  httpClient: HttpClient,
  sanitizer: DomSanitizer,
  errorHandler: ErrorHandler,
  document?: any
) {
  const registry = new SbbIconRegistryWrapper(
    parentRegistry,
    httpClient,
    sanitizer,
    document,
    errorHandler
  );
  const cdnUrl = 'https://icons.app.sbb.ch';
  const namespacedIcons = [
    {
      namespace: 'fpl',
      icons: ['info'],
    },
    {
      namespace: 'kom',
      icons: [
        'arrow-long-right-small',
        'arrow-right-small',
        'calendar-small',
        'chevron-right-small',
        'chevron-small-down-circle-small',
        'chevron-small-down-small',
        'chevron-small-left-circle-small',
        'chevron-small-left-small',
        'chevron-small-right-circle-small',
        'chevron-small-right-small',
        'circle-information-small',
        'circle-question-mark-small',
        'context-menu-small',
        'cross-small',
        'document-image-small',
        'document-pdf-small',
        'document-sound-small',
        'document-standard-small',
        'document-text-small',
        'document-video-small',
        'document-zip-small',
        'download-small',
        'exclamation-point-small',
        'hamburger-menu-small',
        'house-small',
        'magnifying-glass-small',
        'minus-small',
        'plus-small',
        'sign-exclamation-point-small',
        'tick-small',
        'trash-small',
        'upload-small',
        'user-small',
      ],
    },
  ];
  for (const entry of namespacedIcons) {
    for (const icon of entry.icons) {
      registry.addSvgIconInNamespace(
        entry.namespace,
        icon,
        sanitizer.bypassSecurityTrustResourceUrl(`${cdnUrl}/${entry.namespace}/${icon}.svg`)
      );
    }
  }
  return registry;
}
