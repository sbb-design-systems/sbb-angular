import { Injectable } from '@angular/core';
import { SbbRailNetworkOptions } from '@sbb-esta/journey-maps/angular';
import { LineLayerSpecification, Map as MaplibreMap } from 'maplibre-gl';

const RAIL_NETWORK_LAYER_CONST = {
  idPart: '-track',
  layerType: 'line',
  colorPropName: 'line-color',
};

interface LayerMetadata extends Record<string, any> {
  railNetworkDefaultLineColor?: string;
}

@Injectable({ providedIn: 'root' })
export class SbbMapRailNetworkService {
  updateOptions(map: MaplibreMap, options: SbbRailNetworkOptions) {
    map.getStyle().layers?.forEach((layer) => {
      if (
        layer.type === RAIL_NETWORK_LAYER_CONST.layerType &&
        layer.id.includes(RAIL_NETWORK_LAYER_CONST.idPart)
      ) {
        this._backupLayerOptions(layer as LineLayerSpecification);
        map.setPaintProperty(
          layer.id,
          RAIL_NETWORK_LAYER_CONST.colorPropName,
          options.railNetworkColor
        );
      }
    });
  }

  private _backupLayerOptions(railLineLayer: LineLayerSpecification): void {
    const layerMetadata = (railLineLayer.metadata ?? {}) as LayerMetadata;
    if (!layerMetadata.railNetworkDefaultLineColor) {
      const linePaintOptions = (railLineLayer.paint || {}) as Record<string, any>;
      layerMetadata.railNetworkDefaultLineColor =
        linePaintOptions[RAIL_NETWORK_LAYER_CONST.colorPropName];
      railLineLayer.metadata = layerMetadata;
    }
  }
}
