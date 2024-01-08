import { Injectable } from '@angular/core';
import {
  CircleLayerSpecification,
  FillLayerSpecification,
  HeatmapLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
} from 'maplibre-gl';

import {
  SbbEsriAnyFeatureLayerRendererInfo,
  SbbEsriArcgisSymbolDefinition,
} from '../esri-plugin.interface';

import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class SymbolParserService {
  constructor(private _utilService: UtilService) {}

  public parseFeatureLayerRenderer(
    renderer: SbbEsriAnyFeatureLayerRendererInfo,
  ): LayerSpecification {
    if (renderer.uniqueValueInfos) {
      const layer = this.createSimpleSymbolLayer(renderer.uniqueValueInfos[0].symbol);
      this.createUniqueColors(layer, renderer);
      return layer;
    }
    if (renderer.colorStops) {
      return this.createHeatmapLayer(
        renderer.colorStops,
        renderer.blurRadius,
        renderer.maxPixelIntensity,
      );
    }

    return this.createSimpleSymbolLayer(renderer.symbol);
  }

  private createSimpleSymbolLayer(symbol: SbbEsriArcgisSymbolDefinition) {
    switch (symbol.type) {
      case 'esriSMS':
        // https://developers.arcgis.com/web-map-specification/objects/esriSMS_symbol/
        return this.createCircleLayer(symbol);
      case 'esriSLS':
        // https://developers.arcgis.com/web-map-specification/objects/esriSLS_symbol/
        return this.createLineLayer(symbol);
      case 'esriSFS':
        // https://developers.arcgis.com/web-map-specification/objects/esriSFS_symbol/
        return this.createFillLayer(symbol);
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

  private createLineLayer(symbol: SbbEsriArcgisSymbolDefinition): LineLayerSpecification {
    const lineLayer: LineLayerSpecification = {
      id: '',
      type: 'line',
      source: '',
      paint: {
        'line-color': this._utilService.convertColorToRgba(symbol.color),
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

  private createCircleLayer(symbol: SbbEsriArcgisSymbolDefinition): CircleLayerSpecification {
    return {
      id: '',
      type: 'circle',
      paint: {
        'circle-color': this._utilService.convertColorToRgba(symbol.color),
        'circle-radius': symbol.size,
        'circle-stroke-color': this._utilService.convertColorToRgba(symbol.outline!.color),
        'circle-stroke-width': symbol.outline!.width,
        'circle-translate': [symbol['xoffset'], symbol['yoffset']],
      },
    } as CircleLayerSpecification;
  }

  private createHeatmapLayer(
    colorStops: { ratio: number; color: number[] }[],
    heatmapRadius: number,
    heatmapIntensity: number,
  ): HeatmapLayerSpecification {
    const heatmapStops: any[] = ['interpolate', ['linear'], ['heatmap-density']];
    let duplicates = 0;
    colorStops.forEach((colorStop) => {
      if (heatmapStops.some((def) => def === colorStop.ratio)) {
        colorStop.ratio += ++duplicates * 0.00000000000000001;
      }
      heatmapStops.push(colorStop.ratio);
      heatmapStops.push(this._utilService.convertColorToRgba(colorStop.color));
    });

    return {
      id: '',
      type: 'heatmap',
      paint: {
        'heatmap-color': heatmapStops,
        'heatmap-radius': heatmapRadius + 20, // looks like in arcgis
        // 'heatmap-intensity': heatmapIntensity, looks not good - leave default
      },
    } as HeatmapLayerSpecification;
  }

  private createFillLayer(symbol: SbbEsriArcgisSymbolDefinition): FillLayerSpecification {
    return {
      id: '',
      type: 'fill',
      paint: {
        'fill-color': this._utilService.convertColorToRgba(symbol.color),
        'fill-outline-color': this._utilService.convertColorToRgba(symbol.outline!.color),
      },
    } as FillLayerSpecification;
  }

  private createUniqueColors(
    layer: LayerSpecification,
    renderer: SbbEsriAnyFeatureLayerRendererInfo,
  ): void {
    const paintColorDef = this._utilService.convertUniqueValueInfosToPaintColor(renderer);
    if (!layer.paint) {
      throw new Error(`No layer.paint for layer ${layer.id}`);
    }
    switch (layer.type) {
      case 'line':
        layer.paint['line-color'] = paintColorDef;
        break;
      case 'circle':
        layer.paint['circle-color'] = paintColorDef;
        const circleOutlineColorDef = this._utilService.convertUniqueValueInfosToPaintColor(
          renderer,
          true,
        );
        layer.paint['circle-stroke-color'] = circleOutlineColorDef;
        break;
      case 'fill':
        layer.paint['fill-color'] = paintColorDef;
        const fillOutlineColorDef = this._utilService.convertUniqueValueInfosToPaintColor(
          renderer,
          true,
        );
        layer.paint['fill-outline-color'] = fillOutlineColorDef;
        break;
      default:
        throw new Error(`Unique colors for layer type '${layer.type}' are not supported!`);
    }
  }
}
