import { AnimationEvent } from '@angular/animations';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, startWith } from 'rxjs/operators';

import { sbbTabsAnimations } from './tabs-animations';

/**
 * These position states are used internally as animation states for the tab body.
 */
export type SbbTabBodyPositionState = 'hidden' | 'show';

/**
 * The portal host directive for the contents of the tab.
 * @docs-private
 */
@Directive({
  selector: '[sbbTabBodyHost]',
})
export class SbbTabBodyPortal extends CdkPortalOutlet implements OnInit, OnDestroy {
  /** Subscription to events for when the tab body begins centering. */
  private _centeringSub = Subscription.EMPTY;
  /** Subscription to events for when the tab body finishes leaving from center position. */
  private _leavingSub = Subscription.EMPTY;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    @Inject(forwardRef(() => SbbTabBody)) private _host: SbbTabBody,
    // tslint:disable-next-line:naming-convention
    @Inject(DOCUMENT) _document: any
  ) {
    super(componentFactoryResolver, viewContainerRef, _document);
  }

  /** Set initial visibility or set up subscription for changing visibility. */
  override ngOnInit(): void {
    super.ngOnInit();

    this._centeringSub = this._host._beforeCentering
      .pipe(startWith(this._host._isCenterPosition(this._host._position)))
      .subscribe((isCentering: boolean) => {
        if (isCentering && !this.hasAttached()) {
          this.attach(this._host._content);
        }
      });

    this._leavingSub = this._host._afterLeavingCenter.subscribe(() => {
      if (!this._host.preserveContent) {
        this.detach();
      }
    });
  }

  /** Clean up centering subscription. */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._centeringSub.unsubscribe();
    this._leavingSub.unsubscribe();
  }
}

/**
 * Base class with all of the `SbbTabBody` functionality.
 * @docs-private
 */
@Directive()
// tslint:disable-next-line:class-name naming-convention
export abstract class _SbbTabBodyBase implements OnDestroy {
  /** Current position of the tab-body in the tab-group. Zero means that the tab is visible. */
  private _positionIndex: number;

  /** Subscription to the directionality change observable. */
  private _dirChangeSubscription = Subscription.EMPTY;

  /** Tab body position state. Used by the animation trigger for the current state. */
  _position: SbbTabBodyPositionState;

  /** Emits when an animation on the tab is complete. */
  readonly _translateTabComplete = new Subject<AnimationEvent>();

  /** Event emitted when the tab begins to animate towards the center as the active tab. */
  @Output() readonly _onCentering: EventEmitter<number> = new EventEmitter<number>();

  /** Event emitted before the centering of the tab begins. */
  @Output() readonly _beforeCentering: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Event emitted before the centering of the tab begins. */
  @Output() readonly _afterLeavingCenter: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted when the tab completes its animation towards the center. */
  @Output() readonly _onCentered: EventEmitter<void> = new EventEmitter<void>(true);

  /** The portal host inside of this container into which the tab body content will be loaded. */
  abstract _portalHost: CdkPortalOutlet;

  /** The tab body content to display. */
  @Input('content') _content: TemplatePortal;

  /** Position that will be used when the tab is immediately becoming visible after creation. */
  @Input() origin: number | null;

  // Note that the default value will always be overwritten by `SbbTabBody`, but we need one
  // anyway to prevent the animations module from throwing an error if the body is used on its own.
  /** Duration for the tab's animation. */
  @Input() animationDuration: string = '500ms';

  /** Duration of hide animation. */
  @Input() animationDurationHide: string = '150ms';

  /** Whether the tab's content should be kept in the DOM while it's off-screen. */
  @Input() preserveContent: boolean = false;

  /** The shifted index position of the tab body, where zero represents the active center tab. */
  @Input()
  set position(position: number) {
    this._positionIndex = position;
    this._computePositionAnimationState();
  }

  constructor(private _elementRef: ElementRef<HTMLElement>) {
    // Ensure that we get unique animation events, because the `.done` callback can get
    // invoked twice in some browsers. See https://github.com/angular/angular/issues/24084.
    this._translateTabComplete
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        })
      )
      .subscribe((event) => {
        // If the transition to the center is complete, emit an event.
        if (this._isCenterPosition(event.toState) && this._isCenterPosition(this._position)) {
          this._onCentered.emit();
        }

        if (this._isCenterPosition(event.fromState) && !this._isCenterPosition(this._position)) {
          this._afterLeavingCenter.emit();
        }
      });
  }

  ngOnDestroy() {
    this._dirChangeSubscription.unsubscribe();
    this._translateTabComplete.complete();
  }

  _onTranslateTabStarted(event: AnimationEvent): void {
    const isCentering = this._isCenterPosition(event.toState);
    this._beforeCentering.emit(isCentering);
    if (isCentering) {
      this._onCentering.emit(this._elementRef.nativeElement.clientHeight);
    }
  }

  /** Whether the provided position state is considered center, regardless of origin. */
  _isCenterPosition(position: SbbTabBodyPositionState | string): boolean {
    return position === 'show';
  }

  /** Computes the position state that will be used for the tab-body animation trigger. */
  private _computePositionAnimationState() {
    this._position = this._positionIndex === 0 ? 'show' : 'hidden';
  }
}

/**
 * Wrapper for the contents of a tab.
 * @docs-private
 */
@Component({
  selector: 'sbb-tab-body',
  templateUrl: 'tab-body.html',
  styleUrls: ['tab-body.css'],
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [sbbTabsAnimations.translateTab],
  host: {
    class: 'sbb-tab-body',
  },
})
export class SbbTabBody extends _SbbTabBodyBase {
  @ViewChild(CdkPortalOutlet) _portalHost: CdkPortalOutlet;

  constructor(elementRef: ElementRef<HTMLElement>) {
    super(elementRef);
  }
}
