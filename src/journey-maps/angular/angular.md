### Get an API key

A valid API key must be provided to access the map style and data.

```html
<sbb-journey-maps apiKey="<API-KEY>" language="en"></sbb-journey-maps>
```

Subscribe on the [SBB API Plattform](https://developer.sbb.ch/apis/journey-maps-tiles).

### Add the node dependencies in your Angular project

```sh
npm install @sbb-esta/journey-maps
```

```sh
npm install maplibre-gl@1.15.2
```

**NOTE**
The `maplibre-gl` version compatible with this version of `journey-maps` is `1.15`.

### Reference the MapLibre CSS

in HTML:

```html
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" />
```

Or for example in the `styles` array of your `angular.json` file:

```json lines
"styles": [
  "src/styles.scss",
  "node_modules/maplibre-gl/dist/maplibre-gl.css"
],
```

### i18n

The component requires a mandatory `language` input parameter. The component itself has no visual labels. But it's needed for `aria-label` or `alt` texts. The corresponding texts are already translated and stored in the bundle.

```html
<sbb-journey-maps language="en"></sbb-journey-maps>
```
