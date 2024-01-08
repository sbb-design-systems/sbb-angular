import { LayerSpecification as MaplibreLayerSpecification } from 'maplibre-gl';

/**
 * Specification of the maplibre layer acording to `LayerSpecification` from `maplibre-gl`.
 * The fields `id` and `source` are set automatically and cannot be set therefore.
 */
type LayerSpecification = Omit<MaplibreLayerSpecification, 'id' | 'source'>;

/**
 *
 */
export interface SbbEsriFeatureLayer {
  url: string;
  accessToken?: string;
  style?: LayerSpecification;
  layerBefore?: string;
  filter?: string;
}

export interface SbbEsriFeatureLayerAndConfig {
  layerDefinition: SbbEsriFeatureLayer;
  config: SbbEsriConfig;
}

export class SbbEsriConfig {
  minScale: number;
  maxScale: number;
  maxRecordCount: number;
  displayField?: string;
  drawingInfo: { renderer: SbbEsriAnyFeatureLayerRendererInfo };
  transparency: number;
}

export class SbbEsriError {
  error: { code: number; message: string };
}

export interface SbbEsriFeatureResponse {
  exceededTransferLimit: boolean;
  features: GeoJSON.Feature<GeoJSON.Geometry>[];
}

export type SbbEsriAnyFeatureLayerRendererInfo =
  | SbbEsriFeatureLayerSimpleRendererInfo
  | SbbEsriFeatureLayerUniqueValueRendererInfo
  | SbbEsriFeatureLayerHeatmapRendererInfo;

export interface SbbEsriFeatureLayerUniqueValueRendererInfo {
  type: 'uniqueValue';

  /*uniqueValue*/
  defaultSymbol?: SbbEsriArcgisSymbolDefinition;
  uniqueValueInfos?: SbbEsriUniqueValueInfo[];
  field1?: string;

  /**/
  [key: string]: any;
}

export interface SbbEsriUniqueValueInfo {
  symbol: SbbEsriArcgisSymbolDefinition;
  value: any;
}

export interface SbbEsriFeatureLayerSimpleRendererInfo {
  type: 'simple';

  /*simple*/
  symbol: SbbEsriArcgisSymbolDefinition;

  /**/
  [key: string]: any;
}

export interface SbbEsriFeatureLayerHeatmapRendererInfo {
  type: 'heatmap';

  /*heatmap*/
  blurRadius?: number;
  maxPixelIntensity?: number;
  minPixelIntensity?: number;
  colorStops?: { ratio: number; color: number[] }[];

  /**/
  [key: string]: any;
}

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
