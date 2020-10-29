export class SbbEsriConfigConsts {
  public static trustedServers: string[] = [
    'geo-dev.sbb.ch',
    'geo-int.sbb.ch',
    'geo.sbb.ch',
    'wms.geo.admin.ch',
  ];

  public static originsWithCredentialsReuqired: string[] = [
    'geo-dev.sbb.ch',
    'geo-int.sbb.ch',
    'geo.sbb.ch',
  ];

  public static arcgisPortalUrl: string = 'https://www.arcgis.com';

  public static arcgisJsUrl: string = 'https://js.arcgis.com/4.14/init.js';
  public static cssUrl: string = 'https://js.arcgis.com/4.14/esri/css/main.css';
}
