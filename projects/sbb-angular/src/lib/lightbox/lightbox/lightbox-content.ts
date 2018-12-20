import {
  Directive,
  Input,
  OnInit,
  Optional,
  ElementRef,
  HostBinding,
  HostListener,
  Component,
  ChangeDetectionStrategy
} from '@angular/core';

import { Lightbox } from './lightbox.service';
import { LightboxRef } from './lightbox-ref';

/** Counter used to generate unique IDs for lightbox elements. */
let lightboxElementUid = 0;

/**
 * Button that will close the current lightbox.
 */
@Directive({
  selector: `button[sbbLightboxClose]`,
  exportAs: 'sbbLightboxClose'
})
export class LightboxCloseDirective implements OnInit {

  /** Screenreader label for the button. */
  @HostBinding('attr.aria-label')
  ariaLabel = 'Close lightbox';

  /**  Prevents accidental form submits. **/
  @HostBinding('attr.type')
  btnType = 'button';

  /** lightbox close input. Renamed to be more meaningful **/
  // tslint:disable-next-line:no-input-rename
  @Input('sbbLightboxClose')
  lightboxResult: any;

  constructor(
    @Optional() public lightboxRef: LightboxRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _lightbox: Lightbox) { }

  ngOnInit() {
    if (!this.lightboxRef) {
      // When this directive is included in a lightbox via TemplateRef (rather than being
      // in a Component), the lightboxRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the lightboxRef by
      // ID. This must occur in `onInit`, as the ID binding for the lightbox container won't
      // be resolved at constructor time.
      this.lightboxRef = getClosestLightbox(this._elementRef, this._lightbox.openLightboxes);
    }
  }

  @HostListener('click')
  onCloseClick() {
    this.lightboxRef.close(this.lightboxResult);
  }
}

/**
 * Header of a lightbox element. Stays fixed to the top of the lightbox when scrolling.
 */
@Component({
  selector: 'sbb-lightbox-header, [sbbLightboxHeader]',
  template: `
    <ng-content></ng-content>
    <button sbbLightboxClose class="sbb-lightbox-close-btn">
      <sbb-icon-close></sbb-icon-close>
    </button>
  `,
  exportAs: 'sbbLightboxHeader',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxHeaderComponent implements OnInit {
  @HostBinding('class.sbb-lightbox-header')
  lightboxHeaderClass = true;

  constructor(
    @Optional() private _lightboxRef: LightboxRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _lightbox: Lightbox
  ) { }

  ngOnInit() {
    if (!this._lightboxRef) {
      this._lightboxRef = getClosestLightbox(this._elementRef, this._lightbox.openLightboxes);
    }

    if (this._lightboxRef) {
      Promise.resolve().then(() => {
        const container = this._lightboxRef.containerInstance;

        if (container) {
          container.hasHeader = true;
        }
      });
    }
  }
}


@Directive({
  selector: `[sbbLightboxTitle]`
})
export class LightboxTitleDirective implements OnInit {
  @Input()
  @HostBinding('attr.id')
  id = `sbb-lightbox-title-${lightboxElementUid++}`;

  @HostBinding('class.sbb-lightbox-title')
  lightboxTitleClass = true;

  constructor(
    @Optional() private _lightboxRef: LightboxRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _lightbox: Lightbox) { }

  ngOnInit() {
    if (!this._lightboxRef) {
      this._lightboxRef = getClosestLightbox(this._elementRef, this._lightbox.openLightboxes);
    }

    if (this._lightboxRef) {
      Promise.resolve().then(() => {
        const container = this._lightboxRef.containerInstance;

        if (container && !container.ariaLabelledBy) {
          container.ariaLabelledBy = this.id;
        }
      });
    }
  }
}


/**
 * Scrollable content container of a lightbox.
 */
@Component({
  selector: `sbb-lightbox-content, [sbbLightboxContent]`,
  template: `
    <perfect-scrollbar>
      <ng-content></ng-content>
    </perfect-scrollbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxContentComponent {
  @HostBinding('class.sbb-lightbox-content')
  lightboxContentClass = true;
}


/**
 * Container for the bottom action buttons in a lightbox.
 * Stays fixed to the bottom when scrolling.
 */
@Component({
  selector: `sbb-lightbox-footer, [sbbLightboxFooter]`,
  template: `
    <perfect-scrollbar>
      <ng-content select="button"></ng-content>
    </perfect-scrollbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightboxFooterComponent implements OnInit {
  @HostBinding('class.sbb-lightbox-footer')
  lightboxFooterClass = true;

  @Input() alignment: 'left' | 'center' | 'right' = 'left';

  @HostBinding('class.sbb-lightbox-footer-align-start')
  get alignmentStartClass() {
    return this.alignment === 'left';
  }

  @HostBinding('class.sbb-lightbox-footer-align-center')
  get alignmentCenterClass() {
    return this.alignment === 'center';
  }

  @HostBinding('class.sbb-lightbox-footer-align-end')
  get alignmentEndClass() {
    return this.alignment === 'right';
  }

  constructor(
    @Optional() private _lightboxRef: LightboxRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _lightbox: Lightbox
  ) { }

  ngOnInit() {
    if (!this._lightboxRef) {
      this._lightboxRef = getClosestLightbox(this._elementRef, this._lightbox.openLightboxes);
    }

    if (this._lightboxRef) {
      Promise.resolve().then(() => {
        const container = this._lightboxRef.containerInstance;

        if (container) {
          container.hasFooter = true;
        }
      });
    }
  }
}


/**
 * Finds the closest LightboxRef to an element by looking at the DOM.
 * @param element Element relative to which to look for a lightbox.
 * @param openLightboxes References to the currently-open lightboxes.
 */
function getClosestLightbox(element: ElementRef<HTMLElement>, openLightboxes: LightboxRef<any>[]) {
  let parent: HTMLElement | null = element.nativeElement.parentElement;

  while (parent && !parent.classList.contains('sbb-lightbox-container')) {
    parent = parent.parentElement;
  }

  return parent ? openLightboxes.find(lightbox => lightbox.id === parent.id) : null;
}
