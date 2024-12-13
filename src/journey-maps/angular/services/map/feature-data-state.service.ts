import { Injectable } from '@angular/core';

import { SbbFeatureData } from '../../journey-maps.interfaces';
import { SbbMarker } from '../../model/marker';

import { PoiDetails } from './util/poi-details';

@Injectable()
export class FeatureDataStateService {
  // make sure that at least one of these is 'undefined' at all times
  private _selectedSbbMarker: SbbMarker | undefined;
  private _selectedPoi: PoiDetails[] = [];
  private _selectedRoutes: SbbFeatureData[] = [];

  selectPoi(poi: PoiDetails) {
    this.deselectAllRoutes();
    this.deselectSbbMarker();
    this._selectedPoi.push(poi);
  }

  selectSbbMarker(sbbMarker: SbbMarker) {
    this.deselectAllPois();
    this.deselectAllRoutes();
    this._selectedSbbMarker = sbbMarker;
  }

  selectRoute(route: SbbFeatureData) {
    this.deselectAllPois();
    this.deselectSbbMarker();
    this._selectedRoutes.push(route);
  }

  deselectPoi(poi: SbbFeatureData) {
    this._selectedPoi = this._selectedPoi.filter((p) => p.id !== poi.id);
  }

  deselectRoute(route: SbbFeatureData) {
    this._selectedRoutes = this._selectedRoutes.filter((r) => r.id !== route.id);
  }

  deselectSbbMarker() {
    this._selectedSbbMarker = undefined;
  }

  deselectAllPois() {
    this._selectedPoi = [];
  }

  deselectAllRoutes() {
    this._selectedRoutes = [];
  }

  getSelectedSbbMarker() {
    return this._selectedSbbMarker;
  }

  getSelectedRoutes() {
    return this._selectedRoutes;
  }

  getSelectedPoi(): PoiDetails[] {
    return this._selectedPoi;
  }
}
