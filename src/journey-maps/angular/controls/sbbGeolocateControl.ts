import {
  Evented,
  FitBoundsOptions,
  IControl,
  LngLat,
  Map as MaplibreMap,
  Marker,
} from 'maplibre-gl';

interface GeolocateOptions {
  positionOptions?: PositionOptions;
  fitBoundsOptions?: FitBoundsOptions;
  trackUserLocation?: boolean;
  showAccuracyCircle?: boolean;
  showUserLocation?: boolean;
}

const defaultOptions: GeolocateOptions = {
  positionOptions: {
    enableHighAccuracy: false,
    maximumAge: 0,
    timeout: 6000 /* 6 sec */,
  },
  fitBoundsOptions: {
    maxZoom: 15,
  },
  trackUserLocation: false,
  showAccuracyCircle: true,
  showUserLocation: true,
};

let supportsGeolocation: boolean;

function checkGeolocationSupport(callback: () => void) {
  if (supportsGeolocation !== undefined) {
    // do nothing
  } else if (window.navigator.permissions !== undefined) {
    // navigator.permissions has incomplete browser support
    // http://caniuse.com/#feat=permissions-api
    // Test for the case where a browser disables Geolocation because of an
    // insecure origin
    window.navigator.permissions.query({ name: 'geolocation' }).then((p) => {
      supportsGeolocation = p.state !== 'denied';
    });
  } else {
    supportsGeolocation = !!window.navigator.geolocation;
  }

  callback();
}

let numberOfWatches = 0;
let noTimeout = false;

/**
 * This class is a copy of the official maplibre GeolocateControl class, minus the default button
 * I opened a ticket asking to provide a simpler solution: https://github.com/maplibre/maplibre-gl-js/issues/3103
 */
export class SbbGeolocateControl extends Evented implements IControl {
  _map?: MaplibreMap;
  options: GeolocateOptions;
  _container: HTMLElement;
  _dotElement: HTMLElement;
  _circleElement: HTMLElement;
  _geolocationWatchID?: number;
  _timeoutId?: ReturnType<typeof setTimeout>;
  _watchState:
    | 'OFF'
    | 'ACTIVE_LOCK'
    | 'WAITING_ACTIVE'
    | 'ACTIVE_ERROR'
    | 'BACKGROUND'
    | 'BACKGROUND_ERROR';
  _lastKnownPosition: any;
  _userLocationDotMarker: Marker;
  _accuracyCircleMarker: Marker;
  _accuracy: number;
  _setup: boolean; // set to true once the control has been setup

  constructor(options?: GeolocateOptions) {
    super();
    this.options = extend({}, defaultOptions, options);

    bindAll(
      [
        '_onSuccess',
        '_onError',
        '_onZoom',
        '_finish',
        '_setupUI',
        '_updateCamera',
        '_updateMarker',
      ],
      this,
    );
  }

  onAdd(map: MaplibreMap): HTMLElement {
    this._map = map;
    this._container = document.createElement('div');
    checkGeolocationSupport(this._setupUI);
    return this._container;
  }
  onRemove(map: MaplibreMap) {
    // clear the geolocation watch if exists
    if (this._geolocationWatchID !== undefined) {
      window.navigator.geolocation.clearWatch(this._geolocationWatchID);
      this._geolocationWatchID = undefined;
    }

    // clear the markers from the map
    if (this.options.showUserLocation && this._userLocationDotMarker) {
      this._userLocationDotMarker.remove();
    }
    if (this.options.showAccuracyCircle && this._accuracyCircleMarker) {
      this._accuracyCircleMarker.remove();
    }

    this._map!.off('zoom', this._onZoom);
    this._map = undefined;
    numberOfWatches = 0;
    noTimeout = false;
  }

