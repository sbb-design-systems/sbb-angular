import { AnimationEvent } from '@angular/animations';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SbbRadioGroup, SBB_RADIO_GROUP } from '@sbb-esta/angular/radio-button';
import { Subject } from 'rxjs';
import { startWith, take, takeUntil } from 'rxjs/operators';

import { sbbToggleAnimations } from './toggle-animations';
import { SbbToggleOption } from './toggle-option';

let nextId = 0;

@Component({
  selector: 'sbb-toggle',
  templateUrl: './toggle.html',
  styleUrls: ['./toggle.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbToggle),
      multi: true,
    },
    { provide: SbbRadioGroup, useExisting: SbbToggle },
    { provide: SBB_RADIO_GROUP, useExisting: SbbToggle },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-toggle',
    '[class.sbb-toggle-first-option-selected]': '_radios.first.checked',
    '[class.sbb-toggle-middle-option-selected]': '!_radios.first.checked && !_radios.last.checked',
    '[class.sbb-toggle-last-option-selected]': '_radios.last.checked',
    '[class.sbb-toggle-triple]': '_radios.length === 3',
    '[class.sbb-toggle-option-has-content]': '!!selected?._details',
  },
  animations: [sbbToggleAnimations.translateHeight],
})
export class SbbToggle
  extends SbbRadioGroup<SbbToggleOption>
  implements ControlValueAccessor, AfterContentInit, OnDestroy
{
  /** The element id for the selected option content. */
  readonly _contentId = `sbb-toggle-option-content-${nextId++}`;

  private _destroyed = new Subject<void>();

  @ViewChild('toggleOptionContentWrapper') _toggleOptionContentWrapper: ElementRef;
  _heightAnimationState: 'void' | 'initial' | 'fixed' | 'auto' = 'initial';
  _currentOptionContentWrapperHeight: number = 0;

  constructor(private _zone: NgZone, changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();
    // The specification states that if no previous selection has been defined
    // the first option should be selected.
    this._zone.onStable.pipe(take(1)).subscribe(() =>
      this._zone.run(() => {
        if (this._radios.toArray().every((r) => this.value !== r.value)) {
          this._radios.first._onInputChange();
        }
      })
    );

    this.change.pipe(startWith(null!), takeUntil(this._destroyed)).subscribe(() => {
      // Animate toggle height by using current height as start height of transition
      if (this._toggleOptionContentWrapper) {
        this._currentOptionContentWrapperHeight =
          this._toggleOptionContentWrapper.nativeElement.offsetHeight;
        this._heightAnimationState = 'auto';
      }
      Promise.resolve().then(() => {
        this._changeDetector.markForCheck();
      });
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  _onHeightAnimationDone(event: AnimationEvent) {
    if (event.toState === 'auto') {
      this._heightAnimationState = 'fixed';
    }
  }
}
