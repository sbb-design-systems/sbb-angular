WebScene is a simple component for displaying 3D scenes (or 3Dd maps).

_Note: The WebScene component is built to display 3D scenes from a Portal for ArcGIS installation or ArcGIS Online._

#### Portal for ArcGIS

The component works with [ArcGIS Online](https://www.arcgis.com), the [SBB Geoportal](https://geo.sbb.ch/portal) or any other on-premise installation of Portal for ArcGIS. Read more about this in [Overview and usage](/maps/introduction/overview-and-usage)

#### ArcGIS web scene definition

An ArcGIS web scene is part of the ArcGIS geoinformation model and describes an interactive display of geographic information. To learn more about the Esri geoinformation model and the web scene definition head to [Web scenes](https://enterprise.arcgis.com/en/portal/latest/use/what-is-web-scene.htm) in the Portal for ArcGIS documentation.

### Basic WebScene

Let's start with a basic WebScene only displaying a simple 3d scene.

_my-scene.component.html_:

```html
<sbb-esri-web-scene [portalItemId]="'affa021c51944b5694132b2d61fe1057'"> </sbb-esri-web-scene>
```

> _Note:_ Extract the portalItem identificator from the URL to your scene in Portal or ArcGIS Online.

The sample URL refers to a web scene hosted on ArcGIS Online. In order to use it, you need to configure the EsriModule with the ArcGIS Online URL as mentioned in [Getting Started](/maps/introduction/getting-started).

### Events

The WebScene component comes with a few different events for you to listen for, such as mapReady, mapClick, extentChange and more.
