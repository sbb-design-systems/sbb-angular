import { MapGeoJSONFeature } from 'maplibre-gl';

import { SbbMaplibreMapMock } from './maplibre-map-mock';

describe('MaplibreMapMock', () => {
  let mapMock: SbbMaplibreMapMock;

  beforeEach(() => {
    mapMock = new SbbMaplibreMapMock();
  });

  it('should be created', () => {
    expect(mapMock).toBeTruthy();
  });

  it('should call event on map click', (doneFn) => {
    mapMock.on('click', (eventArgs: { point: any; lngLat: any }) => {
      expect(eventArgs).toBeTruthy();
      expect(eventArgs.point).toBeTruthy();
      expect(eventArgs.lngLat).toBeTruthy();
      doneFn();
    });

    mapMock.raise('click');
  });

  it('should call event on map layer click', (doneFn) => {
    mapMock.on('click', 'test-layer', (eventArgs: { point: any; lngLat: any }) => {
      expect(eventArgs).toBeTruthy();
      expect(eventArgs.point).toBeTruthy();
      expect(eventArgs.lngLat).toBeTruthy();
      doneFn();
    });

    mapMock.raise('click');
  });

  it('should call event on any test-event', (doneFn) => {
    mapMock.on('test-event', () => {
      doneFn();
    });

    mapMock.raise('test-event');
  });

  describe('Query rendered features', () => {
    it('should return a feature', () => {
      const point: [number, number] = [1, 2];
      const layer = 'le-layer';
      mapMock.addFeatureData(point, [layer], dummyFeature);

      const renderedFeatures = mapMock.queryRenderedFeatures(point, { layers: [layer] });
      expect(renderedFeatures).toBeTruthy();
      expect(renderedFeatures).toHaveSize(1);
      expect(renderedFeatures![0].id).toEqual('test-feature');
    });

    it('should return a feature when no layer is given', () => {
      const point: [number, number] = [1, 2];
      const layer = 'le-layer';
      mapMock.addFeatureData(point, [layer], dummyFeature);

      const renderedFeatures = mapMock.queryRenderedFeatures(point);
      expect(renderedFeatures).toBeTruthy();
      expect(renderedFeatures).toHaveSize(1);
      expect(renderedFeatures![0].id).toEqual('test-feature');
    });

    it('should return no feature if point does not match', () => {
      const point: [number, number] = [1, 2];
      const layer = 'le-layer';
      mapMock.addFeatureData(point, [layer], dummyFeature);

      const renderedFeatures = mapMock.queryRenderedFeatures([2, 1], { layers: [layer] });
      expect(renderedFeatures).toBeFalsy();
    });

    it('should return no feature if layer does not match', () => {
      const point: [number, number] = [1, 2];
      const layer = 'le-layer';
      mapMock.addFeatureData(point, [layer], dummyFeature);

      const renderedFeatures = mapMock.queryRenderedFeatures(point, { layers: ['le-wrong-layer'] });
      expect(renderedFeatures).toBeFalsy();
    });
  });
});

const dummyFeature: MapGeoJSONFeature[] = [
  {
    type: 'Feature',
    id: 'test-feature',
    geometry: null,
    properties: [],
    layer: null,
    source: null,
    sourceLayer: null,
    state: null,
  } as unknown as MapGeoJSONFeature,
];
