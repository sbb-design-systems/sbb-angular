import {Position} from 'geojson';
import {MarkerCategory} from './marker-category.enum';
import {MarkerPriority} from './marker-priority.enum';
import {MarkerColor} from './marker-color.enum';

/**
 * Defines a marker (point) that will be displayed on the map.
 */
export interface Marker {

  /** ID identifying the marker */
  id: string;

  /**
   * The position of the marker. It's an array containing two numbers.
   * The first one is the longitude and the second one the latitude.
   */
  position: Position;

  /**
   * The category of the marker. The category controls which icon is displayed.
   * Use <code>CUSTOM</code> if you want to use a custom icon.
   */
  category: MarkerCategory | string;

  /**
   * The color of the marker. Default is BLACK.
   * Not all combinations are possible between category and color.
   * Selected color is always RED.
   */
  color?: MarkerColor | string;

  /**
   * The priority of the marker. It can be used to customize the styling of clustered markers.
   */
  priority?: MarkerPriority | number;

  /**
   * URL of the custom marker icon. Only relevant for category <code>CUSTOM</code>.
   */

  icon?: string;
  /**
   * URL of the custom marker icon that is displayed when the marker is selected.
   * Only relevant for category <code>CUSTOM</code>.
   */

  iconSelected?: string;

  /** Title/Name of the marker. */
  title: string;

  /** Subtitle of the marker. */
  subtitle?: string;

  /**
   * Url that will be opened if the marker is selected instead of the overlay.
   */
  markerUrl?: string;

  /**
   * If true or undefined the module will emit an event in output parameter selectedMarkerId:string when this marker is selected.
   * Default value is true.
   */
  triggerEvent?: boolean;

  /**
   * Markers with a lower order are drawn and placed first on the map.
   * Markers with a higher order will overlap over markers with a lower order.
   * (This has no effect when the corresponding markers are clustered.)
   */
  order?: number;

  /**
   * "Everything else" we don't want to add explicitly to the interface.
   */
  [additionalProperties: string]: any;
}
