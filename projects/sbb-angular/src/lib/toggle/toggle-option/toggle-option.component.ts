import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  HostBinding,
  Inject
} from '@angular/core';
import { Subject } from 'rxjs';
import { SBB_TOGGLE_COMPONENT, ToggleBase } from '../toggle-base';

let counter = 0;

@Component({
  selector: 'sbb-toggle-option',
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToggleOptionComponent implements OnInit {

  @Input()
  @HostBinding('id')
  inputId = `sbb-toggle-option-${counter++}`;

  get buttonId() {
    return `${this.inputId}-button`;
  }

  get contentId() {
    return `${this.inputId}-content`;
  }

  @HostBinding('class.sbb-toggle-option')
  toggleOptionClass = true;

  @Input()
  label: string;

  @Input()
  value: any;

  private _selected: boolean;
  @HostBinding('class.sbb-toggle-option-selected')
  get selected() {
    return this._selected;
  }
  set selected(value: boolean) {
    this._selected = value;
  }

  @Input()
  disabled = false;

  valueChange$ = new Subject<any>();

  constructor(
    @Inject(SBB_TOGGLE_COMPONENT) private _parent: ToggleBase,
    private _changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  selectOption() {
    this.selected = true;
    this.valueChange$.next(this.value);
    console.log(this._parent.toggleOptions);
  }

}
