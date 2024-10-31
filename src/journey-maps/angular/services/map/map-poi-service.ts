import { Injectable } from '@angular/core';
import { FilterSpecification, Map as MaplibreMap } from 'maplibre-gl';

import {
  SbbPointsOfInterestCategoryType,
  SbbPointsOfInterestOptions,
} from '../../journey-maps.interfaces';
import {
  SBB_POI_FIRST_HOVER_LAYER,
  SBB_POI_FIRST_LAYER,
  SBB_POI_HOVER_LAYER,
  SBB_POI_LAYER,
  SBB_POI_SECOND_2D_HOVER_LAYER,
  SBB_POI_SECOND_2D_LAYER,
  SBB_POI_SECOND_3D_HOVER_LAYER,
  SBB_POI_SECOND_3D_LAYER,
  SBB_POI_SELECTED_LAYER,
  SBB_POI_THIRD_2D_LAYER,
  SBB_POI_THIRD_3D_LAYER,
} from '../constants';

import { isV3Style } from './util/style-version-lookup';

type PoiLayerType = {
  [key in 'PIN' | 'SQUARE' | 'LEGACY' | 'CIRCLE']: {
    defaultLayer: string[];
    interactiveLayer: string[];
  };
};

const poiLayerTypes: PoiLayerType = {
  PIN: {
    defaultLayer: [SBB_POI_FIRST_LAYER],
    interactiveLayer: [SBB_POI_FIRST_HOVER_LAYER],
  },
  SQUARE: {
    defaultLayer: [SBB_POI_SECOND_2D_LAYER, SBB_POI_SECOND_3D_LAYER],
    interactiveLayer: [SBB_POI_SECOND_2D_HOVER_LAYER, SBB_POI_SECOND_3D_HOVER_LAYER],
  },
  CIRCLE: {
    defaultLayer: [SBB_POI_THIRD_2D_LAYER, SBB_POI_THIRD_3D_LAYER],
    interactiveLayer: [],
  },
  LEGACY: {
    defaultLayer: [SBB_POI_LAYER],
    interactiveLayer: [SBB_POI_HOVER_LAYER, SBB_POI_SELECTED_LAYER],
  },
};

/** This class provides methods to handles all points of interest map styles: ki, ki_2 and journey_maps. */
@Injectable({ providedIn: 'root' })
export class SbbMapPoiService {
  private readonly poiSubCategoryFieldName = 'subCategory';

  updatePoiVisibility(map: MaplibreMap, poiOptions?: SbbPointsOfInterestOptions): void {
    if (isV3Style(map)) {
      this._handleV3StylePoiLayers(map, poiOptions);
    } else {
      this._handleLegacyStylePoiLayers(map, poiOptions);
    }
  }

  private _handleLegacyStylePoiLayers(
    map: MaplibreMap,
    poiOptions?: SbbPointsOfInterestOptions,
  ): void {
    poiLayerTypes.LEGACY.defaultLayer.forEach((layerId) => {
      this._updateCategoryFilter(map, layerId, poiOptions, 'replace');
    });
    [...poiLayerTypes.LEGACY.defaultLayer, ...poiLayerTypes.LEGACY.interactiveLayer].forEach(
      (layerId) => {
        this._updateLayerVisibility(map, layerId, !!poiOptions?.categories?.length);
      },
    );
  }

  private _handleV3StylePoiLayers(map: MaplibreMap, poiOptions?: SbbPointsOfInterestOptions): void {
    const poiPinLayerVisible = !!poiOptions?.categories?.length;
    [...poiLayerTypes.PIN.defaultLayer, ...poiLayerTypes.PIN.interactiveLayer].forEach(
      (layerId) => {
        this._updateCategoryFilter(map, layerId, poiOptions, 'replace');
        this._updateLayerVisibility(map, layerId, poiPinLayerVisible);
      },
    );
    poiLayerTypes.SQUARE.defaultLayer.forEach((layerId) => {
      this._updateCategoryFilter(map, layerId, poiOptions, 'update', true);
    });
    poiLayerTypes.SQUARE.interactiveLayer.forEach((layerId) => {
      this._updateCategoryFilter(map, layerId, poiOptions, 'replace', true);
    });

    const baseInteractivityEnabled = !!poiOptions?.baseInteractivityEnabled;
    [...poiLayerTypes.SQUARE.defaultLayer, ...poiLayerTypes.SQUARE.interactiveLayer].forEach(
      (layerId) => {
        this._updateLayerVisibility(map, layerId, baseInteractivityEnabled);
      },
    );
    poiLayerTypes.CIRCLE.defaultLayer.forEach((layerId) => {
      this._updateLayerVisibility(map, layerId, !baseInteractivityEnabled);
    });
  }

  getInteractivePoiLayerIds(map: MaplibreMap): string[] {
    return isV3Style(map)
      ? [...poiLayerTypes.PIN.defaultLayer, ...poiLayerTypes.SQUARE.defaultLayer]
      : poiLayerTypes.LEGACY.defaultLayer;
  }

  private _updateCategoryFilter(
    map: MaplibreMap,
    poiLayerId: string,
    poiOptions: SbbPointsOfInterestOptions | undefined,
    updateType: 'replace' | 'update',
    exclude?: boolean,
  ): void {
    try {
      const currentFilter = map.getFilter(poiLayerId) ?? undefined;
      const newFilter = this._calculateCategoryFilter(
        currentFilter,
        poiOptions?.categories,
        updateType,
        exclude,
      ) as FilterSpecification;
      map.setFilter(poiLayerId, newFilter);
    } catch (e) {
      console.error('Failed to set new layer filter', poiLayerId, e);
    }
  }

  private _updateLayerVisibility(map: MaplibreMap, poiLayerId: string, isVisible: boolean): void {
    map.setLayoutProperty(poiLayerId, 'visibility', isVisible ? 'visible' : 'none');
  }

  private _calculateCategoryFilter(
    currentFilterDef: any[] | any | undefined,
    categories: SbbPointsOfInterestCategoryType[] | undefined,
    updateType: 'replace' | 'update',
    exclude: boolean | undefined,
  ): boolean | any[] {
    const filterByCategoryExpression: boolean | any[] = categories
      ? this._getCategoryExpressionDef(
          [
            ['get', this.poiSubCategoryFieldName],
            ['literal', categories],
          ],
          exclude,
        )
      : true;

    if (updateType === 'replace' || this._invalidFilterDef(currentFilterDef)) {
      return filterByCategoryExpression;
    }

    let categoryFilterFound = false;
    const updatedFilterDef = currentFilterDef.map((expression: any | any[]) => {
      if (!categoryFilterFound && this._containsCategoryFilter(JSON.stringify(expression))) {
        categoryFilterFound = true;
        return filterByCategoryExpression;
      }
      return expression;
    });

    if (!categoryFilterFound) {
      updatedFilterDef.push(filterByCategoryExpression);
    }
    return updatedFilterDef;
  }

  private _invalidFilterDef(currentFilterDef: FilterSpecification | undefined) {
    return !Array.isArray(currentFilterDef) || currentFilterDef.length < 1;
  }

  private _containsCategoryFilter(expressionJsonString: string): boolean {
    return expressionJsonString.includes(
      `"in",["get","${this.poiSubCategoryFieldName}"],["literal"`,
    );
  }

  // https://maplibre.org/maplibre-style-spec/expressions/#in
  private _getCategoryExpressionDef(filter: any | any[], exclude?: boolean): any[] {
    const contains = ['in', ...filter];
    return exclude ? ['!', contains] : contains;
  }
}
