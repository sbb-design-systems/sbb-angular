import { TemplateRef } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { LngLatBoundsLike, LngLatLike, MapGeoJSONFeature } from 'maplibre-gl';

import { SbbMarker } from './model/marker';

export type SbbStyleMode = 'bright' | 'dark';

export interface SbbStyleOptions {
  /** Overwrite this value if you want to use a style from a different source. */
  url?: string;
  /** Overwrite this value if you want to use a custom style id for the aerial/satellite view. */
  aerialId?: string;
  /** Overwrite this value if you want to use a custom style id for the bright mode. */
  brightId?: string;
  /** Overwrite this value if you want to use a custom style id for the dark mode. */
  darkId?: string;
  /** Select the style mode between bright and dark. */
  mode?: SbbStyleMode;
  /** Additional rail network options as defined in <code>SbbRailNetworkOptions</code>. */
  railNetwork?: SbbRailNetworkOptions;
}

export interface SbbInteractionOptions {
  /**
   * Whether the map should allow panning with one finger or not.
   * If set to false, the users get a message-overlay if they try to pan with one finger.
   */
  oneFingerPan?: boolean;
  /** Whether the map can be zoomed by scrolling. */
  scrollZoom?: boolean;
  /** Whether the map cannot be moved. */
  disableInteractions?: boolean;
}

export interface SbbUIOptions {
  /** Whether the map should show large (default) or small control buttons. */
  showSmallButtons?: boolean;
  /** Whether the map should show the level switch control or not. */
  levelSwitch?: boolean;
  /** Whether the map should show the zoom level control or not. */
  zoomControls?: boolean;
  /** Whether the map should show the basemap switch control or not. */
  basemapSwitch?: boolean;
  /** Whether the map should show the home button control or not. Clicking this button zooms out to show all of Switzerland. */
  homeButton?: boolean;
  /** Whether the map should show the geolocation button or not. Clicking this button shows the current browser location on the map */
  geoLocation?: boolean;
}

export interface SbbViewportBounds {
  /** The minimum zoom level of the map (0-24) */
  minZoomLevel?: number;
  /** The maximum zoom level of the map (0-24) */
  maxZoomLevel?: number;
  /** Pan and zoom operations are constrained within these bounds. Leave empty for no bounds. */
  maxBounds?: LngLatBoundsLike;
}

export type SbbViewportDimensions = SbbMapCenterOptions | SbbBoundingBoxOptions;

export interface SbbMapCenterOptions {
  /** The desired center of the map. */
  mapCenter: LngLatLike;
  /** The desired zoom level of the map. */
  zoomLevel: number;
}

export interface SbbBoundingBoxOptions {
  /** The desired bounding box of the map. */
  boundingBox: LngLatBoundsLike;
  /** The amount of padding in pixels to add to the given bounding box. */
  padding?: number;
}

/**
 * **WARNING:** The map currently doesn't support more than one of these fields to be set at a time.
 */
export interface SbbJourneyMapsRoutingOptions {
  /**
   * GeoJSON as returned by the <code>/journey</code> operation of Journey-Maps.
   * All routes and transfers will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time.
   */
  journey?: FeatureCollection;

  /**
   * GeoJSON as returned by the <code>/transfer</code> operation of Journey-Maps.
   * The transfer will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time.
   */
  transfer?: FeatureCollection;

  /**
   * An array of GeoJSON objects as returned by the <code>/route</code> and <code>/routes</code> operation of Journey-Maps.
   * All routes will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time.
   */
  routes?: SbbSelectableFeatureCollection[];

  /**
   * Additional information as defined in <code>SbbJourneyMetaInformation</code>.
   * selectedLegId must match with a legId from the given journey.
   * Note: journey, transfer and routes cannot be displayed at the same time.
   */
  journeyMetaInformation?: SbbJourneyMetaInformation;

  /**
   * An array of additional information as defined in <code>SbbRouteMetaInformation</code>.
   * ID must match with ID from given routes.
   * If no meta information for a route given, it will use the default settings.
   * Note: journey, transfer and routes cannot be displayed at the same time.
   */
  routesMetaInformations?: SbbRouteMetaInformation[];
}

export interface SbbMarkerOptions {
  /** The list of markers (points) that will be displayed on the map. */
  markers?: SbbMarker[];
  /** Open a popup – instead of the teaser – when selecting a marker. */
  popup?: boolean;
  /** Wrap all markers in view if true. */
  zoomToMarkers?: boolean;
}

