import { LayerSpecification } from 'maplibre-gl';

// post not get
export interface SbbEsriFeatureLayer {
  url: string;
  accessToken?: string;
  style?: LayerSpecification;
  layerBefore?: string;
  filter?: string;
}

export type SbbEsriFeatureLayerInfoResponse = SbbEsriFeatureLayerConfig | SbbEsriFeatureLayerError;

export interface SbbEsriFeatureLayerConfig {
  minScale: number;
  maxScale: number;
  maxRecordCount: number;
  displayField?: string;
  drawingInfo: { renderer: SbbEsriAnyFeatureLayerRendererInfo };
  transparency: number;
}

export interface SbbEsriFeatureLayerError {
  error: { code: number; message: string };
}

export type SbbEsriAnyFeatureLayerRendererInfo =
  | SbbEsriFeatureLayerSimpleRendererInfo
  | SbbEsriFeatureLayerUniqueValueRendererInfo
  | SbbEsriFeatureLayerHeatmapRendererInfo;

export interface SbbEsriFeatureLayerUniqueValueRendererInfo {
  type: 'uniqueValue';

  /*uniqueValue*/
  defaultSymbol?: SbbEsriArcgisSymbolDefinition;
  uniqueValueInfos?: { symbol: SbbEsriArcgisSymbolDefinition; value: any }[];
  field1?: string;

  /**/
  [key: string]: any;
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
}
