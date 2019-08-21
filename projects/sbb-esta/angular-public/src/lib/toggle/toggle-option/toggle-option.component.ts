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
  Injector,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

import { RadioButtonComponent } from '../../radio-button/radio-button';
import { RadioButtonRegistryService } from '../../radio-button/radio-button/radio-button-registry.service';
import { SBB_TOGGLE_COMPONENT, ToggleBase } from '../toggle.base';

import { ToggleOptionIconDirective } from './toggle-option-icon.directive';

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
  /**
   * Identifier of a sbb-toggle-option.
   */
  @Input()
  inputId = `sbb-toggle-option-${counter++}`;

  /**
   * Identifier of sbb-toggle label.
   */
  get labelId() {
    return `${this.inputId}-label`;
  }

  /**
   * Identifier of sbb-toggle content.
   */
  get contentId() {
    return `${this.inputId}-content`;
  }

  /**
   * Css class of sbb-toggle-option.
   */
  @HostBinding('class.sbb-toggle-option')
  toggleOptionClass = true;

  /**
   * Label of a sbb-toggle-option.
   */
  @Input()
  label: string;

  /**
   * Information text in a sbb-toggle-option.
   */
  @Input()
  infoText?: string;

  /**
   * Value of a sbb-toggle-option.
   */
  @Input()
  value: any;

  private _toggleChecked: boolean;

  /**
   * Verifies if a sbb-toggle-option is selected.
   */
  @Input()
  @HostBinding('class.sbb-toggle-option-selected')
  get checked(): boolean {
    return this._toggleChecked;
  }
  set checked(value: boolean) {
    const previousStatus = this._toggleChecked;
    this._toggleChecked = value;

    if (this._toggleChecked) {
      this._registry.select(this);
    }

    // No need to fire a valueChange event if the value didn't change!
    if (previousStatus !== this._toggleChecked) {
      this.valueChange$.next(this.value);
    }
    this._changeDetector.markForCheck();
  }

  /**
   * Name of a toggle parent of options.
   * It should not be used here but it should be set on sbb-toggle.
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
   * It should not be used here but it should be set on sbb-toggle.
   */
  @Input()
  get formControlName() {
    return null;
  }

  /**
   * @docs-private
   */
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
   * Verifies if a toggle option is disabled.
   */
  @Input()
  disabled = false;

  /**
   * Verifies the presence of text in a toggle option.
   */
  toggleOptionHasContent = true;

  /**
   * Observable on change of the value of a toggle option.
   */
  valueChange$ = new Subject<any>();

  private _document: Document;

  constructor(
    @Inject(SBB_TOGGLE_COMPONENT) private _parent: ToggleBase,
    registry: RadioButtonRegistryService,
    changeDetector: ChangeDetectorRef,
    injector: Injector,
    @Inject(DOCUMENT) document: any
  ) {
    super(changeDetector, registry, injector);
    this._document = document;
  }

  /**
   * Refers to the icon optionally contained in a toggle option.
   */
  @Input()
  @HostBinding('class.sbb-toggle-option-has-icon')
  @ContentChild(ToggleOptionIconDirective, { read: TemplateRef, static: false })
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
   */
  setToggleChecked(checked: boolean) {
    this.onChange(checked);
    this.onTouched();
    this.writeValue(checked);
    this.checked = checked;
  }
}
