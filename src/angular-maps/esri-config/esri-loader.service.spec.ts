import { TestBed } from '@angular/core/testing';
import config from '@arcgis/core/config';
import { SbbEsriConfigModule } from '@sbb-esta/angular-maps/esri-config/esri-config.module';

import { SbbEsriConfiguration } from './esri-configuration';
import { SbbEsriLoaderService } from './esri-loader.service';
import { SbbEsriConfigConsts } from './esri-standard-values.const';

describe('EsriLoaderService', () => {
  const esriCustomConf: SbbEsriConfiguration = {
    trustedServers: ['t1', 't2'],
    portalUrl: 'urlToPortalInstance',
    originsWithCredentialsRequired: ['o1', 'o2'],
  };

  let loaderService: SbbEsriLoaderService;
  const configureTestingModule = (customConfig?: SbbEsriConfiguration) => {
    TestBed.configureTestingModule({
      imports: [...(customConfig ? [SbbEsriConfigModule.forRoot(customConfig!)] : [])],
      providers: [SbbEsriLoaderService],
    });
    loaderService = TestBed.inject(SbbEsriLoaderService);
  };

  it('should be created', () => {
    configureTestingModule();
    expect(loaderService).toBeTruthy();
  });

  it('should configure esri with standard config', async () => {
    configureTestingModule();
    const esriConfig = config;
    expect(esriConfig.portalUrl).toEqual(SbbEsriConfigConsts.arcgisPortalUrl);
    SbbEsriConfigConsts.trustedServers.forEach((srv) => {
      expect(esriConfig.request.trustedServers).toContain(srv);
    });
    expect(esriConfig.request.interceptors!.length).toBeGreaterThan(0);
  });

  it('should load modules with custom config', async () => {
    configureTestingModule(esriCustomConf);
    const esriConfig = config;
    expect(esriConfig.portalUrl).toEqual(esriCustomConf.portalUrl!);
    expect(esriConfig.request.trustedServers).toContain(esriCustomConf.trustedServers![0]);
    SbbEsriConfigConsts.trustedServers.concat(esriCustomConf.trustedServers!).forEach((srv) => {
      expect(esriConfig.request.trustedServers).toContain(srv);
    });
    expect(esriConfig.request.interceptors!.length).toBeGreaterThan(0);
  });
});
