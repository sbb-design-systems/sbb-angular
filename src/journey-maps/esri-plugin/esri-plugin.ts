import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AddLayerObject, LayerSpecification, Map as MaplibreMap } from 'maplibre-gl';
import { catchError, forkJoin, map, Subject, takeUntil } from 'rxjs';

import {
  SbbEsriError,
  SbbEsriFeatureLayer,
  SbbEsriFeatureLayerAndConfig,
} from './esri-plugin.interface';
import { FeatureLayerService } from './services/feature-layer.service';
import { SymbolParserService } from './services/symbol-parser.service';
import { UtilService } from './services/util.service';

@Component({
  selector: 'sbb-esri-plugin',
  templateUrl: './esri-plugin.html',
})
export class EsriPluginComponent implements OnChanges, OnDestroy {
  /**
   * The map (maplibre-gl) instance to be used.
   */
  @Input()
  public map: MaplibreMap;

  /**
   * The definition of the feature-layers.
   */
  @Input()
  public featureLayers: SbbEsriFeatureLayer[] = [];

  /**
   * Event that occurs, when the feature layer geojson map source was created and added to the map. Returns the map source id.
   */
  @Output()
  mapSourceAdded: EventEmitter<string> = new EventEmitter();
  /**
   * Event that occurs, when the feature layer map layer was created and added to the map (inc. layer data). Returns the map layer id.
   */
  @Output()
  mapLayerAdded: EventEmitter<string> = new EventEmitter();

  private _destroyed: Subject<void> = new Subject();

  constructor(
    private _featureLayerService: FeatureLayerService,
    private _utilService: UtilService,
    private _symbolParserService: SymbolParserService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue && !changes.map?.previousValue) {
      this._initialize();
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }

  private _initialize(): void {
    if (!this.featureLayers) {
      throw new Error('There must be at least one feature-layer');
    }
    forkJoin(
      this.featureLayers.map((layer) => this._featureLayerService.getFeatureLayerConfig(layer)),
    )
      .pipe(
        takeUntil(this._destroyed),
        catchError((error) => {
          console.error(error);
          return [];
        }),
        map((configs) => {
          return this.featureLayers.map<SbbEsriFeatureLayerAndConfig>((layer, index) => ({
            layerDefinition: layer,
            config: configs[index],
          }));
        }),
      )
      .subscribe((configsAndLayers) => {
        configsAndLayers.forEach((configAndLayer) => this._loadDataForConfig(configAndLayer));
      });
  }

  private _loadDataForConfig(configAndLayer: SbbEsriFeatureLayerAndConfig): void {
    if (configAndLayer.config instanceof SbbEsriError) {
      console.error(
        `Failed to call service ${configAndLayer.layerDefinition.url}`,
        configAndLayer.config as SbbEsriError,
      );
      return;
    }
    this._loadFeaturesForConfig(configAndLayer);
  }

  private _loadFeaturesForConfig(featureLayerConfig: SbbEsriFeatureLayerAndConfig): void {
    this._featureLayerService
      .getFeatures(featureLayerConfig.layerDefinition)
      .pipe(takeUntil(this._destroyed))
      .subscribe((features) => {
        // this.ref.detectChanges();
        try {
          this._addFeaturesToMap(features, featureLayerConfig);
        } catch (error) {
          console.error(
            `Failed to initialize layer ${this._getLayerId(
              featureLayerConfig.layerDefinition,
            )} | ${error}`,
          );
        }
      });
  }

  private _addFeaturesToMap(
    features: GeoJSON.Feature<GeoJSON.Geometry>[],
    configAndLayer: SbbEsriFeatureLayerAndConfig,
  ): void {
    this._addFeaturesAsMapSource(features, configAndLayer.layerDefinition);
    this._addFeaturesAsMapLayer(configAndLayer);
  }

  private _addFeaturesAsMapSource(
    features: GeoJSON.Feature<GeoJSON.Geometry>[],
    layer: SbbEsriFeatureLayer,
  ): void {
    this.map.addSource(this._getSourceId(layer), {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
    });

    // this.mapSourceAdded.next(this._getSourceId(layer));
  }

  private _addFeaturesAsMapLayer(configAndLayer: SbbEsriFeatureLayerAndConfig): void {
    const addLayerBeforeExists =
      configAndLayer.layerDefinition.layerBefore &&
      !!this.map.getLayer(configAndLayer.layerDefinition.layerBefore);

    const layerDefinition = this._getMapLayerDefinition(configAndLayer);
    console.log(layerDefinition);

    this.map.addLayer(
      layerDefinition,
      addLayerBeforeExists ? configAndLayer.layerDefinition.layerBefore : undefined,
    );
    this.mapLayerAdded.next(this._getLayerId(configAndLayer.layerDefinition));
  }

  private _getMapLayerDefinition(configAndLayer: SbbEsriFeatureLayerAndConfig): AddLayerObject {
    const layerPaintStyle =
      configAndLayer.layerDefinition.style ?? this._parseArcgisDrawingInfo(configAndLayer);
    return {
      ...layerPaintStyle,
      id: this._getLayerId(configAndLayer.layerDefinition),
      source: this._getSourceId(configAndLayer.layerDefinition),
      minzoom: this._utilService.convertScaleToLevel(configAndLayer.config.minScale),
      maxzoom: this._utilService.convertScaleToLevel(configAndLayer.config.maxScale),
    } as AddLayerObject;
  }

  private _parseArcgisDrawingInfo(
    configAndLayer: SbbEsriFeatureLayerAndConfig,
  ): LayerSpecification {
    const renderer = configAndLayer.config.drawingInfo.renderer;
    switch (renderer.type) {
      case 'simple':
      case 'uniqueValue':
      case 'heatmap':
        return this._symbolParserService.parseFeatureLayerRenderer(renderer);
      default:
        throw new Error(
          `Renderer type not supported in service ${configAndLayer.layerDefinition.url}`,
        );
    }
  }

  private _getLayerId(layer: SbbEsriFeatureLayer): string {
    return layer.url.replace(/\W/g, '_');
  }

  private _getSourceId(layer: SbbEsriFeatureLayer): string {
    return `${this._getLayerId(layer)}-source`;
  }
}
