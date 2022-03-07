import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Map as MaplibreMap} from 'maplibre-gl';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {LocaleService} from '../../services/locale.service';

@Component({
  selector: 'rokas-zoom-controls',
  templateUrl: './zoom-controls.component.html',
  styleUrls: ['./zoom-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomControlsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() map: MaplibreMap;
  @Input() showSmallButtons: boolean;

  private zoomChanged = new Subject<void>();
  private destroyed = new Subject<void>();
  isMinZoom: boolean;
  isMaxZoom: boolean;

  zoomInLabel: string;
  zoomOutLabel: string;

  constructor(private ref: ChangeDetectorRef,
              private i18n: LocaleService) {
  }

  ngOnInit(): void {
    this.zoomChanged
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.onZoomChanged();
      });

    this.zoomInLabel = `${this.i18n.getText('a4a.visualFunction')} ${this.i18n.getText('a4a.zoomIn')}`;
    this.zoomOutLabel = `${this.i18n.getText('a4a.visualFunction')} ${this.i18n.getText('a4a.zoomOut')}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue) {
      this.map.on('zoomend', () => {
        this.zoomChanged.next();
        // call outside component-zone, trigger detect changes manually
        // when using the mouse wheel to zoom, automatic change detection doesn't work
        this.ref.detectChanges();
      });

      if (!changes.map.previousValue) {
        // only do this the first time map is set
        this.setIsMinMaxZoom();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private onZoomChanged(): void {
    this.setIsMinMaxZoom();
  }

  private setIsMinMaxZoom(): void {
    this.isMinZoom = this.map.getZoom() === this.map.getMinZoom();
    this.isMaxZoom = this.map.getZoom() === this.map.getMaxZoom();
  }

  zoomIn(): void {
    this.map.zoomIn();
  }

  zoomOut(): void {
    this.map.zoomOut();
  }
}
