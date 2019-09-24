import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonComponent } from '@sbb-esta/angular-public/radio-button';

let counter = 0;

@Component({
  selector: 'sbb-radio-button-panel',
  templateUrl: './radio-button-panel.component.html',
  styleUrls: ['./radio-button-panel.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonPanelComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RadioButtonPanelComponent extends RadioButtonComponent {
  /** Label of a radio button panel. */
  @Input()
  label: string;
  /** Subtitle of a radio button panel. */
  @Input()
  subtitle?: string;

  /**
   * Returns the subtitle of a radio button panel.
   * @deprecated Check .subtitle
   */
  get hasSubtitle() {
    return !!this.subtitle;
  }

  constructor(
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    focusMonitor: FocusMonitor,
    radioDispatcher: UniqueSelectionDispatcher
  ) {
    super(changeDetector, elementRef, focusMonitor, radioDispatcher);
    this.id = `sbb-radio-button-panel-${counter++}`;
    this.inputId = `${this.id}-input`;
  }
}
