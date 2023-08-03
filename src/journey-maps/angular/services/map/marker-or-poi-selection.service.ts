import { Injectable } from '@angular/core';
import { SbbMarker } from '@sbb-esta/journey-maps/angular';
import { PoiDetails } from '@sbb-esta/journey-maps/angular/services/map/util/poi-details';

@Injectable({
  providedIn: 'root',
})
export class MarkerOrPoiSelectionStateService {
  // make sure that at least one of these is 'undefined' at all times
  private _selectedSbbMarker: SbbMarker | undefined;
  private _selectedPoi: PoiDetails | undefined;

  getSelectedSbbMarker() {
    return this._selectedSbbMarker;
  }

  // getSelectedPoi() {
  //   return this._selectedPoi;
  // }

  selectSbbMarker(sbbMarker: SbbMarker) {
    this._selectedPoi = undefined;
    this._selectedSbbMarker = sbbMarker;
  }

  selectPoi(poiDetails: PoiDetails) {
    this._selectedSbbMarker = undefined;
    this._selectedPoi = poiDetails;
  }

  deselectSbbMarker() {
    this._selectedSbbMarker = undefined;
  }

  deselectPoi() {
    this._selectedPoi = undefined;
  }
}
