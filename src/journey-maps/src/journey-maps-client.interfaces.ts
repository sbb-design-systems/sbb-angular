import {StyleMode} from './model/style-mode.enum';
import {Marker} from './model/marker';
import {LngLatBoundsLike, LngLatLike, MapboxGeoJSONFeature} from 'maplibre-gl';
import {TemplateRef} from '@angular/core';
import {FeatureCollection} from 'geojson';

export interface StyleOptions {
  /** Overwrite this value if you want to use a style from a different source. */
  url?: string;
  /** Overwrite this value if you want to use a custom style id. */
  brightId?: string;
  /** Overwrite this value if you want to use a custom style id for the dark mode. */
  darkId?: string;
  /** Select the style mode between BRIGHT and DARK. */
  mode?: StyleMode;
}

export interface InteractionOptions {
  /** Whether the map should allow panning with one finger or not
   * If set to false, the users get a message-overlay if they try to pan with one finger.
   */
  oneFingerPan?: boolean;
  /** Whether the map can be zoomed by scrolling */
  scrollZoom?: boolean;
}

export interface UIOptions {
  /** Whether the map should show large (default) or small control buttons. */
  showSmallButtons?: boolean;
  /** Whether the map should show the zoom level control or not. */
  levelSwitch?: boolean;
  /** Whether the map should show the level switch control or not. */
  zoomControls?: boolean;
  /** Whether the map should show the basemap switch control or not. */
  basemapSwitch?: boolean;
  /** Whether the map should show the home button control or not. Clicking this button zooms out to show all of Switzerland. */
  homeButton?: boolean;
}

export interface ViewportOptions {
  /**
   * The initial center of the map. You should pass an array with two numbers.
   * The first one is the longitude and the second one the latitude.
   */
  mapCenter?: LngLatLike;
  /** The initial zoom level of the map. */
  zoomLevel?: number;
  /** The initial bounding box of the map. */
  boundingBox?: LngLatBoundsLike;
  /** The amount of padding in pixels to add to the given boundingBox. */
  boundingBoxPadding?: number;
}

/**
 * **WARNING:** The map currently doesn't support more than one of these fields to be set at a time
 */
export interface JourneyMapsRoutingOptions {
  /**
   * GeoJSON as returned by the <code>/journey</code> operation of Journey Maps.
   * All routes and transfers will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time
   */
  journey?: GeoJSON.FeatureCollection;

  /**
   * GeoJSON as returned by the <code>/transfer</code> operation of Journey Maps.
   * The transfer will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time
   */
  transfer?: GeoJSON.FeatureCollection;

  /**
   * An array of GeoJSON objects as returned by the <code>/route</code> and <code>/routes</code> operation of Journey Maps.
   * All routes will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time
   */
  routes?: SelectableFeatureCollection[];
}

export interface MarkerOptions {
  /** The list of markers (points) that will be displayed on the map. */
  markers?: Marker[];
  /** Open a popup - instead of the teaser - when selecting a marker. */
  popup?: boolean;
  /** Wrap all markers in view if true. */
  zoomToMarkers?: boolean;
}

export interface ZoomLevels {
  /** The minimal zoom level of the map. */
  minZoom: number;
  /** The maximal zoom level of the map. */
  maxZoom: number;
  /** The current zoom level of the map. */
  currentZoom: number;
}

/**
 * Define for which feature types you want to be notified of events (click, hover)
 * and define templates to display in case of such an event.
 */
export type ListenerOptions = {
  /** The feature type for which you want to receive events */
  [type in FeatureDataType]?: ListenerTypeOptions;
};

export type ListenerTypeOptions = {
  /** True if you want to receive events. Otherwise false. */
  watch: boolean;
  /** If a template is defined for an event: Should it be displayed in a popup or teaser? */
  popup?: boolean;
  /** Template to diplay when a feature is clicked */
  clickTemplate?: TemplateRef<any>;
  /** Template to display when a feature is hovered */
  hoverTemplate?: TemplateRef<any>;
  /** Selection mode */
  selectionMode?: SelectionMode;
};

/** Selection mode options */
export enum SelectionMode {
  single,
  multi
}

export interface FeaturesHoverChangeEventData {
  /** Event screen position. */
  eventPoint: { x: number, y: number };
  /** Event map coordinates. */
  eventLngLat: { lng: number, lat: number };
  /** Whether is hovered or not. */
  hover: boolean;
  /** Whether is leaving or not. */
  leave: boolean;
  /** List of features affected by this event. */
  features: FeatureData[];
}

export interface FeaturesSelectEventData {
  /** List of features affected by this event. */
  features: FeatureData[];
}

export interface FeaturesClickEventData {
  /** Click screen position. */
  clickPoint: { x: number, y: number };
  /** Click map coordinates. */
  clickLngLat: { lng: number, lat: number };
  /** List of features affected by this event. */
  features: FeatureData[];
}

export type FeatureData = MapboxGeoJSONFeature & {
  featureDataType: FeatureDataType;
};

export type SelectableFeatureCollection = FeatureCollection & {
  id?: string;
  isSelected?: boolean;
};

export enum FeatureDataType {
  MARKER = 'MARKER',
  ROUTE = 'ROUTE',
  STATION = 'STATION',
  ZONE = 'ZONE',
}
