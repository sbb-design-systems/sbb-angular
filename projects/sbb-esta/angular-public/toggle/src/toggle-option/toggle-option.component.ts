import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  HostBinding,
  Inject,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive';
import { RadioButtonComponent } from '@sbb-esta/angular-public/radio-button';
import { Subject } from 'rxjs';

import { SBB_TOGGLE_COMPONENT, ToggleBase } from '../toggle.base';

let counter = 0;

@Component({
  selector: 'sbb-toggle-option',
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleOptionComponent),
      multi: true
    }
  ]
})
export class ToggleOptionComponent extends RadioButtonComponent
  implements ToggleBase, AfterViewInit {
  /** Identifier of sbb-toggle label. */
  readonly labelId: string;
  /** Identifier of sbb-toggle content. */
  readonly contentId: string;
  /** @docs-private */
  @HostBinding('class.sbb-toggle-option') toggleOptionClass = true;
  /** Label of a sbb-toggle-option. */
  @Input() label: string;
  /** Information text in a sbb-toggle-option. */
  @Input() infoText?: string;

  /** @docs-private */
  @HostBinding('class.sbb-toggle-option-selected')
  get _isChecked() {
    return this.checked;
  }

  /**
   * Name of a toggle parent of options.
   * Can only be set on sbb-toggle.
   */
  @Input()
  get name() {
    return `${this._parent.inputId}-option`;
  }
  set name(value) {
    throw new Error(`You're trying to assign the name "${value}" directly on sbb-toggle-option.
     Please bind it to its parent <sbb-toggle> component.`);
  }

  /**
   * @docs-private
   * @deprecated
   * It should not be used here but it should be set on sbb-toggle.
   */
  @Input()
  get formControlName() {
    return null;
  }
  set formControlName(value) {
    throw new Error(`You're trying to assign the formControlName "${value}" directly on sbb-toggle-option.
     Please bind it to its parent <sbb-toggle> component.`);
  }

  /**
   * Aria expanded value is true when a toggle button is selected.
   */
  get ariaExpandedValue(): boolean | undefined {
    return this.toggleOptionHasContent ? this.checked : undefined;
  }

  /**
   * Aria controls associated to toggle option content.
   */
  get ariaControls(): string | undefined {
    return this.toggleOptionHasContent ? this.contentId : undefined;
  }

  /**
   * Verifies the presence of text in a toggle option.
   */
  toggleOptionHasContent = true;

  /**
   * Observable on change of the value of a toggle option.
   * @deprecated Listen to (change).
   */
  valueChange$ = new Subject<any>();

  /**
   * Refers to the icon optionally contained in a toggle option.
   */
  @Input()
  @HostBinding('class.sbb-toggle-option-has-icon')
  @ContentChild(IconDirective, { read: TemplateRef, static: false })
  icon?: TemplateRef<any>;

  /**
   * Refers to the content of a toggle option.
   */
  @ViewChild('toggleOptionContentContainer', { static: false })
  contentContainer: ElementRef<Element>;

  /**
   * Filter on a toggle option content.
   */
  filteredContentNodes: ChildNode[] = [];

  private _document: Document;

  constructor(
    @Inject(SBB_TOGGLE_COMPONENT) private _parent: ToggleBase,
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    focusMonitor: FocusMonitor,
    radioDispatcher: UniqueSelectionDispatcher,
    @Inject(DOCUMENT) document: any
  ) {
    super(changeDetector, elementRef, focusMonitor, radioDispatcher);
    this._document = document;
    this.id = `sbb-toggle-option-${counter++}`;
    this.inputId = `${this.id}-input`;
    this.labelId = `${this.inputId}-label`;
    this.contentId = `${this.inputId}-content`;
  }

  ngAfterViewInit() {
    const nodeList = this.contentContainer.nativeElement.childNodes;
    for (let k = 0; k < nodeList.length; k++) {
      const node = nodeList.item(k);
      if (node.nodeType !== this._document.COMMENT_NODE) {
        this.filteredContentNodes.push(node);
      }
    }

    if (!this.filteredContentNodes.length) {
      this.toggleOptionHasContent = false;
      this._changeDetector.detectChanges();
    }
  }

  /**
   * Set value of a toggle option to checked.
   * @param checked Value checked.
   * @deprecated Use .checked instead.
   */
  setToggleChecked(checked: boolean) {
    this.onChange(checked);
    this.onTouched();
    this.writeValue(checked);
    this.checked = checked;
  }
}
