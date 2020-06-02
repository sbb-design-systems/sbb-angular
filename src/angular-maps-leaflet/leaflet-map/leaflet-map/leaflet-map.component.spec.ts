import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  circle,
  imageOverlay,
  latLng,
  LatLng,
  LatLngBounds,
  layerGroup,
  LayerGroup,
  LeafletEvent,
  LeafletMouseEvent,
  Map,
  TileLayer,
} from 'leaflet';

import { DEFAULT_CENTER, DEFAULT_ZOOM } from './config/leaflet.const';
import { LeafletMapComponent } from './leaflet-map.component';
import { LayersControl, LayersControlLayer } from './model/map-config.model';

describe('LeafletMapComponent', () => {
  let leafletMapComponent: LeafletMapComponent;
  let fixture: ComponentFixture<LeafletMapComponent>;

  const sampleLayerGroup: LayerGroup = layerGroup([
    circle([56.948212, 8.455189], {
      color: 'blue',
    }),
  ]);

  const layersControl: LayersControl = {
    baseLayers: [
      {
        title: 'sample1',
        layer: new TileLayer('sample1'),
        visible: true,
      },
    ],
    overLays: [
      {
        title: 'overlay1',
        layer: layerGroup([
          circle([46.948212, 7.455189], {
            color: 'red',
          }),
        ]),
        visible: true,
      },
      {
        title: 'Shapes',
        visible: true,
        layer: layerGroup([
          circle([46.948212, 7.455189], {
            color: 'red',
          }),
        ]),
      },
    ],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeafletMapComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeafletMapComponent);
    leafletMapComponent = fixture.componentInstance;
    leafletMapComponent.mapOptions = {};
    leafletMapComponent.layersControlConfig = layersControl;
  });

  it('should initialize map with default mapOptions config', async(() => {
    leafletMapComponent.mapOptions = {};
    leafletMapComponent.mapReady.subscribe((map: Map) => {
      expect(map.getCenter()).toEqual(DEFAULT_CENTER);
      expect(map.getZoom()).toEqual(DEFAULT_ZOOM);
    });
    leafletMapComponent.ngOnInit();
  }));

  it('should initialize map with given mapOptions', async(() => {
    const zoomlvl = 10;
    const mapCenter = latLng(5, 5);
    leafletMapComponent.mapOptions = { zoom: zoomlvl, center: mapCenter };
    leafletMapComponent.mapReady.subscribe((map: Map) => {
      expect(map.getCenter()).toEqual(mapCenter);
      expect(map.getZoom()).toEqual(zoomlvl);
    });
    leafletMapComponent.ngOnInit();
  }));

  it('should initialize layerscontrol for map', async(() => {
    leafletMapComponent.mapReady.subscribe((map: Map) => {
      let i = 0;
      map.eachLayer(() => i++);
      expect(i).toEqual(6);
    });
    leafletMapComponent.ngOnInit();
  }));

  it('should emit map ready', async(() => {
    leafletMapComponent.mapReady.subscribe((map: Map) => expect(map).toBeDefined());
    leafletMapComponent.ngOnInit();
  }));

  it('should emit mapClicked', async(() => {
    let map: Map;
    leafletMapComponent.mapReady.subscribe((m: Map) => {
      map = m;
      map.fireEvent('click');
    });
    leafletMapComponent.mapClicked.subscribe((e: LeafletMouseEvent) =>
      expect(e.type).toBe('click')
    );
    leafletMapComponent.ngOnInit();
  }));

  it('should emit mapExtentChanged with zoom', async(() => {
    let map: Map;
    leafletMapComponent.mapReady.subscribe((m: Map) => {
      map = m;
      map.fireEvent('zoom');
    });
    leafletMapComponent.mapExtentChanged.subscribe((e: LeafletEvent) =>
      expect(e.type).toBe('zoom')
    );
    leafletMapComponent.ngOnInit();
  }));

  it('should emit mapExtentChanged with move', async(() => {
    let map: Map;
    leafletMapComponent.mapReady.subscribe((m: Map) => {
      map = m;
      map.fireEvent('move');
    });
    leafletMapComponent.mapExtentChanged.subscribe((e: LeafletEvent) =>
      expect(e.type).toBe('move')
    );
    leafletMapComponent.ngOnInit();
  }));

  it('should fly to coordinate', async(() => {
    leafletMapComponent.mapReady.subscribe((m: Map) => {
      spyOn(m, 'flyTo');
      const center = new LatLng(50, 6);
      leafletMapComponent.flyTo(center);
      expect(m.flyTo).toHaveBeenCalled();
    });
    leafletMapComponent.ngOnInit();
  }));

  it('should fly to bounds', async(() => {
    leafletMapComponent.mapReady.subscribe((m: Map) => {
      spyOn(m, 'flyToBounds');
      const latlng1 = new LatLng(50, 6);
      const latlng2 = new LatLng(47, 7);
      const bounds = new LatLngBounds(latlng1, latlng2);
      leafletMapComponent.flyToBounds(bounds);
      expect(m.flyToBounds).toHaveBeenCalled();
    });
    leafletMapComponent.ngOnInit();
  }));

  it('should add additional overlay', async(() => {
    const lc: LayersControlLayer = {
      title: 'myNewLayer',
      layer: sampleLayerGroup,
      visible: true,
    };

    leafletMapComponent.mapReady.subscribe((m: Map) => {
      leafletMapComponent.addOverlayToMap(lc);
      let layerFound = false;
      m.eachLayer((l) => {
        if (l === lc.layer) {
          layerFound = true;
        }
      });
      expect(layerFound).toBeTruthy();
    });
    leafletMapComponent.ngOnInit();
  }));

  it('should remove additional overlay', async(() => {
    const lc: LayersControlLayer = {
      title: 'myNewLayer',
      layer: sampleLayerGroup,
      visible: true,
    };

    leafletMapComponent.mapReady.subscribe((m: Map) => {
      leafletMapComponent.addOverlayToMap(lc);
      leafletMapComponent.removeLayerFromMap(lc.layer);
      let layerFound = false;
      m.eachLayer((l) => {
        if (l === lc.layer) {
          layerFound = true;
        }
      });
      expect(layerFound).toBeFalsy();
    });
    leafletMapComponent.ngOnInit();
  }));

  it('should remove all layers onDestroy', async(() => {
    leafletMapComponent.mapReady.subscribe((map: Map) => {
      let i = 0;
      map.eachLayer(() => i++);
      expect(i).toEqual(6);
      leafletMapComponent.ngOnDestroy();
      let j = 0;
      map.eachLayer(() => j++);
      expect(j).toEqual(0);
    });

    leafletMapComponent.ngOnInit();
  }));
});
