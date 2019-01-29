import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'sbb-toggle-option',
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToggleOptionComponent implements OnInit {

  @Input()
  label: string;

  @Input()
  value: any;

  valueChange = new Subject<any>();

  constructor(private _changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  selectOption() {
    this.valueChange.next(this.value);
  }

}
