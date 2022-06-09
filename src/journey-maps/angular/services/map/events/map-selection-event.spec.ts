import { MapGeoJSONFeature } from 'maplibre-gl';

import { SbbMaplibreMapMock } from '../../../testing/maplibre-map-mock';

import { SbbMapCursorStyleEvent } from './map-cursor-style-event';

describe('MapCursorStyleEvent', () => {
  let mapCursorStyleEvent: SbbMapCursorStyleEvent;
  let mapMock: SbbMaplibreMapMock;

  beforeEach(() => {
    mapMock = new SbbMaplibreMapMock();
    mapCursorStyleEvent = new SbbMapCursorStyleEvent(mapMock.get(), layers);
  });

  afterEach(() => {
    mapCursorStyleEvent.complete();
  });

  it('should be created', () => {
    expect(mapCursorStyleEvent).toBeTruthy();
  });

  it('should set pointer cursor when feature is present', (doneFn) => {
    expect(mapMock.getCanvas().style.cursor).toBe('');
    mapMock.addFeatureData(SbbMaplibreMapMock.EVENT_POINT, layers, dummyFeature);
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
const dummyFeature: MapGeoJSONFeature[] = [
  {
    type: 'Feature',
    id: 'test-feature',
    properties: [],
  } as unknown as MapGeoJSONFeature,
];
