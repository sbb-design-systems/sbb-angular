import { Injectable } from '@angular/core';
import { LineLayerSpecification, Map as MaplibreMap } from 'maplibre-gl';

import { SbbRailNetworkOptions } from '../../journey-maps.interfaces';

const RAIL_NETWORK_LAYER_CONST = {
  // Old style
  idPart: '-track',
  // Shortbread style
  metadataClass: 'railways',
  layerType: 'line',
  colorPropName: 'line-color',
};

interface RailLayerMetadata extends Record<string, any> {
  railNetworkDefaultLineColor?: string;
}

@Injectable({ providedIn: 'root' })
export class SbbMapRailNetworkLayerService {
  updateOptions(map: MaplibreMap, options?: SbbRailNetworkOptions) {
    map.getStyle().layers?.forEach((layer) => {
      if (layer.type === RAIL_NETWORK_LAYER_CONST.layerType && this._isRailLayer(layer)) {
        const lineLayer = layer as LineLayerSpecification;
        if (!options) {
          this._restoreLayerOptions(map, lineLayer);
        } else {
          this._updateLayerOptions(map, lineLayer, options);
        }
      }
    });
  }

  private _isRailLayer(layer: { id: string; metadata?: unknown }): boolean {
    if (layer.id.includes(RAIL_NETWORK_LAYER_CONST.idPart)) {
      return true;
    }
    const metadata = layer.metadata as Record<string, unknown> | undefined;
    return metadata?.['general.class'] === RAIL_NETWORK_LAYER_CONST.metadataClass;
  }

  private _updateLayerOptions(
    map: MaplibreMap,
    railLineLayer: LineLayerSpecification,
    options: SbbRailNetworkOptions,
  ): void {
    this._backupLayerOptions(railLineLayer);
    if (options.railNetworkColor) {
      map.setPaintProperty(
        railLineLayer.id,
        RAIL_NETWORK_LAYER_CONST.colorPropName,
        options.railNetworkColor,
      );
    }
  }

  private _backupLayerOptions(railLineLayer: LineLayerSpecification) {
    const layerMetadata = (railLineLayer.metadata ?? {}) as RailLayerMetadata;
    if (layerMetadata.railNetworkDefaultLineColor) {
      return;
    }
    const linePaintOptions = (railLineLayer.paint || {}) as Record<string, any>;
    layerMetadata.railNetworkDefaultLineColor =
      linePaintOptions[RAIL_NETWORK_LAYER_CONST.colorPropName];
    railLineLayer.metadata = layerMetadata;
  }

  private _restoreLayerOptions(map: MaplibreMap, railLineLayer: LineLayerSpecification): void {
    const layerMetadata = (railLineLayer.metadata ?? {}) as RailLayerMetadata;
    if (!layerMetadata.railNetworkDefaultLineColor) {
      return;
    }
    map.setPaintProperty(
      railLineLayer.id,
      RAIL_NETWORK_LAYER_CONST.colorPropName,
      layerMetadata.railNetworkDefaultLineColor,
    );
    delete layerMetadata.railNetworkDefaultLineColor;
  }
}
