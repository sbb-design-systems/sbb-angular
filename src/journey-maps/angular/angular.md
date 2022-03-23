# Journey Maps for Angular

## Key features

Journey Maps for Angular displays an interactive map, with specific style for public transport.

Use Journey Maps to display any of the following public transport data:

- routes (for train, bus, tram, ship, etc.)
- customer journey
- customer transfer and indoor-transfer

## Get started

### Install and set up

#### You have to add the `@sbb-esta/journey-maps` dependency in your Angular project

via npm:

```sh
npm install @sbb-esta/journey-maps
```

or, if using yarn:

```sh
yarn add @sbb-esta/journey-maps
```

#### Reference the MapLibre CSS from CDN

in HTML:

```html
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" />
```

or in your main CSS file:

```css
@import 'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css';
```

### Get an API key

A valid `<API-KEY>` must be provided to access the map style and data.

```html
<sbb-journey-maps apiKey="<API-KEY>" language="en"></sbb-journey-maps>
```

Get a subscription and check the available plans on [SBB API Plattform](https://developer.sbb.ch/apis/journey-maps-tiles).
