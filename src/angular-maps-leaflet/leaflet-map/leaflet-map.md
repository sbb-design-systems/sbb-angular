### Introduction

LeafletMap is a simple and lightweight component for displaying 2D maps based on [`leafletjs`](https://leafletjs.com/).

### Basic LeafletMap

Let's start with a basic LeafletMap only displaying a simple map.

_my-map.component.html:_

```html
<sbb-leaflet-map [layersControlConfig]="layersControlConfig"></sbb-leaflet-map>
```

_my-map.component.ts:_

```ts
...
public layerControl: LayerControl = {
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
  overLays: []
};
...
```

### Events

The Leaflet component comes with a few different events for you to listen for, such as mapReady, mapClick, extentChange and more.

### Layers

You are able to add different types of layers to your map! You can find a good starting point to see how leaflet handles layers [here](https://leafletjs.com/examples/layers-control/).
