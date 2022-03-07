import {Map as MaplibreMap} from 'maplibre-gl';
import {Subject, Subscription} from 'rxjs';
import {sampleTime} from 'rxjs/operators';

const CURSOR_STYLE_DELAY = 25;

export class MapCursorStyleEvent {

  private subject = new Subject<boolean>();
  private subscription: Subscription;
  private enterListener: () => void;
  private leaveListener: () => void;

  constructor(private mapInstance: MaplibreMap, private layerIds: string[]) {
    if (!this.layerIds.length) {
      return;
    }

    this.subscription = this.subject.pipe(sampleTime(CURSOR_STYLE_DELAY)).subscribe(hover => this.setCursorStyle(hover));

    this.enterListener = () => this.subject.next(true);
    this.leaveListener = () => this.subject.next(false);

    this.layerIds.forEach(layerId => {
      this.mapInstance.on('mouseenter', layerId, this.enterListener);
      this.mapInstance.on('mouseleave', layerId, this.leaveListener);
    });
  }

  complete(): void {
    this.subject.complete();
    this.subscription?.unsubscribe();

    this.layerIds.forEach(layerId => {
      this.mapInstance.off('mouseenter', layerId, this.enterListener);
      this.mapInstance.off('mouseleave', layerId, this.leaveListener);
    });
  }

  private setCursorStyle(hover: boolean): void {
    this.mapInstance.getCanvas().style.cursor = hover ? 'pointer' : '';
  }
}
