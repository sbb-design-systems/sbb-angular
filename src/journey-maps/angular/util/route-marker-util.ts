import { Point } from 'geojson';

import {
  SbbSelectableFeatureCollection,
  SbbSelectableFeatureCollectionMetaInformation,
} from '../journey-maps.interfaces';
import { SbbMarker } from '../public-api';

export const getRouteMarkers = (
  routes: SbbSelectableFeatureCollection[] | undefined,
  routesOptions: SbbSelectableFeatureCollectionMetaInformation[] | undefined
): SbbMarker[] | undefined => {
  return routes
    ?.map<SbbMarker | undefined>((route) => {
      const markerConfiguration = routesOptions?.find(
        (ro) => ro.id === route.id && !!route.id
      )?.midpointMarkerConfiguration;

      const point = route.features.find((f) => f?.properties!['type'] === 'midpoint')?.geometry as
        | Point
        | undefined;

      if (!markerConfiguration || !point) {
        return;
      }

      return {
        ...markerConfiguration,
        id: `jmc-generated-route-${route.id}-midpoint-marker`,
        position: point?.coordinates,
      };
    })
    .filter((m) => !!m) as SbbMarker[];
};
