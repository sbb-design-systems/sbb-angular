import { LayerSpecification } from 'maplibre-gl';

// post not get
export interface FeatureLayer {
  url: string;
  accessToken?: string;
  style?: LayerSpecification;
  layerBefore?: string;
  filter?: string;
}
