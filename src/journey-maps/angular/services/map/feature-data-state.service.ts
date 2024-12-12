import { Injectable } from '@angular/core';
import { SbbFeatureData } from '@sbb-esta/journey-maps/angular';

import { SbbMarker } from '../../model/marker';

import { PoiDetails } from './util/poi-details';

@Injectable()
export class FeatureDataStateService {
  // make sure that at least one of these is 'undefined' at all times
  private _selectedSbbMarker: SbbMarker | undefined;
  private _selectedPoi: PoiDetails[] = [];
  private _selectedRoutes: SbbFeatureData[] = [];

  addSelectedPoi(poi: PoiDetails) {
    this.deselectRoutes();
    this.deselectSbbMarker();
    this._selectedPoi.push(poi);
  }

  removeSelectedPoi(poi: SbbFeatureData) {
    this._selectedPoi = this._selectedPoi.filter((p) => p.id !== poi.id);
  }

  addSelectedRoute(route: SbbFeatureData) {
    this.deselectPois();
    this.deselectSbbMarker();
    this._selectedRoutes.push(route);
  }

  removeSelectedRoute(route: SbbFeatureData) {
    this._selectedRoutes = this._selectedRoutes.filter((r) => r.id !== route.id);
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

  selectSbbMarker(sbbMarker: SbbMarker) {
    this.deselectPois();
    this.deselectRoutes();
    this._selectedSbbMarker = sbbMarker;
  }

  deselectSbbMarker() {
    this._selectedSbbMarker = undefined;
  }

  deselectPois() {
    this._selectedPoi = [];
  }

  deselectRoutes() {
    this._selectedRoutes = [];
  }
}
