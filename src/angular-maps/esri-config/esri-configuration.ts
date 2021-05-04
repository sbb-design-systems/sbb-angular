export interface SbbEsriConfiguration {
  cssUrl?: string;
  /**
   * @deprecated included in "@arcgis/core" module
   */
  arcgisJsUrl?: string;
  trustedServers?: string[];
  portalUrl?: string;
  originsWithCredentialsRequired?: string[];
}
