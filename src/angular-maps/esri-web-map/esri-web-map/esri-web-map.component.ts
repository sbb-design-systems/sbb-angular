// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  SbbEsriTypesService,
  SbbGraphicService,
  SbbHitTestService,
} from '@sbb-esta/angular-maps/core';

import { SbbEsriExtent2D } from '../model/sbb-esri-extent-2d.model';

@Component({
  selector: 'sbb-esri-web-map',
  templateUrl: './esri-web-map.component.html',
  styleUrls: ['./esri-web-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbEsriWebMap implements OnInit {
  private _extent: SbbEsriExtent2D;
  /** The reference to the esri.MapView */
  mapView: __esri.MapView;

  /** The reference to the esri.WebMap */
  webMap: __esri.WebMap;

  /** This id references to a portal web-map item. It is used to display the map. */
  @Input() portalItemId: string;

  /** Updates coordinates (xmin, xmax, ymin & ymax) for the mapExtent.
   * If empty, portal default map extent will be used.
   * You need to add a wkid as well. (switzerland default is 2056). */
  @Input() set mapExtent(newExtent: SbbEsriExtent2D) {
    this._extent = newExtent;
    this._setMapExtent(newExtent);
  }

  /** Moves map to a specific point . */
  @Input() set goTo(point: __esri.Point | any) {
    if (point) {
      this.mapView.center = point;
      this._geometryUtilsService.addNewGraphicToMap(point, this.mapView);
    }
  }

  /** Event that is emitted when the map is clicked */
  @Output() mapClick: EventEmitter<{
    clickedPoint: __esri.Point;
    clickedGraphics: __esri.Graphic[];
  }> = new EventEmitter();

  /** Event that is emitted when the extent of the map has been changed. */
  @Output() extentChanged: EventEmitter<__esri.Extent> = new EventEmitter();

  /** Event that is emitted when the map is ready */
  @Output() mapReady: EventEmitter<__esri.MapView> = new EventEmitter();

  constructor(
    private _esri: SbbEsriTypesService,
    private _elementRef: ElementRef,
    private _geometryUtilsService: SbbGraphicService,
    private _hitTestService: SbbHitTestService
  ) {}

  ngOnInit() {
    this._esri.load().then(() => {
      this.webMap = new this._esri.WebMap({
        portalItem: {
          id: this.portalItemId,
        },
      });

      this.mapView = new this._esri.MapView({
        map: this.webMap,
        container: this._elementRef.nativeElement,
      });

      this._setMapExtent(this._extent);
      this._registerEvents();

      this.mapView.when(() => this.mapReady.emit(this.mapView));
    });
  }

  private _setMapExtent(newExtent: SbbEsriExtent2D) {
    if (this.mapView && newExtent) {
      this.mapView.extent = new this._esri.Extent({
        xmin: newExtent.xmin,
        xmax: newExtent.xmax,
        ymin: newExtent.ymin,
        ymax: newExtent.ymax,
        spatialReference: newExtent.spatialReference,
      });
    }
  }

  private _registerEvents() {
    this.mapView.on('click', (e) => this._emitMouseClick(e));
    this.mapView.watch('extent', (extent) => this._emitExtentChange(extent));
  }

  private _emitMouseClick(e: __esri.MapViewClickEvent) {
    this._hitTestService
      .esriHitTest(this.mapView, e)
      .then((hitTestGraphics) =>
        this.mapClick.emit({ clickedPoint: e.mapPoint, clickedGraphics: hitTestGraphics })
      );
  }

  private _emitExtentChange(extent: __esri.Extent) {
    this.extentChanged.emit(extent);
  }
}
