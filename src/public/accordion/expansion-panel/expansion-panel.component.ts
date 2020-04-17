import { AnimationEvent } from '@angular/animations';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, first, startWith } from 'rxjs/operators';

import { sbbExpansionAnimations } from '../accordion/accordion-animations';
import { IAccordionBase, SBB_ACCORDION } from '../accordion/accordion-base';

import { ExpansionPanelContentDirective } from './expansion-panel-content';

/** SbbExpansionPanel's states. */
export type ExpansionPanelState = 'expanded' | 'collapsed';

/** Counter for generating unique element ids. */
let uniqueId = 0;

/**
 * `<sbb-expansion-panel>`
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the SbbAccordion component attached.
 */
@Component({
  selector: 'sbb-expansion-panel',
  exportAs: 'sbbExpansionPanel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sbbExpansionAnimations.bodyExpansion],
  // Provide SbbAccordion as undefined to prevent nested expansion panels from registering
  // to the same accordion.
  providers: [
    {
      provide: SBB_ACCORDION,
      useValue: undefined
    }
  ]
})
export class ExpansionPanelComponent extends CdkAccordionItem
  implements AfterContentInit, OnChanges, OnDestroy {
  /**
   * Class property to disable a specific panel.
   */
  @Input() disabled = false;
  /**
   * Class property to expand a specific panel.
   */
  @Input() expanded = false;
  /**
   * An event generated when a panel is opened.
   */
  @Output() opened: EventEmitter<void>;
  /**
   * An event generated when a panel is closed.
   */
  @Output() closed: EventEmitter<void>;
  /**
   * An event generated when change the status of the expansion panel.
   */
  @Output() expandedChange: EventEmitter<boolean>;
  /**
   * Class property that refers to the attribute class of the panel.
   */
  @HostBinding('class.sbb-expansion-panel')
  sbbExpansionPanelClass = true;
  /**
   * Class property that refers to the status of expansion of the panel.
   */
  @HostBinding('class.sbb-expanded')
  get expandedPanelClass() {
    return this.expanded;
  }

  /** Whether the toggle indicator should be hidden. */
  @Input()
  get hideToggle(): boolean {
    return this._hideToggle || (this.accordion && this.accordion.hideToggle);
  }
  set hideToggle(value: boolean) {
    this._hideToggle = coerceBooleanProperty(value);
  }
  private _hideToggle = false;

  private _document: Document;

  /** Stream that emits for changes in `@Input` properties. */
  readonly _inputChanges = new Subject<SimpleChanges>();

  /** Optionally defined accordion the expansion panel belongs to. */
  accordion: IAccordionBase;

  /** Content that will be rendered lazily. */
  @ContentChild(ExpansionPanelContentDirective)
  lazyContent: ExpansionPanelContentDirective;

  /** Element containing the panel's user-provided content. */
  @ViewChild('body', { static: true }) body: ElementRef<HTMLElement>;

  /** Portal holding the user's content. */
  portal: TemplatePortal;

  /** ID for the associated header element. Used for a11y labelling. */
  headerId = `sbb-expansion-panel-header-${uniqueId++}`;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    @Optional() @SkipSelf() @Inject(SBB_ACCORDION) accordion: IAccordionBase,
    changeDetectorRef: ChangeDetectorRef,
    uniqueSelectionDispatcher: UniqueSelectionDispatcher,
    @Inject(DOCUMENT) document?: any
  ) {
    super(accordion, changeDetectorRef, uniqueSelectionDispatcher);
    this.accordion = accordion;
    this._document = document;
  }

  /** Gets the expanded state string. */
  getExpandedState(): ExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  ngAfterContentInit() {
    if (this.lazyContent) {
      // Render the content as soon as the panel becomes open.
      this.opened
        .pipe(
          startWith(true),
          filter(() => this.expanded && !this.portal),
          first()
        )
        .subscribe(() => {
          this.portal = new TemplatePortal(this.lazyContent._template, this._viewContainerRef);
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this._inputChanges.next(changes);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._inputChanges.complete();
  }

  bodyAnimation(event: AnimationEvent) {
    const classList = event.element.classList;
    const cssClass = 'sbb-expanded';
    const { phaseName, toState } = event;

    // Toggle the body's `overflow: hidden` class when closing starts or when expansion ends in
    // order to prevent the cases where switching too early would cause the animation to jump.
    // Note that we do it directly on the DOM element to avoid the slight delay that comes
    // with doing it via change detection.
    if (phaseName === 'done' && toState === 'expanded') {
      classList.add(cssClass);
    } else if (phaseName === 'start' && toState === 'collapsed') {
      classList.remove(cssClass);
    }
  }

  /** Checks whether the expansion panel's content contains the currently-focused element. */
  containsFocus(): boolean {
    if (this.body && this._document) {
      const focusedElement = this._document.activeElement;
      const bodyElement = this.body.nativeElement;
      return focusedElement === bodyElement || bodyElement.contains(focusedElement);
    }

    return false;
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_hideToggle: BooleanInput;
  // tslint:enable: member-ordering
}
