// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SbbDialog, SbbDialogClose, _SbbDialogTitleBase } from '@sbb-esta/angular/dialog';
import { SbbIcon } from '@sbb-esta/angular/icon';

import { SbbLightbox } from './lightbox';
import { SbbLightboxRef } from './lightbox-ref';

/** Counter used to generate unique IDs for dialog elements. */
let dialogElementUid = 0;

/**
 * Button that will close the current lightbox.
 */
@Directive({
  selector: '[sbb-lightbox-close], [sbbLightboxClose]',
  exportAs: 'sbbLightboxClose',
  host: {
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.type]': 'type',
  },
  standalone: true,
})
export class SbbLightboxClose extends SbbDialogClose implements OnInit, OnChanges {
  /** Aria label for the close button. */
  @Input('aria-label')
  override ariaLabel: string =
    $localize`:Aria label to close a dialog@@sbbLightboxCloseLightbox:Close lightbox`;

  /** Lightbox close input. */
  @Input('sbb-lightbox-close')
  get lightboxResult(): any {
    return this.dialogResult;
  }
  set lightboxResult(value: any) {
    this.dialogResult = value;
  }

  @Input('sbbLightboxClose') _sbbLightboxClose: any;

  constructor(
    // The lightbox title directive is always used in combination with a `SbbLightboxRef`.
    // tslint:disable-next-line: lightweight-tokens
    @Optional() lightboxRef: SbbLightboxRef<any>,
    elementRef: ElementRef<HTMLElement>,
    lightbox: SbbLightbox,
  ) {
    super(lightboxRef, elementRef, lightbox as unknown as SbbDialog);
  }

  override ngOnChanges(changes: SimpleChanges) {
    const proxiedChange = changes['_sbbLightboxClose'] || changes['_sbbLightboxCloseResult'];

    if (proxiedChange) {
      this.dialogResult = proxiedChange.currentValue;
    }
  }
}

/**
 * Title of a lightbox element. Stays fixed to the top of the lightbox when scrolling.
 */
@Component({
  selector: 'sbb-lightbox-title, [sbb-lightbox-title], [sbbLightboxTitle]',
  exportAs: 'sbbLightboxTitle',
  template: `
    <ng-content></ng-content>
    <button
      sbb-lightbox-close
      class="sbb-lightbox-title-close-button sbb-button-reset-frameless"
      [aria-label]="closeAriaLabel"
    >
      <sbb-icon svgIcon="circle-cross-small" class="sbb-icon-scaled"></sbb-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-lightbox-title',
    '[id]': 'id',
  },
  standalone: true,
  imports: [SbbLightboxClose, SbbIcon],
})
export class SbbLightboxTitle extends _SbbDialogTitleBase implements OnInit {
  /** Unique id for the lightbox title. If none is supplied, it will be auto-generated. */
  @Input() override id: string = `sbb-lightbox-title-${dialogElementUid++}`;

  @ViewChild(SbbLightboxClose, { static: true }) _lightBoxClose: SbbLightboxClose;

  /** Arial label for the close button. */
  @Input()
  override closeAriaLabel: string =
    $localize`:Aria label to close a dialog@@sbbLightboxCloseLightbox:Close lightbox`;

  constructor(
    // The lightbox title directive is always used in combination with a `SbbDialogRef`.
    // tslint:disable-next-line: lightweight-tokens
    @Optional() lightboxRef: SbbLightboxRef<any>,
    elementRef: ElementRef<HTMLElement>,
    lightbox: SbbLightbox,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    super(lightboxRef, elementRef, lightbox as unknown as SbbDialog, changeDetectorRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this._lightBoxClose._canCloseInterceptor = () => {
      if (!this._closeEnabled) {
        (this._dialogRef as SbbLightboxRef<any>)?.closeRequest.next();
        return false;
      }
      return true;
    };
  }
}

/**
 * Scrollable content container of a lightbox.
 */
@Directive({
  selector: `[sbb-lightbox-content], sbb-lightbox-content, [sbbLightboxContent]`,
  host: { class: 'sbb-lightbox-content sbb-scrollbar' },
  standalone: true,
})
export class SbbLightboxContent {}

/**
 * Container for the bottom action buttons in a lightbox.
 * Stays fixed to the bottom when scrolling.
 */
@Directive({
  selector: `[sbb-lightbox-actions], sbb-lightbox-actions, [sbbLightboxActions]`,
  host: { class: 'sbb-lightbox-actions' },
  standalone: true,
})
export class SbbLightboxActions {}
