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
  TemplateRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { SBB_TOGGLE_COMPONENT, ToggleBase } from '../toggle-base';
import { DOCUMENT } from '@angular/common';
import { ToggleOptionIconDirective } from './toggle-option-icon.directive';

let counter = 0;

@Component({
  selector: 'sbb-toggle-option',
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToggleOptionComponent implements AfterViewInit {

  @Input()
  @HostBinding('id')
  inputId = `sbb-toggle-option-${counter++}`;

  get buttonId() {
    return `${this.inputId}-button`;
  }

  get contentId() {
    return `${this.inputId}-content`;
  }

  @HostBinding('class.sbb-toggle-option')
  toggleOptionClass = true;

  @Input()
  label: string;

  @Input()
  value: any;

  private _selected = false;
  @HostBinding('class.sbb-toggle-option-selected')
  get selected() {
    return this._selected;
  }
  set selected(value: boolean) {
    this._selected = value;
    this._changeDetector.markForCheck();
  }

  get ariaExpandedValue(): boolean | undefined {
    return this.toggleOptionHasContent ? this.selected : undefined;
  }

  get ariaControls(): string | undefined {
    return this.toggleOptionHasContent ? this.contentId : undefined;
  }

  @Input()
  disabled = false;

  toggleOptionHasContent = true;

  get sibling(): ToggleOptionComponent {
    return this._parent.toggleOptions.find(toggle => toggle.value !== this.value);
  }

  valueChange$ = new Subject<any>();

  constructor(
    @Inject(SBB_TOGGLE_COMPONENT) private _parent: ToggleBase,
    @Inject(DOCUMENT) private _document: Document,
    private _changeDetector: ChangeDetectorRef) { }

  @Input() @ContentChild(ToggleOptionIconDirective, { read: TemplateRef }) icon: TemplateRef<any>;

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

  selectOption() {
    this.selected = true;
    this.valueChange$.next(this.value);
    this.sibling.selected = false;
  }

}
