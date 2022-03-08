import { Geometry } from 'geojson';
import { MapboxGeoJSONFeature } from 'maplibre-gl';

import { MaplibreMapMock } from '../../../model/maplibre-map-mock';

import { MapCursorStyleEvent } from './map-cursor-style-event';

describe('MapCursorStyleEvent', () => {
  let mapCursorStyleEvent: MapCursorStyleEvent;
  let mapMock: MaplibreMapMock;

  beforeEach(() => {
    mapMock = new MaplibreMapMock();
    mapCursorStyleEvent = new MapCursorStyleEvent(mapMock.get(), layers);
  });

  afterEach(() => {
    mapCursorStyleEvent.complete();
  });

  it('should be created', () => {
    expect(mapCursorStyleEvent).toBeTruthy();
  });

  it('should set pointer cursor when feature is present', (doneFn) => {
    expect(mapMock.getCanvas().style.cursor).toBe('');
    mapMock.addFeatureData(MaplibreMapMock.EVENT_POINT, layers, dummyFeature);
    mapMock.raise('mouseenter');
    setTimeout(() => {
      expect(mapMock.getCanvas().style.cursor).toBe('pointer');
      doneFn();
    }, 100);
  });

  it('should unset pointer cursor when NO feature is preent', (doneFn) => {
    mapMock.getCanvas().style.cursor = 'pointer';
    mapMock.raise('mouseleave');
    setTimeout(() => {
      expect(mapMock.getCanvas().style.cursor).toBe('');
      doneFn();
    }, 100);
  });
});

const layers = ['layer-1', 'layer-2'];
const dummyFeature: MapboxGeoJSONFeature[] = [
  {
    type: 'Feature',
    id: 'test-feature',
    properties: [],
  } as unknown as MapboxGeoJSONFeature,
];
