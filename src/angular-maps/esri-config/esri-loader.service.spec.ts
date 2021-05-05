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
  const beforeEach = () => {
    TestBed.configureTestingModule({
      providers: [SbbEsriLoaderService],
    });
    loaderService = TestBed.inject(SbbEsriLoaderService);
  };

  it('should be created', () => {
    beforeEach();
    expect(loaderService).toBeTruthy();
  });

  it('should configure esri with standard config', async () => {
    beforeEach();
    const esriConfig = config;
    expect(esriConfig.portalUrl).toEqual(SbbEsriConfigConsts.arcgisPortalUrl);
    expect(esriConfig.request.trustedServers).toEqual(SbbEsriConfigConsts.trustedServers);
    expect(esriConfig.request.interceptors!.length).toBeGreaterThan(0);
  });

  it('should load modules with custom config', async () => {
    TestBed.configureTestingModule({
      imports: [SbbEsriConfigModule.forRoot(esriCustomConf)],
      providers: [SbbEsriLoaderService],
    });
    loaderService = TestBed.inject(SbbEsriLoaderService);

    const esriConfig = config;
    expect(esriConfig.portalUrl).toEqual(esriCustomConf.portalUrl!);
    expect(esriConfig.request.trustedServers).toEqual(
      SbbEsriConfigConsts.trustedServers.concat(esriCustomConf.trustedServers!)
    );
    expect(esriConfig.request.interceptors!.length).toBeGreaterThan(0);
  });
});
