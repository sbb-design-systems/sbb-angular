import { Component, ViewChild } from '@angular/core';
import { LeafletMapComponent } from '@sbb-esta/angular-maps-leaflet/leaflet-map';
import { LayersControl } from '@sbb-esta/angular-maps-leaflet/leaflet-map/leaflet-map/model/map-config.model';
import { featureLayer } from 'esri-leaflet';
import {
  Canvas,
  circle,
  latLng,
  LatLngBounds,
  LayerGroup,
  layerGroup,
  LeafletEvent,
  LeafletMouseEvent,
  MapOptions,
  polygon,
  popup,
  tileLayer,
  Util
} from 'leaflet';

export let mapOptions: MapOptions = {
  zoom: 12,
  center: latLng(46.948094, 7.451563)
};

export let layersControlConfig: LayersControl = {
  baseLayers: [
    {
      title: 'OSM',
      visible: true,
      layer: tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    }
  ],
  overLays: [
    {
      title: 'AGOL',
      visible: true,
      layer: featureLayer({
        url:
          'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Hazards_Uptown_Charlotte/FeatureServer/0',
        renderer: new Canvas(),
        useCors: true
      }).bindPopup((l: any) => {
        return Util.template(
          '<p>Standort <strong>{NAME}</strong> in {GEMEINDE}.',
          l.feature.properties
        );
      })
    },
    {
      title: 'Shapes',
      visible: true,
      layer: layerGroup([
        polygon(
          [
            [46.94469, 7.440515],
            [46.945798, 7.441306],
            [46.94634, 7.441016],
            [46.94608, 7.439305],
            [46.945443, 7.439611]
          ],
          {
            color: 'red'
          }
        ).bindPopup(`<b>test</p>`),
        circle([46.948212, 7.455189], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.2,
          radius: 200
        }).bindPopup('sample')
      ])
    }
  ]
};

@Component({
  selector: 'sbb-leaflet-map-example',
  templateUrl: './leaflet-map-example.component.html',
  styleUrls: ['./leaflet-map-example.component.scss']
})
export class LeafletMapExampleComponent {
  private _map: L.Map;
  private _myPointLayerGroup: LayerGroup<any>;

  @ViewChild('leafletMap', { static: true })
  private _leafLetMap: LeafletMapComponent;

  public options = mapOptions;
  public lc = layersControlConfig;

  private _createLayerGroup(myPoints: [number, number][]): LayerGroup<any> {
    const l = new LayerGroup();
    myPoints.forEach(p => {
      l.addLayer(circle(p, { color: 'blue', radius: 10 }).bindPopup('Hi, I am a point.'));
    });
    return l;
  }

  private _removeLayerFromMap(l: any) {
    if (l) {
      this._leafLetMap.removeLayerFromMap(l);
    }
  }

  private _generatePoints(): [number, number][] {
    const pointArray = [];
    for (let i = 1; i < 1000; i++) {
      pointArray.push([this._randomNumber(45.8, 47.7), this._randomNumber(5.9, 10.5)]);
    }
    return pointArray;
  }

  private _randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  public mapReady(map: L.Map) {
    this._map = map;
  }

  public goToPoint(lat: number, lng: number, zoomlvl: number) {
    this._leafLetMap.flyTo(latLng(lat, lng), zoomlvl);
  }

  public goToArea(lat1: number, lng1: number, lat2: number, lng2: number) {
    const latlng1 = latLng(lat1, lng1);
    const latlng2 = latLng(lat2, lng2);
    const bounds = new LatLngBounds(latlng1, latlng2);
    this._leafLetMap.flyToBounds(bounds);
  }

  public mapClicked(e: LeafletMouseEvent) {
    popup()
      .setLatLng(e.latlng)
      .setContent('You clicked the map at: ' + e.latlng.toString())
      .openOn(this._map);
  }

  public mapExtentChanged(e: LeafletEvent) {}

  public mapZoomed(e: LeafletEvent) {}

  public addPointLayerToMap() {
    this._removeLayerFromMap(this._myPointLayerGroup);

    const myPoints = this._generatePoints();
    this._myPointLayerGroup = this._createLayerGroup(myPoints);
    this._leafLetMap.addOverlayToMap({
      title: 'sample',
      layer: this._myPointLayerGroup,
      visible: true
    });
  }
}
