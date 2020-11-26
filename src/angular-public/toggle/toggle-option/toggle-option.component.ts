import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Input,
  Optional,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SbbIconDirective } from '@sbb-esta/angular-core/icon-directive';
import { SbbRadioButton, SbbRadioGroup } from '@sbb-esta/angular-core/radio-button';

@Component({
  selector: 'sbb-toggle-option',
  templateUrl: './toggle-option.component.html',
  inputs: ['tabIndex'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbToggleOption),
      multi: true,
    },
    { provide: SbbRadioButton, useExisting: SbbToggleOption },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-toggle-option',
    '[class.sbb-toggle-option-selected]': 'this.checked',
    '[class.sbb-toggle-option-has-icon]': 'this.icon',
  },
})
export class SbbToggleOption extends SbbRadioButton {
  /** Label of a sbb-toggle-option. */
  @Input() label: string;
  /** Information text in a sbb-toggle-option. */
  @Input() infoText?: string;

  /** Identifier of sbb-toggle content. */
  get _contentId() {
    return `${this.inputId}-content`;
  }

  /** Refers to the icon optionally contained in a toggle option. */
  @Input()
  set icon(icon: TemplateRef<any> | null) {
    this._icon = icon;
  }
  get icon(): TemplateRef<any> | null {
    return this._contentIcon || this._icon;
  }
  private _icon: TemplateRef<any> | null = null;

  /**
   * icon placed in template
   * @docs-private
   */
  @ContentChild(SbbIconDirective, { read: TemplateRef })
  _contentIcon?: TemplateRef<any>;

  @ViewChild('contentTemplateRef') _contentTemplateRef: TemplateRef<HTMLElement>;

  constructor(
    @Optional() radioGroup: SbbRadioGroup,
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    focusMonitor: FocusMonitor,
    radioDispatcher: UniqueSelectionDispatcher
  ) {
    super(radioGroup, changeDetector, elementRef, focusMonitor, radioDispatcher);
  }
}
