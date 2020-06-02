import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
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
  LeafletMouseEvent,
  MapOptions,
  polygon,
  popup,
  tileLayer,
  TileLayer,
  Util,
} from 'leaflet';

export let mapOptions: MapOptions = {
  zoom: 12,
  center: latLng(46.948094, 7.451563),
};

export let layersControlConfig: LayersControl = {
  baseLayers: [
    {
      title: 'Mapbox',
      visible: true,
      layer: new TileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            'pk.eyJ1IjoidG9iaWFzd3lzcyIsImEiOiJja2F4bnpzd3EwN3c2MzR1bGhoejR0ZWJoIn0.VBz7YJs-cDlR75f_FQzkSw',
        }
      ),
    },
    {
      title: 'OSM2',
      visible: false,
      layer: tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
    },
  ],
  overLays: [
    {
      title: 'Hospitals in Switzerland.',
      visible: true,
      layer: featureLayer({
        url:
          'https://services7.arcgis.com/fhCHtFls7KqrvbDz/ArcGIS/rest/services/Spit%c3%a4ler_Schweiz/FeatureServer/0',
        renderer: new Canvas(),
        useCors: true,
      }).bindPopup((l: any) => {
        return Util.template('<p>{Standort}</p>', l.feature.properties);
      }),
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
            [46.945443, 7.439611],
          ],
          {
            color: 'red',
          }
        ).bindPopup(`<b>test</p>`),
        circle([46.948212, 7.455189], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.2,
          radius: 200,
        }).bindPopup('sample'),
      ]),
    },
  ],
};

@Component({
  selector: 'sbb-leaflet-map-example',
  templateUrl: './leaflet-map-example.component.html',
  styleUrls: ['./leaflet-map-example.component.scss'],
})
export class LeafletMapExampleComponent implements AfterViewChecked {
  private _map: L.Map;
  private _myPointLayerGroup: LayerGroup<any>;

  @ViewChild('leafletMap', { static: true })
  private _leafLetMap: LeafletMapComponent;

  public options = mapOptions;
  public layersControl = layersControlConfig;

  mapReady(map: L.Map) {
    this._map = map;
  }

  goToPoint(lat: number, lng: number, zoomlvl: number) {
    this._leafLetMap.flyTo(latLng(lat, lng), zoomlvl);
  }

  goToArea(lat1: number, lng1: number, lat2: number, lng2: number) {
    const latlng1 = latLng(lat1, lng1);
    const latlng2 = latLng(lat2, lng2);
    const bounds = new LatLngBounds(latlng1, latlng2);
    this._leafLetMap.flyToBounds(bounds);
  }

  mapClicked(e: LeafletMouseEvent) {
    popup()
      .setLatLng(e.latlng)
      .setContent('You clicked the map at: ' + e.latlng.toString())
      .openOn(this._map);
  }

  addPointLayerToMap() {
    this._removeLayerFromMap(this._myPointLayerGroup);

    const myPoints = this._generatePoints();
    this._myPointLayerGroup = this._createLayerGroup(myPoints);
    this._leafLetMap.addOverlayToMap({
      title: 'sample',
      layer: this._myPointLayerGroup,
      visible: true,
    });
  }

  /**
   * The map gets it's size, when it is added to the DOM.
   * At this point it is not yet displayed, but only when the user clicks the "examples"-tab.
   * This leads to not enough tiles being loaded when the map is actually displayed, which turns out in a grey map.
   * All required tiles will not be loaded until you call `map.invalidateSize()`.
   * Because it is not possible to get notified when the user clicks the "examples"-tab,
   * we use ngAfterviewChecked to get the new mapsize and load the according tiles.
   */
  ngAfterViewChecked() {
    if (this._map) {
      setTimeout(() => this._map.invalidateSize());
    }
  }

  private _createLayerGroup(myPoints: [number, number][]): LayerGroup<any> {
    const l = new LayerGroup();
    myPoints.forEach((p) => {
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
}
