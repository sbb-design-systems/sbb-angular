import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxBase, SbbCheckboxChange } from '@sbb-esta/angular-core/base';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

/**
 * Injection token used to provide the parent component to TagComponent.
 */
export const TAGS_CONTAINER = new InjectionToken<any>('SBB_TAG_CONTAINER');

export interface TagChange extends SbbCheckboxChange<TagComponent> {}

@Component({
  selector: 'sbb-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TagComponent extends CheckboxBase<TagChange> implements OnInit, OnDestroy {
  /** @docs-private  */
  @HostBinding('class.sbb-tag')
  sbbTagClass = true;

  /** @docs-private  */
  @HostBinding('class.sbb-tag-disabled')
  get sbbTagDisabledClass() {
    return this.disabled;
  }

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
  private _linkMode = false;

  /**
   * Label of the tag.
   */
  @Input()
  label: string;
  /**
   * Amount of result found.
   */
  @Input()
  get amount(): number {
    return this._amount;
  }
  set amount(value: number) {
    this._amount = coerceNumberProperty(value);
  }
  private _amount: number;

  /**
   * A subject on tag checking.
   */
  // TODO: Check usage and rename without $ for Angular 9.
  readonly tagChecking$ = new Subject<any>();

  /** Refers if a tag is active. */
  @HostBinding('class.sbb-tag-active')
  get active() {
    return this._active || (this.checked && !this.disabled);
  }
  set active(value: boolean) {
    this._active = value;
    this._changeDetectorRef.markForCheck();
  }
  private _active = false;

  constructor(
    @Optional() @Inject(TAGS_CONTAINER) private _tagsContainer: any,
    private _zone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    focusMonitor: FocusMonitor,
    elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string
  ) {
    super(changeDetectorRef, focusMonitor, elementRef, tabIndex, 'tag');

    this.change.subscribe((e: TagChange) => {
      this.tagChecking$.next(e.checked);
    });
    this._zone.onStable
      .pipe(first())
      .subscribe(() => this._zone.run(() => this.tagChecking$.next(this.checked)));
  }

  ngOnInit() {
    if (!this._tagsContainer) {
      this.linkMode = true;
    }
  }

  ngOnDestroy() {
    this.tagChecking$.complete();
  }
  // tslint:disable: member-ordering
  static ngAcceptInputType_amount: NumberInput;
  // tslint:enable: member-ordering
}
