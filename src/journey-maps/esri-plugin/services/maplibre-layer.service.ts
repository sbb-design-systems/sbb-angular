import { EventEmitter, Injectable } from '@angular/core';
import { AddLayerObject, Map as MaplibreMap } from 'maplibre-gl';

import {
  SbbEsriViewInformations,
  SupportedEsriLayerTypes,
  WithoutIdAndSource,
} from '../esri-plugin.interface';

import { EsriColorService } from './esri-color.service';
import { EsriSymbolParserService } from './esri-symbol-parser.service';
import { MaplibreUtilService } from './maplibre-util.service';

@Injectable({
  providedIn: 'root',
})
export class MaplibreLayerService {
  constructor(
    private _maplibreUtilService: MaplibreUtilService,
    private _esriColorService: EsriColorService,
    private _esriSymbolParserService: EsriSymbolParserService,
  ) {}

  public addFeaturesAsMapLayer(
    map: MaplibreMap,
    configAndLayer: SbbEsriViewInformations,
    mapLayerAdded: EventEmitter<string>,
  ): void {
    const addLayerBeforeExists =
      configAndLayer.layerDefinition.layerBefore &&
      !!map.getLayer(configAndLayer.layerDefinition.layerBefore);
    const maplibreLayerDefinition = this._getMapLayerDefinition(configAndLayer);
    map.addLayer(
      maplibreLayerDefinition,
      addLayerBeforeExists ? configAndLayer.layerDefinition.layerBefore : undefined,
    );
    mapLayerAdded.next(this._maplibreUtilService.getLayerId(configAndLayer.layerDefinition));
  }

  private _getMapLayerDefinition(configAndLayer: SbbEsriViewInformations): AddLayerObject {
    const layerPaintStyle =
      configAndLayer.layerDefinition.style ?? this._parseArcgisDrawingInfo(configAndLayer);
    return {
      minzoom: this._esriColorService.convertScaleToLevel(configAndLayer.config.minScale),
      maxzoom: this._esriColorService.convertScaleToLevel(configAndLayer.config.maxScale),
      ...layerPaintStyle,
      id: this._maplibreUtilService.getLayerId(configAndLayer.layerDefinition),
      source: this._maplibreUtilService.getSourceId(configAndLayer.layerDefinition),
    } as AddLayerObject;
  }

  private _parseArcgisDrawingInfo(
    configAndLayer: SbbEsriViewInformations,
  ): WithoutIdAndSource<SupportedEsriLayerTypes> {
    const renderer = configAndLayer.config.drawingInfo.renderer;
    switch (renderer.type) {
      case 'simple':
      case 'uniqueValue':
      case 'heatmap':
        return this._esriSymbolParserService.parseFeatureLayerRenderer(renderer);
      default:
        throw new Error(
          `Renderer type not supported in service ${configAndLayer.layerDefinition.url}`,
        );
    }
  }
}
