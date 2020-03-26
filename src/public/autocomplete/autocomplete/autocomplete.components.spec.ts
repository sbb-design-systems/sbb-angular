import { DOWN_ARROW, ENTER, ESCAPE, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  Provider,
  QueryList,
  Type,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  clearElement,
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent
} from '@sbb-esta/angular-core/testing';
import { createKeyboardEvent } from '@sbb-esta/angular-core/testing';
import { MockNgZone } from '@sbb-esta/angular-core/testing';
import { typeInElement } from '@sbb-esta/angular-core/testing';
import { FieldComponent, FieldModule } from '@sbb-esta/angular-public/field';
import {
  OptionComponent,
  OptionModule,
  SBBOptionSelectionChange
} from '@sbb-esta/angular-public/option';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AutocompleteModule } from '../autocomplete.module';

import {
  AutocompleteTriggerDirective,
  getSbbAutocompleteMissingPanelError,
  SBB_AUTOCOMPLETE_SCROLL_STRATEGY
} from './autocomplete-trigger.directive';
import { AutocompleteComponent, SbbAutocompleteSelectedEvent } from './autocomplete.component';

@Component({
  template: `
    <input
      placeholder="Number"
      [sbbAutocomplete]="auto"
      [sbbAutocompleteDisabled]="autocompleteDisabled"
      [formControl]="numberCtrl"
    />
    <sbb-autocomplete
      class="class-one class-two"
      #auto="sbbAutocomplete"
      [displayWith]="displayFn"
      (opened)="openedSpy()"
      (closed)="closedSpy()"
    >
      <sbb-option *ngFor="let num of filteredNumbers" [value]="num">
        <span>{{ num.code }}: {{ num.name }}</span>
      </sbb-option>
    </sbb-autocomplete>
  `
})
class SimpleAutocompleteComponent implements OnDestroy {
  numberCtrl = new FormControl();
  filteredNumbers: any[];
  valueSub: Subscription;
  floatLabel = 'auto';
  width: number;
  autocompleteDisabled = false;
  openedSpy = jasmine.createSpy('autocomplete opened spy');
  closedSpy = jasmine.createSpy('autocomplete closed spy');

  @ViewChild(AutocompleteTriggerDirective, { static: true })
  trigger: AutocompleteTriggerDirective;
  @ViewChild(AutocompleteComponent, { static: true })
  panel: AutocompleteComponent;
  @ViewChild(FieldComponent, { static: true }) formField: FieldComponent;
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;

  numbers = [
    { code: '1', name: 'Eins' },
    { code: '2', name: 'Zwei' },
    { code: '3', name: 'Drei' },
    { code: '4', name: 'Vier' },
    { code: '5', name: 'Funf' },
    { code: '6', name: 'Sechs' },
    { code: '7', name: 'Sieben' },
    { code: '8', name: 'Acht' },
    { code: '9', name: 'Neun' },
    { code: '10', name: 'Zehn' }
  ];

  constructor() {
    this.filteredNumbers = this.numbers;
    this.valueSub = this.numberCtrl.valueChanges.subscribe(val => {
      this.filteredNumbers = val
        ? this.numbers.filter(s => s.name.match(new RegExp(val, 'gi')))
        : this.numbers;
    });
  }

  displayFn(value: any): string {
    return value ? value.name : value;
  }

  ngOnDestroy() {
    this.valueSub.unsubscribe();
  }
}

@Component({
  template: `
    <sbb-field *ngIf="isVisible">
      <input placeholder="Choose" [sbbAutocomplete]="auto" [formControl]="optionCtrl" />
    </sbb-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let option of filteredOptions | async" [value]="option">
        {{ option }}
      </sbb-option>
    </sbb-autocomplete>
  `
})
class NgIfAutocompleteComponent {
  optionCtrl = new FormControl();
  filteredOptions: Observable<any>;
  isVisible = true;
  options = ['One', 'Two', 'Three'];

  @ViewChild(AutocompleteTriggerDirective)
  trigger: AutocompleteTriggerDirective;
  @ViewChildren(OptionComponent) matOptions: QueryList<OptionComponent>;

  constructor() {
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(null),
      map((val: string) => {
        return val
          ? this.options.filter(option => new RegExp(val, 'gi').test(option))
          : this.options.slice();
      })
    );
  }
}

@Component({
  template: `
    <sbb-field>
      <input
        placeholder="Number"
        [sbbAutocomplete]="auto"
        (input)="onInput($event.target?.value)"
      />
    </sbb-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let num of filteredNumbers" [value]="num">
        <span> {{ num }} </span>
      </sbb-option>
    </sbb-autocomplete>
  `
})
class AutocompleteWithoutFormsComponent {
  filteredNumbers: any[];
  numbers = ['Eins', 'Zwei', 'Drei'];

  constructor() {
    this.filteredNumbers = this.numbers.slice();
  }

  onInput(value: any) {
    this.filteredNumbers = this.numbers.filter(s => new RegExp(value, 'gi').test(s));
  }
}

@Component({
  template: `
    <sbb-field>
      <input
        placeholder="Number"
        [sbbAutocomplete]="auto"
        [(ngModel)]="selectedNumber"
        (ngModelChange)="onInput($event)"
      />
    </sbb-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let num of filteredNumbers" [value]="num">
        <span>{{ num }}</span>
      </sbb-option>
    </sbb-autocomplete>
  `
})
class AutocompleteWithNgModelComponent {
  filteredNumbers: any[];
  selectedNumber: string;
  numbers = ['Eins', 'Zwei', 'Drei'];

