import {
  Canvas,
  circle,
  circleMarker,
  latLng,
  layerGroup,
  MapOptions,
  polygon,
  tileLayer,
  Util
} from 'leaflet';
import { LayersControl } from './map-config.model';

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
    },
    {
      title: 'OSM2',
      visible: false,
      layer: tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    }
  ],
  overLays: [
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
