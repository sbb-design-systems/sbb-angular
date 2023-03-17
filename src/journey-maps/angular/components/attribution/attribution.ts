import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Map as MaplibreMap, MapDataEvent } from 'maplibre-gl';

@Component({
  selector: 'sbb-attribution',
  templateUrl: './attribution.html',
  styleUrls: ['./attribution.css'],
})
export class SbbAttribution implements OnChanges, OnDestroy {
  @Input() map: MaplibreMap | null;

  open: boolean;
  compact: boolean;
  attributions: string[] = [];

  private _listeners = new Map<string[], (event?: MapDataEvent) => void>();
  private readonly _compactBreakpoint = 640;
  private readonly _linkRegex = /<a .+?<\/a>/gi;

  constructor(private _cd: ChangeDetectorRef) {
    this._listeners.set(['resize'], this._setIsCompact.bind(this));
    this._listeners.set(['styledata', 'sourcedata', 'terrain'], this._updateAttribution.bind(this));
  }

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

    const attributions = new Set<string>();
    const sourceCaches = this.map?.style?.sourceCaches ?? {};

    for (const sourceCache of Object.values(sourceCaches)) {
      if (sourceCache.used || sourceCache.usedForTerrain) {
        const attribution = sourceCache.getSource().attribution;
        this._splitAttribution(attribution).forEach((attr) => attributions.add(attr));
      }
    }

    this.attributions = Array.from(attributions.values());
    this.attributions.sort(this._sortAttributionItems);
    this._cd.detectChanges();
  }

  private _splitAttribution(attribution?: string): string[] {
    if (!attribution?.length) {
      return [];
    }

    return attribution.match(this._linkRegex) ?? [attribution];
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
