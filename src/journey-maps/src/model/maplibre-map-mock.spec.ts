import {MaplibreMapMock} from './maplibre-map-mock';

describe('MaplibreMapMock', () => {
  let mapMock: MaplibreMapMock;

  beforeEach(() => {
    mapMock = new MaplibreMapMock();
  });

  it('should be created', () => {
    expect(mapMock).toBeTruthy();
  });

  it('should call event on map click', (doneFn) => {
    mapMock.on('click', (eventArgs) => {
      expect(eventArgs).toBeTruthy();
      expect(eventArgs.point).toBeTruthy();
      expect(eventArgs.lngLat).toBeTruthy();
      doneFn();
    });

    mapMock.raise('click');
  });

  it('should call event on map layer click', (doneFn) => {
    mapMock.on('click', 'test-layer', (eventArgs) => {
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
});