  /**
   * Check if the Geolocation API Position is outside the map's maxbounds.
   *
   * @param {GeolocationPosition} position the Geolocation API Position
   * @returns {boolean} Returns `true` if position is outside the map's maxbounds, otherwise returns `false`.
   * @private
   */
  _isOutOfMapMaxBounds(position: GeolocationPosition) {
    const bounds = this._map!.getMaxBounds();
    const coordinates = position.coords;

    return (
      bounds &&
      (coordinates.longitude < bounds.getWest() ||
        coordinates.longitude > bounds.getEast() ||
        coordinates.latitude < bounds.getSouth() ||
        coordinates.latitude > bounds.getNorth())
    );
  }

  _setErrorState() {
    switch (this._watchState) {
      case 'WAITING_ACTIVE':
        this._watchState = 'ACTIVE_ERROR';
        break;
      case 'ACTIVE_LOCK':
        this._watchState = 'ACTIVE_ERROR';
        // turn marker grey
        break;
      case 'BACKGROUND':
        this._watchState = 'BACKGROUND_ERROR';
        // turn marker grey
        break;
      case 'ACTIVE_ERROR':
        break;
      default:
      // assert(false, `Unexpected watchState ${this._watchState}`);
    }
  }

  /**
   * When the Geolocation API returns a new location, update the GeolocateControl.
   *
   * @param {GeolocationPosition} position the Geolocation API Position
   * @private
   */
  _onSuccess(position: GeolocationPosition) {
    if (!this._map) {
      // control has since been removed
      return;
    }

    if (this._isOutOfMapMaxBounds(position)) {
      this._setErrorState();

      this.fire(new CustomEvent('outofmaxbounds', { detail: position }));
      this._updateMarker();
      this._finish();

      return;
    }

    if (this.options.trackUserLocation) {
      // keep a record of the position so that if the state is BACKGROUND and the user
      // clicks the button, we can move to ACTIVE_LOCK immediately without waiting for
      // watchPosition to trigger _onSuccess
      this._lastKnownPosition = position;

      switch (this._watchState) {
        case 'WAITING_ACTIVE':
        case 'ACTIVE_LOCK':
        case 'ACTIVE_ERROR':
          this._watchState = 'ACTIVE_LOCK';
          break;
        case 'BACKGROUND':
        case 'BACKGROUND_ERROR':
          this._watchState = 'BACKGROUND';
          break;
        default:
        // assert(false, `Unexpected watchState ${this._watchState}`);
      }
    }

    // if showUserLocation and the watch state isn't off then update the marker location
    if (this.options.showUserLocation && this._watchState !== 'OFF') {
      this._updateMarker(position);
    }

    // if in normal mode (not watch mode), or if in watch mode and the state is active watch
    // then update the camera
    if (!this.options.trackUserLocation || this._watchState === 'ACTIVE_LOCK') {
      this._updateCamera(position);
    }

    if (this.options.showUserLocation) {
      this._dotElement.classList.remove(
        'maplibregl-user-location-dot-stale',
        'mapboxgl-user-location-dot-stale',
      );
    }

    this.fire(new CustomEvent('geolocate', { detail: position }));
    this._finish();
  }

  /**
   * Update the camera location to center on the current position
   *
   * @param {GeolocationPosition} position the Geolocation API Position
   * @private
   */
  _updateCamera(position: GeolocationPosition) {
    const center = new LngLat(position.coords.longitude, position.coords.latitude);
    const radius = position.coords.accuracy;
    const bearing = this._map!.getBearing();
    const options = extend({ bearing }, this.options.fitBoundsOptions);

    this._map!.fitBounds(center.toBounds(radius), options, {
      geolocateSource: true, // tag this camera change so it won't cause the control to change to background state
    });
  }

  /**
   * Update the user location dot Marker to the current position
   *
   * @param {GeolocationPosition} [position] the Geolocation API Position
   * @private
   */
  _updateMarker(position?: GeolocationPosition | null) {
    if (position) {
      const center = new LngLat(position.coords.longitude, position.coords.latitude);
      this._accuracyCircleMarker.setLngLat(center).addTo(this._map!);
      this._userLocationDotMarker.setLngLat(center).addTo(this._map!);
      this._accuracy = position.coords.accuracy;
      if (this.options.showUserLocation && this.options.showAccuracyCircle) {
        this._updateCircleRadius();
      }
    } else {
      this._userLocationDotMarker.remove();
      this._accuracyCircleMarker.remove();
    }
  }

