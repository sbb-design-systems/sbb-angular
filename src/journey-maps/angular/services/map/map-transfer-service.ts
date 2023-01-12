import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbRouteSourceService } from '../source/route-source-service';
import { SbbStyleSourceService } from '../source/style-source-service';
import { SbbTransferSourceService } from '../source/transfer-source-service';

import { SBB_EMPTY_FEATURE_COLLECTION } from './map-service';

@Injectable({ providedIn: 'root' })
export class SbbMapTransferService {
  constructor(
    private _styleSourceService: SbbStyleSourceService,
    private _transferSourceService: SbbTransferSourceService,
    private _routeSourceService: SbbRouteSourceService
  ) {}

  updateTransfer(
    map: MaplibreMap,
    featureCollection: FeatureCollection = SBB_EMPTY_FEATURE_COLLECTION
  ): void {
    if (this._styleSourceService.isV1Style(map)) {
      this._transferSourceService.updateTransferV1(map, featureCollection);
    } else {
      this._routeSourceService.updateTransferV2(map, featureCollection);
    }
  }

  updateOutdoorWalkFloor(map: MaplibreMap, level: number): void {
    if (this._styleSourceService.isV1Style(map)) {
      this._transferSourceService.updateOutdoorWalkFloorV1(map, level);
    } else {
      this._routeSourceService.updateOutdoorWalkFloorV2(map, level);
    }
  }
}
