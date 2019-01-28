import { Component, OnInit, ChangeDetectionStrategy, forwardRef, ViewEncapsulation, Input, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

let counter = 0;

@Component({
  selector: 'sbb-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToggleComponent implements OnInit {

  /**
     * Radio button panel identifier
     */
  @Input()
  @HostBinding('id')
  inputId = `sbb-toggle-${counter++}`;

  ngOnInit() {
  }

}
