import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { LngLatLike, Map as MaplibreMap, Offset, Popup, PopupOptions } from 'maplibre-gl';

import { SbbTemplateType } from '../../journey-maps.interfaces';
import { SbbLocaleService } from '../../services/locale-service';

@Component({
  selector: 'sbb-popup',
  templateUrl: './popup.html',
  styleUrls: ['./popup.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SbbPopup implements OnChanges, OnDestroy {
  @Input() rendered: boolean;
  @Input() map: MaplibreMap | null;
  @Input() template: SbbTemplateType;
  @Input() templateContext: any;
  @Input() position: LngLatLike;
  @Input() offset: Offset;
  @Input() additionalClassName?: string;
  @Input() withPaginator: boolean = false;
  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseEvent: EventEmitter<'enter' | 'leave'> = new EventEmitter<'enter' | 'leave'>();

  private readonly _options: PopupOptions = {
    closeOnClick: false,
    className: 'rokas',
  };

  templateContextIndex: number = 0;
  templateContextSize: number = 1;
  private _popup: Popup | undefined;
  private _popupContent: ElementRef<HTMLElement>;

  private _mouseEnter = () => this.mouseEvent.next('enter');
  private _mouseLeave = () => this.mouseEvent.next('leave');

  // The view child is initially undefined (because of the *ngif in the parent component).
  @ViewChild('popupContent') set content(content: ElementRef<HTMLElement>) {
    const firstChange = this._popupContent == null && content != null;
    this._popupContent = content;
    if (firstChange) {
      this._showPopup();
    }
  }

  constructor(
    private _i18n: SbbLocaleService,
    private _cd: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.templateContext?.currentValue) {
      this.templateContextIndex = 0;
      this.templateContextSize = Array.isArray(this.templateContext)
        ? this.templateContext.length
        : 1;
    }

    // Not sure why this is needed here...
    // Otherwise this._popupContent is not correctly updated.
    this._cd.detectChanges();
    this._showPopup();
  }

  ngOnDestroy(): void {
    this._popup?.remove();
  }

  getTemplateContext(): any {
    const paginated = Array.isArray(this.templateContext) && this.withPaginator;
    const ctx = paginated ? this.templateContext[this.templateContextIndex] : this.templateContext;
    return {
      $implicit: ctx ?? {},
    };
  }

  showPaginator(): boolean {
    return this.withPaginator && this.templateContextSize > 1 && typeof this.template !== 'string';
  }

  private _showPopup(): void {
    if (!this.templateContext || !this._popupContent) {
      this._popup?.remove();
      this._popup = undefined;
      return;
    }
    if (!this._popup) {
      this._initPopup();
    }

    this._popup?.setOffset(this.offset);
    if (this.position) {
      this._popup?.setLngLat(this.position);
    }
    this._registerEventListeners(this._popup?.getElement());
  }

  private _registerEventListeners(element: HTMLElement | undefined) {
    if (!element) {
      return;
    }

    element.removeEventListener('mouseenter', this._mouseEnter);
    element.removeEventListener('mouseleave', this._mouseLeave);
    element.addEventListener('mouseenter', this._mouseEnter);
    element.addEventListener('mouseleave', this._mouseLeave);
  }

  private _initPopup(): void {
    const options = this._options;
    if (this.additionalClassName) {
      options.className = options.className + ` ${this.additionalClassName}`;
    }

    this._popup = new Popup(options)
      .setDOMContent(this._popupContent.nativeElement)
      .addTo(this.map!);

    try {
      (this._popup as any)._closeButton.ariaLabel = this._i18n.getText('close');
    } catch (e) {
      console.warn('Cannot modify label of _popup close button: ', e);
    }

    this._popup.on('close', () => {
      this._popup = undefined;
      this.closeClicked.emit();
    });
  }

  onIndexSelected(index: number) {
    this.templateContextIndex = index;
    this._cd.detectChanges();
  }
}