  constructor() {
    this.filteredNumbers = this.numbers.slice();
  }

  onInput(value: any) {
    this.filteredNumbers = this.numbers.filter(s => new RegExp(value, 'gi').test(s));
  }
}

@Component({
  template: `
    <sbb-field>
      <input placeholder="Number" [sbbAutocomplete]="auto" [(ngModel)]="selectedNumber" />
    </sbb-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let number of numbers" [value]="number">
        <span>{{ number }}</span>
      </sbb-option>
    </sbb-autocomplete>
  `
})
class AutocompleteWithNumbersComponent {
  selectedNumber: number;
  numbers = [0, 1, 2];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sbb-field>
      <input type="text" [sbbAutocomplete]="auto" />
    </sbb-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let option of options" [value]="option">{{ option }}</sbb-option>
    </sbb-autocomplete>
  `
})
class AutocompleteWithOnPushDelayComponent implements OnInit {
  @ViewChild(AutocompleteTriggerDirective, { static: true })
  trigger: AutocompleteTriggerDirective;
  options: string[];

  ngOnInit() {
    setTimeout(() => {
      this.options = ['One'];
    }, 1000);
  }
}

@Component({
  template: `
    <input placeholder="Choose" [sbbAutocomplete]="auto" [formControl]="optionCtrl" />

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let option of filteredOptions | async" [value]="option">
        {{ option }}
      </sbb-option>
    </sbb-autocomplete>
  `
})
class AutocompleteWithNativeInputComponent {
  optionCtrl = new FormControl();
  filteredOptions: Observable<any>;
  options = ['En', 'To', 'Tre', 'Fire', 'Fem'];

  @ViewChild(AutocompleteTriggerDirective, { static: true })
  trigger: AutocompleteTriggerDirective;
  @ViewChildren(OptionComponent) matOptions: QueryList<OptionComponent>;

  constructor() {
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(null),
      map((val: string) => {
        return val
          ? this.options.filter(option => new RegExp(val, 'gi').test(option))
          : this.options.slice();
      })
    );
  }
}

@Component({
  template: `
    <input placeholder="Choose" [sbbAutocomplete]="auto" [formControl]="control" />
  `
})
class AutocompleteWithoutPanelComponent {
  @ViewChild(AutocompleteTriggerDirective, { static: true })
  trigger: AutocompleteTriggerDirective;
  control = new FormControl();
}

@Component({
  template: `
    <sbb-field>
      <input placeholder="Number" [sbbAutocomplete]="auto" [(ngModel)]="selectedNumber" />
    </sbb-field>

