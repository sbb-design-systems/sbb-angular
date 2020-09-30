import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SbbCheckboxBase, SbbCheckboxChange } from '@sbb-esta/angular-core/base/checkbox';

export interface SbbCheckboxPanelChange extends SbbCheckboxChange<SbbCheckboxPanel> {}

@Component({
  selector: 'sbb-checkbox-panel',
  templateUrl: './checkbox-panel.component.html',
  styleUrls: ['./checkbox-panel.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbCheckboxPanel),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbCheckboxPanel extends SbbCheckboxBase<SbbCheckboxPanelChange> {
  /**
   * Label of a multiple checkbox panel.
   */
  @Input()
  label: string;
  /**
   * Subtitle of a multiple checkbox panel.
   */
  @Input()
  subtitle?: string;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    focusMonitor: FocusMonitor,
    elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string
  ) {
    super(changeDetectorRef, focusMonitor, elementRef, tabIndex, 'checkbox-panel');
  }
}
