import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SbbLocaleService } from '../../services/locale-service';

@Component({
  selector: 'sbb-zoom-controls',
  templateUrl: './zoom-controls.html',
  styleUrls: ['./zoom-controls.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SbbZoomControls implements OnInit, OnChanges, OnDestroy {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;
  @Input() isDarkMode: boolean;

  private _zoomChanged = new Subject<void>();
  private _destroyed = new Subject<void>();
  isMinZoom: boolean;
  isMaxZoom: boolean;

  zoomInLabel: string;
  zoomOutLabel: string;

  constructor(
    private _cd: ChangeDetectorRef,
    private _i18n: SbbLocaleService,
  ) {}

  ngOnInit(): void {
    this._zoomChanged.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._onZoomChanged();
    });

    this.zoomInLabel = `${this._i18n.getText('a4a.visualFunction')} ${this._i18n.getText(
      'a4a.zoomIn',
    )}`;
    this.zoomOutLabel = `${this._i18n.getText('a4a.visualFunction')} ${this._i18n.getText(
      'a4a.zoomOut',
    )}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue) {
      this.map?.on('zoomend', () => {
        this._zoomChanged.next();
        // call outside component-zone, trigger detect changes manually
        // when using the mouse wheel to zoom, automatic change detection doesn't work
        this._cd.detectChanges();
      });

      if (!changes.map.previousValue) {
        // only do this the first time map is set
        this._setIsMinMaxZoom();
      }
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private _onZoomChanged(): void {
    this._setIsMinMaxZoom();
  }

  private _setIsMinMaxZoom(): void {
    this.isMinZoom = this.map?.getZoom() === this.map?.getMinZoom();
    this.isMaxZoom = this.map?.getZoom() === this.map?.getMaxZoom();
  }

  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }
}
