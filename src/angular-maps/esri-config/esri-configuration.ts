export interface SbbEsriConfiguration {
  /**
   * @deprecated read the angular-maps "Getting Started" section (https://angular.app.sbb.ch/maps/introduction/getting-started).
   */
  cssUrl?: string;
  /**
   * @deprecated included in "@arcgis/core" npm package.
   */
  arcgisJsUrl?: string;
  trustedServers?: string[];
  portalUrl?: string;
  /**
   * @deprecated not used. Esri is using only the new FetchAPI instead of XMLHttpRequest (since API V4.10).
   */
  originsWithCredentialsRequired?: string[];
}
