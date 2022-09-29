import { Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbInteractionOptions } from '../../journey-maps.interfaces';

@Injectable({
  providedIn: 'root',
})
export class SbbMapOverflowingLabelService {
  /**
   * Hides the labels which get cut off by the border, if the given interaction options allow so.
   *
   * @param map The map to hide the overflowing labels on.
   * @param interactionOptions The interaction options to decide whether to hide or not.
   */
  hideOverflowingLabels(map: MaplibreMap, interactionOptions: SbbInteractionOptions): void {
    if (interactionOptions.disableInteractions) {
      const borderId = `map-viewport-line`;
      this._addBorderSource(map, borderId);

      const blockerWidth = 10;
      this._addBlockerImage(map, blockerWidth);
      this._addBlockerImageOnBorder(map, borderId, blockerWidth);
    }
  }

  /**
   * Create border as source around map.
   *
   * @param map The map to add the border to.
   * @param borderId ID of the border.
   */
  private _addBorderSource(map: MaplibreMap, borderId: string) {
    const viewport = map.getBounds();
    map.addSource(borderId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [viewport._sw.lng, viewport._sw.lat],
            [viewport._sw.lng, viewport._ne.lat],
            [viewport._ne.lng, viewport._ne.lat],
            [viewport._ne.lng, viewport._sw.lat],
            [viewport._sw.lng, viewport._sw.lat],
          ],
        },
      },
    });
  }

  /**
   * Initialize image to remove text nearer than the given width to the boarder.
   *
   * @param map The map to add the blocker-image to.
   */
  private _addBlockerImage(map: MaplibreMap, width: number) {
    const data = new Uint8Array(width * width * 4);
    map.addImage('pixel', {
      width: width,
      height: width,
      data: data,
    });
  }

  /**
   * Add layer with images on map border.
   *
   * @param map The map to add the blocker-images to the border.
   * @param borderId ID of the border.
   */
  private _addBlockerImageOnBorder(map: MaplibreMap, borderId: string, width: number) {
    const symbolId = `map-viewport-line-symbols`;
    map.addLayer({
      id: symbolId,
      type: 'symbol',
      source: borderId,
      layout: {
        'icon-image': 'pixel',
        'symbol-placement': 'line',
        'symbol-spacing': width / 2,
      },
    });
  }
}
