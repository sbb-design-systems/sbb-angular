import { TestBed } from '@angular/core/testing';
import config from '@arcgis/core/config';

import { SbbEsriConfiguration } from './esri-configuration';
import { SbbEsriLoaderService } from './esri-loader.service';
import { SbbEsriConfigConsts } from './esri-standard-values.const';
import configRequest = __esri.configRequest;

describe('EsriLoaderService', () => {
  const esriCustomConf: SbbEsriConfiguration = {
    trustedServers: ['t1', 't2'],
    portalUrl: 'urlToPortalInstance',
    originsWithCredentialsRequired: ['o1', 'o2'],
  };

  class EsriConfigMock implements Partial<config> {
    portalUrl: string;
    request: configRequest = {
      trustedServers: [],
      interceptors: [],
    };
  }

  let loaderService: SbbEsriLoaderService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SbbEsriLoaderService],
    });
    loaderService = TestBed.inject(SbbEsriLoaderService);
  });

  it('should be created', () => {
    expect(loaderService).toBeTruthy();
  });

  it('should configure esri with standard config', async () => {
    const esriConfigMock = new EsriConfigMock();
    expect(esriConfigMock.portalUrl).toEqual(SbbEsriConfigConsts.arcgisPortalUrl);
    expect(esriConfigMock.request.trustedServers).toEqual(SbbEsriConfigConsts.trustedServers);
    expect(esriConfigMock.request.interceptors!.length).toBeGreaterThan(0);
  });

  it('should load modules with custom config', async () => {
    // tslint:disable-next-line: no-string-literal
    loaderService['_config'] = esriCustomConf;

    loaderService = TestBed.inject(SbbEsriLoaderService);

    const esriConfigMock = new EsriConfigMock();
    expect(esriConfigMock.portalUrl).toEqual(esriCustomConf.portalUrl!);
    expect(esriConfigMock.request.trustedServers).toEqual(
      SbbEsriConfigConsts.trustedServers.concat(esriCustomConf.trustedServers!)
    );
    expect(esriConfigMock.request.interceptors!.length).toBeGreaterThan(0);
  });
});
