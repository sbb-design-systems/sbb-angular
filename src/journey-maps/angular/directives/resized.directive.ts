import {
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[sbbResized]',
})
export class ResizedDirective implements OnInit, OnDestroy {
  private _observer: ResizeObserver;

  @Output() sbbResized: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _element: ElementRef, private _zone: NgZone) {}

  ngOnInit(): void {
    this._observer = new ResizeObserver(() => this._zone.run(() => this.sbbResized.emit()));
    this._observer.observe(this._element.nativeElement);
  }

  ngOnDestroy(): void {
    this._observer?.disconnect();
  }
}
