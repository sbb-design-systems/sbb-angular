import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Optional,
} from '@angular/core';

import { LightboxRef } from './lightbox-ref';
import { Lightbox } from './lightbox.service';

/** Counter used to generate unique IDs for lightbox elements. */
let lightboxElementUid = 0;

/**
 * Button that will close the current lightbox.
 */
@Directive({
  selector: `button[sbbLightboxClose]`,
  exportAs: 'sbbLightboxClose',
  host: {
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.type]': 'type',
  },
})
export class LightboxCloseDirective implements OnInit {
  /** Screenreader label for the button. */
  @Input('aria-label') ariaLabel: string = 'Close lightbox';

  /** @deprecated internal detail */
  btnType = 'button';

  /** Default to "button" to prevents accidental form submits. */
  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  /** lightbox close input. Renamed to be more meaningful **/
  @Input('sbbLightboxClose') lightboxResult: any;

  constructor(
    @Optional() public lightboxRef: LightboxRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _lightbox: Lightbox
  ) {}

  ngOnInit() {
    if (!this.lightboxRef) {
      // When this directive is included in a lightbox via TemplateRef (rather than being
      // in a Component), the lightboxRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the lightboxRef by
      // ID. This must occur in `onInit`, as the ID binding for the lightbox container won't
      // be resolved at constructor time.
      this.lightboxRef = getClosestLightbox(this._elementRef, this._lightbox.openLightboxes)!;
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
    <button type="button" sbbLightboxClose *ngIf="!isCloseDisabled" class="sbb-lightbox-close-btn">
      <sbb-icon svgIcon="kom:cross-small"></sbb-icon>
    </button>
    <button
      *ngIf="isCloseDisabled"
      type="button"
      (click)="emitManualCloseAction()"
      class="sbb-lightbox-close-btn"
    >
      <sbb-icon svgIcon="kom:cross-small"></sbb-icon>
    </button>
  `,
  exportAs: 'sbbLightboxHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-lightbox-header',
  },
})
export class LightboxHeaderComponent implements OnInit {
  /** Disables lightbox header when lightbox is closed.  */
  isCloseDisabled: boolean;
  /** @deprecated internal detail */
  lightboxHeaderClass = true;

  constructor(
    @Optional() private _lightboxRef: LightboxRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _lightbox: Lightbox,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this._lightboxRef) {
      this._lightboxRef = getClosestLightbox(this._elementRef, this._lightbox.openLightboxes)!;
    }

    if (this._lightboxRef) {
      Promise.resolve().then(() => {
        const container = this._lightboxRef.containerInstance;

        if (container) {
          container.hasHeader = true;
          this.isCloseDisabled = !!container.config.disableClose;
          this._changeDetectorRef.markForCheck();
        }
      });
    }
  }

  emitManualCloseAction() {
    if (this._lightboxRef) {
      this._lightboxRef.manualCloseAction.next();
    }
  }
}

@Directive({
  selector: `[sbbLightboxTitle]`,
  host: {
    class: 'sbb-lightbox-title',
    '[id]': 'id',
  },
})
export class LightboxTitleDirective implements OnInit {
  /** Identifier of lightbox title. */
  @Input() id = `sbb-lightbox-title-${lightboxElementUid++}`;
  /** @deprecated internal detail */
  lightboxTitleClass = true;

  constructor(
    @Optional() private _lightboxRef: LightboxRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _lightbox: Lightbox
  ) {}

  ngOnInit() {
    if (!this._lightboxRef) {
      this._lightboxRef = getClosestLightbox(this._elementRef, this._lightbox.openLightboxes)!;
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
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-lightbox-content sbb-scrollbar',
  },
})
export class LightboxContentComponent {
  /** @deprecated internal detail */
  lightboxContentClass = true;
}

/**
 * Container for the bottom action buttons in a lightbox.
 * Stays fixed to the bottom when scrolling.
 */
@Component({
  selector: `sbb-lightbox-footer, [sbbLightboxFooter]`,
  template: '<ng-content select="button"></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-lightbox-footer',
    '[class.sbb-lightbox-footer-align-start]': 'this.alignment === "left"',
    '[class.sbb-lightbox-footer-align-center]': 'this.alignment === "center"',
    '[class.sbb-lightbox-footer-align-end]': 'this.alignment === "right"',
  },
})
export class LightboxFooterComponent implements OnInit {
  /** Types of alignment. */
  @Input() alignment: 'left' | 'center' | 'right' = 'left';
  /** @deprecated internal detail */
  lightboxFooterClass = true;
  /** @deprecated internal detail */
  get alignmentStartClass() {
    return !this.alignmentCenterClass && !this.alignmentEndClass;
  }
  /** @deprecated internal detail */
  get alignmentCenterClass() {
    return this.alignment === 'center';
  }
  /** @deprecated internal detail */
  get alignmentEndClass() {
    return this.alignment === 'right';
  }

  constructor(
    @Optional() private _lightboxRef: LightboxRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _lightbox: Lightbox
  ) {}

  ngOnInit() {
    if (!this._lightboxRef) {
      this._lightboxRef = getClosestLightbox(this._elementRef, this._lightbox.openLightboxes)!;
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

  // tslint:disable: member-ordering
  static ngAcceptInputType_alignment: 'left' | 'center' | 'right' | string | null | undefined;
  // tslint:enable: member-ordering
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

  return parent ? openLightboxes.find((lightbox) => lightbox.id === parent!.id) : null;
}
