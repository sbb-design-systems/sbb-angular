// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { _IdGenerator } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SbbDialog, SbbDialogClose, _SbbDialogTitleBase } from '@sbb-esta/angular/dialog';
import { SbbIcon } from '@sbb-esta/angular/icon';

import { SbbLightbox } from './lightbox';
import { SbbLightboxRef } from './lightbox-ref';

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
  protected override _dialogRef: SbbLightboxRef<any> = inject<SbbLightboxRef<any>>(SbbLightboxRef, {
    optional: true,
  })!;
  protected override _dialog: SbbDialog = inject(SbbLightbox) as unknown as SbbDialog;

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
  imports: [SbbLightboxClose, SbbIcon],
})
export class SbbLightboxTitle extends _SbbDialogTitleBase implements OnInit {
  protected override _dialogRef: SbbLightboxRef<any> = inject<SbbLightboxRef<any>>(SbbLightboxRef, {
    optional: true,
  })!;
  protected override _dialog: SbbDialog = inject(SbbLightbox) as unknown as SbbDialog;

  /** Unique id for the lightbox title. If none is supplied, it will be auto-generated. */
  @Input() override id: string = inject(_IdGenerator).getId('sbb-lightbox-title-');

  @ViewChild(SbbLightboxClose, { static: true }) _lightBoxClose: SbbLightboxClose;

  /** Arial label for the close button. */
  @Input()
  override closeAriaLabel: string =
    $localize`:Aria label to close a dialog@@sbbLightboxCloseLightbox:Close lightbox`;

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
