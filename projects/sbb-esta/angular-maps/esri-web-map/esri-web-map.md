WebMap is a simple component for displaying 2D maps.

_Note: The WebMap component is built to display maps from a Portal for ArcGIS installation or ArcGIS Online._

#### Portal for ArcGIS

The component works with [ArcGIS Online](https://www.arcgis.com), the [SBB Geoportal](https://geo.sbb.ch/portal) or any other on-premise installation of Portal for ArcGIS. Read more about this in [Overview and usage](/maps/introduction/overview-and-usage)

#### ArcGIS web map definition

An ArcGIS web map is part of the ArcGIS geoinformation model and describes an interactive display of geographic information. To learn more about the Esri geoinformation model and the web map definition head to [Web maps](https://enterprise.arcgis.com/en/portal/latest/use/what-is-web-map.htm) in the Portal for ArcGIS documentation.

### Basic WebMap

Let's start with a basic WebMap only displaying a simple map.

_my-map.component.html_:

```html
<sbb-esri-web-map [portalItemId]="'e691172598f04ea8881cd2a4adaa45ba'"> </sbb-esri-web-map>
```

> _Note:_ Extract the portalItem identificator from the URL to your map in Portal or ArcGIS Online.

The sample URL refers to a web map hosted on ArcGIS Online. In order to use it, you need to configure the EsriModule with the ArcGIS Online URL as mentioned in [Getting Started](/maps/introduction/getting-started).

### Events

The WebMap component comes with a few different events for you to listen for, such as mapReady, mapClick, extentChange and more.