    <sbb-autocomplete #auto="sbbAutocomplete" (optionSelected)="optionSelected($event)">
      <sbb-option *ngFor="let num of numbers" [value]="num">
        <span>{{ num }}</span>
      </sbb-option>
    </sbb-autocomplete>
  `
})
class AutocompleteWithSelectEventComponent {
  selectedNumber: string;
  numbers = ['Eins', 'Zwei', 'Drei'];
  optionSelected = jasmine.createSpy('optionSelected callback');

  @ViewChild(AutocompleteTriggerDirective, { static: true })
  trigger: AutocompleteTriggerDirective;
  @ViewChild(AutocompleteComponent, { static: true })
  autocomplete: AutocompleteComponent;
}

@Component({
  template: `
    <input [formControl]="formControl" [sbbAutocomplete]="auto" />
    <sbb-autocomplete #auto="sbbAutocomplete"></sbb-autocomplete>
  `
})
class PlainAutocompleteInputWithFormControlComponent {
  formControl = new FormControl();
}

@Component({
  template: `
    <sbb-field>
      <input type="number" [sbbAutocomplete]="auto" [(ngModel)]="selectedValue" />
    </sbb-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let value of values" [value]="value">{{ value }}</sbb-option>
    </sbb-autocomplete>
  `
})
class AutocompleteWithNumberInputAndNgModelComponent {
  selectedValue: number;
  values = [1, 2, 3];
}

@Component({
  template: `
    <input autocomplete="changed" [(ngModel)]="value" [sbbAutocomplete]="auto" />
    <sbb-autocomplete #auto="sbbAutocomplete"></sbb-autocomplete>
  `
})
class AutocompleteWithNativeAutocompleteAttributeComponent {
  value: string;
}

@Component({
  template: '<input [sbbAutocomplete]="null" sbbAutocompleteDisabled>'
})
class InputWithoutAutocompleteAndDisabledComponent {}

describe('AutocompleteComponent', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let zone: MockNgZone;

  // Creates a test component fixture.
  function createComponent<T>(component: Type<T>, providers: Provider[] = []) {
    TestBed.configureTestingModule({
      imports: [AutocompleteModule, FieldModule, FormsModule, ReactiveFormsModule, OptionModule],
      declarations: [component],
      providers: [{ provide: NgZone, useFactory: () => (zone = new MockNgZone()) }, ...providers]
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some of the tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('panel toggling', () => {
    let fixture: ComponentFixture<SimpleAutocompleteComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocompleteComponent);
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should open the panel when the input is focused', () => {
      input = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to start out closed.`
      );

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        true,
        `Expected panel state to read open when input is focused.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Eins',
        `Expected panel to display when input is focused.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Zwei',
        `Expected panel to display when input is focused.`
      );
    });

    it('should not open the panel on focus if the input is readonly', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      input.readOnly = true;
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false, 'Expected panel state to start out closed.');
      dispatchFakeEvent(input, 'focusin');
      flush();

      fixture.detectChanges();
      expect(trigger.panelOpen).toBe(false, 'Expected panel to stay closed.');
    }));

    it('should not open using the arrow keys when the input is readonly', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      input.readOnly = true;
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false, 'Expected panel state to start out closed.');
      dispatchKeyboardEvent(input, 'keydown', DOWN_ARROW);
      flush();

      fixture.detectChanges();
      expect(trigger.panelOpen).toBe(false, 'Expected panel to stay closed.');
    }));

    it('should open the panel programmatically', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to start out closed.`
      );

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        true,
        `Expected panel state to read open when opened programmatically.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Eins',
        `Expected panel to display when opened programmatically.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Zwei',
        `Expected panel to display when opened programmatically.`
      );
    });

    it('should show the panel when the first open is after the initial zone stabilization', async(() => {
      // Note that we're running outside the Angular zone, in order to be able
      // to test properly without the subscription from `_subscribeToClosingActions`
      // giving us a false positive.
      // tslint:disable-next-line:no-non-null-assertion
      fixture.ngZone!.runOutsideAngular(() => {
        fixture.componentInstance.trigger.openPanel();

        Promise.resolve().then(() => {
          expect(fixture.componentInstance.panel.showPanel).toBe(
            true,
            `Expected panel to be visible.`
          );
        });
      });
    }));

    it('should close the panel when the user clicks away', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();
      dispatchFakeEvent(document, 'click');

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected clicking outside the panel to set its state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected clicking outside the panel to close the panel.`
      );
    }));

    it('should close the panel when the user taps away on a touch device', fakeAsync(() => {
      dispatchFakeEvent(input, 'focus');
      fixture.detectChanges();
      flush();
      dispatchFakeEvent(document, 'touchend');

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected tapping outside the panel to set its state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected tapping outside the panel to close the panel.`
      );
    }));

    it('should close the panel when an option is clicked', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
      option.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected clicking an option to set the panel state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected clicking an option to close the panel.`
      );
    }));

    it('should close the panel when a newly created option is clicked', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();

      // Filter down the option list to a subset of original options ('Eins', 'Zwei', 'Drei')
      typeInElement(input, 'ei');
      fixture.detectChanges();
      tick();

      let options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;
      options[0].click();

      // Changing value from 'Eins' to 'ei' to re-populate the option list,
      // ensuring that 'California' is created new.
      dispatchFakeEvent(input, 'focusin');
      clearElement(input);
      typeInElement(input, 'ei');
      fixture.detectChanges();
      tick();

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected clicking a new option to set the panel state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected clicking a new option to close the panel.`
      );
    }));

    it('should close the panel programmatically', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected closing programmatically to set the panel state to closed.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected closing programmatically to close the panel.`
      );
    });

    it('should not throw when attempting to close the panel of a destroyed autocomplete', () => {
      const trigger = fixture.componentInstance.trigger;

      trigger.openPanel();
      fixture.detectChanges();
      fixture.destroy();

      expect(() => trigger.closePanel()).not.toThrow();
    });

    it('should hide the panel when the options list is empty', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector('.sbb-autocomplete-panel') as HTMLElement;

      expect(panel.classList).toContain(
        'sbb-autocomplete-visible',
        `Expected panel to start out visible.`
      );

      // Filter down the option list such that no options match the value
      typeInElement(input, 'af');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(panel.classList).toContain(
        'sbb-autocomplete-hidden',
        `Expected panel to hide itself when empty.`
      );
    }));

    it('should not open the panel when the `input` event is invoked on a non-focused input', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to start out closed.`
      );

      input.value = 'Alabama';
      dispatchFakeEvent(input, 'input');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to stay closed.`
      );
    });

    it('should toggle the visibility when typing and closing the panel', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      tick();
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('.sbb-autocomplete-panel')).toBeTruthy();
      expect(overlayContainerElement.querySelector('.sbb-autocomplete-panel')!.classList).toContain(
        'sbb-autocomplete-visible',
        'Expected panel to be visible.'
      );

      typeInElement(input, 'x');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('.sbb-autocomplete-panel')).toBeTruthy();

      expect(overlayContainerElement.querySelector('.sbb-autocomplete-panel')!.classList).toContain(
        'sbb-autocomplete-hidden',
        'Expected panel to be hidden.'
      );

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      clearElement(input);
      typeInElement(input, 'ei');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('.sbb-autocomplete-panel')).toBeTruthy();
      expect(overlayContainerElement.querySelector('.sbb-autocomplete-panel')!.classList).toContain(
        'sbb-autocomplete-visible',
        'Expected panel to be visible.'
      );
    }));

    it('should provide the open state of the panel', fakeAsync(() => {
      expect(fixture.componentInstance.panel.open).toBeFalsy(
        `Expected the panel to be unopened initially.`
      );

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.panel.open).toBeTruthy(
        `Expected the panel to be opened on focus.`
      );
    }));

    it('should emit an event when the panel is opened', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalled();
    });

    it('should not emit the `opened` event when no options are being shown', () => {
      fixture.componentInstance.filteredNumbers = fixture.componentInstance.numbers = [];
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).not.toHaveBeenCalled();
    });

    it('should not emit the opened event multiple times while typing', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalledTimes(1);

      typeInElement(input, 'Alabam');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalledTimes(1);
    }));

    it('should emit an event when the panel is closed', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.closedSpy).toHaveBeenCalled();
    });

    it('should not emit the `closed` event when no options were shown', () => {
      fixture.componentInstance.filteredNumbers = fixture.componentInstance.numbers = [];
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.closedSpy).not.toHaveBeenCalled();
    });

    it('should not be able to open the panel if the autocomplete is disabled', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to start out closed.`
      );

      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel to remain closed.`
      );
    });

    it('should continue to update the model if the autocomplete is disabled', () => {
      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      typeInElement(input, 'hello');
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.value).toBe('hello');
    });
  });

  it('should be able to set a custom value for the `autocomplete` attribute', () => {
    const fixture = createComponent(AutocompleteWithNativeAutocompleteAttributeComponent);
    const input = fixture.nativeElement.querySelector('input');

    fixture.detectChanges();

    expect(input.getAttribute('autocomplete')).toBe('changed');
  });

  it('should not throw when typing in an element with a null and disabled autocomplete', () => {
    const fixture = createComponent(InputWithoutAutocompleteAndDisabledComponent);
    fixture.detectChanges();

    expect(() => {
      dispatchKeyboardEvent(fixture.nativeElement.querySelector('input'), 'keydown', SPACE);
      fixture.detectChanges();
    }).not.toThrow();
  });

  describe('forms integration', () => {
    let fixture: ComponentFixture<SimpleAutocompleteComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocompleteComponent);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should update control value as user types with input value', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      typeInElement(input, 'a');
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.value).toEqual(
        'a',
        'Expected control value to be updated as user types.'
      );

      clearElement(input);
      typeInElement(input, 'al');
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.value).toEqual(
        'al',
        'Expected control value to be updated as user types.'
      );
    });

    it('should update control value when option is selected with option value', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.value).toEqual(
        { code: '2', name: 'Zwei' },
        'Expected control value to equal the selected option value.'
      );
    }));

    it('should update the control back to a string if user types after an option is selected', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;
      options[1].click();
      fixture.detectChanges();

      clearElement(input);
      typeInElement(input, 'Californi');
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.numberCtrl.value).toEqual(
        'Californi',
        'Expected control value to revert back to string.'
      );
    }));

    it('should fill the text field with display value when an option is selected', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;
      options[1].click();
      fixture.detectChanges();

      expect(input.value).toContain('Zwei', `Expected text field to fill with selected value.`);
    }));

    it('should fill the text field correctly if value is set to obj programmatically', fakeAsync(() => {
      fixture.componentInstance.numberCtrl.setValue({
        code: '1',
        name: 'Eins'
      });
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(input.value).toContain(
        'Eins',
        `Expected input to fill with matching option's viewValue.`
      );
    }));

    it('should clear the text field if value is reset programmatically', fakeAsync(() => {
      typeInElement(input, 'Eins');
      fixture.detectChanges();
      tick();

      fixture.componentInstance.numberCtrl.reset();
      tick();

      fixture.detectChanges();
      tick();

      expect(input.value).toEqual('', `Expected input value to be empty after reset.`);
    }));

    it('should mark the autocomplete control as dirty when an option is selected', fakeAsync(() => {
      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        false,
        `Expected control to start out pristine.`
      );

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        true,
        `Expected control to become dirty when an option was selected.`
      );
    }));

    it('should not mark the control dirty when the value is set programmatically', () => {
      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        false,
        `Expected control to start out pristine.`
      );

      fixture.componentInstance.numberCtrl.setValue('AL');
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        false,
        `Expected control to stay pristine if value is set programmatically.`
      );
    });

    it('should mark the autocomplete control as touched on blur', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      expect(fixture.componentInstance.numberCtrl.touched).toBe(
        false,
        `Expected control to start out untouched.`
      );

      dispatchFakeEvent(input, 'blur');
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.touched).toBe(
        true,
        `Expected control to become touched on blur.`
      );
    });

    it('should disable the input when used with a value accessor and without ` `', () => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();

      const plainFixture = createComponent(PlainAutocompleteInputWithFormControlComponent);
      plainFixture.detectChanges();
      input = plainFixture.nativeElement.querySelector('input');

      expect(input.disabled).toBe(false);

      plainFixture.componentInstance.formControl.disable();
      plainFixture.detectChanges();

      expect(input.disabled).toBe(true);
    });
  });

  describe('keyboard events', () => {
    let fixture: ComponentFixture<SimpleAutocompleteComponent>;
    let input: HTMLInputElement;
    let downArrowEvent: KeyboardEvent;
    let upArrowEvent: KeyboardEvent;
    let enterEvent: KeyboardEvent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleAutocompleteComponent);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;
      downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      upArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
      enterEvent = createKeyboardEvent('keydown', ENTER);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
    }));

    it('should not focus the option when DOWN key is pressed', () => {
      fixture.detectChanges();
      spyOn(fixture.componentInstance.options.first, 'focus');

      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);
      expect(fixture.componentInstance.options.first.focus).not.toHaveBeenCalled();
    });

    it('should not close the panel when DOWN key is pressed', () => {
      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        true,
        `Expected panel state to stay open when DOWN key is pressed.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Eins',
        `Expected panel to keep displaying when DOWN key is pressed.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Zwei',
        `Expected panel to keep displaying when DOWN key is pressed.`
      );
    });

    it('should set the active item to the first option when DOWN key is pressed', () => {
      const componentInstance = fixture.componentInstance;
      const optionEls = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      expect(componentInstance.trigger.panelOpen).toBe(
        true,
        'Expected first down press to open the pane.'
      );

      componentInstance.trigger.handleKeydown(downArrowEvent);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption!.id === componentInstance.options.first.id
      ).toBe(true, 'Expected first option to be active.');
      expect(optionEls[0].classList).toContain('sbb-active');
      expect(optionEls[1].classList).not.toContain('sbb-active');

      componentInstance.trigger.handleKeydown(downArrowEvent);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption!.id === componentInstance.options.toArray()[1].id
      ).toBe(true, 'Expected second option to be active.');
      expect(optionEls[0].classList).not.toContain('sbb-active');
      expect(optionEls[1].classList).toContain('sbb-active');
    });

    it('should set the active item to the last option when UP key is pressed', () => {
      const componentInstance = fixture.componentInstance;
      const optionEls = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      expect(componentInstance.trigger.panelOpen).toBe(
        true,
        'Expected first up press to open the pane.'
      );

      componentInstance.trigger.handleKeydown(upArrowEvent);
      fixture.detectChanges();

      expect(componentInstance.trigger.activeOption!.id === componentInstance.options.last.id).toBe(
        true,
        'Expected last option to be active.'
      );
      expect(optionEls[9].classList).toContain('sbb-active');
      expect(optionEls[0].classList).not.toContain('sbb-active');

      componentInstance.trigger.handleKeydown(downArrowEvent);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption!.id === componentInstance.options.first.id
      ).toBe(true, 'Expected first option to be active.');
      expect(optionEls[0].classList).toContain('sbb-active');
    });

    it('should set the active item properly after filtering', () => {
      const componentInstance = fixture.componentInstance;

      typeInElement(input, 'e');
      fixture.detectChanges();

      componentInstance.trigger.handleKeydown(downArrowEvent);
      fixture.detectChanges();

      const optionEls = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      expect(
        componentInstance.trigger.activeOption!.id === componentInstance.options.first.id
      ).toBe(true, 'Expected first option to be active.');
      expect(optionEls[0].classList).toContain('sbb-active');
      expect(optionEls[1].classList).not.toContain('sbb-active');
    });

    it('should fill the text field when an option is selected with ENTER', fakeAsync(() => {
      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);
      flush();
      fixture.detectChanges();

      fixture.componentInstance.trigger.handleKeydown(enterEvent);
      fixture.detectChanges();
      expect(input.value).toContain(
        'Eins',
        `Expected text field to fill with selected value on ENTER.`
      );
    }));

    it('should prevent the default enter key action', fakeAsync(() => {
      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);
      flush();

      fixture.componentInstance.trigger.handleKeydown(enterEvent);

      expect(enterEvent.defaultPrevented).toBe(
        true,
        'Expected the default action to have been prevented.'
      );
    }));

    it('should not prevent the default enter action for a closed panel after a user action', () => {
      fixture.componentInstance.trigger.handleKeydown(upArrowEvent);
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();
      fixture.componentInstance.trigger.handleKeydown(enterEvent);

      expect(enterEvent.defaultPrevented).toBe(false, 'Default action should not be prevented.');
    });

    it('should fill the text field, not select an option, when SPACE is entered', () => {
      typeInElement(input, 'New');
      fixture.detectChanges();

      const spaceEvent = createKeyboardEvent('keydown', SPACE);
      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);
      fixture.detectChanges();

      fixture.componentInstance.trigger.handleKeydown(spaceEvent);
      fixture.detectChanges();

      expect(input.value).not.toContain('New York', `Expected option not to be selected on SPACE.`);
    });

    it('should mark the control dirty when selecting an option from the keyboard', fakeAsync(() => {
      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        false,
        `Expected control to start out pristine.`
      );

      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);
      flush();
      fixture.componentInstance.trigger.handleKeydown(enterEvent);
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        true,
        `Expected control to become dirty when option was selected by ENTER.`
      );
    }));

    it('should open the panel again when typing after making a selection', fakeAsync(() => {
      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);
      flush();
      fixture.componentInstance.trigger.handleKeydown(enterEvent);
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        false,
        `Expected panel state to read closed after ENTER key.`
      );
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected panel to close after ENTER key.`
      );

      dispatchFakeEvent(input, 'focusin');
      clearElement(input);
      typeInElement(input, 'Eins');
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        true,
        `Expected panel state to read open when typing in input.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Eins',
        `Expected panel to display when typing in input.`
      );
    }));

    it('should not open the panel if the `input` event was dispatched with changing the value', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;

      dispatchFakeEvent(input, 'focusin');
      typeInElement(input, 'A');
      fixture.detectChanges();
      tick();

      expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');

      trigger.closePanel();
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false, 'Expected panel to be closed.');

      // Dispatch the event without actually changing the value
      // to simulate what happen in some cases on IE.
      dispatchFakeEvent(input, 'input');
      fixture.detectChanges();
      tick();

      expect(trigger.panelOpen).toBe(false, 'Expected panel to stay closed.');
    }));

    it('should close the panel when pressing escape', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;

      input.focus();
      flush();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input, 'Expected input to be focused.');
      expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');

      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      fixture.detectChanges();

      expect(document.activeElement).toBe(input, 'Expected input to continue to be focused.');
      expect(trigger.panelOpen).toBe(false, 'Expected panel to be closed.');
    }));

    it('should prevent the default action when pressing escape', fakeAsync(() => {
      const escapeEvent = dispatchKeyboardEvent(input, 'keydown', ESCAPE);
      fixture.detectChanges();

      expect(escapeEvent.defaultPrevented).toBe(true);
    }));

    it('should close the panel when pressing ALT + UP_ARROW', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      const innerUpArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
      Object.defineProperty(innerUpArrowEvent, 'altKey', { get: () => true });

      input.focus();
      flush();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input, 'Expected input to be focused.');
      expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');

      dispatchEvent(document.body, innerUpArrowEvent);
      fixture.detectChanges();

      expect(document.activeElement).toBe(input, 'Expected input to continue to be focused.');
      expect(trigger.panelOpen).toBe(false, 'Expected panel to be closed.');
    }));

    it('should close the panel when tabbing away from a trigger without results', fakeAsync(() => {
      fixture.componentInstance.numbers = [];
      fixture.componentInstance.filteredNumbers = [];
      fixture.detectChanges();
      input.focus();
      flush();

      expect(overlayContainerElement.querySelector('.sbb-autocomplete-panel')).toBeTruthy(
        'Expected panel to be rendered.'
      );

      dispatchKeyboardEvent(input, 'keydown', TAB);
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector('.sbb-autocomplete-panel')).toBeFalsy(
        'Expected panel to be removed.'
      );
    }));

    it('should reset the active option when closing with the escape key', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;

      trigger.openPanel();
      fixture.detectChanges();
      tick();

      expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');
      expect(!!trigger.activeOption).toBe(false, 'Expected no active option.');

      // Press the down arrow a few times.
      [1, 2, 3].forEach(() => {
        trigger.handleKeydown(downArrowEvent);
        tick();
        fixture.detectChanges();
      });

      // Note that this casts to a boolean, in order to prevent Jasmine
      // from crashing when trying to stringify the option if the test fails.
      expect(!!trigger.activeOption).toBe(true, 'Expected to find an active option.');

      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      tick();

      expect(!!trigger.activeOption).toBe(false, 'Expected no active options.');
    }));

    it('should reset the active option when closing by selecting with enter', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;

      trigger.openPanel();
      fixture.detectChanges();
      tick();

      expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');
      expect(!!trigger.activeOption).toBe(false, 'Expected no active option.');

      // Press the down arrow a few times.
      [1, 2, 3].forEach(() => {
        trigger.handleKeydown(downArrowEvent);
        tick();
        fixture.detectChanges();
      });

      // Note that this casts to a boolean, in order to prevent Jasmine
      // from crashing when trying to stringify the option if the test fails.
      expect(!!trigger.activeOption).toBe(true, 'Expected to find an active option.');

      trigger.handleKeydown(enterEvent);
      tick();

      expect(!!trigger.activeOption).toBe(false, 'Expected no active options.');
    }));
  });

  describe('aria', () => {
    let fixture: ComponentFixture<SimpleAutocompleteComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocompleteComponent);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should set role of input to combobox', () => {
      expect(input.getAttribute('role')).toEqual(
        'combobox',
        'Expected role of input to be combobox.'
      );
    });

    it('should set role of autocomplete panel to listbox', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.css('.sbb-autocomplete-panel')).nativeElement;

      expect(panel.getAttribute('role')).toEqual(
        'listbox',
        'Expected role of the panel to be listbox.'
      );
    });

    it('should set aria-autocomplete to list', () => {
      expect(input.getAttribute('aria-autocomplete')).toEqual(
        'list',
        'Expected aria-autocomplete attribute to equal list.'
      );
    });

    it('should set aria-activedescendant based on the active option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.hasAttribute('aria-activedescendant')).toBe(
        false,
        'Expected aria-activedescendant to be absent if no active item.'
      );

      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);

      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.options.first.id,
        'Expected aria-activedescendant to match the active item after 1 down arrow.'
      );

      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.options.toArray()[1].id,
        'Expected aria-activedescendant to match the active item after 2 down arrows.'
      );
    }));

    it('should set aria-expanded based on whether the panel is open', () => {
      expect(input.getAttribute('aria-expanded')).toBe(
        'false',
        'Expected aria-expanded to be false while panel is closed.'
      );

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe(
        'true',
        'Expected aria-expanded to be true while panel is open.'
      );

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe(
        'false',
        'Expected aria-expanded to be false when panel closes again.'
      );
    });

    it('should set aria-expanded properly when the panel is hidden', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      expect(input.getAttribute('aria-expanded')).toBe(
        'true',
        'Expected aria-expanded to be true while panel is open.'
      );

      typeInElement(input, 'zz');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe(
        'false',
        'Expected aria-expanded to be false when panel hides itself.'
      );
    }));

    it('should set aria-owns based on the attached autocomplete', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.css('.sbb-autocomplete-panel')).nativeElement;

      expect(input.getAttribute('aria-owns')).toBe(
        panel.getAttribute('id'),
        'Expected aria-owns to match attached autocomplete.'
      );
    });

    it('should not set aria-owns while the autocomplete is closed', () => {
      expect(input.getAttribute('aria-owns')).toBeFalsy();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-owns')).toBeTruthy();
    });

    it('should restore focus to the input when clicking to select a value', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      // Focus the option manually since the synthetic click may not do it.
      option.focus();
      option.click();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input, 'Expected focus to be restored to the input.');
    }));

    it('should remove autocomplete-specific aria attributes when autocomplete is disabled', () => {
      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      expect(input.getAttribute('role')).toBeFalsy();
      expect(input.getAttribute('aria-autocomplete')).toBeFalsy();
      expect(input.getAttribute('aria-expanded')).toBeFalsy();
      expect(input.getAttribute('aria-owns')).toBeFalsy();
    });
  });

  describe('Option selection', () => {
    let fixture: ComponentFixture<SimpleAutocompleteComponent>;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocompleteComponent);
      fixture.detectChanges();
    });

    it('should deselect any other selected option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      let options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;
      options[0].click();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const componentOptions = fixture.componentInstance.options.toArray();
      expect(componentOptions[0].selected).toBe(true, `Clicked option should be selected.`);

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(componentOptions[0].selected).toBe(false, `Previous option should not be selected.`);
      expect(componentOptions[1].selected).toBe(true, `New Clicked option should be selected.`);
    }));

    it('should call deselect only on the previous selected option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      let options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;
      options[0].click();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const componentOptions = fixture.componentInstance.options.toArray();
      componentOptions.forEach(option => spyOn(option, 'deselect'));

      expect(componentOptions[0].selected).toBe(true, `Clicked option should be selected.`);

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(componentOptions[0].deselect).toHaveBeenCalled();
      componentOptions.slice(1).forEach(option => expect(option.deselect).not.toHaveBeenCalled());
    }));

    it('should be able to preselect the first option', fakeAsync(() => {
      fixture.componentInstance.trigger.autocomplete.autoActiveFirstOption = true;
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(overlayContainerElement.querySelectorAll('sbb-option')[0].classList).toContain(
        'sbb-active',
        'Expected first option to be highlighted.'
      );
    }));

    it('should handle `optionSelections` being accessed too early', fakeAsync(() => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      fixture = TestBed.createComponent(SimpleAutocompleteComponent);

      const spy = jasmine.createSpy('option selection spy');
      let subscription: Subscription;

      expect(fixture.componentInstance.trigger.autocomplete).toBeFalsy();
      expect(() => {
        subscription = fixture.componentInstance.trigger.optionSelections.subscribe(spy);
      }).not.toThrow();

      fixture.detectChanges();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      option.click();
      fixture.detectChanges();
      zone.simulateZoneExit();

      expect(spy).toHaveBeenCalledWith(jasmine.any(SBBOptionSelectionChange));
      // tslint:disable-next-line:no-non-null-assertion
      subscription!.unsubscribe();
    }));
  });

  describe('panel closing', () => {
    let fixture: ComponentFixture<SimpleAutocompleteComponent>;
    let input: HTMLInputElement;
    let trigger: AutocompleteTriggerDirective;
    let closingActionSpy: jasmine.Spy;
    let closingActionsSub: Subscription;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleAutocompleteComponent);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      flush();

      trigger = fixture.componentInstance.trigger;
      closingActionSpy = jasmine.createSpy('closing action listener');
      closingActionsSub = trigger.panelClosingActions.subscribe(closingActionSpy);
    }));

    afterEach(() => {
      closingActionsSub.unsubscribe();
    });

    it('should emit panel close event when clicking away', () => {
      expect(closingActionSpy).not.toHaveBeenCalled();
      dispatchFakeEvent(document, 'click');
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });

    it('should emit panel close event when tabbing out', () => {
      const tabEvent = createKeyboardEvent('keydown', TAB);
      input.focus();

      expect(closingActionSpy).not.toHaveBeenCalled();
      trigger.handleKeydown(tabEvent);
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });

    it('should not emit when tabbing away from a closed panel', () => {
      const tabEvent = createKeyboardEvent('keydown', TAB);

      input.focus();
      zone.simulateZoneExit();

      trigger.handleKeydown(tabEvent);

      // Ensure that it emitted once while the panel was open.
      expect(closingActionSpy).toHaveBeenCalledTimes(1);

      trigger.handleKeydown(tabEvent);

      // Ensure that it didn't emit again when tabbing out again.
      expect(closingActionSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit panel close event when selecting an option', () => {
      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      expect(closingActionSpy).not.toHaveBeenCalled();
      option.click();
      expect(closingActionSpy).toHaveBeenCalledWith(jasmine.any(SBBOptionSelectionChange));
    });

    it('should close the panel when pressing escape', () => {
      expect(closingActionSpy).not.toHaveBeenCalled();
      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('without  ', () => {
    let fixture: ComponentFixture<AutocompleteWithNativeInputComponent>;

    beforeEach(() => {
      fixture = createComponent(AutocompleteWithNativeInputComponent);
      fixture.detectChanges();
    });

    it('should not throw when clicking outside', fakeAsync(() => {
      dispatchFakeEvent(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');
      fixture.detectChanges();
      flush();

      expect(() => dispatchFakeEvent(document, 'click')).not.toThrow();
    }));
  });

  describe('misc', () => {
    it('should allow basic use without any forms directives', () => {
      expect(() => {
        const fixture = createComponent(AutocompleteWithoutFormsComponent);
        fixture.detectChanges();

        const input = fixture.debugElement.query(By.css('input')).nativeElement;
        typeInElement(input, 'eins');
        fixture.detectChanges();

        const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
          HTMLElement
        >;
        expect(options.length).toBe(1);
      }).not.toThrowError();
    });

    it('should display an empty input when the value is undefined with ngModel', () => {
      const fixture = createComponent(AutocompleteWithNgModelComponent);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('input')).nativeElement.value).toBe('');
    });

    it('should display the number when the selected option is the number zero', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithNumbersComponent);

      fixture.componentInstance.selectedNumber = 0;
      fixture.detectChanges();
      tick();

      expect(fixture.debugElement.query(By.css('input')).nativeElement.value).toBe('0');
    }));

    it('should work when input is wrapped in ngIf', () => {
      const fixture = createComponent(NgIfAutocompleteComponent);
      fixture.detectChanges();

      dispatchFakeEvent(fixture.debugElement.query(By.css('input')).nativeElement, 'focusin');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(
        true,
        `Expected panel state to read open when input is focused.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'One',
        `Expected panel to display when input is focused.`
      );
      expect(overlayContainerElement.textContent).toContain(
        'Two',
        `Expected panel to display when input is focused.`
      );
    });

    it('should filter properly with ngIf after setting the active item', () => {
      const fixture = createComponent(NgIfAutocompleteComponent);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      fixture.componentInstance.trigger.handleKeydown(downArrowEvent);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      typeInElement(input, 'o');
      fixture.detectChanges();

      expect(fixture.componentInstance.matOptions.length).toBe(2);
    });

    it('should throw if the user attempts to open the panel too early', () => {
      const fixture = createComponent(AutocompleteWithoutPanelComponent);
      fixture.detectChanges();

      expect(() => {
        fixture.componentInstance.trigger.openPanel();
      }).toThrow(getSbbAutocompleteMissingPanelError());
    });

    it('should not throw on init, even if the panel is not defined', fakeAsync(() => {
      expect(() => {
        const fixture = createComponent(AutocompleteWithoutPanelComponent);
        fixture.componentInstance.control.setValue('Something');
        fixture.detectChanges();
        tick();
      }).not.toThrow();
    }));

    it('should transfer the sbb-autocomplete classes to the panel element', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocompleteComponent);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      tick();
      fixture.detectChanges();

      const autocomplete = fixture.debugElement.nativeElement.querySelector('sbb-autocomplete');
      // tslint:disable-next-line:no-non-null-assertion
      const panel = overlayContainerElement.querySelector('.sbb-autocomplete-panel')!;

      expect(autocomplete.classList).not.toContain('class-one');
      expect(autocomplete.classList).not.toContain('class-two');

      expect(panel.classList).toContain('class-one');
      expect(panel.classList).toContain('class-two');
    }));

    it('should reset correctly when closed programmatically', fakeAsync(() => {
      const scrolledSubject = new Subject();
      const fixture = createComponent(SimpleAutocompleteComponent, [
        {
          provide: ScrollDispatcher,
          useValue: { scrolled: () => scrolledSubject.asObservable() }
        },
        {
          provide: SBB_AUTOCOMPLETE_SCROLL_STRATEGY,
          useFactory: (overlay: Overlay) => () => overlay.scrollStrategies.close(),
          deps: [Overlay]
        }
      ]);

      fixture.detectChanges();
      const trigger = fixture.componentInstance.trigger;

      trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');

      scrolledSubject.next();
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false, 'Expected panel to be closed.');
    }));

    it('should handle autocomplete being attached to number inputs', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithNumberInputAndNgModelComponent);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      typeInElement(input, '1337');
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedValue).toBe(1337);
    }));
  });

  it('should have panel width set to string value', () => {
    const widthFixture = createComponent(SimpleAutocompleteComponent);

    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.autocomplete.panelWidth = 'auto';
    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.width).toBe('auto');
  });

  it('should have panel width set to number value', () => {
    const widthFixture = createComponent(SimpleAutocompleteComponent);

    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.autocomplete.panelWidth = 400;
    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(400);
  });

  it(
    'should show the panel when the options are initialized later within a component with ' +
      'OnPush change detection',
    fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithOnPushDelayComponent);

      fixture.detectChanges();
      dispatchFakeEvent(fixture.debugElement.query(By.css('input')).nativeElement, 'focusin');
      tick(1000);

      fixture.detectChanges();
      tick();

      Promise.resolve().then(() => {
        const panel = overlayContainerElement.querySelector(
          '.sbb-autocomplete-panel'
        ) as HTMLElement;
        const visibleClass = 'sbb-autocomplete-visible';

        fixture.detectChanges();
        expect(panel.classList).toContain(visibleClass, `Expected panel to be visible.`);
      });
    })
  );

  it('should emit an event when an option is selected', fakeAsync(() => {
    const fixture = createComponent(AutocompleteWithSelectEventComponent);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    zone.simulateZoneExit();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
      HTMLElement
    >;
    const spy = fixture.componentInstance.optionSelected;

    options[1].click();
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);

    const event = spy.calls.mostRecent().args[0] as SbbAutocompleteSelectedEvent;

    expect(event.source).toBe(fixture.componentInstance.autocomplete);
    expect(event.option.value).toBe('Zwei');
  }));

  it('should emit an event when a newly-added option is selected', fakeAsync(() => {
    const fixture = createComponent(AutocompleteWithSelectEventComponent);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    tick();
    fixture.detectChanges();

    fixture.componentInstance.numbers.push('Vier');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
      HTMLElement
    >;
    const spy = fixture.componentInstance.optionSelected;

    options[3].click();
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);

    const event = spy.calls.mostRecent().args[0] as SbbAutocompleteSelectedEvent;

    expect(event.source).toBe(fixture.componentInstance.autocomplete);
    expect(event.option.value).toBe('Vier');
  }));

  it('should be able to re-type the same value when it is reset while open', fakeAsync(() => {
    const fixture = createComponent(SimpleAutocompleteComponent);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    const formControl = fixture.componentInstance.numberCtrl;

    typeInElement(input, 'Cal');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(formControl.value).toBe('Cal', 'Expected initial value to be propagated to model');

    formControl.setValue('');
    fixture.detectChanges();

    expect(input.value).toBe('', 'Expected input value to reset when model is reset');

    typeInElement(input, 'Cal');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(formControl.value).toBe('Cal', 'Expected new value to be propagated to model');
  }));
});
