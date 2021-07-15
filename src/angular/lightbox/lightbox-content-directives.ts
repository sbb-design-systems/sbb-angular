// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import {
  Component,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Optional,
} from '@angular/core';
import { SbbDialogClose, _closeDialogVia, _SbbDialogTitleBase } from '@sbb-esta/angular/dialog';

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
})
export class SbbLightboxClose extends SbbDialogClose implements OnInit, OnChanges {
  /** Screenreader label for the button. */
  @Input('aria-label') ariaLabel: string =
    typeof $localize === 'function'
      ? $localize`:Aria label to close a dialog@@sbbLightboxCloseLightbox:Close lightbox`
      : 'Close lightbox';

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
    lightbox: SbbLightbox
  ) {
    super(lightboxRef, elementRef, lightbox as any);
  }

  ngOnChanges(changes: SimpleChanges) {
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
      (click)="_handleCloseClick($event)"
      class="sbb-lightbox-title-close-button sbb-button-reset-frameless"
    >
      <sbb-icon svgIcon="kom:circle-cross-small" class="sbb-icon-scaled"></sbb-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-lightbox-title',
    '[id]': 'id',
  },
})
export class SbbLightboxTitle extends _SbbDialogTitleBase {
  /** Unique id for the lightbox title. If none is supplied, it will be auto-generated. */
  @Input() id: string = `sbb-lightbox-title-${dialogElementUid++}`;

  constructor(
    // The lightbox title directive is always used in combination with a `SbbDialogRef`.
    // tslint:disable-next-line: lightweight-tokens
    @Optional() lightboxRef: SbbLightboxRef<any>,
    elementRef: ElementRef<HTMLElement>,
    lightbox: SbbLightbox,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(lightboxRef, elementRef, lightbox as any, changeDetectorRef);
  }

  /** Called when the close button is clicked. */
  _handleCloseClick(event: MouseEvent) {
    if (!this._closeEnabled) {
      (this._dialogRef as SbbLightboxRef<any>)?.closeRequest.next();
      return;
    }

    // Determinate the focus origin using the click event, because using the FocusMonitor will
    // result in incorrect origins. Most of the time, close buttons will be auto focused in the
    // dialog, and therefore clicking the button won't result in a focus change. This means that
    // the FocusMonitor won't detect any origin change, and will always output `program`.
    _closeDialogVia(
      this._dialogRef,
      event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse'
    );
  }
}

/**
 * Scrollable content container of a lightbox.
 */
@Directive({
  selector: `[sbb-lightbox-content], sbb-lightbox-content, [sbbLightboxContent]`,
  host: { class: 'sbb-lightbox-content sbb-scrollbar' },
})
export class SbbLightboxContent {}

/**
 * Container for the bottom action buttons in a lightbox.
 * Stays fixed to the bottom when scrolling.
 */
@Directive({
  selector: `[sbb-lightbox-actions], sbb-lightbox-actions, [sbbLightboxActions]`,
  host: { class: 'sbb-lightbox-actions' },
})
export class SbbLightboxActions {}
