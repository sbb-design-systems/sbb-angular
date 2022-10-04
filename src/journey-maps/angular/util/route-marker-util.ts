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
      const markerCategory = routesOptions?.find(
        (ro) => ro.id === route.id && !!route.id
      )?.markerCategory;

      const point = route.features.find((f) => f?.properties!['type'] === 'midpoint')?.geometry as
        | Point
        | undefined;

      console.log(route, routesOptions);

      if (!markerCategory || !point) {
        return;
      }

      return {
        id: `jmc-generated-route-${route.id}-midpoint-marker`,
        category: markerCategory,
        color: 'RED',
        position: point?.coordinates,
        title: `jmc-generated-route-${route.id}-midpoint-marker`,
      } as SbbMarker;
    })
    .filter((m) => !!m) as SbbMarker[];
};
