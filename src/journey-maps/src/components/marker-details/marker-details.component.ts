import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {Marker} from '../../model/marker';
import {Map as MaplibreMap, Offset} from 'maplibre-gl';
import {MapMarkerService} from '../../services/map/map-marker.service';

@Component({
  selector: 'rokas-marker-details',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkerDetailsComponent implements OnChanges {

  @Input() selectedMarker: Marker;
  @Input() template?: TemplateRef<any>;
  @Input() popup: boolean;
  @Input() map: MaplibreMap;
  @Output() closeClicked = new EventEmitter<void>();

  shouldRender = false;
  popupOffset: Offset;

  private readonly defaultPopupOffset = {
    right: [-15, -15],
    left: [15, -15],
    bottom: [0, -70],
    'bottom-left': [0, -70],
    'bottom-right': [0, -70],
    top: [0, -10],
    'top-left': [0, -10],
    'top-right': [0, -10],
  };

  constructor(private mapMarkerService: MapMarkerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.shouldRender = !!this.selectedMarker && !!this.template;

    if (this.selectedMarker) {
      this.popupOffset = this.mapMarkerService.markerCategoryMappings.get(this.selectedMarker.category)
        ?.popupOffset ?? this.defaultPopupOffset;
    } else {
      this.popupOffset = {};
    }
  }

  @HostListener('document:keyup.escape')
  onEscapePressed(): void {
    if (this.selectedMarker) {
      this.closeClicked.next();
    }
  }
}
