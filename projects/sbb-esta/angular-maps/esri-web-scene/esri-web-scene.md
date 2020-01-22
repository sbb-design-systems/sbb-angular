The WebScene is a simple component for displaying 3D-Maps.

> _Note:_ The WebScene is built to display maps defined in the ArcGIS Portal.  
> You are abe to use any portal installation - the component works with the [SBB Portal](https://geo.sbb.ch/portal), the [ArcGIS Online Portal](https://enterprise.arcgis.com/en/portal/) or any other on-premise installation!  
> For further information about the portal check out [What is Portal for ArcGIS?](https://enterprise.arcgis.com/en/portal/latest/use/what-is-portal-for-arcgis-.htm).  
> To learn more about WebScenes checkout [WebScenes](https://enterprise.arcgis.com/en/portal/latest/use/what-is-web-map.htm).

### Basic WebScenes

Let's start with a basic WebScenes only displays a map.

_my-map.component.html_

```html
<sbb-esri-web-scene [portalItem]="'affa021c51944b5694132b2d61fe1057'"> </sbb-esri-web-scene>
```

> _Note:_ You get the portal item from the url to your map.  
> The sample url refers to a WebScenes hosted on the ArcGIS Online Portal, in order to use it, do not forget to configure the EsriModule with the ArcGIS Online Portal Url as mentioned in the [Getting Started](/maps/introduction/getting-started) section.

### Events

The WebScene Component comes with different events (such as mapReady, mapClick, extentChange and more) you can listen to.
