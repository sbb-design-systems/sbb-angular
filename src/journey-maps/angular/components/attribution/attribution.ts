import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Map as MaplibreMap, MapDataEvent } from 'maplibre-gl';

@Component({
  selector: 'sbb-attribution',
  templateUrl: './attribution.html',
  styleUrls: ['./attribution.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbAttribution implements OnChanges, OnDestroy {
  @Input() map: MaplibreMap | null;

  open: boolean;
  compact: boolean;
  attributions: string[] = [];

  private _listeners = new Map<string[], (event?: MapDataEvent) => void>([
    [['resize'], this._setIsCompact.bind(this)],
    [['styledata', 'sourcedata', 'terrain'], this._updateAttribution.bind(this)],
  ]);

  private readonly _compactBreakpoint = 640;
  private readonly _linkRegex = /<a .+?<\/a>/gi;

  constructor(
    private _cd: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const prev = changes.map?.previousValue;
    const curr = changes.map?.currentValue;

    for (const [types, listener] of this._listeners) {
      for (const type of types) {
        prev?.off(type, listener);
        curr?.on(type, listener);
      }
      if (curr) {
        listener();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      for (const [types, listener] of this._listeners) {
        for (const type of types) {
          this.map!.off(type, listener);
        }
      }
    }
  }

  toggleOpen() {
    this.open = !this.open;
    this._cd.detectChanges();
  }

  _setIsCompact(): void {
    const current = this.map!.getCanvasContainer().offsetWidth <= this._compactBreakpoint;
    if (this.compact !== current) {
      this.compact = current;
      this._cd.detectChanges();
    }
  }

  _updateAttribution(event?: MapDataEvent): void {
    if (!this._shouldUpdateAttribution(event)) {
      return;
    }

    const sourceCaches = this.map?.style?.sourceCaches ?? {};

    this.attributions = Object.values(sourceCaches)
      .filter((sc) => sc.used || sc.usedForTerrain)
      .map((sc) => sc.getSource().attribution)
      .map((attr) => this._sanitizer.sanitize(SecurityContext.HTML, attr ?? null))
      .filter((attr) => !!attr)
      .flatMap((attr) => this._splitAttribution(attr!))
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort(this._sortAttributionItems);

    this._cd.detectChanges();
  }

  private _splitAttribution(attribution?: string): string[] {
    if (!attribution?.length) {
      return [];
    }

    return attribution.match(this._linkRegex) ?? [`<span>${attribution}</span>`];
  }

  private _shouldUpdateAttribution(event?: MapDataEvent): boolean {
    return (
      event == null ||
      event.sourceDataType === 'metadata' ||
      event.dataType === 'style' ||
      event.dataType === 'terrain'
    );
  }

  private _sortAttributionItems(a: string, b: string): number {
    const aIsSBB = a.toUpperCase().includes('SBB');
    const bIsSBB = b.toUpperCase().includes('SBB');

    if (aIsSBB && !bIsSBB) {
      return -1;
    } else if (!aIsSBB && bIsSBB) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  }
}
