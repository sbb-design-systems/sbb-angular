import { Injectable } from '@angular/core';
import {
  CircleLayerSpecification,
  FillLayerSpecification,
  HeatmapLayerSpecification,
  LineLayerSpecification,
} from 'maplibre-gl';

import {
  SbbEsriAnyFeatureLayerRendererInfo,
  SbbEsriArcgisSymbolDefinition,
  SupportedEsriLayerTypes,
  WithoutIdAndSource,
} from '../esri-plugin.interface';

import { EsriColorService } from './esri-color.service';

@Injectable({
  providedIn: 'root',
})
export class EsriSymbolParserService {
  constructor(private _esriColorService: EsriColorService) {}

  public parseFeatureLayerRenderer(
    renderer: SbbEsriAnyFeatureLayerRendererInfo,
  ): WithoutIdAndSource<SupportedEsriLayerTypes> {
    if (renderer.uniqueValueInfos) {
      const layer = this._createSimpleSymbolLayer(renderer.uniqueValueInfos[0].symbol);
      this._createUniqueColors(layer, renderer);
      return layer;
    }
    if (renderer.colorStops) {
      return this._createHeatmapLayer(renderer.colorStops, renderer.blurRadius);
    }
    return this._createSimpleSymbolLayer(renderer.symbol);
  }

  private _createSimpleSymbolLayer(
    symbol: SbbEsriArcgisSymbolDefinition,
  ): WithoutIdAndSource<SupportedEsriLayerTypes> {
    switch (symbol.type) {
      case 'esriSMS':
        // https://developers.arcgis.com/web-map-specification/objects/esriSMS_symbol/
        return this._createCircleLayer(symbol);
      case 'esriSLS':
        // https://developers.arcgis.com/web-map-specification/objects/esriSLS_symbol/
        return this._createLineLayer(symbol);
      case 'esriSFS':
        // https://developers.arcgis.com/web-map-specification/objects/esriSFS_symbol/
        return this._createFillLayer(symbol);
      case 'esriPMS':
      // https://developers.arcgis.com/web-map-specification/objects/esriPMS_symbol/
      case 'esriPFS':
      // https://developers.arcgis.com/web-map-specification/objects/esriPFS_symbol/
      case 'esriTS':
      // https://developers.arcgis.com/web-map-specification/objects/esriTS_symbol/
      default:
        throw new Error(`This symbol type is not supported: ${symbol.type}`);
    }
  }

  private _createLineLayer(symbol: SbbEsriArcgisSymbolDefinition): LineLayerSpecification {
    const lineLayer: WithoutIdAndSource<LineLayerSpecification> = {
      type: 'line',
      paint: {
        'line-color': this._esriColorService.convertColorToRgba(symbol.color),
        'line-width': symbol.width,
      },
    };

    if (lineLayer.paint) {
      if (symbol.style === 'esriSLSDot') {
        lineLayer.paint['line-dasharray'] = [0.5, 1];
      } else if (symbol.style === 'esriSLSDash') {
        lineLayer.paint['line-dasharray'] = [3, 3];
      }
    }

    return lineLayer as LineLayerSpecification;
  }

  private _createCircleLayer(
    symbol: SbbEsriArcgisSymbolDefinition,
  ): WithoutIdAndSource<CircleLayerSpecification> {
    return {
      type: 'circle',
      paint: {
        'circle-color': this._esriColorService.convertColorToRgba(symbol.color),
        'circle-radius': symbol.size,
        'circle-stroke-color': this._esriColorService.convertColorToRgba(symbol.outline!.color),
        'circle-stroke-width': symbol.outline!.width,
        'circle-translate': [symbol['xoffset'], symbol['yoffset']],
      },
    } as WithoutIdAndSource<CircleLayerSpecification>;
  }

  private _createHeatmapLayer(
    colorStops: { ratio: number; color: number[] }[],
    heatmapRadius: number,
  ): WithoutIdAndSource<HeatmapLayerSpecification> {
    const heatmapStops: any[] = ['interpolate', ['linear'], ['heatmap-density']];
    let duplicates = 0;
    colorStops.forEach((colorStop) => {
      if (heatmapStops.some((def) => def === colorStop.ratio)) {
        colorStop.ratio += ++duplicates * 0.00000000000000001;
      }
      heatmapStops.push(colorStop.ratio);
      heatmapStops.push(this._esriColorService.convertColorToRgba(colorStop.color));
    });

    return {
      type: 'heatmap',
      paint: {
        'heatmap-color': heatmapStops,
        'heatmap-radius': heatmapRadius + 20, // looks like in arcgis
      },
    } as WithoutIdAndSource<HeatmapLayerSpecification>;
  }

  private _createFillLayer(
    symbol: SbbEsriArcgisSymbolDefinition,
  ): WithoutIdAndSource<FillLayerSpecification> {
    return {
      type: 'fill',
      paint: {
        'fill-color': this._esriColorService.convertColorToRgba(symbol.color),
        'fill-outline-color': this._esriColorService.convertColorToRgba(symbol.outline!.color),
      },
    } as WithoutIdAndSource<FillLayerSpecification>;
  }

  private _createUniqueColors(
    layer: WithoutIdAndSource<SupportedEsriLayerTypes>,
    renderer: SbbEsriAnyFeatureLayerRendererInfo,
  ): void {
    const paintColorDef = this._esriColorService.convertUniqueValueInfosToPaintColor(renderer);
    if (!layer.paint) {
      throw new Error(`No layer.paint for layer ${layer}`);
    }
    switch (layer.type) {
      case 'line':
        (layer as WithoutIdAndSource<LineLayerSpecification>).paint!['line-color'] = paintColorDef;
        break;
      case 'circle':
        (layer as WithoutIdAndSource<CircleLayerSpecification>).paint!['circle-color'] =
          paintColorDef;
        const circleOutlineColorDef = this._esriColorService.convertUniqueValueInfosToPaintColor(
          renderer,
          true,
        );
        (layer as WithoutIdAndSource<CircleLayerSpecification>).paint!['circle-stroke-color'] =
          circleOutlineColorDef;
        break;
      case 'fill':
        (layer as WithoutIdAndSource<FillLayerSpecification>).paint!['fill-color'] = paintColorDef;
        const fillOutlineColorDef = this._esriColorService.convertUniqueValueInfosToPaintColor(
          renderer,
          true,
        );
        (layer as WithoutIdAndSource<FillLayerSpecification>).paint!['fill-outline-color'] =
          fillOutlineColorDef;
        break;
      default:
        throw new Error(`Unique colors for layer type '${layer.type}' are not supported!`);
    }
  }
}
