import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  HostBinding,
  Inject,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ContentChild,
  TemplateRef,
  forwardRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ToggleOptionIconDirective } from './toggle-option-icon.directive';
import { RadioButtonComponent } from '../../radio-button/radio-button';
import { RadioButtonRegistryService } from '../../radio-button/radio-button/radio-button-registry.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SBB_TOGGLE_COMPONENT, ToggleBase } from '../toggle.base';

let counter = 0;

@Component({
  selector: 'sbb-toggle-option',
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleOptionComponent),
    multi: true,
  }],
})
export class ToggleOptionComponent extends RadioButtonComponent implements ToggleBase, AfterViewInit {

  @Input()
  inputId = `sbb-toggle-option-${counter++}`;

  get labelId() {
    return `${this.inputId}-label`;
  }

  get contentId() {
    return `${this.inputId}-content`;
  }

  @HostBinding('class.sbb-toggle-option')
  toggleOptionClass = true;

  @Input()
  label: string;

  @Input()
  infoText?: string;

  @Input()
  value: any;

  private _toggleChecked: boolean;
  @Input()
  @HostBinding('class.sbb-toggle-option-selected')
  get checked(): boolean {
    return this._toggleChecked;
  }
  set checked(value: boolean) {
    this._toggleChecked = value;

    if (this._toggleChecked) {
      this._registry.select(this);
    }

    this.valueChange$.next(this.value);
    this._changeDetector.markForCheck();
  }

  @Input()
  get name() {
    return `${this._parent.inputId}-option`;
  }
  set name(value) {
    throw new Error(`You're trying to assign the name "${value}" directly on sbb-toggle-option.
     Please bind it to its parent <sbb-toggle> component.`);
  }

  @Input()
  get formControlName() {
    return null;
  }
  set formControlName(value) {
    throw new Error(`You're trying to assign the formControlName "${value}" directly on sbb-toggle-option.
     Please bind it to its parent <sbb-toggle> component.`);
  }

  get ariaExpandedValue(): boolean | undefined {
    return this.toggleOptionHasContent ? this.checked : undefined;
  }

  get ariaControls(): string | undefined {
    return this.toggleOptionHasContent ? this.contentId : undefined;
  }

  @Input()
  disabled = false;

  toggleOptionHasContent = true;

  valueChange$ = new Subject<any>();

  private _document: Document;

  constructor(
    @Inject(SBB_TOGGLE_COMPONENT) private _parent: ToggleBase,
    @Inject(DOCUMENT) document: any,
    private _registry: RadioButtonRegistryService,
    private _changeDetector: ChangeDetectorRef) {
    super(_changeDetector, _registry);
    this._document = document;
  }

  @Input() @ContentChild(ToggleOptionIconDirective, { read: TemplateRef })
  icon?: TemplateRef<any>;

  @ViewChild('toggleOptionContentContainer')
  contentContainer: ElementRef<Element>;

  filteredContentNodes: ChildNode[] = [];

  ngAfterViewInit() {
    this.contentContainer.nativeElement.childNodes.forEach(node => {
      if (node.nodeType !== this._document.COMMENT_NODE) {
        this.filteredContentNodes.push(node);
      }
    });

    if (!this.filteredContentNodes.length) {
      this.toggleOptionHasContent = false;
      this._changeDetector.detectChanges();
    }
  }

  setToggleChecked(checked: boolean) {
    this.onChange(checked);
    this.onTouched();
    this.writeValue(checked);
    this.checked = checked;
  }

}
