### Get an API key

A valid API key must be provided to access the map style and data.

```html
<sbb-journey-maps apiKey="<API-KEY>" language="en"></sbb-journey-maps>
```

Subscribe on the [SBB API Plattform](https://developer.sbb.ch/apis/journey-maps-tiles).

### Add the node dependencies in your Angular project

```sh
npm install --save @sbb-esta/journey-maps
```

```sh
npm install --save maplibre-gl
npm install --save-dev @types/geojson
```

**NOTE** \
The `maplibre-gl` version compatible with this version of `journey-maps` is `4.x.y`.

### Reference the CSS

You should add the following two CSS files to your application:

- `@maplibre-gl/dist/maplibre-gl.css` (Required)
- `@sbb-esta/angular/typography.css` (Recommended)

You can add them for example in the `styles` array of your `angular.json` file:

```json lines
"styles": [
  "src/styles.scss",
  "node_modules/maplibre-gl/dist/maplibre-gl.css"
  "node_modules/@sbb-esta/angular/typography.css"
],
```

### i18n

The component requires a mandatory `language` input parameter. The component itself has no visual labels. But it's needed for `aria-label` or `alt` texts. The corresponding texts are already translated and stored in the bundle.

```html
<sbb-journey-maps language="en"></sbb-journey-maps>
```
