import {MaplibreMapMock} from '../../../model/maplibre-map-mock';
import {MapCursorStyleEvent} from './map-cursor-style-event';

describe('MapCursorStyleEvent', () => {
  let mapCursorStyleEvent: MapCursorStyleEvent;
  let mapMock: MaplibreMapMock;

  beforeEach(() => {
    mapMock = new MaplibreMapMock();
    const layers = ['layer-1', 'layer-2'];
    mapCursorStyleEvent = new MapCursorStyleEvent(mapMock.get(), layers);
  });

  afterEach(() => {
    mapCursorStyleEvent.complete();
  });

  it('should be created', () => {
    expect(mapCursorStyleEvent).toBeTruthy();
  });

  it('should set pointer cursor on mouse enter', (doneFn) => {
    expect(mapMock.getCanvas().style.cursor).toBe('');
    mapMock.raise('mouseenter');
    setTimeout(() => {
      expect(mapMock.getCanvas().style.cursor).toBe('pointer');
      doneFn();
    }, 100);
  });

  it('should set pointer cursor on mouse leave', (doneFn) => {
    mapMock.getCanvas().style.cursor = 'pointer';
    mapMock.raise('mouseleave');
    setTimeout(() => {
      expect(mapMock.getCanvas().style.cursor).toBe('');
      doneFn();
    }, 100);
  });
});
