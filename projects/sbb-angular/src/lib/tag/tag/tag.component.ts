import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  Input, ChangeDetectorRef, HostBinding, OnDestroy,
  NgZone,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxComponent } from '../../checkbox/checkbox/checkbox.component';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TagComponent extends CheckboxComponent implements OnChanges, OnDestroy {

  readonly stateChange$ = new Subject<void>();

  private _linkMode = true;
  get linkMode() {
    return this._linkMode;
  }
  set linkMode(value: boolean) {
    this._linkMode = value;
    this._changeDetector.detectChanges();
  }

  /**
   * Label of the tag.
   */
  @Input()
  label: string;

  @Input()
  amount: number;

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
  readonly tagChecking$ = new Subject<any>();
  @Input()
  get checked(): any {
    return this._checkedTag;
  }
  set checked(value: any) {
    this._checkedTag = value;
    this.tagChecking$.next(value);
    this._changeDetector.markForCheck();
  }

  @HostBinding('class.sbb-tag')
  sbbTagClass = true;

  private _active = false;
  @HostBinding('class.sbb-tag-active')
  get active() {
    return this._active || (this.checked && !this.disabled);
  }
  set active(value: boolean) {
    this._active = value;
    this._changeDetector.markForCheck();
  }

  constructor(private _changeDetector: ChangeDetectorRef, private zone: NgZone) {
    super(_changeDetector);

    this.zone.onStable.pipe(first()).subscribe(
      () => {
        this.zone.run(() => {
          this.tagChecking$.next(this.checked);
        });
      }
    );
  }

  ngOnChanges() {
    this.stateChange$.next();
  }

  ngOnDestroy() {
    this.tagChecking$.complete();
    this.stateChange$.complete();
  }

}
