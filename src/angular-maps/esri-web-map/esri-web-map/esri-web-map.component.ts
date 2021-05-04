import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import Extent from '@arcgis/core/geometry/Extent';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import { SbbGraphicService, SbbHitTestService } from '@sbb-esta/angular-maps/core';
import MapViewClickEvent = __esri.MapViewClickEvent;
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SbbEsriExtent2D } from '../model/sbb-esri-extent-2d.model';

@Component({
  selector: 'sbb-esri-web-map',
  templateUrl: './esri-web-map.component.html',
  styleUrls: ['./esri-web-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbEsriWebMap implements OnInit, OnDestroy {
  private readonly _setMapExtentSubject = new ReplaySubject<SbbEsriExtent2D>(1);
  private readonly _goToSubject = new ReplaySubject<Point | any>(1);
  private readonly _ngUnsubscribe = new Subject<void>();

  /** The reference to the esri.MapView */
  mapView: MapView;

  /** The reference to the esri.WebMap */
  webMap: WebMap;

  /** This id references to a portal web-map item. It is used to display the map. */
  @Input() portalItemId: string;

  /** Updates coordinates (xmin, xmax, ymin & ymax) for the mapExtent.
   * If empty, portal default map extent will be used.
   * You need to add a wkid as well. (switzerland default is 2056). */
  @Input() set mapExtent(newExtent: SbbEsriExtent2D) {
    this._setMapExtentSubject.next(newExtent);
  }

  /** Moves map to a specific point . */
  @Input() set goTo(point: Point | any) {
    this._goToSubject.next(point);
  }

  /** Event that is emitted when the map is clicked */
  @Output() mapClick: EventEmitter<{
    clickedPoint: Point;
    clickedGraphics: Graphic[];
  }> = new EventEmitter();

  /** Event that is emitted when the extent of the map has been changed. */
  @Output() extentChanged: EventEmitter<Extent> = new EventEmitter();

  /** Event that is emitted when the map is ready */
  @Output() mapReady: EventEmitter<MapView> = new EventEmitter();

  constructor(
    private _elementRef: ElementRef,
    private _geometryUtilsService: SbbGraphicService,
    private _hitTestService: SbbHitTestService
  ) {}

  ngOnInit() {
    this.webMap = new WebMap({
      portalItem: {
        id: this.portalItemId,
      },
    });

    this.mapView = new MapView({
      map: this.webMap,
      container: this._elementRef.nativeElement,
    });

    this._subscribeToInputChanges();
    this._registerEvents();
    this.mapView.when(() => this.mapReady.emit(this.mapView));
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
    this._destroyMapView();
  }

  private _subscribeToInputChanges() {
    this._setMapExtentSubject
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((newExtent: SbbEsriExtent2D) => {
        this._setMapExtent(newExtent);
      });

    this._goToSubject.pipe(takeUntil(this._ngUnsubscribe)).subscribe((point: Point | any) => {
      this._setMapCenter(point);
    });
  }

  private _setMapExtent(newExtent: SbbEsriExtent2D) {
    if (this.mapView && newExtent) {
      this.mapView.extent = new Extent({
        xmin: newExtent.xmin,
        xmax: newExtent.xmax,
        ymin: newExtent.ymin,
        ymax: newExtent.ymax,
        spatialReference: newExtent.spatialReference,
      });
    }
  }

  private _setMapCenter(point: Point | any) {
    if (this.mapView && point) {
      this.mapView.center = point;
      this._geometryUtilsService.addNewGraphicToMap(point, this.mapView);
    }
  }

  private _registerEvents() {
    this.mapView.on('click', (e) => this._emitMouseClick(e));
    this.mapView.watch('extent', (extent) => this._emitExtentChange(extent));
  }

  private _emitMouseClick(e: MapViewClickEvent) {
    this._hitTestService
      .esriHitTest(this.mapView, e)
      .then((hitTestGraphics) =>
        this.mapClick.emit({ clickedPoint: e.mapPoint, clickedGraphics: hitTestGraphics })
      );
  }

  private _emitExtentChange(extent: Extent) {
    this.extentChanged.emit(extent);
  }

  private _destroyMapView() {
    // it was in 4.18, but just to be sure it's cleaned-up: https://community.esri.com/t5/arcgis-api-for-javascript/4-17-memory-issue-angular/td-p/140389
    const mapView = this.mapView;
    const map = this.webMap;
    if (mapView) {
      mapView?.destroy();
    }

    if (map) {
      map.removeAll();
      map.destroy();
    }
  }
}