export interface SbbZoomLevels {
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
 * NB: We currently don't support having MARKERs and POIs be clickable on the same map.
 */
export type SbbListenerOptions = {
  /** The feature type for which you want to receive events. */
  [type in SbbFeatureDataType]?: SbbListenerTypeOptions;
};

export interface SbbListenerTypeOptions {
  /** True if you want to receive events. Otherwise false. */
  watch: boolean;
  /** If a template is defined for an event: Should it be displayed in a popup or teaser ? */
  popup?: boolean;
  /** Template to display when a feature is clicked. */
  clickTemplate?: SbbTemplateType;
  /** Template to display when a feature is hovered. */
  hoverTemplate?: SbbTemplateType;
  /** Selection mode */
  selectionMode?: SbbSelectionMode;
}

/** Selection mode options */
export type SbbSelectionMode = 'single' | 'multi';

// FIXME ses: 'hover' and 'leave' should be defined per feature
export interface SbbFeaturesHoverChangeEventData {
  /** Event screen position. */
  eventPoint: { x: number; y: number };
  /** Event map coordinates. */
  eventLngLat: { lng: number; lat: number };
  /** Whether is hovered or not. */
  hover: boolean;
  /** Whether is leaving or not. */
  leave: boolean;
  /** List of features affected by this event. */
  features: SbbFeatureData[];
}

export interface SbbFeaturesSelectEventData {
  /** List of features affected by this event. */
  features: SbbFeatureData[];
}

export interface SbbFeaturesClickEventData {
  /** Click screen position. */
  clickPoint: { x: number; y: number };
  /** Click map coordinates. */
  clickLngLat: { lng: number; lat: number };
  /** List of features affected by this event. */
  features: SbbFeatureData[];
}

export type SbbFeatureData = MapGeoJSONFeature & {
  featureDataType: SbbFeatureDataType;
};

export type SbbSelectableFeatureCollection = FeatureCollection & {
  id?: string;
  isSelected?: boolean;
};

export interface SbbRouteMetaInformation {
  /** ID that matches a route in <code>SbbJourneyMapsRoutingOptions.routes</code>. */
  id: string;
  /** Color of the route. See https://maplibre.org/maplibre-gl-js-docs/style-spec/types/ for color-format. */
  routeColor?: string;
  /** Midpoint-Marker configuration. Position must be given in midpoint-feature from Journey-Maps response. */
  midpointMarkerConfiguration?: Omit<SbbMarker, 'id' | 'position'>;
}

export interface SbbRailNetworkOptions {
  /**
   * Color of the rail network on the map.
   *
   * Set 'transparent' to hide the rail network, or use other color-format as specified in https://maplibre.org/maplibre-gl-js-docs/style-spec/types/.
   * */
  railNetworkColor?: string;
}

export interface SbbJourneyMetaInformation {
  /** ID that matches a leg ID in <code>SbbJourneyMapsRoutingOptions.journey</code>. */
  selectedLegId: string;
}

export type SbbFeatureDataType = 'MARKER' | 'ROUTE' | 'STATION' | 'ZONE' | 'POI';

export type SbbDeselectableFeatureDataType = Extract<SbbFeatureDataType, 'MARKER' | 'POI'>;

/** Angular TemplateRef or an id of an HTML <template>. */
export type SbbTemplateType = TemplateRef<any> | string;

/** points of interest options */
export interface SbbPointsOfInterestOptions {
  /** Configure a list of points of interest categories visible on the map. Set empty, to hide all POIs. */
  categories: SbbPointsOfInterestCategoryType[];
  /** Configure the environment from which to get the points of interest from ('prod' or 'int. default = 'prod'). */
  environment?: SbbPointsOfInterestEnvironmentType;
  /** Configure whether to include preview-points-of-interest or not */
  includePreview?: boolean;
}

/** points of interest category type */
export type SbbPointsOfInterestCategoryType =
  | 'aquarium'
  | 'atm'
  | 'bakery'
  | 'bar'
  | 'beauty'
  | 'beverages'
  | 'bike_parking'
  | 'bike_sharing'
  | 'bnb'
  | 'books'
  | 'boutique'
  | 'bowling'
  | 'butcher'
  | 'cafe'
  | 'camp_site'
  | 'car_repair'
  | 'car_sharing'
  | 'casino'
  | 'cinema'
  | 'clothes'
  | 'cosmetics'
  | 'dance'
  | 'department_store'
  | 'drugstore'
  | 'electronics'
  | 'events_venue'
  | 'fast_food'
  | 'flowers'
  | 'food'
  | 'fuel'
  | 'furniture'
  | 'gallery'
  | 'games'
  | 'garden'
  | 'gifts'
  | 'hairdresser'
  | 'hardware_store'
  | 'historic'
  | 'hospital'
  | 'hostel'
  | 'hotel'
  | 'household'
  | 'ice_cream'
  | 'jewelry'
  | 'kindergarten'
  | 'kiosk'
  | 'language_school'
  | 'library'
  | 'massage'
  | 'miniature_golf'
  | 'motel'
  | 'museum'
  | 'music'
  | 'music_school'
  | 'musical_instrument'
  | 'nightclub'
  | 'nursing_home'
  | 'on_demand'
  | 'optician'
  | 'outdoor'
  | 'p2p_car_sharing'
  | 'park_rail'
  | 'perfumery'
  | 'photo'
  | 'place_of_worship'
  | 'post_office'
  | 'public_bath'
  | 'restaurant'
  | 'school'
  | 'service_other'
  | 'shoes'
  | 'shopping_center'
  | 'shopping_other'
  | 'social_facility'
  | 'sport'
  | 'sports_centre'
  | 'supermarket'
  | 'tattoo'
  | 'taxi'
  | 'theatre'
  | 'theme_park'
  | 'thrift_shop'
  | 'townhall'
  | 'toy_library'
  | 'toys'
  | 'university'
  | 'variety_store'
  | 'video_games'
  | 'watches'
  | 'water_park'
  | 'zoo';

export type SbbPointsOfInterestEnvironmentType = 'prod' | 'int';
