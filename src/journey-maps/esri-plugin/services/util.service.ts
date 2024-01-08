import { Injectable } from '@angular/core';
import { ExpressionFilterSpecification } from 'maplibre-gl';

import {
  SbbEsriAnyFeatureLayerRendererInfo,
  SbbEsriUniqueValueInfo,
} from '../esri-plugin.interface';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  convertUniqueValueInfosToPaintColor(
    renderer: SbbEsriAnyFeatureLayerRendererInfo,
    byOutlineColor?: boolean,
  ) {
    const invisibleColor = [0, 0, 0, 0];
    const fallbackValue = 0;

    const featurePropertyName: string = renderer.field1;
    const uniqueValueInfos: SbbEsriUniqueValueInfo[] = renderer.uniqueValueInfos;
    const defaultSymbolColor = renderer.defaultSymbol?.color;
    const fallbackColor = this.convertColorToRgba(defaultSymbolColor ?? invisibleColor);

    const valueMapping: any = ['match', ['get', featurePropertyName]];

    const uniqueValueColorMapping: ExpressionFilterSpecification = [
      'interpolate',
      ['linear'],
      valueMapping,
      fallbackValue,
      fallbackColor!,
    ];
    uniqueValueInfos.forEach((info, idx) => {
      const colorDef = {
        id: idx + 1,
        value: info['value'],
        color: this.convertColorToRgba(
          byOutlineColor && info.symbol.outline?.color
            ? info.symbol.outline?.color
            : info.symbol.color,
        ),
      };
      valueMapping.push(colorDef.value);
      valueMapping.push(colorDef.id);
      uniqueValueColorMapping.push(colorDef.id);
      uniqueValueColorMapping.push(colorDef.color!);
    });

    // fallback (default) value:
    valueMapping.push(fallbackValue);

    return uniqueValueColorMapping;
  }

  convertColorToRgba(color: number[]): string | undefined {
    if (!color || !color.length) {
      return;
    }
    const rgb = color.slice(0, 3).join();
    const alpha = (color.slice(-1)[0] / 255.0).toFixed(2);
    return `rgba(${rgb},${alpha})`;
  }

  convertScaleToLevel(scale: number): number {
    if (scale === 0) {
      return 0;
    }

    // Find the LOD with the largest scale that is less than the input scale
    const lower = this.arcgisLODs.find((lod) => lod.scale < scale);

    // If no lower LOD is found, return the level of the smallest LOD
    if (!lower) {
      return this.arcgisLODs[this.arcgisLODs.length - 1].level;
    }

    // Calculate the level based on the lower LOD and the input scale
    return lower.level + (scale - lower.scale) / (lower.scale * 2);
  }

  private readonly arcgisLODs = [
    { level: 0, scale: 5.91657527591555e8 },
    {
      level: 1,
      scale: 2.95828763795777e8,
    },
    { level: 2, scale: 1.47914381897889e8 },
    {
      level: 3,
      scale: 7.3957190948944e7,
    },
    { level: 4, scale: 3.6978595474472e7 },
    {
      level: 5,
      scale: 1.8489297737236e7,
    },
    { level: 6, scale: 9244648.868618 },
    {
      level: 7,
      scale: 4622324.434309,
    },
    { level: 8, scale: 2311162.217155 },
    {
      level: 9,
      scale: 1155581.108577,
    },
    { level: 10, scale: 577790.554289 },
    {
      level: 11,
      scale: 288895.277144,
    },
    { level: 12, scale: 144447.638572 },
    {
      level: 13,
      scale: 72223.819286,
    },
    { level: 14, scale: 36111.909643 },
    {
      level: 15,
      scale: 18055.954822,
    },
    { level: 16, scale: 9027.977411 },
    {
      level: 17,
      scale: 4513.988705,
    },
    { level: 18, scale: 2256.994353 },
    {
      level: 19,
      scale: 1128.497176,
    },
    { level: 20, scale: 564.248588 },
    {
      level: 21,
      scale: 282.124294,
    },
    { level: 22, scale: 141.062147 },
    {
      level: 23,
      scale: 70.5310735,
    },
    { level: 24, scale: 0 },
  ];
}
