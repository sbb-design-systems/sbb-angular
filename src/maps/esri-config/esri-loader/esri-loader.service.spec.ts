import { TestBed } from '@angular/core/testing';
import * as esriLoader from 'esri-loader';

import { EsriConfiguration } from '../esri-config/esri-configuration';
import { EsriConfigConsts } from '../esri-config/esri-standard-values.const';

import { EsriLoaderService } from './esri-loader.service';

describe('EsriLoaderService', () => {
  const esriCustomConf: EsriConfiguration = {
    cssUrl: 'myCssUrl',
    arcgisJsUrl: 'arcgisJsURL',
    trustedServers: ['t1', 't2'],
    portalUrl: 'urlToPortalInstance',
    originsWithCredentialsRequired: ['o1', 'o2']
  };

  class EsriConfigMock {
    portalUrl: string;
    request = {
      trustedServers: [],
      interceptors: []
    };
  }

  let loaderService: EsriLoaderService;

  function createEsriLoaderSpy(esriConfigMock: EsriConfigMock) {
    const spy = spyOn(esriLoader, 'loadModules');
    spy.and.returnValue(Promise.resolve([esriConfigMock]));
    spyOn(esriLoader, 'loadCss').and.returnValue(null!);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EsriLoaderService]
    });
    loaderService = TestBed.inject(EsriLoaderService);
  });

  it('should be created', () => {
    expect(loaderService).toBeTruthy();
  });

  it('should load modules with standard config', async () => {
    const esriConfigMock = new EsriConfigMock();
    createEsriLoaderSpy(esriConfigMock);

    let webMap: __esri.WebMapConstructor;
    [webMap] = await loaderService.load<__esri.WebMapConstructor>(['esri/WebMap']);

    expect(esriConfigMock.portalUrl).toEqual(EsriConfigConsts.arcgisPortalUrl);
    expect(esriConfigMock.request.trustedServers).toEqual(EsriConfigConsts.trustedServers);
    expect(esriConfigMock.request.interceptors.length).toBeGreaterThan(0);
    expect(esriLoader.loadCss).toHaveBeenCalledWith(EsriConfigConsts.cssUrl);
    expect(webMap).toBeDefined();
  });

  it('should load modules with custom config', async () => {
    // tslint:disable-next-line: no-string-literal
    loaderService['_config'] = esriCustomConf;

    loaderService = TestBed.inject(EsriLoaderService);

    const esriConfigMock = new EsriConfigMock();
    createEsriLoaderSpy(esriConfigMock);

    let webMap: __esri.WebMapConstructor;
    [webMap] = await loaderService.load<__esri.WebMapConstructor>(['esri/WebMap']);

    expect(esriConfigMock.portalUrl).toEqual(esriCustomConf.portalUrl);
    expect(esriConfigMock.request.trustedServers).toEqual(
      EsriConfigConsts.trustedServers.concat(esriCustomConf.trustedServers)
    );
    expect(esriConfigMock.request.interceptors.length).toBeGreaterThan(0);
    expect(esriLoader.loadCss).toHaveBeenCalledWith(esriCustomConf.cssUrl);
    expect(webMap).toBeDefined();
  });
});
