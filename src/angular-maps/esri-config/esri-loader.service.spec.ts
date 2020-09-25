// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

import { TestBed } from '@angular/core/testing';
import esriLoader from 'esri-loader';

import { SbbEsriConfiguration } from './esri-configuration';
import { SbbEsriLoaderService } from './esri-loader.service';
import { SbbEsriConfigConsts } from './esri-standard-values.const';

describe('EsriLoaderService', () => {
  const esriCustomConf: SbbEsriConfiguration = {
    cssUrl: 'myCssUrl',
    arcgisJsUrl: 'arcgisJsURL',
    trustedServers: ['t1', 't2'],
    portalUrl: 'urlToPortalInstance',
    originsWithCredentialsRequired: ['o1', 'o2'],
  };

  class EsriConfigMock implements Partial<__esri.config> {
    portalUrl: string;
    request: __esri.configRequest = {
      trustedServers: [],
      interceptors: [],
    };
  }

  let loaderService: SbbEsriLoaderService;

  function createEsriLoaderSpy(esriConfigMock: EsriConfigMock) {
    const spy = spyOn(esriLoader, 'loadModules');
    spy.and.returnValue(Promise.resolve([esriConfigMock]));
    spyOn(esriLoader, 'loadCss').and.returnValue(null!);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SbbEsriLoaderService],
    });
    loaderService = TestBed.inject(SbbEsriLoaderService);
  });

  it('should be created', () => {
    expect(loaderService).toBeTruthy();
  });

  it('should load modules with standard config', async () => {
    const esriConfigMock = new EsriConfigMock();
    createEsriLoaderSpy(esriConfigMock);

    let webMap: __esri.WebMapConstructor;
    [webMap] = await loaderService.load<__esri.WebMapConstructor>(['esri/WebMap']);

    expect(esriConfigMock.portalUrl).toEqual(SbbEsriConfigConsts.arcgisPortalUrl);
    expect(esriConfigMock.request.trustedServers).toEqual(SbbEsriConfigConsts.trustedServers);
    expect(esriConfigMock.request.interceptors!.length).toBeGreaterThan(0);
    expect(esriLoader.loadCss).toHaveBeenCalledWith(SbbEsriConfigConsts.cssUrl);
    expect(webMap).toBeDefined();
  });

  it('should load modules with custom config', async () => {
    // tslint:disable-next-line: no-string-literal
    loaderService['_config'] = esriCustomConf;

    loaderService = TestBed.inject(SbbEsriLoaderService);

    const esriConfigMock = new EsriConfigMock();
    createEsriLoaderSpy(esriConfigMock);

    let webMap: __esri.WebMapConstructor;
    [webMap] = await loaderService.load<__esri.WebMapConstructor>(['esri/WebMap']);

    expect(esriConfigMock.portalUrl).toEqual(esriCustomConf.portalUrl!);
    expect(esriConfigMock.request.trustedServers).toEqual(
      SbbEsriConfigConsts.trustedServers.concat(esriCustomConf.trustedServers!)
    );
    expect(esriConfigMock.request.interceptors!.length).toBeGreaterThan(0);
    expect(esriLoader.loadCss).toHaveBeenCalledWith(esriCustomConf.cssUrl);
    expect(webMap).toBeDefined();
  });
});
