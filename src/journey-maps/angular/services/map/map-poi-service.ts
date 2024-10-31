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
  [key in 'PIN' | 'SQUARE_2D' | 'SQUARE_3D' | 'LEGACY' | 'CIRCLE_2D' | 'CIRCLE_3D']: {
    defaultLayer: string[];
    interactiveLayer: string[];
  };
};

const poiLayerTypes: PoiLayerType = {
  PIN: {
    defaultLayer: [SBB_POI_FIRST_LAYER],
    interactiveLayer: [SBB_POI_FIRST_HOVER_LAYER],
  },
  SQUARE_2D: {
    defaultLayer: [SBB_POI_SECOND_2D_LAYER],
    interactiveLayer: [SBB_POI_SECOND_2D_HOVER_LAYER],
  },
  SQUARE_3D: {
    defaultLayer: [SBB_POI_SECOND_3D_LAYER],
    interactiveLayer: [SBB_POI_SECOND_3D_HOVER_LAYER],
  },
  CIRCLE_2D: {
    defaultLayer: [SBB_POI_THIRD_2D_LAYER],
    interactiveLayer: [],
  },
  CIRCLE_3D: {
    defaultLayer: [SBB_POI_THIRD_3D_LAYER],
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

  updatePoiVisibility(
    map: MaplibreMap,
    isLevelFilterEnabled: boolean,
    poiOptions?: SbbPointsOfInterestOptions,
  ): void {
    if (isV3Style(map)) {
      this._handleV3StylePoiLayers(map, isLevelFilterEnabled, poiOptions);
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
    [poiLayerTypes.LEGACY.defaultLayer, poiLayerTypes.LEGACY.interactiveLayer]
      .flat()
      .forEach((layerId) => {
        this._setMapLayerVisibility(map, layerId, !!poiOptions?.categories?.length);
      });
  }

  private _handleV3StylePoiLayers(
    map: MaplibreMap,
    isLevelFilterEnabled: boolean,
    poiOptions?: SbbPointsOfInterestOptions,
  ): void {
    const poiPinLayerVisible = !!poiOptions?.categories?.length;
    [poiLayerTypes.PIN.defaultLayer, poiLayerTypes.PIN.interactiveLayer]
      .flat()
      .forEach((layerId) => {
        this._updateCategoryFilter(map, layerId, poiOptions, 'replace');
        this._setMapLayerVisibility(map, layerId, poiPinLayerVisible);
      });

    [
      poiLayerTypes.SQUARE_2D.defaultLayer,
      poiLayerTypes.SQUARE_3D.defaultLayer,
      poiLayerTypes.CIRCLE_2D.defaultLayer,
      poiLayerTypes.CIRCLE_3D.defaultLayer,
    ]
      .flat()
      .forEach((layerId) => {
        this._updateCategoryFilter(map, layerId, poiOptions, 'update', true);
      });

    [poiLayerTypes.SQUARE_2D.interactiveLayer, poiLayerTypes.SQUARE_3D.interactiveLayer]
      .flat()
      .forEach((layerId) => {
        this._updateCategoryFilter(map, layerId, poiOptions, 'replace', true);
      });

    const baseInteractivityEnabled = !!poiOptions?.baseInteractivityEnabled;
    this.setPoiLayerVisibilityByLevelFilter(map, isLevelFilterEnabled, baseInteractivityEnabled);
  }

  private setPoiLayerVisibilityByLevelFilter(
    map: MaplibreMap,
    isLevelFilterEnabled: boolean,
    baseInteractivityEnabled: boolean,
  ) {
    (isLevelFilterEnabled
      ? [poiLayerTypes.SQUARE_3D.defaultLayer, poiLayerTypes.SQUARE_3D.interactiveLayer]
      : [poiLayerTypes.SQUARE_2D.defaultLayer, poiLayerTypes.SQUARE_2D.interactiveLayer]
    )
      .flat()
      .forEach((layerId) => {
        this._setMapLayerVisibility(map, layerId, baseInteractivityEnabled);
      });
    (isLevelFilterEnabled
      ? poiLayerTypes.CIRCLE_3D.defaultLayer
      : poiLayerTypes.CIRCLE_2D.defaultLayer
    ).forEach((layerId) => {
      this._setMapLayerVisibility(map, layerId, !baseInteractivityEnabled);
    });
  }

  getPoiMapStyleLayerIds(map: MaplibreMap): string[] {
    return isV3Style(map)
      ? [
          poiLayerTypes.PIN.defaultLayer,
          poiLayerTypes.SQUARE_2D.defaultLayer,
          poiLayerTypes.CIRCLE_2D.defaultLayer,
          poiLayerTypes.SQUARE_3D.defaultLayer,
          poiLayerTypes.CIRCLE_3D.defaultLayer,
        ].flat()
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

  private _setMapLayerVisibility(map: MaplibreMap, poiLayerId: string, isVisible: boolean): void {
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
