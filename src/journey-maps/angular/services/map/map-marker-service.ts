import { Injectable } from '@angular/core';
import { Feature, Geometry, Position } from 'geojson';
import {
  FilterSpecification,
  GeoJSONSource,
  LngLatLike,
  Map as MaplibreMap,
  MapGeoJSONFeature,
  PointLike,
} from 'maplibre-gl';

import { SbbFeatureData, SbbStyleMode } from '../../journey-maps.interfaces';
import { SbbMarker } from '../../model/marker';
import { SbbMarkerCategory } from '../../model/marker-category';
import { SbbMarkerCategoryMapping } from '../../model/marker-category-mapping';
import {
  SBB_CLUSTER_LAYER,
  SBB_CLUSTER_RADIUS,
  SBB_MARKER_LAYER,
  SBB_MARKER_LAYER_SELECTED,
  SBB_METADATA_MAPPINGS,
  SBB_ROKAS_MARKER_SOURCE,
} from '../constants';
import { SbbMarkerConverter } from '../marker-converter';

import { SbbMapConfig } from './map-config';
import { SbbMapService, SBB_EMPTY_FEATURE_COLLECTION } from './map-service';

@Injectable({ providedIn: 'root' })
export class SbbMapMarkerService {
  markerCategoryMappings: Map<string, SbbMarkerCategoryMapping> = new Map<
    string,
    SbbMarkerCategoryMapping
  >();
  sources: string[];
  markerLayers: string[];
  markerLayersSelected: string[];

  constructor(
    private _markerConverter: SbbMarkerConverter,
    private _mapService: SbbMapService,
    private _mapConfigService: SbbMapConfig,
  ) {}

  initStyleData(map: MaplibreMap): void {
    this.markerCategoryMappings.clear();
    this.sources = [SBB_ROKAS_MARKER_SOURCE];
    this.markerLayers = [SBB_MARKER_LAYER];
    this.markerLayersSelected = [SBB_MARKER_LAYER_SELECTED];

    const markerCategoryMappings = ((map.getStyle().metadata as any)?.[SBB_METADATA_MAPPINGS] ??
      []) as SbbMarkerCategoryMapping[];
    for (const mapping of markerCategoryMappings) {
      this.sources.push(mapping.source);
      this.markerLayers.push(mapping.layer);
      this.markerLayersSelected.push(mapping.layerSelected);
      this.markerCategoryMappings.set(mapping.category, mapping);
    }
  }

  get allMarkerAndClusterLayers(): string[] {
    return [SBB_CLUSTER_LAYER, ...this.allMarkerLayers];
  }

  get allMarkerLayers(): string[] {
    return [...this.markerLayers, ...this.markerLayersSelected];
  }

  updateMarkers(
    map: MaplibreMap,
    markers: SbbMarker[] | undefined,
    selectedMarker: SbbMarker | undefined,
    styleMode: SbbStyleMode | undefined,
  ): void {
    this._verifyMarkers(markers);
    if (!selectedMarker) {
      this.unselectFeature(map);
    }
    this.addMissingImages(map, markers!, styleMode === 'dark');

    const featuresPerSource = new Map<string, Feature[]>();
    for (const marker of markers ?? []) {
      const mapping = this.markerCategoryMappings.get(marker.category);
      const sourceId = mapping?.source ?? SBB_ROKAS_MARKER_SOURCE;
      if (!featuresPerSource.has(sourceId)) {
        featuresPerSource.set(sourceId, []);
      }
      featuresPerSource.get(sourceId)?.push(this._markerConverter.convertToFeature(marker));
    }

    for (const sourceId of this.sources) {
      const newData = { ...SBB_EMPTY_FEATURE_COLLECTION };
      newData.features = featuresPerSource.get(sourceId) ?? [];

      const source = map.getSource(sourceId) as GeoJSONSource;
      source.setData(newData);
    }
  }

  private _getPrimaryMarkerSource(map: MaplibreMap): GeoJSONSource {
    return map.getSource(SBB_ROKAS_MARKER_SOURCE) as GeoJSONSource;
  }

  onClusterClicked(map: MaplibreMap, cluster: SbbFeatureData): void {
    this._zoomToCluster(
      map,
      cluster.properties?.['cluster_id'],
      this._mapService.convertToLngLatLike(cluster.geometry),
    );
  }

