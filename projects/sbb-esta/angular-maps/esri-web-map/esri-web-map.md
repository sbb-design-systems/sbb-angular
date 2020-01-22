The WebMap is a simple component for displaying 2D-Maps.

> _Note:_ The WebMap is built to display maps defined in the ArcGIS Portal.  
> You are abe to use any portal installation - the component works with the [SBB Portal](https://geo.sbb.ch/portal), the [ArcGIS Online Portal](https://enterprise.arcgis.com/en/portal/) or any other on-premise installation!  
> For further information about the portal check out [What is Portal for ArcGIS?](https://enterprise.arcgis.com/en/portal/latest/use/what-is-portal-for-arcgis-.htm).  
> To learn more about WebMaps checkout [WebMaps](https://enterprise.arcgis.com/en/portal/latest/use/what-is-web-map.htm).

### Basic WebMap

Let's start with a basic WebMap only displays a map.

_my-map.component.html_

```html
<sbb-esri-web-map [portalItem]="'e691172598f04ea8881cd2a4adaa45ba'"> </sbb-esri-web-map>
```

> _Note:_ You get the portal item from the url to your map.  
> The sample url refers to a WebMap hosted on the ArcGIS Online Portal, in order to use it, do not forget to configure the EsriModule with the ArcGIS Online Portal Url as mentioned in the [Getting Started](/maps/introduction/getting-started) section.

### Events

The WebMap Component comes with different events (such as mapReady, mapClick, extentChange and more) you can listen to.
