import { Injectable } from '@angular/core';
import { Feature } from 'geojson';
import {
  GeoJSONSource,
  LngLatLike,
  Map as MaplibreMap,
  MapboxGeoJSONFeature,
  PointLike,
} from 'maplibre-gl';

import { FeatureData } from '../../journey-maps-client.interfaces';
import { Marker } from '../../model/marker';
import { MarkerCategoryMapping } from '../../model/marker-category-mapping';
import { MarkerCategory } from '../../model/marker-category.enum';
import { StyleMode } from '../../model/style-mode.enum';
import {
  CLUSTER_LAYER,
  CLUSTER_RADIUS,
  MARKER_LAYER,
  MARKER_LAYER_SELECTED,
  MARKER_SOURCE,
  METADATA_MAPPINGS,
} from '../constants';
import { MarkerConverterService } from '../marker-converter.service';

import { MapConfigService } from './map-config.service';
import { EMPTY_FEATURE_COLLECTION, MapService } from './map.service';

@Injectable({ providedIn: 'root' })
export class MapMarkerService {
  markerCategoryMappings: Map<string, MarkerCategoryMapping> = new Map<
    string,
    MarkerCategoryMapping
  >();
  sources: string[];
  markerLayers: string[];
  markerLayersSelected: string[];

  constructor(
    private _markerConverter: MarkerConverterService,
    private _mapService: MapService,
    private _mapConfigService: MapConfigService
  ) {}

  initStyleData(map: MaplibreMap): void {
    this.markerCategoryMappings.clear();
    this.sources = [MARKER_SOURCE];
    this.markerLayers = [MARKER_LAYER];
    this.markerLayersSelected = [MARKER_LAYER_SELECTED];

    const markerCategoryMappings = ((map.getStyle().metadata ?? {})[METADATA_MAPPINGS] ??
      []) as MarkerCategoryMapping[];
    for (const mapping of markerCategoryMappings) {
      this.sources.push(mapping.source);
      this.markerLayers.push(mapping.layer);
      this.markerLayersSelected.push(mapping.layerSelected);
      this.markerCategoryMappings.set(mapping.category, mapping);
    }
  }

  get allMarkerAndClusterLayers(): string[] {
    return [CLUSTER_LAYER, ...this.allMarkerLayers];
  }

  get allMarkerLayers(): string[] {
    return [...this.markerLayers, ...this.markerLayersSelected];
  }

  updateMarkers(
    map: MaplibreMap,
    markers: Marker[] | undefined,
    selectedMarker: Marker | undefined,
    styleMode: StyleMode | undefined
  ): void {
    this._verifyMarkers(markers);
    if (!selectedMarker) {
      this.unselectFeature(map);
    }
    this.addMissingImages(map, markers!, styleMode === StyleMode.DARK);

    const featuresPerSource = new Map<string, Feature[]>();
    for (const marker of markers ?? []) {
      const mapping = this.markerCategoryMappings.get(marker.category);
      const sourceId = mapping?.source ?? MARKER_SOURCE;
      if (!featuresPerSource.has(sourceId)) {
        featuresPerSource.set(sourceId, []);
      }
      featuresPerSource.get(sourceId)?.push(this._markerConverter.convertToFeature(marker));
    }

    for (const sourceId of this.sources) {
      const newData = { ...EMPTY_FEATURE_COLLECTION };
      newData.features = featuresPerSource.get(sourceId) ?? [];

      const source = map.getSource(sourceId) as GeoJSONSource;
      source.setData(newData);
    }
  }

  private _getPrimaryMarkerSource(map: MaplibreMap): GeoJSONSource {
    return map.getSource(MARKER_SOURCE) as GeoJSONSource;
  }

  onClusterClicked(map: MaplibreMap, cluster: FeatureData): void {
    this._zoomToCluster(
      map,
      cluster.properties?.cluster_id,
      this._mapService.convertToLngLatLike(cluster.geometry)
    );
  }

