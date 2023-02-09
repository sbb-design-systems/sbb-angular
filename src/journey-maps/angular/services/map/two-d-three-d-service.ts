import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

@Injectable({
  providedIn: 'root',
})
export class TwoDThreeDService {
  public show2Dor3D(map: MaplibreMap, show3D: boolean) {
    this._setVisibility(map, '-2d', show3D ? 'none' : 'visible');
    this._setVisibility(map, '-lvl', show3D ? 'visible' : 'none');
  }

  private _setVisibility(map: MaplibreMap, layerIdSuffix: string, visibility: string) {
    map
      .getStyle()
      .layers?.filter((layer) => layer.id.endsWith(layerIdSuffix))
      .forEach((layer) => map.setLayoutProperty(layer.id, 'visibility', visibility));
  }
}
