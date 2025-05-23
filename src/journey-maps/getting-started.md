# Journey Maps

This package contains a map component based on Angular and the [MapLibre](https://maplibre.org/maplibre-gl-js-docs/api/)
framework.

This package is published as an [Angular Library](/journey-maps/components/angular/overview).

The web component bundle is published as another package [@sbb-esta/journey-maps-wc](/journey-maps-wc/documentation/getting-started).

## Example Code

You can inspect the source code from our [example application](/journey-maps/components/angular/examples):

- by clicking on the "<>" Button on the top right of the map to view code,
- or by clicking on the "□^" Button to edit in StackBlitz.

<img src="assets/source-code-button-hint.png" alt="drawing" style="width:95%;max-width: 800px"/>

## About the map

### MapLibre

MapLibre is a open source fork of the famous [Mapbox](https://www.mapbox.com) framework. It has been created
when Mapbox changed its licencing model. MapLibre supports - in contrast to [Leaflet](https://leafletjs.com/) for example - maps based on vector tiles. (These tiles are hosted on an inhouse server.)

This means that the frontend does not receive pre-rendered images. It receives "raw" vector data and is responsible for the rendering of the map. This includes

- drawing the polygones
- placement of lines, text, icons etc.
- clean transitions when zooming and panning the map

Vector tiles have a lot of advantages compared to raster tiles:

- They require less disk space and bandwidth.
- They can be calculated faster on the server.
- They are easily customizable - via a style file.
- The map image looks better in general.

### Styling the map

The map style is based on Trafimage. We created a default style that can be used without any modifications neccessery. If you need a custom map style get in touch with us.

## Functionality

It's an interactive map that can be used to display points of interest or public transport data. E.g.

- routes (train, bus, tram, ship, etc.)
- a customer journey
- (Footpath) transfers between stations (including indoor-routing)

This map component is tightly coupled to the [Journey Maps API](https://developer.sbb.ch/apis/journey-maps/information).
It's output can directly be used as input to this component.
