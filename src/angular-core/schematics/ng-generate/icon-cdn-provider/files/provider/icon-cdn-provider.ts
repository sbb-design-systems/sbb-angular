import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SbbIconRegistry } from '@sbb-esta/angular-core/icon';

/**
 * This providers registers all icons added below, which can then be used with <sbb-icon>.
 * Example:
 *   `
 *     .addSvgIconInNamespace(
 *       'namespace-example',
 *       'icon-example',
 *       sanitizer.bypassSecurityTrustResourceUrl('url/to/icon.svg')
 *     )
 *   `
 *   `<sbb-icon svgIcon="namespace-example:icon-example"></sbb-icon>`
 *
 * Register this in your AppModule:
 *   `
 *     @NgModule({
 *       ...
 *       providers: [
 *         ...
 *         SBB_ICON_REGISTRY_PROVIDER
 *       ]
 *     })
 *     export class AppModule {
 *       ...
 *   `
 */
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
 * Generated from version <%= cdnIndex.version %> of the icon CDN.
 * Icons that are not needed by your app can be removed.
 *
 * You can also add additional icons from your assets:
 *   `
 *     .addSvgIconInNamespace(
 *       'my-icons',
 *       'lego',
 *       sanitizer.bypassSecurityTrustResourceUrl('/assets/path/to/your/icon/in/assets/directory.svg')
 *     )
 *   `
 *   `<sbb-icon svgIcon="my-icons:lego"></sbb-icon>`
 *   or without namespace
 *   `
 *     .addSvgIcon(
 *       'lego',
 *       sanitizer.bypassSecurityTrustResourceUrl('/assets/path/to/your/icon/in/assets/directory.svg')
 *     )
 *   `
 *   `<sbb-icon svgIcon="lego"></sbb-icon>`
 *
 * You can also self-host the CDN icons, by downloading the icons from the CDN
 * or from https://github.com/sbb-design-systems/icon-library/tree/master/icons/svg
 * and adapting the url:
 *   `
 *     ['fpl', 'sa-1', '/assets/path/to/sa-1.svg'],
 *     ...
 *     )
 *   `
 *
 * @docs-private
 */
export function SBB_ICON_REGISTRY_PROVIDER_FACTORY(
  parentRegistry: SbbIconRegistry,
  httpClient: HttpClient,
  sanitizer: DomSanitizer,
  errorHandler: ErrorHandler,
  document?: any
) {
  const registry = parentRegistry || new SbbIconRegistry(httpClient, sanitizer, document, errorHandler);
  const icons = [<% for (const icon of cdnIndex.icons) { %>
    ['<%= icon.namespace %>', '<%= icon.name %>', '<%= cdnBaseUrl %>/<%= icon.namespace %>/<%= icon.name %>.svg'],<% } %>
  ];
  for (const [namespace, icon, url] of icons) {
    registry.addSvgIconInNamespace(namespace, icon, sanitizer.bypassSecurityTrustResourceUrl(url));
  }
  return registry;
}

