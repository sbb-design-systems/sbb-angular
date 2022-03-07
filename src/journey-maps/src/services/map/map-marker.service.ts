import {Injectable} from '@angular/core';
import {GeoJSONSource, LngLatLike, Map as MaplibreMap, MapboxGeoJSONFeature, PointLike} from 'maplibre-gl';
import {Constants} from '../constants';
import {Marker} from '../../model/marker';
import {MarkerConverterService} from '../marker-converter.service';
import {MarkerCategory} from '../../model/marker-category.enum';
import {EMPTY_FEATURE_COLLECTION, MapService} from './map.service';
import {MapConfigService} from './map-config.service';
import {Feature} from 'geojson';
import {MarkerCategoryMapping} from '../../model/marker-category-mapping';
import {StyleMode} from '../../model/style-mode.enum';
import {FeatureData} from '../../journey-maps-client.interfaces';

@Injectable({providedIn: 'root'})
export class MapMarkerService {

  markerCategoryMappings = new Map<string, MarkerCategoryMapping>();
  sources: string[];
  markerLayers: string[];
  markerLayersSelected: string[];

  constructor(private markerConverter: MarkerConverterService,
              private mapService: MapService,
              private mapConfigService: MapConfigService) {
  }

  initStyleData(map: MaplibreMap): void {
    this.markerCategoryMappings.clear();
    this.sources = [Constants.MARKER_SOURCE];
    this.markerLayers = [Constants.MARKER_LAYER];
    this.markerLayersSelected = [Constants.MARKER_LAYER_SELECTED];

    const markerCategoryMappings = ((map.getStyle().metadata ?? {})[Constants.METADATA_MAPPINGS] ?? []) as MarkerCategoryMapping[];
    for (const mapping of markerCategoryMappings) {
      this.sources.push(mapping.source);
      this.markerLayers.push(mapping.layer);
      this.markerLayersSelected.push(mapping.layerSelected);
      this.markerCategoryMappings.set(mapping.category, mapping);
    }
  }

  get allMarkerAndClusterLayers(): string[] {
    return [Constants.CLUSTER_LAYER, ...this.allMarkerLayers];
  }

  get allMarkerLayers(): string[] {
    return [...this.markerLayers, ...this.markerLayersSelected];
  }

  updateMarkers(map: MaplibreMap, markers: Marker[], selectedMarker: Marker, styleMode: StyleMode): void {
    this.verifyMarkers(markers);
    if (!selectedMarker) {
      this.unselectFeature(map);
    }
    this.addMissingImages(map, markers, styleMode === StyleMode.DARK);

    const featuresPerSource = new Map<string, Feature[]>();
    for (const marker of markers ?? []) {
      const mapping = this.markerCategoryMappings.get(marker.category);
      const sourceId = mapping?.source ?? Constants.MARKER_SOURCE;
      if (!featuresPerSource.has(sourceId)) {
        featuresPerSource.set(sourceId, []);
      }
      featuresPerSource.get(sourceId).push(this.markerConverter.convertToFeature(marker));
    }

    for (const sourceId of this.sources) {
      const newData = {...EMPTY_FEATURE_COLLECTION};
      newData.features = featuresPerSource.get(sourceId) ?? [];

      const source = map.getSource(sourceId) as GeoJSONSource;
      source.setData(newData);
    }
  }

  private getPrimaryMarkerSource(map: MaplibreMap): GeoJSONSource {
    return map.getSource(Constants.MARKER_SOURCE) as GeoJSONSource;
  }

  onClusterClicked(map: MaplibreMap, cluster: FeatureData): void {
    this.zoomToCluster(map, cluster.properties.cluster_id, this.mapService.convertToLngLatLike(cluster.geometry));
  }

  private zoomToCluster(map: MaplibreMap, clusterId: any, center: LngLatLike, offset: PointLike = [0, 0]): void {
    this.getPrimaryMarkerSource(map).getClusterExpansionZoom(
      clusterId,
      (err, zoom) => {
        if (!err) {
          this.easeTo(map, center, {zoom: zoom + 0.1, offset});
        }
      }
    );
  }

  onMarkerClicked(map: MaplibreMap, feature: FeatureData, oldSelectedFeatureId: string): string {
    const selectedFeatureId = feature.properties?.id;
    if (!selectedFeatureId || selectedFeatureId === oldSelectedFeatureId) {
      this.unselectFeature(map);
      return undefined;
    }

    this.selectFeature(map, selectedFeatureId);
    const geometry = feature.geometry;
    if (geometry?.type === 'Point') {
      this.easeTo(map, this.mapService.convertToLngLatLike(geometry));
    }

    return selectedFeatureId;
  }

  // When a marker has been selected from outside the map.
  selectMarker(map: MaplibreMap, marker: Marker): void {
    this.selectFeature(map, marker.id);
    const features = map.queryRenderedFeatures(
      map.project(marker.position as LngLatLike),
      {
        layers: this.allMarkerLayers,
        filter: ['in', 'id', marker.id]
      }
    );

    if (features && features.length) {
      // Marker is already visible on map.
      // Center map to marker.
      this.easeTo(map, marker.position as LngLatLike);
    } else {
      let cluster = this.queryClusterAtPosition(map, marker.position);
      if (cluster) {
        this.zoomUntilMarkerVisible(map, cluster, marker);
      } else {
        // We have to fly to the marker position first before we can query it.
        // We add a one-time handler which gets executed after the flyTo() call.
        map.once('moveend', () => {
            cluster = this.queryClusterAtPosition(map, marker.position);
            if (cluster) {
              // Zooming won't work without the timeout.
              setTimeout(() => this.zoomUntilMarkerVisible(map, cluster, marker), 250);
            }
          }
        );
        this.easeTo(map, marker.position as LngLatLike);
      }
    }
  }

