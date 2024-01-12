import { Injectable } from '@angular/core';
import { Point } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';

import {
  SbbRouteMetaInformation,
  SbbSelectableFeatureCollection,
} from '../../journey-maps.interfaces';
import { SbbMarker } from '../../model/marker';

import { SbbMapSelectionEvent, SBB_SELECTED_PROPERTY_NAME } from './events/map-selection-event';
import {
  SBB_ROUTE_ID_PROPERTY_NAME,
  SBB_ROUTE_LINE_COLOR_PROPERTY_NAME,
} from './events/route-utils';
import { SbbMapRouteService } from './map-route-service';
import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';
import { toFeatureCollection } from './util/feature-collection-util';
import { isV1Style } from './util/style-version-lookup';

const SBB_ROUTE_GEN_PREFIX = 'gen';
const SBB_ROUTE_GEN_NUM = 5;
const SBB_ROUTE_LINE_LAYER_ID = 'rokas-route';
const SBB_ROUTE_OUTER_LINE_LAYER_ID = 'rokas-route-halo-shadow';

@Injectable({ providedIn: 'root' })
export class SbbMapRoutesService {
  constructor(private _mapRouteService: SbbMapRouteService) {}

  updateRoutes(
    map: MaplibreMap,
    mapSelectionEventService: SbbMapSelectionEvent,
    routes: SbbSelectableFeatureCollection[] = [SBB_EMPTY_FEATURE_COLLECTION],
    routesMetaInformations: SbbRouteMetaInformation[] = [],
  ): void {
    routes.forEach((featureCollection, idx) => {
      const id = featureCollection.id ?? `jmc-generated-${idx + 1}`;

      const metadata = routesMetaInformations.find((rmi) => rmi.id === featureCollection.id);
      for (const feature of featureCollection.features) {
        feature.properties![SBB_ROUTE_ID_PROPERTY_NAME] = id;
        feature.properties![SBB_SELECTED_PROPERTY_NAME] = featureCollection.isSelected;

        // Set route-color if given in metadata
        const routeColor = metadata?.routeColor;
        if (routeColor) {
          feature.properties![SBB_ROUTE_LINE_COLOR_PROPERTY_NAME] = routeColor;
        }
      }
    });
    this._mapRouteService.updateRoute(
      map,
      mapSelectionEventService,
      toFeatureCollection(routes.flatMap((r) => r.features)),
    );
  }

  getRouteMarkers(
    routes: SbbSelectableFeatureCollection[] | undefined,
    routesOptions: SbbRouteMetaInformation[] | undefined,
  ): SbbMarker[] | undefined {
    return routes
      ?.map<SbbMarker | undefined>((route) => {
        const markerConfiguration = routesOptions?.find(
          (ro) => ro.id === route.id && !!route.id,
        )?.midpointMarkerConfiguration;

        const point = route.features.find((f) => f?.properties!['type'] === 'midpoint')
          ?.geometry as Point | undefined;

        if (!markerConfiguration || !point) {
          return;
        }

        return {
          ...markerConfiguration,
          id: `route-${route.id}-midpoint-marker`,
          position: point.coordinates,
        } as SbbMarker;
      })
      .filter((m) => !!m) as SbbMarker[];
  }

  /**
   * Get all route layer ids, for user interaction (click, hover).
   * @param map current map instance.
   */
  getRouteLayerIds(map: MaplibreMap): string[] {
    return isV1Style(map)
      ? this.generateRouteLayerIds(map, SBB_ROUTE_LINE_LAYER_ID)
      : this.generateRouteLayerIds(map, SBB_ROUTE_OUTER_LINE_LAYER_ID);
  }

  generateRouteLayerIds(map: MaplibreMap, layerId: string): string[] {
    const layerIds = [layerId];
    for (let i = 0; i < SBB_ROUTE_GEN_NUM; i++) {
      layerIds.push(`${layerId}-${SBB_ROUTE_GEN_PREFIX}${i}`);
    }
    return layerIds;
  }
}
