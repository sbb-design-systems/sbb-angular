import {
  Component,
  ViewChild,
  ElementRef,
  HostBinding,
  InjectionToken,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  AfterContentInit,
  Input,
  forwardRef,
} from '@angular/core';

import { ScrollStrategy, Overlay } from '@angular/cdk/overlay';

import { AutocompleteComponent, AutocompleteTriggerDirective, AutocompleteOriginDirective } from '../../autocomplete/autocomplete';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Injection token that determines the scroll handling while the calendar is open. */
export const SBB_SEARCH_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('sbb-search-scroll-strategy');

/** @docs-private */
export function SBB_SEARCH_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SBB_SEARCH_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_SEARCH_SCROLL_STRATEGY_FACTORY,
};

export class SearchChangeEvent {
  constructor(
    /** Instance of search field component. */
    public instance: SearchComponent,
    /** States if the search field has been opened by a click. */
    public isUserInput = false
  ) { }
}

let searchFieldCounter = 1;

@Component({
  selector: 'sbb-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchComponent),
    multi: true
  }]
})
export class SearchComponent implements AfterContentInit, ControlValueAccessor {

  @ViewChild(AutocompleteTriggerDirective) trigger: AutocompleteTriggerDirective;

  origin: AutocompleteOriginDirective;

  /**
  * Identifier of search.
  */
  @HostBinding('attr.id')
  searchFieldId = 'sbb-search-id-' + searchFieldCounter++;

  /**
   * Identifier of search content.
   */
  contentId = 'sbb-search-content-id-' + searchFieldCounter;

  /**
   * Css class on search component.
   */
  @HostBinding('class.sbb-search') cssClass = true;

  /** The autocomplete panel to be attached to this trigger. */
  // tslint:disable-next-line:no-input-rename
  @Input() autocomplete: AutocompleteComponent;

  constructor(private elementRef: ElementRef) {
    this.origin = new AutocompleteOriginDirective(elementRef);
  }

  ngAfterContentInit() {
    this.trigger.autocomplete = this.autocomplete;
    console.log(this.autocomplete);
    console.log(this.trigger);

  }

  writeValue(obj: any): void {
    this.trigger.writeValue(obj);
  }
  registerOnChange(fn: any): void {
    this.trigger.registerOnChange(fn);
  }
  registerOnTouched(fn: any): void {
    this.registerOnTouched(fn);
  }
  setDisabledState?(isDisabled: boolean): void {
    this.trigger.setDisabledState(isDisabled);
  }
}
