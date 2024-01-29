import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { CdkPortal } from '@angular/cdk/portal';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import {
  SbbRadioButton,
  SBB_RADIO_BUTTON,
  SBB_RADIO_GROUP,
  _SbbRadioButtonBase,
} from '@sbb-esta/angular/radio-button';

import type { SbbToggle } from './toggle';
import {
  SbbToggleDetails,
  SbbToggleIcon,
  SbbToggleLabel,
  SbbToggleSubtitle,
} from './toggle-directives';

@Component({
  selector: 'sbb-toggle-option',
  templateUrl: './toggle-option.html',
  inputs: ['tabIndex'],
  providers: [
    { provide: SBB_RADIO_BUTTON, useExisting: SbbRadioButton },
    { provide: SbbRadioButton, useExisting: SbbToggleOption },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-toggle-option',
    '[class.sbb-toggle-option-selected]': 'checked',
    '[class.sbb-toggle-option-has-icon]': '_hasIcon()',
    // Needs to be removed since it causes some a11y issues (see angular/components#21266).
    '[attr.tabindex]': 'null',
    '[attr.id]': 'id',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
    // Note: under normal conditions focus shouldn't land on this element, however it may be
    // programmatically set, for example inside of a focus trap, in this case we want to forward
    // the focus to the native element.
    '(focus)': '_inputElement.nativeElement.focus()',
  },
  standalone: true,
  imports: [SbbIcon, CdkPortal],
})
export class SbbToggleOption extends _SbbRadioButtonBase {
  /** Label of a sbb-toggle-option. */
  @Input() label?: string;
  /** Additional information for this option. */
  @Input() subtitle?: string;

  /** The toggle content projection label. */
  @ContentChild(SbbToggleLabel) _labelNonStatic: SbbToggleLabel;
  @ContentChild(SbbToggleLabel, { static: true }) _labelStatic: SbbToggleLabel;
  get _label() {
    // TODO: we need this workaround in order to support both Ivy and ViewEngine.
    // We should clean this up once Ivy is the default renderer.
    return this._labelNonStatic || this._labelStatic;
  }

  /** The toggle content projection label. */
  @ContentChild(SbbToggleSubtitle) _subtitleNonStatic: SbbToggleSubtitle;
  @ContentChild(SbbToggleSubtitle, { static: true }) _subtitleStatic: SbbToggleSubtitle;
  get _subtitle() {
    return this._subtitleNonStatic || this._subtitleStatic;
  }

  /** The toggle content projection label. */
  @ContentChild(SbbToggleIcon) _iconNonStatic: SbbToggleIcon;
  @ContentChild(SbbToggleIcon, { static: true }) _iconStatic: SbbToggleIcon;
  get _icon() {
    return this._iconNonStatic || this._iconStatic;
  }

  /**
   * The indicator icon, which will be shown on the left-hand side of the toggle option.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="plus-small"
   */
  @Input() svgIcon: string;

  /** The toggle content projection label. */
  @ContentChild(SbbToggleDetails) _detailsNonStatic: SbbToggleDetails;
  @ContentChild(SbbToggleDetails, { static: true }) _detailsStatic: SbbToggleDetails;
  get _details() {
    return this._detailsNonStatic || this._detailsStatic;
  }

  @ViewChild(CdkPortal) _content: CdkPortal;

  constructor(
    @Inject(SBB_RADIO_GROUP) readonly toggle: SbbToggle,
    elementRef: ElementRef,
    changeDetector: ChangeDetectorRef,
    focusMonitor: FocusMonitor,
    radioDispatcher: UniqueSelectionDispatcher,
    @Attribute('tabindex') tabIndex?: string,
  ) {
    super(toggle, elementRef, changeDetector, focusMonitor, radioDispatcher, tabIndex);
  }

  /** Whether this toggle option has an icon. */
  _hasIcon() {
    return !!(this._icon || this.svgIcon);
  }
}
