import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  Input, ChangeDetectorRef, HostBinding, OnDestroy,
  NgZone,
  OnChanges,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Optional,
  OnInit,
  InjectionToken,
  Inject
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxComponent } from '../../checkbox/checkbox/checkbox.component';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { TagChange } from '../tag.model';

let counter = 0;

/**
 * Injection token used to provide the parent component to TagComponent.
 */
export const TAGS_CONTAINER = new InjectionToken<any>('SBB_TAG_CONTAINER');

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
export class TagComponent extends CheckboxComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * A subject on a state change of a tag.
   */
  readonly stateChange$ = new Subject<void>();
  /**
   * Event generated on tag change.
   */
  @Output() readonly tagChange = new EventEmitter<TagChange>();

  private _linkMode = false;
  /**
   * Link mode of a tag.
   */
  get linkMode() {
    return this._linkMode;
  }
  set linkMode(value: boolean) {
    this._linkMode = value;
    this.active = value;
  }

  /**
   * Label of the tag.
   */
  @Input()
  label: string;
  /**
   * Amount of result found.
   */
  @Input()
  amount: number;

  private _inputId: string;
  /**
   * Identifier of a tag.
   */
  @Input('id')
  get inputId(): string {
    return this._inputId;
  }
  set inputId(value: string) {
    this._inputId = value ? value : `sbb-tag-${counter++}`;
  }

  private _checkedTag = false;
  /**
   * A subject on tag checking.
   */
  readonly tagChecking$ = new Subject<any>();
  /**
   * Refers if a tag is checked.
   */
  @Input()
  get checked(): any {
    return this._checkedTag;
  }
  set checked(value: any) {
    this._checkedTag = value;
    this.tagChecking$.next(value);
    this.tagChange.emit(new TagChange(this, value));
    this._changeDetector.markForCheck();
  }
  /**
   * Css class of a tag.
   */
  @HostBinding('class.sbb-tag')
  sbbTagClass = true;

  private _active = false;
  /**
   * Refers if a tag is active.
   */
  @HostBinding('class.sbb-tag-active')
  get active() {
    return this._active || (this.checked && !this.disabled);
  }
  set active(value: boolean) {
    this._active = value;
    this._changeDetector.markForCheck();
  }

  constructor(
    private _changeDetector: ChangeDetectorRef,
    @Optional() @Inject(TAGS_CONTAINER) private _tagsContainer,
    private zone: NgZone) {
    super(_changeDetector);

    this.zone.onStable.pipe(first()).subscribe(
      () => this.zone.run(() => this.tagChecking$.next(this.checked))
    );
  }

  ngOnInit() {
    if(!this._tagsContainer) {
      this.linkMode = true;
    }
  }

  ngOnChanges() {
    this.stateChange$.next();
  }

  ngOnDestroy() {
    this.tagChecking$.complete();
    this.stateChange$.complete();
  }
  /**
   * Set a tag to checked status.
   * @param checked Value of tag checked.
   */
  setTagChecked(checked: boolean) {
    this.checked = checked;
    this.onChange(checked);
    this.onTouched();
    this.writeValue(checked);
  }

}
