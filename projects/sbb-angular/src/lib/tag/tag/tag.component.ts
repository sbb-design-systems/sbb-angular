import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  Input, ChangeDetectorRef, HostBinding, OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxComponent } from '../../checkbox/checkbox/checkbox.component';
import { Subject } from 'rxjs';

let counter = 0;

@Component({
  selector: 'sbb-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent extends CheckboxComponent implements OnDestroy {

  private _linkMode = true;
  get linkMode() {
    return this._linkMode;
  }
  set linkMode(value: boolean) {
    this._linkMode = value;
    this._changeDetector.detectChanges();
  }

  readonly tagChecking$ = new Subject<any>();

  /**
   * Label of the tag.
   */
  @Input()
  label: string;

  @Input()
  amount = 0;

  private _inputId: string;
  // tslint:disable-next-line:no-input-rename
  @Input('id')
  get inputId(): string {
    return this._inputId;
  }
  set inputId(value: string) {
    this._inputId = value ? value : `sbb-tag-${counter++}`;
  }

  private _checkedTag = false;
  @Input()
  get checked(): any {
    return this._checkedTag;
  }
  set checked(value: any) {
    this._checkedTag = value;
    this.tagChecking$.next(value);
    this._changeDetector.markForCheck();
  }

  private _active = true;

  @HostBinding('class.sbb-tag-active')
  get active() {
    return this._active && (this.checked && !this.disabled);
  }
  set active(value: boolean) {
    this._active = value;
  }

  constructor(private _changeDetector: ChangeDetectorRef) {
    super(_changeDetector);
  }

  ngOnDestroy() {
    this.tagChecking$.complete();
  }

}