  private _zoomToCluster(
    map: MaplibreMap,
    clusterId: any,
    center: LngLatLike,
    offset: PointLike = [0, 0]
  ): void {
    this._getPrimaryMarkerSource(map).getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (!err) {
        this._easeTo(map, center, { zoom: zoom + 0.1, offset });
      }
    });
  }

  onMarkerClicked(
    map: MaplibreMap,
    feature: FeatureData,
    oldSelectedFeatureId: string | undefined
  ): string | undefined {
    const selectedFeatureId = feature.properties?.id;
    if (!selectedFeatureId || selectedFeatureId === oldSelectedFeatureId) {
      this.unselectFeature(map);
      return undefined;
    }

    this._selectFeature(map, selectedFeatureId);
    const geometry = feature.geometry;
    if (geometry?.type === 'Point') {
      this._easeTo(map, this._mapService.convertToLngLatLike(geometry));
    }

    return selectedFeatureId;
  }

  // When a marker has been selected from outside the map.
  selectMarker(map: MaplibreMap, marker: Marker): void {
    this._selectFeature(map, marker.id);
    const features = map.queryRenderedFeatures(map.project(marker.position as LngLatLike), {
      layers: this.allMarkerLayers,
      filter: ['in', 'id', marker.id],
    });

    if (features && features.length) {
      // Marker is already visible on map.
      // Center map to marker.
      this._easeTo(map, marker.position as LngLatLike);
    } else {
      let cluster = this._queryClusterAtPosition(map, marker.position);
      if (cluster) {
        this._zoomUntilMarkerVisible(map, cluster, marker);
      } else {
        // We have to fly to the marker position first before we can query it.
        // We add a one-time handler which gets executed after the flyTo() call.
        map.once('moveend', () => {
          cluster = this._queryClusterAtPosition(map, marker.position);
          if (cluster) {
            // Zooming won't work without the timeout.
            setTimeout(() => this._zoomUntilMarkerVisible(map, cluster!, marker), 250);
          }
        });
        this._easeTo(map, marker.position as LngLatLike);
      }
    }
  }

  private _easeTo(map: MaplibreMap, center: LngLatLike, optionsOverride: object = {}): void {
    map.easeTo({
      center,
      offset: this._getSelectedMarkerOffset(map), // can be overridden by optionsOverride
      ...optionsOverride,
    });
  }

  // put the marker 15px above 1/3 from the top of the map
  private _getSelectedMarkerOffset(map: MaplibreMap): PointLike {
    let yOffset = 0;
    if (this._mapConfigService.popup) {
      const mapHeight = map.getContainer().clientHeight;
      const mapHeightOffset = mapHeight / 6;
      const tooltipToMarker = 15;
      yOffset = -(mapHeightOffset + tooltipToMarker);
    }
    return [0, yOffset];
  }

  private _queryClusterAtPosition(
    map: MaplibreMap,
    position: GeoJSON.Position
  ): MapboxGeoJSONFeature | undefined {
    const point = map.project(position as LngLatLike);
    const range = CLUSTER_RADIUS / 2;

    const clusters = map.queryRenderedFeatures(
      [
        [point.x - range, point.y - range],
        [point.x + range, point.y + range],
      ],
      {
        layers: [CLUSTER_LAYER],
      }
    );

    return clusters?.length ? clusters[0] : undefined;
  }

  private _zoomUntilMarkerVisible(
    map: MaplibreMap,
    cluster: GeoJSON.Feature,
    marker: Marker,
    found: boolean[] = []
  ): void {
    const clusterId = cluster.properties?.cluster_id;
    this._getPrimaryMarkerSource(map).getClusterChildren(clusterId, (e1, children) => {
      // Skip processing if marker has been found
      if (!found.length) {
        for (const child of children) {
          if (child.id === marker.id) {
            found.push(true);
            this._zoomToCluster(
              map,
              clusterId,
              marker.position as LngLatLike,
              this._getSelectedMarkerOffset(map)
            );
          } else if (child.properties?.cluster === true) {
            this._zoomUntilMarkerVisible(map, child, marker, found);
          }
        }
      }
    });
  }

  unselectFeature(map: MaplibreMap): void {
    this._selectFeature(map, undefined);
  }

  private _selectFeature(map: MaplibreMap, selectedFeatureId: string | undefined): void {
    const id = selectedFeatureId ?? '';
    for (let i = 0; i < this.markerLayers.length; i++) {
      map.setFilter(this.markerLayers[i], this._createMarkerFilter(id, false));
      map.setFilter(this.markerLayersSelected[i], this._createMarkerFilter(id));
    }
  }

  private _createMarkerFilter(id: string, include = true): Array<any> {
    return ['all', ['!has', 'point_count'], [include ? 'in' : '!in', 'id', id]];
  }

  // visible for testing
  addMissingImages(map: MaplibreMap, markers: Marker[], isDarkMode: boolean): void {
    const images = new Map<string, string>();

    (markers ?? [])
      .filter((marker) => marker.originalCategory ?? marker.category === MarkerCategory.CUSTOM)
      .forEach((marker) => {
        // The image will later be loaded by the category name.
        // Therefore we have to overwrite the category.
        // We also need to use the same naming convention that we use in the map style.
        // see https://gitlab.geops.de/sbb/sbb-styles/-/blob/dev/partials/_ki.json#L28
        marker.originalCategory = marker.category;
        const imageName = this._buildImageName(marker);
        marker.category = imageName;
        if (isDarkMode) {
          images.set(`sbb-marker_dark-inactive-black_${imageName}`, marker.icon!);
          images.set(`sbb-marker_dark-active-red_${imageName}`, marker.iconSelected!);
        } else {
          images.set(`sbb-marker_bright-inactive-black_${imageName}`, marker.icon!);
          images.set(`sbb-marker_bright-active-red_${imageName}`, marker.iconSelected!);
        }
      });

    for (const [imageName, icon] of images) {
      if (!map.hasImage(imageName)) {
        this._mapService.addMissingImage(map, imageName, icon);
      }
    }
  }

  private _buildImageName(marker: Marker): string {
    const simpleHash = this._simpleHash(`${marker.icon}${marker.iconSelected}`);
    return `${this._convertToImageName(marker.icon!)}_${this._convertToImageName(
      marker.iconSelected!
    )}_${simpleHash}`;
  }

  private _convertToImageName(iconPath: string): string {
    return iconPath.substring(iconPath.lastIndexOf('/') + 1, iconPath.lastIndexOf('.'));
  }

  private _simpleHash(value: string): number {
    return Math.abs(
      // https://stackoverflow.com/a/34842797/349169
      // eslint-disable-next-line no-bitwise
      // tslint:disable-next-line:no-bitwise
      value.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    );
  }

  private _verifyMarkers(markers: Marker[] | undefined): void {
    const invalidMarker = (markers ?? [])
      .filter((marker) => marker.category === MarkerCategory.CUSTOM)
      .find((marker) => !marker.icon || !marker.iconSelected);

    if (invalidMarker) {
      throw new Error(
        `Marker with id ${invalidMarker.id} and category CUSTOM is missing the required 'icon' or 'iconSelected' definition.`
      );
    }
  }
}
