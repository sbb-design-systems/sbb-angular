import { Injectable } from '@angular/core';
import {
  ColorSpecification,
  DataDrivenPropertyValueSpecification,
  ExpressionInputType,
  ExpressionSpecification,
} from 'maplibre-gl';

import { ARCGIS_LODS } from '../constants';
import {
  AtLeastTwoInputValues,
  SbbEsriAnyFeatureLayerRendererInfo,
  SbbEsriUniqueValueInfo,
} from '../esri-plugin.interface';

@Injectable({
  providedIn: 'root',
})
export class EsriColorService {
  convertUniqueValueInfosToPaintColor(
    renderer: SbbEsriAnyFeatureLayerRendererInfo,
    byOutlineColor?: boolean,
  ): DataDrivenPropertyValueSpecification<ColorSpecification> {
    const invisibleColor = [0, 0, 0, 0];
    const fallbackValue = 0;

    const featurePropertyName = renderer.field1;
    const uniqueValueInfos: SbbEsriUniqueValueInfo[] = renderer.uniqueValueInfos;
    const defaultSymbolColor = renderer.defaultSymbol?.color;
    const fallbackColor = this.convertColorToRgba(defaultSymbolColor ?? invisibleColor);

    const colorMap: ExpressionInputType[] = [];
    const interpolationStops: (number | ColorSpecification)[] = [];

    // fill color map and interpolation stops
    uniqueValueInfos.forEach((info, idx) => {
      const useOutlineColor = byOutlineColor && info.symbol.outline?.color;
      const colorDef = {
        id: idx + 1,
        value: info.value,
        color: this.convertColorToRgba(
          useOutlineColor ? info.symbol.outline!.color : info.symbol.color,
        ),
      };
      // [label, output] according to maplibre match-expression
      colorMap.push(colorDef.value, colorDef.id);
      interpolationStops.push(colorDef.id, colorDef.color!);
    });

    // https://maplibre.org/maplibre-style-spec/expressions/#match
    const valueMapping: ExpressionSpecification = [
      'match',
      ['get', featurePropertyName],
      ...(colorMap as AtLeastTwoInputValues),
      fallbackValue,
    ];

    // https://maplibre.org/maplibre-style-spec/expressions/#interpolate
    return [
      'interpolate',
      ['linear'],
      valueMapping,
      fallbackValue,
      fallbackColor!,
      ...interpolationStops,
    ];
  }

  convertColorToRgba(color: number[]): string | undefined {
    if (!color || !color.length) {
      return;
    }
    const rgb = color.slice(0, 3).join();
    const alpha = (color[3] / 255).toFixed(2);
    return `rgba(${rgb},${alpha})`;
  }

  convertScaleToLevel(scale: number): number {
    if (scale === 0) {
      return 0;
    }

    const lower = ARCGIS_LODS.find((lod) => lod.scale < scale);

    return lower
      ? lower.level + (scale - lower.scale) / (lower.scale * 2)
      : ARCGIS_LODS[ARCGIS_LODS.length - 1].level;
  }
}