  _updateCircleRadius() {
    // assert(this._circleElement);
    const y = this._map!._container.clientHeight / 2;
    const a = this._map!.unproject([0, y]);
    const b = this._map!.unproject([1, y]);
    const metersPerPixel = a.distanceTo(b);
    const circleDiameter = Math.ceil((2.0 * this._accuracy) / metersPerPixel);
    this._circleElement.style.width = `${circleDiameter}px`;
    this._circleElement.style.height = `${circleDiameter}px`;
  }

  _onZoom() {
    if (this.options.showUserLocation && this.options.showAccuracyCircle) {
      this._updateCircleRadius();
    }
  }

  _onError(error: GeolocationPositionError) {
    if (!this._map) {
      // control has since been removed
      return;
    }

    if (this.options.trackUserLocation) {
      if (error.code === 1) {
        // PERMISSION_DENIED
        this._watchState = 'OFF';

        if (this._geolocationWatchID !== undefined) {
          this._clearWatch();
        }
      } else if (error.code === 3 && noTimeout) {
        // this represents a forced error state
        // this was triggered to force immediate geolocation when a watch is already present
        // see https://github.com/mapbox/mapbox-gl-js/issues/8214
        // and https://w3c.github.io/geolocation-api/#example-5-forcing-the-user-agent-to-return-a-fresh-cached-position
        return;
      } else {
        this._setErrorState();
      }
    }

    if (this._watchState !== 'OFF' && this.options.showUserLocation) {
      this._dotElement.classList.add(
        'maplibregl-user-location-dot-stale',
        'mapboxgl-user-location-dot-stale',
      );
    }

    this.fire(new CustomEvent('error', { detail: error }));

    this._finish();
  }

