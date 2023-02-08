import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

@Injectable({
  providedIn: 'root',
})
export class TwoDThreeDService {
  /**
   * If the level-switch feature is enabled by the client, then show only 3d layers (-lvl)
   * If the level-switch feature is disabled by the client, then show only 2d layers (-2d)
   */
  public show2Dor3D(map: MaplibreMap, isLevelSwitchEnabled: boolean) {
    this._setVisibility(map, '-2d', isLevelSwitchEnabled ? 'none' : 'visible');
    this._setVisibility(map, '-lvl', isLevelSwitchEnabled ? 'visible' : 'none');
  }

  private _setVisibility(map: MaplibreMap, searchString1: string, newVisibility1: string) {
    map
      .getStyle()
      .layers?.filter((layer) => layer.id.endsWith(searchString1))
      .forEach((layer) => map.setLayoutProperty(layer.id, 'visibility', newVisibility1));
  }
}
