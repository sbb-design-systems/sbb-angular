import { Layer } from 'leaflet';

/** This class represents a config to create e layercontrol for a leaflet-map. */
export interface LayersControl {
  /** Specifies the differenc baselayers (background layers) for your map. */
  baseLayers?: LayersControlLayer[];
  /** Specifies the overlays (differenc layers) for your map. */
  overLays?: LayersControlLayer[];
}
/** This class represents a layer definition. */
export interface LayersControlLayer {
  /** The title the overlay/baselayer  */
  title: string;
  /** The layer itself to show in the control & map. */
  layer: Layer;
  /** Whether or not the layer should be displayed on the map by default. */
  visible: boolean;
}
