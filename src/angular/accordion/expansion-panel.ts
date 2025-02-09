import { AnimationEvent } from '@angular/animations';
import { _IdGenerator } from '@angular/cdk/a11y';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ANIMATION_MODULE_TYPE,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { mixinVariant, TypeRef } from '@sbb-esta/angular/core';
import { Subject } from 'rxjs';
import { filter, startWith, take } from 'rxjs/operators';

import type { SbbAccordion } from './accordion';
import { SBB_ACCORDION } from './accordion-token';
import { SBB_EXPANSION_PANEL } from './expansion-panel-base';
import { SbbExpansionPanelContent } from './expansion-panel-content';

/** SbbExpansionPanel's states. */
export type SbbExpansionPanelState = 'expanded' | 'collapsed';

// Boilerplate for applying mixins to SbbExpansionPanel.
/** @docs-private */
const _SbbExpansionPanelBase = mixinVariant(CdkAccordionItem);

/**
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the SbbAccordion component attached.
 */
@Component({
  selector: 'sbb-expansion-panel',
  exportAs: 'sbbExpansionPanel',
  templateUrl: './expansion-panel.html',
  styleUrls: ['./expansion-panel.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    { name: 'expanded', transform: booleanAttribute },
    { name: 'disabled', transform: booleanAttribute },
  ],
  // Provide SbbAccordion as undefined to prevent nested expansion panels from registering
  // to the same accordion.
  providers: [
    {
      provide: SBB_ACCORDION,
      useValue: undefined,
    },
    { provide: SBB_EXPANSION_PANEL, useExisting: SbbExpansionPanel },
  ],
  host: {
    class: 'sbb-expansion-panel',
    '[class.sbb-expanded]': 'expanded',
  },
  imports: [CdkPortalOutlet],
})
export class SbbExpansionPanel
  extends _SbbExpansionPanelBase
  implements AfterContentInit, OnChanges, OnDestroy
{
  private _viewContainerRef = inject(ViewContainerRef);
  _animationMode: 'NoopAnimations' | 'BrowserAnimations' | null = inject(ANIMATION_MODULE_TYPE, {
    optional: true,
  });
  private readonly _animationsDisabled =
    inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations';

  private _document = inject(DOCUMENT);
  private _ngZone = inject(NgZone);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _renderer = inject(Renderer2);
  private _cleanupTransitionEnd: (() => void) | undefined;

  /** Whether the toggle indicator should be hidden. */
  @Input({ transform: booleanAttribute })
  get hideToggle(): boolean {
    return this._hideToggle || (this.accordion && this.accordion.hideToggle);
  }
  set hideToggle(value: boolean) {
    this._hideToggle = value;
  }
  private _hideToggle = false;

  /** An event emitted after the body's expansion animation happens. */
  @Output() afterExpand: EventEmitter<void> = new EventEmitter<void>();

  /** An event emitted after the body's collapse animation happens. */
  @Output() afterCollapse: EventEmitter<void> = new EventEmitter<void>();

  /** Stream that emits for changes in `@Input` properties. */
  readonly _inputChanges = new Subject<SimpleChanges>();

  /** Optionally defined accordion the expansion panel belongs to. */
  override accordion = inject<TypeRef<SbbAccordion>>(SBB_ACCORDION, {
    optional: true,
    skipSelf: true,
  })!;

  /** Content that will be rendered lazily. */
  @ContentChild(SbbExpansionPanelContent) _lazyContent: SbbExpansionPanelContent;

  /** Element containing the panel's user-provided content. */
  @ViewChild('body') _body: ElementRef<HTMLElement>;

  /** Element wrapping the panel body. */
  @ViewChild('bodyWrapper')
  protected _bodyWrapper: ElementRef<HTMLElement> | undefined;

  /** Portal holding the user's content. */
  _portal: TemplatePortal;

  /** ID for the associated header element. Used for a11y labelling. */
  _headerId: string = inject(_IdGenerator).getId('sbb-expansion-panel-header-');

  /** Stream of body animation done events. */
  _bodyAnimationDone: Subject<AnimationEvent> = new Subject<AnimationEvent>();

  constructor(...args: unknown[]);
  constructor() {
    super();
  }

  /** Gets the expanded state string. */
  _getExpandedState(): SbbExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  /** Toggles the expanded state of the expansion panel. */
  override toggle(): void {
    this.expanded = !this.expanded;
  }

  /** Sets the expanded state of the expansion panel to false. */
  override close(): void {
    this.expanded = false;
  }

  /** Sets the expanded state of the expansion panel to true. */
  override open(): void {
    this.expanded = true;
  }

  ngAfterContentInit() {
    if (this._lazyContent && this._lazyContent._expansionPanel === this) {
      // Render the content as soon as the panel becomes open.
      this.opened
        .pipe(
          startWith(null),
          filter(() => this.expanded && !this._portal),
          take(1),
        )
        .subscribe(() => {
          this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
        });
    }

    this._setupAnimationEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    this._inputChanges.next(changes);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._cleanupTransitionEnd?.();
    this._inputChanges.complete();
  }

  private _transitionEndListener = ({ target, propertyName }: TransitionEvent) => {
    if (target === this._bodyWrapper?.nativeElement && propertyName === 'grid-template-rows') {
      this._ngZone.run(() => {
        if (this.expanded) {
          this.afterExpand.emit();
        } else {
          this.afterCollapse.emit();
        }
      });
    }
  };
  protected _setupAnimationEvents() {
    // This method is defined separately, because we need to
    // disable this logic in some internal components.
    this._ngZone.runOutsideAngular(() => {
      if (this._animationsDisabled) {
        this.opened.subscribe(() => this._ngZone.run(() => this.afterExpand.emit()));
        this.closed.subscribe(() => this._ngZone.run(() => this.afterCollapse.emit()));
      } else {
        setTimeout(() => {
          const element = this._elementRef.nativeElement;
          this._cleanupTransitionEnd = this._renderer.listen(
            element,
            'transitionend',
            this._transitionEndListener,
          );
          element.classList.add('sbb-expansion-panel-animations-enabled');
        }, 200);
      }
    });
  }

  /** Checks whether the expansion panel's content contains the currently-focused element. */
  _containsFocus(): boolean {
    if (this._body) {
      const focusedElement = this._document.activeElement;
      const bodyElement = this._body.nativeElement;
      return focusedElement === bodyElement || bodyElement.contains(focusedElement);
    }

    return false;
  }

  /** Called when the expansion animation has started. */
  protected _animationStarted(event: AnimationEvent) {
    if (!isInitialAnimation(event) && !this._animationsDisabled && this._body) {
      // Prevent the user from tabbing into the content while it's animating.
      // TODO(crisbeto): maybe use `inert` to prevent focus from entering while closed as well
      // instead of `visibility`? Will allow us to clean up some code but needs more testing.
      this._body?.nativeElement.setAttribute('inert', '');
    }
  }

  /** Called when the expansion animation has finished. */
  protected _animationDone(event: AnimationEvent) {
    if (!isInitialAnimation(event)) {
      if (event.toState === 'expanded') {
        this.afterExpand.emit();
      } else if (event.toState === 'collapsed') {
        this.afterCollapse.emit();
      }

      // Re-enable tabbing once the animation is finished.
      if (!this._animationsDisabled && this._body) {
        this._body.nativeElement.removeAttribute('inert');
      }
    }
  }
}
/** Checks whether an animation is the initial setup animation. */
function isInitialAnimation(event: AnimationEvent): boolean {
  return event.fromState === 'void';
}
