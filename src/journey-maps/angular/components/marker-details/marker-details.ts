import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Position } from 'geojson';
import { LngLatLike, Map as MaplibreMap, Offset } from 'maplibre-gl';

import { SbbTemplateType } from '../../journey-maps.interfaces';
import { SbbMarker } from '../../model/marker';
import { SbbMapMarkerService } from '../../services/map/map-marker-service';
import { SbbDarkModeAware } from '../dark-mode-aware/dark-mode-aware';

@Component({
  selector: 'sbb-marker-details',
  templateUrl: './marker-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbMarkerDetails extends SbbDarkModeAware implements OnChanges {
  @Input() selectedMarker: SbbMarker | undefined;
  @Input() template?: SbbTemplateType;
  @Input() popup: boolean | undefined;
  @Input() map: MaplibreMap | null;
  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();

  shouldRender: boolean = false;
  popupOffset: Offset;

  private readonly _defaultPopupOffset = {
    right: [-15, -15],
    left: [15, -15],
    bottom: [0, -70],
    'bottom-left': [0, -70],
    'bottom-right': [0, -70],
    top: [0, -10],
    'top-left': [0, -10],
    'top-right': [0, -10],
  };

  constructor(private _mapMarkerService: SbbMapMarkerService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges | undefined): void {
    this.shouldRender = !!this.selectedMarker && !!this.template;

    if (this.selectedMarker) {
      this.popupOffset =
        this._mapMarkerService.markerCategoryMappings.get(this.selectedMarker.category)
          ?.popupOffset ?? this._defaultPopupOffset;
    } else {
      this.popupOffset = 0;
    }
  }

  @HostListener('document:keyup.escape')
  onEscapePressed(): void {
    if (this.selectedMarker) {
      this.closeClicked.next();
    }
  }

  getLngLatLike(pos: Position | undefined): LngLatLike {
    return pos as LngLatLike;
  }
}
