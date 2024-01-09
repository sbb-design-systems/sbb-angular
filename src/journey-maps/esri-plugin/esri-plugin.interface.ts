import {
  CircleLayerSpecification,
  ExpressionInputType,
  FillLayerSpecification,
  HeatmapLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
  Map,
} from 'maplibre-gl';

/**
 * Contains all necessary information to represent the Esri feature-layer onto a MapLibre map.
 */
export interface SbbEsriFeatureLayer {
  /** The url of the Esri feature-layer. */
  url: string;
  /** The Esri access-token, if the Esri feature-layer requires authentication (optional). */
  accessToken?: string;
  /**
   * A style according to the MapLibre layer-specification (optional).
   * If not given, the style of the Esri feature-layer will be translated to the corresponding MapLibre style.
   *
   * {@link https://maplibre.org/maplibre-style-spec/layers/}
   */
  style?: WithoutIdAndSource<LayerSpecification>;
  /** The ID of the layer, that is after this layer (optional). */
  layerAfter?: string;
  /**
   *  A where-clause according to the Esri feature-service (optional).
   *
   * {@link https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm}
   */
  filter?: string;
}

/**
 * Specification of the maplibre layer acording to `LayerSpecification` from `maplibre-gl`.
 * The fields `id` and `source` are set automatically by the plugin and cannot be manually set therefore.
 */
export type WithoutIdAndSource<T> = Omit<T, 'id' | 'source'>;

/**
 * Alias for the class `map` of the MapLibre library.
 */
export type MaplibreMap = Map;

/** @docs-private */
export interface SbbEsriViewInformations {
  layerDefinition: SbbEsriFeatureLayer;
  config: SbbEsriConfig;
  features: GeoJSON.Feature<GeoJSON.Geometry>[];
}

/** @docs-private */
export class SbbEsriConfig {
  minScale: number;
  maxScale: number;
  maxRecordCount: number;
  displayField?: string;
  drawingInfo: { renderer: SbbEsriAnyFeatureLayerRendererInfo };
  transparency: number;
}

/** @docs-private */
export class SbbEsriError {
  error: { code: number; message: string };
}

/** @docs-private */
export interface SbbEsriFeatureResponse {
  exceededTransferLimit: boolean;
  features: GeoJSON.Feature<GeoJSON.Geometry>[];
}

/** @docs-private */
export type SbbEsriAnyFeatureLayerRendererInfo =
  | SbbEsriFeatureLayerSimpleRendererInfo
  | SbbEsriFeatureLayerUniqueValueRendererInfo
  | SbbEsriFeatureLayerHeatmapRendererInfo;

/** @docs-private */
interface SbbEsriFeatureLayerBase {
  type: string;
  [key: string]: any;
}

/** @docs-private */
export interface SbbEsriFeatureLayerUniqueValueRendererInfo extends SbbEsriFeatureLayerBase {
  type: 'uniqueValue';

  /*uniqueValue*/
  defaultSymbol?: SbbEsriArcgisSymbolDefinition;
  uniqueValueInfos?: SbbEsriUniqueValueInfo[];
  field1?: string;
  /**/
}

/** @docs-private */
export interface SbbEsriUniqueValueInfo {
  symbol: SbbEsriArcgisSymbolDefinition;
  value: any;
}

/** @docs-private */
export interface SbbEsriFeatureLayerSimpleRendererInfo extends SbbEsriFeatureLayerBase {
  type: 'simple';

  /*simple*/
  symbol: SbbEsriArcgisSymbolDefinition;
  /**/
}

/** @docs-private */
export interface SbbEsriFeatureLayerHeatmapRendererInfo extends SbbEsriFeatureLayerBase {
  type: 'heatmap';

  /*heatmap*/
  blurRadius?: number;
  maxPixelIntensity?: number;
  minPixelIntensity?: number;
  colorStops?: { ratio: number; color: number[] }[];
  /**/
}

/** @docs-private */
export interface SbbEsriArcgisSymbolDefinition {
  type: 'esriSMS' | 'esriSLS' | 'esriSFS' | 'esriPMS' | 'esriPFS' | 'esriTS';
  color: number[];
  width?: number;
  size?: number;
  style?: 'esriSLSSolid' | 'esriSLSDash' | 'esriSLSDot';
  outline?: { color: number[]; width?: number };
  xoffset?: number;
  yoffset?: number;
}

/** @docs-private */
export type AtLeastTwoInputValues = [
  ExpressionInputType,
  ExpressionInputType,
  ...ExpressionInputType[],
];

/** @docs-private */
export type SupportedEsriLayerTypes =
  | CircleLayerSpecification
  | LineLayerSpecification
  | FillLayerSpecification
  | HeatmapLayerSpecification;