  private _zoomToCluster(
    map: MaplibreMap,
    clusterId: any,
    center: LngLatLike,
    offset: PointLike = [0, 0],
  ): void {
    this._getPrimaryMarkerSource(map)
      .getClusterExpansionZoom(clusterId)
      .then((zoom) => zoom && this._easeTo(map, center, { zoom: zoom + 0.1, offset }));
  }

  onMarkerClicked(
    map: MaplibreMap,
    feature: SbbFeatureData,
    oldSelectedFeatureId: string | undefined,
  ): string | undefined {
    const selectedFeatureId = feature.properties?.['id'];

    if (!selectedFeatureId || selectedFeatureId === oldSelectedFeatureId) {
      this.unselectFeature(map);
      return undefined;
    }

    this._selectFeature(map, selectedFeatureId);
    this._flyToMarker(feature.geometry, map);
    return selectedFeatureId;
  }

  private _flyToMarker(geometry: Geometry, map: MaplibreMap) {
    if (geometry?.type === 'Point') {
      this._easeTo(map, this._mapService.convertToLngLatLike(geometry));
    }
  }

  // When a marker has been selected from outside the map.
  selectMarker(map: MaplibreMap, marker: SbbMarker): void {
    this._selectFeature(map, marker.id);
    const features = map.queryRenderedFeatures(map.project(marker.position as LngLatLike), {
      layers: this.allMarkerLayers,
      filter: ['in', 'id', marker.id],
    });

    if (features?.length) {
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
    position: Position,
  ): MapGeoJSONFeature | undefined {
    const point = map.project(position as LngLatLike);
    const range = SBB_CLUSTER_RADIUS / 2;

    const clusters = map.queryRenderedFeatures(
      [
        [point.x - range, point.y - range],
        [point.x + range, point.y + range],
      ],
      {
        layers: [SBB_CLUSTER_LAYER],
      },
    );

    return clusters?.length ? clusters[0] : undefined;
  }

  private _zoomUntilMarkerVisible(
    map: MaplibreMap,
    cluster: Feature,
    marker: SbbMarker,
    found: boolean[] = [],
  ): void {
    const clusterId = cluster.properties?.['cluster_id'];
    this._getPrimaryMarkerSource(map)
      .getClusterChildren(clusterId)
      .then((children) => {
        // Skip processing if marker has been found
        if (!found.length) {
          for (const child of children ?? []) {
            if (child.id === marker.id) {
              found.push(true);
              this._zoomToCluster(
                map,
                clusterId,
                marker.position as LngLatLike,
                this._getSelectedMarkerOffset(map),
              );
            } else if (child.properties?.['cluster'] === true) {
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
      map.setFilter(this.markerLayersSelected[i], this._createMarkerFilter(id, true));
    }
  }

  private _createMarkerFilter(id: string, include = true): FilterSpecification {
    return ['all', ['!has', 'point_count'], [include ? 'in' : '!in', 'id', id]];
  }

  // visible for testing
  addMissingImages(map: MaplibreMap, markers: SbbMarker[], isDarkMode: boolean): void {
    const images = new Map<string, string>();

    (markers ?? [])
      .filter(
        (marker) => marker['originalCategory'] ?? marker.category === SbbMarkerCategory.CUSTOM,
      )
      .forEach((marker) => {
        // The image will later be loaded by the category name.
        // Therefore, we have to overwrite the category.
        // We also need to use the same naming convention that we use in the map style.
        // see https://gitlab.geops.de/sbb/sbb-styles/-/blob/dev/partials/_ki.json#L28
        marker['originalCategory'] = marker.category;
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

  private _buildImageName(marker: SbbMarker): string {
    const simpleHash = this._simpleHash(`${marker.icon}${marker.iconSelected}`);
    return `${this._convertToImageName(marker.icon!)}_${this._convertToImageName(
      marker.iconSelected!,
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
      value.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0),
    );
  }

  private _verifyMarkers(markers: SbbMarker[] | undefined): void {
    const invalidMarker = (markers ?? [])
      .filter((marker) => marker.category === SbbMarkerCategory.CUSTOM)
      .find((marker) => !marker.icon || !marker.iconSelected);

    if (invalidMarker) {
      throw new Error(
        `Marker with id ${invalidMarker.id} and category CUSTOM is missing the required 'icon' or 'iconSelected' definition.`,
      );
    }
  }
}
