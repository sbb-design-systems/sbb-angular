### Use Case

Utilize this component when you need to depict Esri Feature Layers on a MapLibre Layer.

### Compatibility

The `maplibre-gl` version compatible with this version of `journey-maps` is `4.x.y`.

You can even use our [Journey-Maps-Client](https://angular.app.sbb.ch/journey-maps/components/angular/overview) as well.

### Reference the CSS

You should add the following two CSS files to your application:

- `@maplibre-gl/dist/maplibre-gl.css` (Required)
- `@sbb-esta/angular/typography.css` (Recommended, when using Journey-Maps-Client)

You can add them for example in the `styles` array of your `angular.json` file:

```json lines
"styles": [
  "src/styles.scss",
  "node_modules/maplibre-gl/dist/maplibre-gl.css"
  "node_modules/@sbb-esta/angular/typography.css"
],
```

### Usage

To use the Esri-Plugin, you have to inject an instance of the class `map` of MapLibre library.
Additionally, you need to provide at least one definition of a Esri feature-layer (See API-section for further details).

```html
<sbb-esri-plugin
  [map]="map"
  [featureLayers]="[
  {
    url: 'url-to-my-esri-feature-layer'
  }
]"
/>
```