  private easeTo(map: MaplibreMap, center: LngLatLike, optionsOverride: object = {}): void {
    map.easeTo({
      center,
      offset: this.getSelectedMarkerOffset(map), // can be overridden by optionsOverride
      ...optionsOverride,
    });
  }

  // put the marker 15px above 1/3 from the top of the map
  private getSelectedMarkerOffset(map: MaplibreMap): PointLike {
    let yOffset = 0;
    if (this.mapConfigService.popup) {
      const mapHeight = map.getContainer().clientHeight;
      const mapHeightOffset = mapHeight / 6;
      const tooltipToMarker = 15;
      yOffset = -(mapHeightOffset + tooltipToMarker);
    }
    return [0, yOffset];
  }

  private queryClusterAtPosition(map: MaplibreMap, position: GeoJSON.Position): MapboxGeoJSONFeature {
    const point = map.project(position as LngLatLike);
    const range = Constants.CLUSTER_RADIUS / 2;

    const clusters = map.queryRenderedFeatures([
        [point.x - range, point.y - range],
        [point.x + range, point.y + range]
      ],
      {
        layers: [Constants.CLUSTER_LAYER]
      }
    );

    return clusters?.length ? clusters[0] : undefined;
  }

  private zoomUntilMarkerVisible(map: MaplibreMap, cluster: GeoJSON.Feature, marker: Marker, found: boolean[] = []): void {
    const clusterId = cluster.properties.cluster_id;
    this.getPrimaryMarkerSource(map).getClusterChildren(
      clusterId,
      (e1, children) => {
        // Skip processing if marker has been found
        if (!found.length) {
          for (const child of children) {
            if (child.id === marker.id) {
              found.push(true);
              this.zoomToCluster(map, clusterId, marker.position as LngLatLike, this.getSelectedMarkerOffset(map));
            } else if (child.properties.cluster === true) {
              this.zoomUntilMarkerVisible(map, child, marker, found);
            }
          }
        }
      }
    );
  }

  unselectFeature(map: MaplibreMap): void {
    this.selectFeature(map, undefined);
  }

  private selectFeature(map: MaplibreMap, selectedFeatureId: string): void {
    const id = selectedFeatureId ?? '';
    for (let i = 0; i < this.markerLayers.length; i++) {
      map.setFilter(this.markerLayers[i], this.createMarkerFilter(id, false));
      map.setFilter(this.markerLayersSelected[i], this.createMarkerFilter(id));
    }
  }

  private createMarkerFilter(id: string, include = true): Array<any> {
    return ['all', ['!has', 'point_count'], [include ? 'in' : '!in', 'id', id]];
  }

  // visible for testing
  addMissingImages(map: MaplibreMap, markers: Marker[], isDarkMode: boolean): void {
    const images = new Map<string, string>();

    (markers ?? [])
      .filter(marker => marker.originalCategory ?? marker.category === MarkerCategory.CUSTOM)
      .forEach(marker => {
        // The image will later be loaded by the category name.
        // Therefore we have to overwrite the category.
        // We also need to use the same naming convention that we use in the map style.
        // see https://gitlab.geops.de/sbb/sbb-styles/-/blob/dev/partials/_ki.json#L28
        marker.originalCategory = marker.category;
        const imageName = this.buildImageName(marker);
        marker.category = imageName;
        if (isDarkMode) {
          images.set(`sbb-marker_dark-inactive-black_${imageName}`, marker.icon);
          images.set(`sbb-marker_dark-active-red_${imageName}`, marker.iconSelected);
        } else {
          images.set(`sbb-marker_bright-inactive-black_${imageName}`, marker.icon);
          images.set(`sbb-marker_bright-active-red_${imageName}`, marker.iconSelected);
        }
      });

    for (const [imageName, icon] of images) {
      if (!map.hasImage(imageName)) {
        this.mapService.addMissingImage(map, imageName, icon);
      }
    }
  }

  private buildImageName(marker: Marker): string {
    const simpleHash = this.simpleHash(`${marker.icon}${marker.iconSelected}`);
    return `${this.convertToImageName(marker.icon)}_${this.convertToImageName(marker.iconSelected)}_${simpleHash}`;
  }

  private convertToImageName(iconPath: string): string {
    return iconPath.substring(iconPath.lastIndexOf('/') + 1, iconPath.lastIndexOf('.'));
  }

  private simpleHash(value: string): number {
    return Math.abs(
      // https://stackoverflow.com/a/34842797/349169
      // eslint-disable-next-line no-bitwise
      value.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)
    );
  }

  private verifyMarkers(markers: Marker[]): void {
    const invalidMarker = (markers ?? [])
      .filter(marker => marker.category === MarkerCategory.CUSTOM)
      .find(marker => !marker.icon || !marker.iconSelected);

    if (invalidMarker) {
      throw new Error(
        `Marker with id ${invalidMarker.id} and category CUSTOM is missing the required 'icon' or 'iconSelected' definition.`
      );
    }
  }
}
