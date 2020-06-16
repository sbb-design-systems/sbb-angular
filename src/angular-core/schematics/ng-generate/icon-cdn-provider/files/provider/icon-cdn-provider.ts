import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SbbIconRegistry } from '@sbb-esta/angular-core/icon';

/** @docs-private */
export const SBB_ICON_REGISTRY_PROVIDER = {
  // If there is already an SbbIconRegistry available, use that. Otherwise, provide a new one.
  provide: SbbIconRegistry,
  deps: [
    [new Optional(), new SkipSelf(), SbbIconRegistry],
    [new Optional(), HttpClient],
    DomSanitizer,
    ErrorHandler,
    [new Optional(), DOCUMENT as InjectionToken<any>],
  ],
  useFactory: SBB_ICON_REGISTRY_PROVIDER_FACTORY,
};

/**
 * Version <%= cdnIndex.version %> of CDN
 * @docs-private
 */
export function SBB_ICON_REGISTRY_PROVIDER_FACTORY(
  parentRegistry: SbbIconRegistry,
  httpClient: HttpClient,
  sanitizer: DomSanitizer,
  errorHandler: ErrorHandler,
  document?: any
) {
  return parentRegistry || new SbbIconRegistry(httpClient, sanitizer, document, errorHandler)<% for (const icon of cdnIndex.icons) { %>
    .addSvgIconInNamespace(
      '<%= icon.namespace %>',
      '<%= icon.name %>',
      sanitizer.bypassSecurityTrustResourceUrl('<%= cdnBaseUrl =>/<%= icon.namespace %>/<%= icon.name %>.svg')
    )<% } %>;
}

