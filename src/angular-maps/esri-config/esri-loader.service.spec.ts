import { TestBed } from '@angular/core/testing';
import config from '@arcgis/core/config';

import { SbbEsriConfigConsts, SbbEsriConfigModule, SbbEsriConfiguration } from './index';

describe('EsriLoaderService', () => {
  const esriCustomConf: SbbEsriConfiguration = {
    trustedServers: ['t1', 't2'],
    portalUrl: 'urlToPortalInstance',
  };

  const configureTestingModule = (customConfig?: SbbEsriConfiguration) => {
    TestBed.configureTestingModule({
      imports: [...(customConfig ? [SbbEsriConfigModule.forRoot(customConfig!)] : [])],
    });
  };

  it('should configure esri with standard config', async () => {
    configureTestingModule();
    const esriConfig = config;
    expect(esriConfig.portalUrl).toEqual(SbbEsriConfigConsts.arcgisPortalUrl);
    SbbEsriConfigConsts.trustedServers.forEach((srv) => {
      expect(esriConfig.request.trustedServers).toContain(srv);
    });
  });

  it('should load modules with custom config', async () => {
    configureTestingModule(esriCustomConf);
    const esriConfig = config;
    expect(esriConfig.portalUrl).toEqual(esriCustomConf.portalUrl!);
    expect(esriConfig.request.trustedServers).toContain(esriCustomConf.trustedServers![0]);
    SbbEsriConfigConsts.trustedServers.concat(esriCustomConf.trustedServers!).forEach((srv) => {
      expect(esriConfig.request.trustedServers).toContain(srv);
    });
  });
});
