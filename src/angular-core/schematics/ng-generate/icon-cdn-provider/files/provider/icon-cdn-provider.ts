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
 * Icons that are not needed by your app and are not @sbb-esta required icons (see list below) can be removed.
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
 * You can also self-host the CDN icons, by downloading the icons from the Icon CDN (https://icons.app.sbb.ch)
 * and adapting the url.
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
  /*
   * @sbb-esta Required Icons
   * ========================
   * Our libraries require the following icons. Please do not remove them
   * or make sure you provide them yourself.
   *
   * Icons:<% for (const entry of moduleIcons) { %>
   *  - <%= entry.module %>: <%= entry.icons.join(', ') %><% } %>
   */
  const registry =
    parentRegistry || new SbbIconRegistry(httpClient, sanitizer, document, errorHandler);
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
