# Using ArcGIS types

The ArcGIS API for Javascript (since version 4.18) is available for installation as ES modules from npm via [@arcgis/core](https://www.npmjs.com/package/@arcgis/core).

You can find a complete documentation of ArcGIS ES modules [here](https://developers.arcgis.com/javascript/latest/es-modules/).

_Note: Angular uses rollup.js instead of Webpack to bundle libraries. Thus it's not currently possible to use [@arcgis/webpack-plugin](https://www.npmjs.com/package/@arcgis/webpack-plugin).._

## Use import statements to load individual types/modules.

```
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
```

(https://developers.arcgis.com/javascript/latest/es-modules/#get-started)
