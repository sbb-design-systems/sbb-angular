export interface SbbEsriConfiguration {
  /**
   * @deprecated read the angular-maps "Getting Started" section (http://localhost:4200/public/introduction/getting-started).
   */
  cssUrl?: string;
  /**
   * @deprecated included in "@arcgis/core" npm package.
   */
  arcgisJsUrl?: string;
  trustedServers?: string[];
  portalUrl?: string;
  originsWithCredentialsRequired?: string[];
}