  _finish() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
    this._timeoutId = undefined;
  }

  _setupUI() {
    this._container.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());

    if (this.options.trackUserLocation) {
      this._watchState = 'OFF';
    }

    // when showUserLocation is enabled, keep the Geolocate button disabled until the device location marker is setup on the map
    if (this.options.showUserLocation) {
      this._dotElement = document.createElement('div');
      this._dotElement.classList.add('maplibregl-user-location-dot', 'mapboxgl-user-location-dot');

      this._userLocationDotMarker = new Marker(this._dotElement);

      this._circleElement = document.createElement('div');
      this._circleElement.classList.add(
        'maplibregl-user-location-accuracy-circle',
        'mapboxgl-user-location-accuracy-circle',
      );
      this._accuracyCircleMarker = new Marker({
        element: this._circleElement,
        pitchAlignment: 'map',
      });

      if (this.options.trackUserLocation) {
        this._watchState = 'OFF';
      }

      this._map!.on('zoom', this._onZoom);
    }

    this._setup = true;

    // when the camera is changed (and it's not as a result of the Geolocation Control) change
    // the watch mode to background watch, so that the marker is updated but not the camera.
    if (this.options.trackUserLocation) {
      this._map!.on('movestart', (event: any) => {
        const fromResize = event.originalEvent && event.originalEvent.type === 'resize';
        if (!event.geolocateSource && this._watchState === 'ACTIVE_LOCK' && !fromResize) {
          this._watchState = 'BACKGROUND';

          this.fire(new Event('trackuserlocationend'));
        }
      });
    }
  }

  /**
   * Programmatically request and move the map to the user's location.
   *
   * @returns {boolean} Returns `false` if called before control was added to a map, otherwise returns `true`.
   * @example
   * // Initialize the geolocate control.
   * var geolocate = new maplibregl.GeolocateControl({
   *  positionOptions: {
   *    enableHighAccuracy: true
   *  },
   *  trackUserLocation: true
   * });
   * // Add the control to the map.
   * map.addControl(geolocate);
   * map.on('load', function() {
   *   geolocate.trigger();
   * });
   */
  trigger() {
    if (!this._setup) {
      // warnOnce('Geolocate control triggered before added to a map');
      return false;
    }
    if (this.options.trackUserLocation) {
      // update watchState and do any outgoing state cleanup
      switch (this._watchState) {
        case 'OFF':
          // turn on the Geolocate Control
          this._watchState = 'WAITING_ACTIVE';

          this.fire(new Event('trackuserlocationstart'));
          break;
        case 'WAITING_ACTIVE':
        case 'ACTIVE_LOCK':
        case 'ACTIVE_ERROR':
        case 'BACKGROUND_ERROR':
          // turn off the Geolocate Control
          numberOfWatches--;
          noTimeout = false;
          this._watchState = 'OFF';

          this.fire(new Event('trackuserlocationend'));
          break;
        case 'BACKGROUND':
          this._watchState = 'ACTIVE_LOCK';
          // set camera to last known location
          if (this._lastKnownPosition) {
            this._updateCamera(this._lastKnownPosition);
          }

          this.fire(new Event('trackuserlocationstart'));
          break;
        default:
        // assert(false, `Unexpected watchState ${this._watchState}`);
      }

      // manage geolocation.watchPosition / geolocation.clearWatch
      if (this._watchState === 'OFF' && this._geolocationWatchID !== undefined) {
        // clear watchPosition as we've changed to an OFF state
        this._clearWatch();
      } else if (this._geolocationWatchID === undefined) {
        // enable watchPosition since watchState is not OFF and there is no watchPosition already running

        numberOfWatches++;
        let positionOptions;
        if (numberOfWatches > 1) {
          positionOptions = { maximumAge: 600000, timeout: 0 };
          noTimeout = true;
        } else {
          positionOptions = this.options.positionOptions;
          noTimeout = false;
        }

        this._geolocationWatchID = window.navigator.geolocation.watchPosition(
          this._onSuccess,
          this._onError,
          positionOptions,
        );
      }
    } else {
      window.navigator.geolocation.getCurrentPosition(
        this._onSuccess,
        this._onError,
        this.options.positionOptions,
      );

      // This timeout ensures that we still call finish() even if
      // the user declines to share their location in Firefox
      this._timeoutId = setTimeout(this._finish, 10000 /* 10sec */);
    }

    return true;
  }

  _clearWatch() {
    window.navigator.geolocation.clearWatch(this._geolocationWatchID!);

    this._geolocationWatchID = undefined;

    if (this.options.showUserLocation) {
      this._updateMarker(null);
    }
  }
}

/**
 * Given a destination object and optionally many source objects,
 * copy all properties from the source objects into the destination.
 * The last source object given overrides properties from previous
 * source objects.
 *
 * @param dest destination object
 * @param sources sources from which properties are pulled
 * @private
 */
export function extend(dest: any, ...sources: Array<any>): any {
  for (const src of sources) {
    // tslint:disable-next-line:forin
    for (const k in src) {
      dest[k] = src[k];
    }
  }
  return dest;
}

/**
 * Given an array of member function names as strings, replace all of them
 * with bound versions that will always refer to `context` as `this`. This
 * is useful for classes where otherwise event bindings would reassign
 * `this` to the evented object or some other value: this lets you ensure
 * the `this` value always.
 *
 * @param fns list of member function names
 * @param context the context value
 * @example
 * function MyClass() {
 *   bindAll(['ontimer'], this);
 *   this.name = 'Tom';
 * }
 * MyClass.prototype.ontimer = function() {
 *   alert(this.name);
 * };
 * var myClass = new MyClass();
 * setTimeout(myClass.ontimer, 100);
 * @private
 */
function bindAll(fns: Array<string>, context: any): void {
  fns.forEach((fn) => {
    if (!context[fn]) {
      return;
    }
    context[fn] = context[fn].bind(context);
  });
}
