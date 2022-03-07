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
  TemplateRef,
  ViewChild
} from '@angular/core';
import {LngLatLike, Map as MaplibreMap, Offset, Popup, PopupOptions} from 'maplibre-gl';
import {LocaleService} from '../../services/locale.service';

@Component({
  selector: 'rokas-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupComponent implements OnChanges, OnDestroy {

  @Input() rendered: boolean;
  @Input() map: MaplibreMap;
  @Input() template: TemplateRef<any>;
  @Input() templateContext: any;
  @Input() position: LngLatLike;
  @Input() offset: Offset;
  @Input() additionalClassName?: string;
  @Input() withPaginator = false;
  @Output() closeClicked = new EventEmitter<void>();
  @Output() mouseEvent = new EventEmitter<'enter' | 'leave'>();

  private readonly options: PopupOptions = {
    closeOnClick: false,
    className: 'rokas',
  };

  private templateContextIndex = 0;
  private templateContextSize = 1;
  private popup: Popup;
  private popupContent: ElementRef<HTMLElement>;

  private mouseEnter = () => this.mouseEvent.next('enter');
  private mouseLeave = () => this.mouseEvent.next('leave');

  // The view child is initially undefined (because of the *ngif in the parent component).
  @ViewChild('popupContent') set content(content: ElementRef<HTMLElement>) {

    const firstChange = this.popupContent == null && content != null;
    this.popupContent = content;
    if (firstChange) {
      this.showPopup();
    }
  }

  constructor(
    private i18n: LocaleService,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.templateContext?.currentValue) {
      this.templateContextIndex = 0;
      this.templateContextSize = Array.isArray(this.templateContext) ? this.templateContext.length : 1;
    }

    // Not sure why this is needed here...
    // Otherwise this.popupContent is not correctly updated.
    this.cd.detectChanges();
    this.showPopup();

  }

  ngOnDestroy(): void {
    this.popup?.remove();
  }

  getTemplateContext(): any {
    const paginated = Array.isArray(this.templateContext) && this.withPaginator;
    const ctx = paginated ? this.templateContext[this.templateContextIndex] : this.templateContext;
    return {
      $implicit: ctx ?? {}
    };
  }

  private showPopup(): void {
    if (!this.templateContext || !this.popupContent) {
      this.popup?.remove();
      this.popup = undefined;
      return;
    }
    if (!this.popup) {
      this.initPopup();
    }

    this.popup.setOffset(this.offset);
    this.popup.setLngLat(this.position);
    this.registerEventListeners(this.popup.getElement());
  }

  private registerEventListeners(element: HTMLElement) {
    if (!element) {
      return;
    }

    element.removeEventListener('mouseenter', this.mouseEnter);
    element.removeEventListener('mouseleave', this.mouseLeave);
    element.addEventListener('mouseenter', this.mouseEnter);
    element.addEventListener('mouseleave', this.mouseLeave);
  }

  private initPopup(): void {
    const _options = this.options;
    if (this.additionalClassName) {
      _options.className = _options.className + ` ${this.additionalClassName}`;
    }

    this.popup = new Popup(_options)
      .setDOMContent(this.popupContent.nativeElement)
      .addTo(this.map);

    try {
      (this.popup as any)._closeButton.ariaLabel = this.i18n.getText('close');
    } catch (e) {
      console.warn('Cannot modify label of popup close button: ', e);
    }

    this.popup.on('close', () => {
      this.popup = undefined;
      this.closeClicked.emit();
    });
  }

  onIndexSelected(index: number) {
    this.templateContextIndex = index;
    this.cd.detectChanges();
  }
}
