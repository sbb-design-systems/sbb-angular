import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import {
  SbbRadioGroup,
  SBB_RADIO_BUTTON,
  SBB_RADIO_GROUP,
  _SbbRadioButtonBase,
} from '@sbb-esta/angular/radio-button';

@Component({
  selector: 'sbb-radio-button-panel',
  templateUrl: './radio-button-panel.html',
  inputs: ['tabIndex'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbRadioButtonPanel',
  host: {
    class: 'sbb-radio-button-panel sbb-selection-panel-item sbb-radio-button sbb-selection-item',
    '[class.sbb-selection-checked]': 'checked',
    '[class.sbb-selection-disabled]': 'disabled',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SBB_RADIO_BUTTON, useExisting: SbbRadioButtonPanel }],
  standalone: true,
})
export class SbbRadioButtonPanel extends _SbbRadioButtonBase {
  constructor(
    @Optional() @Inject(SBB_RADIO_GROUP) radioGroup: SbbRadioGroup,
    elementRef: ElementRef,
    changeDetector: ChangeDetectorRef,
    focusMonitor: FocusMonitor,
    radioDispatcher: UniqueSelectionDispatcher,
    @Attribute('tabindex') tabIndex?: string,
  ) {
    super(radioGroup, elementRef, changeDetector, focusMonitor, radioDispatcher, tabIndex);
  }
}
