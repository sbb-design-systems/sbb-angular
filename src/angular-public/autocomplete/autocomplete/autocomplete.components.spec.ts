import { DOWN_ARROW, ENTER, ESCAPE, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { _supportsShadowDom } from '@angular/cdk/platform';
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
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  clearElement,
  createKeyboardEvent,
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  MockNgZone,
  typeInElement,
} from '@sbb-esta/angular-core/testing';
import { SbbFormField, SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import {
  SbbOption,
  SbbOptionModule,
  SbbOptionSelectionChange,
} from '@sbb-esta/angular-public/option';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { SbbAutocompleteModule } from '../autocomplete.module';

import { SbbAutocompleteOrigin } from './autocomplete-origin.directive';
import {
  getSbbAutocompleteMissingPanelError,
  SbbAutocompleteTrigger,
  SBB_AUTOCOMPLETE_SCROLL_STRATEGY,
} from './autocomplete-trigger.directive';
import {
  SbbAutocomplete,
  SbbAutocompleteSelectedEvent,
  SBB_AUTOCOMPLETE_DEFAULT_OPTIONS,
} from './autocomplete.component';

const SIMPLE_AUTOCOMPLETE_TEMPLATE = `
  <sbb-form-field [style.width.px]="width">
   <input
      sbbInput
      placeholder="Number"
      [sbbAutocomplete]="auto"
      [sbbAutocompletePosition]="position"
      [sbbAutocompleteDisabled]="autocompleteDisabled"
      [formControl]="numberCtrl"
    />
  </sbb-form-field>
  <sbb-autocomplete
    [class]="panelClass"
    #auto="sbbAutocomplete"
    [displayWith]="displayFn"
    [aria-label]="ariaLabel"
    [aria-labelledby]="ariaLabelledby"
    (opened)="openedSpy()"
    (closed)="closedSpy()"
  >
    <sbb-option *ngFor="let num of filteredNumbers"
      [value]="num"
      [style.height.px]="num.height"
      [disabled]="num.disabled">
      <span>{{ num.code }}: {{ num.name }}</span>
    </sbb-option>
  </sbb-autocomplete>
`;

@Component({
  template: SIMPLE_AUTOCOMPLETE_TEMPLATE,
})
class SimpleAutocomplete implements OnDestroy {
  numberCtrl = new FormControl();
  filteredNumbers: any[];
  valueSub: Subscription;
  position = 'auto';
  width: number;
  autocompleteDisabled = false;
  ariaLabel: string;
  ariaLabelledby: string;
  panelClass = 'class-one class-two';
  openedSpy = jasmine.createSpy('autocomplete opened spy');
  closedSpy = jasmine.createSpy('autocomplete closed spy');

  @ViewChild(SbbAutocompleteTrigger, { static: true })
  trigger: SbbAutocompleteTrigger;
  @ViewChild(SbbAutocomplete, { static: true })
  panel: SbbAutocomplete;
  @ViewChild(SbbFormField) formField: SbbFormField;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;

  numbers: { code: string; name: string; height?: number; disabled?: boolean }[] = [
    { code: '1', name: 'Eins', height: 48 },
    { code: '2', name: 'Zwei', height: 48 },
    { code: '3', name: 'Drei', height: 48 },
    { code: '4', name: 'Vier', height: 48 },
    { code: '5', name: 'Funf', height: 48 },
    { code: '6', name: 'Sechs', height: 48 },
    { code: '7', name: 'Sieben', height: 48 },
    { code: '8', name: 'Acht', height: 48 },
    { code: '9', name: 'Neun', height: 48 },
    { code: '10', name: 'Zehn', height: 48 },
    { code: '11', name: 'Elf', height: 48 },
  ];

  constructor() {
    this.filteredNumbers = this.numbers;
    this.valueSub = this.numberCtrl.valueChanges.subscribe((val) => {
      this.filteredNumbers = val
        ? this.numbers.filter((s) => s.name.match(new RegExp(val, 'gi')))
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

@Component({ template: SIMPLE_AUTOCOMPLETE_TEMPLATE, encapsulation: ViewEncapsulation.ShadowDom })
class SimpleAutocompleteShadowDom extends SimpleAutocomplete {}

@Component({
  template: `
    <sbb-form-field *ngIf="isVisible">
      <input sbbInput placeholder="Choose" [sbbAutocomplete]="auto" [formControl]="optionCtrl" />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let option of filteredOptions | async" [value]="option">
        {{ option }}
      </sbb-option>
    </sbb-autocomplete>
  `,
})
class NgIfAutocomplete {
  optionCtrl = new FormControl();
  filteredOptions: Observable<any>;
  isVisible = true;
  options = ['One', 'Two', 'Three'];

  @ViewChild(SbbAutocompleteTrigger)
  trigger: SbbAutocompleteTrigger;
  @ViewChildren(SbbOption) sbbOptions: QueryList<SbbOption>;

  constructor() {
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(null),
      map((val: string) => {
        return val
          ? this.options.filter((option) => new RegExp(val, 'gi').test(option))
          : this.options.slice();
      })
    );
  }
}

@Component({
  template: `
    <sbb-form-field>
      <input
        sbbInput
        placeholder="Number"
        [sbbAutocomplete]="auto"
        (input)="onInput($event.target?.value)"
      />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let num of filteredNumbers" [value]="num">
        <span> {{ num }} </span>
      </sbb-option>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithoutForms {
  filteredNumbers: any[];
  numbers = ['Eins', 'Zwei', 'Drei'];

  constructor() {
    this.filteredNumbers = this.numbers.slice();
  }

  onInput(value: any) {
    this.filteredNumbers = this.numbers.filter((s) => new RegExp(value, 'gi').test(s));
  }
}

@Component({
  template: `
    <sbb-form-field>
      <input
        sbbInput
        placeholder="Number"
        [sbbAutocomplete]="auto"
        [(ngModel)]="selectedNumber"
        (ngModelChange)="_handleInput($event)"
      />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let num of filteredNumbers" [value]="num">
        <span>{{ num }}</span>
      </sbb-option>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithNgModel {
  filteredNumbers: any[];
  selectedNumber: string;
  numbers = ['Eins', 'Zwei', 'Drei'];

  constructor() {
    this.filteredNumbers = this.numbers.slice();
  }

  _handleInput(value: any) {
    this.filteredNumbers = this.numbers.filter((s) => new RegExp(value, 'gi').test(s));
  }
}

@Component({
  template: `
    <sbb-form-field>
      <input sbbInput placeholder="Number" [sbbAutocomplete]="auto" [(ngModel)]="selectedNumber" />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let number of numbers" [value]="number">
        <span>{{ number }}</span>
      </sbb-option>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithNumbers {
  selectedNumber: number;
  numbers = [0, 1, 2];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sbb-form-field>
      <input type="text" sbbInput [sbbAutocomplete]="auto" />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let option of options" [value]="option">{{ option }}</sbb-option>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithOnPushDelay implements OnInit {
  @ViewChild(SbbAutocompleteTrigger, { static: true })
  trigger: SbbAutocompleteTrigger;
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
  `,
})
class AutocompleteWithNativeInput {
  optionCtrl = new FormControl();
  filteredOptions: Observable<any>;
  options = ['En', 'To', 'Tre', 'Fire', 'Fem'];

  @ViewChild(SbbAutocompleteTrigger) trigger: SbbAutocompleteTrigger;
  @ViewChildren(SbbOption) sbbOptions: QueryList<SbbOption>;

  constructor() {
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(null),
      map((val: string) => {
        return val
          ? this.options.filter((option) => new RegExp(val, 'gi').test(option))
          : this.options.slice();
      })
    );
  }
}

@Component({
  template: `<input placeholder="Choose" [sbbAutocomplete]="auto" [formControl]="control" />`,
})
class AutocompleteWithoutPanel {
  @ViewChild(SbbAutocompleteTrigger) trigger: SbbAutocompleteTrigger;
  control = new FormControl();
}

@Component({
  template: `
    <sbb-form-field>
      <input sbbInput placeholder="State" [sbbAutocomplete]="auto" [(ngModel)]="selectedState" />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option-group *ngFor="let group of stateGroups" [label]="group.label">
        <sbb-option *ngFor="let state of group.states" [value]="state" style="height: 48px">
          <span>{{ state }}</span>
        </sbb-option>
      </sbb-option-group>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithGroups {
  @ViewChild(SbbAutocompleteTrigger) trigger: SbbAutocompleteTrigger;
  selectedState: string;
  stateGroups = [
    {
      title: 'One',
      states: ['Alabama', 'California', 'Florida', 'Oregon'],
    },
    {
      title: 'Two',
      states: ['Kansas', 'Massachusetts', 'New York', 'Pennsylvania'],
    },
    {
      title: 'Three',
      states: ['Tennessee', 'Virginia', 'Wyoming', 'Alaska'],
    },
  ];
}

@Component({
  template: `
    <sbb-form-field>
      <input sbbInput placeholder="State" [sbbAutocomplete]="auto" [(ngModel)]="selectedState" />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <ng-container [ngSwitch]="true">
        <sbb-option-group *ngFor="let group of stateGroups" [label]="group.label">
          <sbb-option *ngFor="let state of group.states" [value]="state">
            <span>{{ state }}</span>
          </sbb-option>
        </sbb-option-group>
      </ng-container>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithIndirectGroups extends AutocompleteWithGroups {}

@Component({
  template: `
    <sbb-form-field>
      <input sbbInput placeholder="Number" [sbbAutocomplete]="auto" [(ngModel)]="selectedNumber" />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete" (optionSelected)="optionSelected($event)">
      <sbb-option *ngFor="let num of numbers" [value]="num">
        <span>{{ num }}</span>
      </sbb-option>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithSelectEvent {
  selectedNumber: string;
  numbers = ['Eins', 'Zwei', 'Drei'];
  optionSelected = jasmine.createSpy('optionSelected callback');

  @ViewChild(SbbAutocompleteTrigger)
  trigger: SbbAutocompleteTrigger;
  @ViewChild(SbbAutocomplete)
  autocomplete: SbbAutocomplete;
}

@Component({
  template: `
    <input [formControl]="formControl" [sbbAutocomplete]="auto" />
    <sbb-autocomplete #auto="sbbAutocomplete"></sbb-autocomplete>
  `,
})
class PlainAutocompleteInputWithFormControl {
  formControl = new FormControl();
}

@Component({
  template: `
    <sbb-form-field>
      <input type="number" sbbInput [sbbAutocomplete]="auto" [(ngModel)]="selectedValue" />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let value of values" [value]="value">{{ value }}</sbb-option>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithNumberInputAndNgModel {
  selectedValue: number;
  values = [1, 2, 3];
}

@Component({
  template: `
    <div>
      <sbb-form-field>
        <input
          sbbInput
          [sbbAutocomplete]="auto"
          [sbbAutocompleteConnectedTo]="connectedTo"
          [(ngModel)]="selectedValue"
        />
      </sbb-form-field>
    </div>

    <div
      class="origin"
      sbbAutocompleteOrigin
      #origin="sbbAutocompleteOrigin"
      style="margin-top: 50px"
    >
      Connection element
    </div>

    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let value of values" [value]="value">{{ value }}</sbb-option>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithDifferentOrigin {
  @ViewChild(SbbAutocompleteTrigger) trigger: SbbAutocompleteTrigger;
  @ViewChild(SbbAutocompleteOrigin) alternateOrigin: SbbAutocompleteOrigin;
  selectedValue: string;
  values = ['one', 'two', 'three'];
  connectedTo?: SbbAutocompleteOrigin;
}

@Component({
  template: `
    <input autocomplete="changed" [(ngModel)]="value" [sbbAutocomplete]="auto" />
    <sbb-autocomplete #auto="sbbAutocomplete"></sbb-autocomplete>
  `,
})
class AutocompleteWithNativeAutocompleteAttribute {
  value: string;
}

@Component({
  template: '<input [sbbAutocomplete]="null" sbbAutocompleteDisabled>',
})
class InputWithoutAutocompleteAndDisabled {}

@Component({
  template: `
    <sbb-form-field>
      <input sbbInput [sbbAutocomplete]="auto" />
    </sbb-form-field>

    <sbb-autocomplete #auto="sbbAutocomplete" (optionActivated)="optionActivated($event)">
      <sbb-option *ngFor="let state of states" [value]="state">{{ state }}</sbb-option>
    </sbb-autocomplete>
  `,
})
class AutocompleteWithActivatedEvent {
  states = ['California', 'West Virginia', 'Florida'];
  optionActivated = jasmine.createSpy('optionActivated callback');

  @ViewChild(SbbAutocompleteTrigger) trigger: SbbAutocompleteTrigger;
  @ViewChild(SbbAutocomplete) autocomplete: SbbAutocomplete;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  template: ` <sbb-form-field>
      <input type="text" sbbInput [(ngModel)]="value" [sbbAutocomplete]="auto" />
    </sbb-form-field>
    <sbb-autocomplete #auto="sbbAutocomplete" [localeNormalizer]="normalizer">
      <sbb-option *ngFor="let option of options" [value]="option">
        {{ option }}
      </sbb-option>
    </sbb-autocomplete>`,
})
class AutocompleteLocaleNormalizer {
  @ViewChild(SbbAutocompleteTrigger, { static: true })
  trigger: SbbAutocompleteTrigger;

  value: string;

  options = ['Faröer', 'Français', 'Hur mår du?', 'Dobry wieczór!', 'Ćao'];

  normalizer: ((value: string) => string) | null = (value: string) =>
    value
      .replace(/[àâäãåá]/gi, 'a')
      .replace(/[ç,ć]/gi, 'c')
      .replace(/[éèêë]/gi, 'e')
      .replace(/[íìîï]/gi, 'i')
      .replace(/[ñ]/gi, 'n')
      .replace(/[òôöóõø]/gi, 'o')
      .replace(/[ùûüú]/gi, 'u');
}

@Component({
  template: `<input type="text" [sbbAutocomplete]="auto" />
    <sbb-autocomplete #auto="sbbAutocomplete" [showHintIfNoOptions]="showHintIfNoOptions">
      <sbb-option *ngIf="showOption">option</sbb-option>
      <sbb-autocomplete-hint *ngIf="showHint">hint</sbb-autocomplete-hint>
    </sbb-autocomplete>`,
})
class AutocompleteHint {
  @ViewChild(SbbAutocompleteTrigger) trigger: SbbAutocompleteTrigger;
  showOption: boolean;
  showHint: boolean;
  showHintIfNoOptions: boolean;
}

describe('SbbAutocomplete', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let zone: MockNgZone;

  // Creates a test component fixture.
  function createComponent<T>(component: Type<T>, providers: Provider[] = []) {
    TestBed.configureTestingModule({
      imports: [
        SbbAutocompleteModule,
        SbbFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        SbbOptionModule,
      ],
      declarations: [component],
      providers: [{ provide: NgZone, useFactory: () => (zone = new MockNgZone()) }, ...providers],
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
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input'))!.nativeElement;
    });

    it('should open the panel when the input is focused', () => {
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

    it(
      'should show the panel when the first open is after the initial zone stabilization',
      waitForAsync(() => {
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
      })
    );

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

    it('should close the panel when the user clicks away via auxilliary button', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();
      dispatchFakeEvent(document, 'auxclick');

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

      let options = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;
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
      expect(fixture.componentInstance.panel.isOpen).toBeFalsy(
        `Expected the panel to be unopened initially.`
      );

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.panel.isOpen).toBeTruthy(
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

    it('should emit the `opened` event if the options come in after the panel is shown', fakeAsync(() => {
      fixture.componentInstance.filteredNumbers = fixture.componentInstance.numbers = [];
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).not.toHaveBeenCalled();

      fixture.componentInstance.filteredNumbers = fixture.componentInstance.numbers = [
        { name: 'California', code: 'CA' },
      ];
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalled();
    }));

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

    it('should set aria-haspopup depending on whether the autocomplete is disabled', () => {
      expect(input.getAttribute('aria-haspopup')).toBe('true');

      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      expect(input.getAttribute('aria-haspopup')).toBe('false');
    });
  });

  it('should not close the panel when clicking on the input', fakeAsync(() => {
    const fixture = createComponent(SimpleAutocomplete);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

    dispatchFakeEvent(input, 'focusin');
    fixture.detectChanges();
    zone.simulateZoneExit();

    expect(fixture.componentInstance.trigger.panelOpen).toBe(
      true,
      'Expected panel to be opened on focus.'
    );

    input.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.trigger.panelOpen).toBe(
      true,
      'Expected panel to remain opened after clicking on the input.'
    );
  }));

  it('should not close the panel when clicking on the input inside shadow DOM', fakeAsync(() => {
    // This test is only relevant for Shadow DOM-capable browsers.
    if (!_supportsShadowDom()) {
      return;
    }

    const fixture = createComponent(SimpleAutocompleteShadowDom);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

    dispatchFakeEvent(input, 'focusin');
    fixture.detectChanges();
    zone.simulateZoneExit();

    expect(fixture.componentInstance.trigger.panelOpen).toBe(
      true,
      'Expected panel to be opened on focus.'
    );

    input.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.trigger.panelOpen).toBe(
      true,
      'Expected panel to remain opened after clicking on the input.'
    );
  }));

  it('should be able to set a custom value for the `autocomplete` attribute', () => {
    const fixture = createComponent(AutocompleteWithNativeAutocompleteAttribute);
    const input = fixture.nativeElement.querySelector('input');

    fixture.detectChanges();

    expect(input.getAttribute('autocomplete')).toBe('changed');
  });

  it('should not throw when typing in an element with a null and disabled autocomplete', () => {
    const fixture = createComponent(InputWithoutAutocompleteAndDisabled);
    fixture.detectChanges();

    expect(() => {
      dispatchKeyboardEvent(fixture.nativeElement.querySelector('input'), 'keydown', SPACE);
      fixture.detectChanges();
    }).not.toThrow();
  });

  describe('forms integration', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
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

    it('should update control value when autofilling', () => {
      // Simulate the browser autofilling the input by setting a value and
      // dispatching an `input` event while the input is out of focus.
      expect(document.activeElement).not.toBe(input, 'Expected input not to have focus.');
      input.value = 'Alabama';
      dispatchFakeEvent(input, 'input');
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.value).toBe(
        'Alabama',
        'Expected value to be propagated to the form control.'
      );
    });

    it('should update control value when option is selected with option value', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.value).toEqual(
        { code: '2', name: 'Zwei', height: 48 },
        'Expected control value to equal the selected option value.'
      );
    }));

    it('should update the control back to a string if user types after an option is selected', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;
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

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(input.value).toContain('Zwei', `Expected text field to fill with selected value.`);
    }));

    it('should fill the text field with value if displayWith is not set', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      fixture.componentInstance.panel.displayWith = null;
      fixture.componentInstance.options.toArray()[1].value = 'test value';
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;
      options[1].click();

      fixture.detectChanges();
      expect(input.value).toContain(
        'test value',
        `Expected input to fall back to selected option's value.`
      );
    }));

    it('should fill the text field correctly if value is set to obj programmatically', fakeAsync(() => {
      fixture.componentInstance.numberCtrl.setValue({
        code: '1',
        name: 'Eins',
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

    it('should disable input in view when disabled programmatically', () => {
      const formFieldElement = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;

      expect(input.disabled).toBe(false, `Expected input to start out enabled in view.`);
      expect(formFieldElement.classList.contains('sbb-form-field-disabled')).toBe(
        false,
        `Expected input underline to start out with normal styles.`
      );

      fixture.componentInstance.numberCtrl.disable();
      fixture.detectChanges();

      expect(input.disabled).toBe(
        true,
        `Expected input to be disabled in view when disabled programmatically.`
      );
      expect(formFieldElement.classList.contains('sbb-form-field-disabled')).toBe(
        true,
        `Expected input underline to display disabled styles.`
      );
    });

    it('should mark the autocomplete control as dirty as user types', () => {
      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        false,
        `Expected control to start out pristine.`
      );

      typeInElement(input, 'a');
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        true,
        `Expected control to become dirty when the user types into the input.`
      );
    });

    it('should mark the autocomplete control as dirty when an option is selected', fakeAsync(() => {
      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        false,
        `Expected control to start out pristine.`
      );

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;
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

    it('should disable the input when used with a value accessor and without `sbbInput`', () => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();

      const plainFixture = createComponent(PlainAutocompleteInputWithFormControl);
      plainFixture.detectChanges();
      input = plainFixture.nativeElement.querySelector('input');

      expect(input.disabled).toBe(false);

      plainFixture.componentInstance.formControl.disable();
      plainFixture.detectChanges();

      expect(input.disabled).toBe(true);
    });
  });

  describe('keyboard events', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;
    let downArrowEvent: KeyboardEvent;
    let upArrowEvent: KeyboardEvent;
    let enterEvent: KeyboardEvent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleAutocomplete);
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
      spyOn(fixture.componentInstance.options.first, 'focus');

      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      expect(fixture.componentInstance.options.first.focus).not.toHaveBeenCalled();
    });

    it('should not close the panel when DOWN key is pressed', () => {
      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);

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
      const optionEls = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;

      expect(componentInstance.trigger.panelOpen).toBe(
        true,
        'Expected first down press to open the pane.'
      );

      componentInstance.trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();

      expect(componentInstance.trigger.activeOption === componentInstance.options.first).toBe(
        true,
        'Expected first option to be active.'
      );
      expect(optionEls[0].classList).toContain('sbb-active');
      expect(optionEls[1].classList).not.toContain('sbb-active');

      componentInstance.trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption === componentInstance.options.toArray()[1]
      ).toBe(true, 'Expected second option to be active.');
      expect(optionEls[0].classList).not.toContain('sbb-active');
      expect(optionEls[1].classList).toContain('sbb-active');
    });

    it('should set the active item to the last option when UP key is pressed', () => {
      const componentInstance = fixture.componentInstance;
      const optionEls = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;

      expect(componentInstance.trigger.panelOpen).toBe(
        true,
        'Expected first up press to open the pane.'
      );

      componentInstance.trigger._handleKeydown(upArrowEvent);
      fixture.detectChanges();

      expect(componentInstance.trigger.activeOption === componentInstance.options.last).toBe(
        true,
        'Expected last option to be active.'
      );
      expect(optionEls[10].classList).toContain('sbb-active');
      expect(optionEls[0].classList).not.toContain('sbb-active');

      componentInstance.trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();

      expect(componentInstance.trigger.activeOption === componentInstance.options.first).toBe(
        true,
        'Expected first option to be active.'
      );
      expect(optionEls[0].classList).toContain('sbb-active');
    });

    it('should set the active item properly after filtering', fakeAsync(() => {
      const componentInstance = fixture.componentInstance;

      componentInstance.trigger._handleKeydown(downArrowEvent);
      tick();
      fixture.detectChanges();
    }));

    it('should set the active item properly after filtering', () => {
      const componentInstance = fixture.componentInstance;

      typeInElement(input, 'e');
      fixture.detectChanges();

      componentInstance.trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();

      const optionEls = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;

      expect(componentInstance.trigger.activeOption === componentInstance.options.first).toBe(
        true,
        'Expected first option to be active.'
      );
      expect(optionEls[0].classList).toContain('sbb-active');
      expect(optionEls[1].classList).not.toContain('sbb-active');
    });

    it('should fill the text field when an option is selected with ENTER', fakeAsync(() => {
      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      flush();
      fixture.detectChanges();

      fixture.componentInstance.trigger._handleKeydown(enterEvent);
      fixture.detectChanges();
      expect(input.value).toContain(
        'Eins',
        `Expected text field to fill with selected value on ENTER.`
      );
    }));

    it('should prevent the default enter key action', fakeAsync(() => {
      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      flush();

      fixture.componentInstance.trigger._handleKeydown(enterEvent);

      expect(enterEvent.defaultPrevented).toBe(
        true,
        'Expected the default action to have been prevented.'
      );
    }));

    it('should not prevent the default enter action for a closed panel after a user action', () => {
      fixture.componentInstance.trigger._handleKeydown(upArrowEvent);
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();
      fixture.componentInstance.trigger._handleKeydown(enterEvent);

      expect(enterEvent.defaultPrevented).toBe(false, 'Default action should not be prevented.');
    });

    it('should fill the text field, not select an option, when SPACE is entered', () => {
      typeInElement(input, 'New');
      fixture.detectChanges();

      const spaceEvent = createKeyboardEvent('keydown', SPACE);
      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();

      fixture.componentInstance.trigger._handleKeydown(spaceEvent);
      fixture.detectChanges();

      expect(input.value).not.toContain('New York', `Expected option not to be selected on SPACE.`);
    });

    it('should mark the control dirty when selecting an option from the keyboard', fakeAsync(() => {
      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        false,
        `Expected control to start out pristine.`
      );

      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      flush();
      fixture.componentInstance.trigger._handleKeydown(enterEvent);
      fixture.detectChanges();

      expect(fixture.componentInstance.numberCtrl.dirty).toBe(
        true,
        `Expected control to become dirty when option was selected by ENTER.`
      );
    }));

    it('should open the panel again when typing after making a selection', fakeAsync(() => {
      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      flush();
      fixture.componentInstance.trigger._handleKeydown(enterEvent);
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

    it('should scroll to active options below the fold', () => {
      const trigger = fixture.componentInstance.trigger;
      const scrollContainer: HTMLElement = document.querySelector(
        '.cdk-overlay-pane .sbb-autocomplete-panel'
      )! as HTMLElement;
      scrollContainer.style.height = '256px'; // set panel height to a small height to enable scrolling

      trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();
      expect(scrollContainer.scrollTop).toEqual(0, `Expected panel not to scroll.`);

      // These down arrows will set the 6th option active, below the fold.
      [1, 2, 3, 4, 5].forEach(() => trigger._handleKeydown(downArrowEvent));

      // Expect option bottom minus the panel height plus padding (288 - 256 + 10 = 42)
      expect(scrollContainer.scrollTop).toEqual(42, `Expected panel to reveal the sixth option.`);
    });

    it('should scroll to active options below if the option height is variable', () => {
      // Make every other option a bit taller than the base of 48.
      fixture.componentInstance.numbers.forEach((number, index) => {
        if (index % 2 === 0) {
          number.height = 64;
        }
      });
      fixture.detectChanges();

      const trigger = fixture.componentInstance.trigger;
      const scrollContainer: HTMLElement = document.querySelector(
        '.cdk-overlay-pane .sbb-autocomplete-panel'
      )! as HTMLElement;
      scrollContainer.style.height = '256px'; // set panel height to a small height to enable scrolling

      trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();
      expect(scrollContainer.scrollTop).toEqual(0, `Expected panel not to scroll.`);

      // These down arrows will set the 6th option active, below the fold.
      [1, 2, 3, 4, 5].forEach(() => trigger._handleKeydown(downArrowEvent));

      // Expect option bottom minus the panel height plus padding (336 - 256 + 10 = 90)
      expect(scrollContainer.scrollTop).toEqual(90, `Expected panel to reveal the sixth option.`);
    });

    it('should scroll to active options on UP arrow', () => {
      const scrollContainer: HTMLElement = document.querySelector(
        '.cdk-overlay-pane .sbb-autocomplete-panel'
      )! as HTMLElement;
      scrollContainer.style.height = '256px'; // set panel height to a small height to enable scrolling

      fixture.componentInstance.trigger._handleKeydown(upArrowEvent);
      fixture.detectChanges();

      // Expect option bottom minus the panel height plus padding (528 - 256 + 10 = 282)
      expect(scrollContainer.scrollTop).toEqual(282, `Expected panel to reveal last option.`);
    });

    it('should not scroll to active options that are fully in the panel', () => {
      const trigger = fixture.componentInstance.trigger;
      const scrollContainer: HTMLElement = document.querySelector(
        '.cdk-overlay-pane .sbb-autocomplete-panel'
      )! as HTMLElement;
      scrollContainer.style.height = '256px'; // set panel height to a small height to enable scrolling
      fixture.detectChanges();

      trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();

      expect(scrollContainer.scrollTop).toEqual(0, `Expected panel not to scroll.`);

      // These down arrows will set the 6th option active, below the fold.
      [1, 2, 3, 4, 5].forEach(() => trigger._handleKeydown(downArrowEvent));

      // Expect option bottom minus the panel height plus padding (288 - 256 + 10 = 42)
      expect(scrollContainer.scrollTop).toEqual(42, `Expected panel to reveal the sixth option.`);

      // These up arrows will set the 2nd option active
      [4, 3, 2, 1].forEach(() => trigger._handleKeydown(upArrowEvent));

      // Expect no scrolling to have occurred. Still showing bottom of 6th option.
      expect(scrollContainer.scrollTop).toEqual(
        42,
        `Expected panel not to scroll up since sixth option still fully visible.`
      );
    });

    it('should scroll to active options that are above the panel', () => {
      const trigger = fixture.componentInstance.trigger;
      const scrollContainer: HTMLElement = document.querySelector(
        '.cdk-overlay-pane .sbb-autocomplete-panel'
      )! as HTMLElement;
      scrollContainer.style.height = '256px'; // set panel height to a small height to enable scrolling

      trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();

      expect(scrollContainer.scrollTop).toEqual(0, `Expected panel not to scroll.`);

      // These down arrows will set the 7th option active, below the fold.
      [1, 2, 3, 4, 5, 6].forEach(() => trigger._handleKeydown(downArrowEvent));

      // These up arrows will set the 2nd option active
      [5, 4, 3, 2, 1].forEach(() => trigger._handleKeydown(upArrowEvent));

      // Expect to show the top of the 2nd option at the top of the panel (including panel padding 10px)
      expect(scrollContainer.scrollTop).toEqual(
        58,
        `Expected panel to scroll up when option is above panel.`
      );
    });

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

    it('should not close the panel when pressing escape with a modifier', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;

      input.focus();
      flush();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input, 'Expected input to be focused.');
      expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');

      const event = dispatchKeyboardEvent(document.body, 'keydown', ESCAPE, undefined, {
        alt: true,
      });
      fixture.detectChanges();

      expect(document.activeElement).toBe(input, 'Expected input to continue to be focused.');
      expect(trigger.panelOpen).toBe(true, 'Expected panel to stay open.');
      expect(event.defaultPrevented).toBe(false, 'Expected default action not to be prevented.');
    }));

    it('should close the panel when pressing ALT + UP_ARROW', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      const upArrowEventWithAltModifier = createKeyboardEvent('keydown', UP_ARROW, undefined, {
        alt: true,
      });
      spyOn(upArrowEventWithAltModifier, 'stopPropagation').and.callThrough();

      input.focus();
      flush();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input, 'Expected input to be focused.');
      expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');

      dispatchEvent(document.body, upArrowEventWithAltModifier);
      fixture.detectChanges();

      expect(document.activeElement).toBe(input, 'Expected input to continue to be focused.');
      expect(trigger.panelOpen).toBe(false, 'Expected panel to be closed.');
      expect(upArrowEventWithAltModifier.stopPropagation).toHaveBeenCalled();
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
        trigger._handleKeydown(downArrowEvent);
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
        trigger._handleKeydown(downArrowEvent);
        tick();
        fixture.detectChanges();
      });

      // Note that this casts to a boolean, in order to prevent Jasmine
      // from crashing when trying to stringify the option if the test fails.
      expect(!!trigger.activeOption).toBe(true, 'Expected to find an active option.');

      trigger._handleKeydown(enterEvent);
      tick();

      expect(!!trigger.activeOption).toBe(false, 'Expected no active options.');
    }));
  });

  describe('option groups', () => {
    let downArrowEvent: KeyboardEvent;
    let upArrowEvent: KeyboardEvent;

    beforeEach(() => {
      downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      upArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
    });

    it('should scroll to active options below the fold', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithGroups);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();
      const container = document.querySelector('.sbb-autocomplete-panel') as HTMLElement;
      container.style.height = '256px';

      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      tick();
      fixture.detectChanges();
      expect(container.scrollTop).toBe(0, 'Expected the panel not to scroll.');

      // Press the down arrow five times.
      [1, 2, 3, 4, 5].forEach(() => {
        fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
        tick();
      });

      // <option bottom> - <panel height> + <2x group labels> + <panel padding>
      // 288 - 256 + 56 + 10 = 98
      expect(container.scrollTop).toBe(98, 'Expected panel to reveal the sixth option.');
    }));

    it('should scroll to active options on UP arrow', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithGroups);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();
      const container = document.querySelector('.sbb-autocomplete-panel') as HTMLElement;
      container.style.height = '256px';

      fixture.componentInstance.trigger._handleKeydown(upArrowEvent);
      tick();
      fixture.detectChanges();

      // <option bottom> - <panel height> + <3x group label> + <panel padding>
      // 576 - 256 + 95 + 10 = 425
      expect(container.scrollTop).toBe(425, 'Expected panel to reveal last option.');
    }));

    it('should scroll to active options that are above the panel', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithGroups);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const container = document.querySelector('.sbb-autocomplete-panel') as HTMLElement;
      container.style.height = '256px';

      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      tick();
      fixture.detectChanges();
      expect(container.scrollTop).toBe(0, 'Expected panel not to scroll.');

      // These down arrows will set the 7th option active, below the fold.
      [1, 2, 3, 4, 5, 6].forEach(() => {
        fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
        tick();
      });

      // These up arrows will set the 2nd option active
      [5, 4, 3, 2, 1].forEach(() => {
        fixture.componentInstance.trigger._handleKeydown(upArrowEvent);
        tick();
      });

      // Expect to show the top of the 2nd option at the top of the panel.
      // It is offset by 28px, because there's a group label above it.
      expect(container.scrollTop).toBe(
        76,
        'Expected panel to scroll up when option is above panel.'
      );
    }));

    it('should scroll back to the top when reaching the first option with preceding group label', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithGroups);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const container = document.querySelector('.sbb-autocomplete-panel') as HTMLElement;

      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      tick();
      fixture.detectChanges();
      expect(container.scrollTop).toBe(0, 'Expected the panel not to scroll.');

      // Press the down arrow five times.
      [1, 2, 3, 4, 5].forEach(() => {
        fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
        tick();
      });

      // Press the up arrow five times.
      [1, 2, 3, 4, 5].forEach(() => {
        fixture.componentInstance.trigger._handleKeydown(upArrowEvent);
        tick();
      });

      expect(container.scrollTop).toBe(0, 'Expected panel to be scrolled to the top.');
    }));

    it('should scroll to active option when group is indirect descendant', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithIndirectGroups);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();
      const container = document.querySelector('.sbb-autocomplete-panel') as HTMLElement;
      container.style.height = '156px';

      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      tick();
      fixture.detectChanges();
      expect(container.scrollTop).toBe(0, 'Expected the panel not to scroll.');

      // Press the down arrow five times.
      [1, 2, 3, 4, 5].forEach(() => {
        fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
        tick();
      });

      // <option bottom> - <panel height> + <2x group labels>
      expect(container.scrollTop).toBe(88, 'Expected panel to reveal the sixth option.');
    }));
  });

  describe('aria', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input'))!.nativeElement;
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

    it('should point the aria-labelledby of the panel to the field label', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.css('.sbb-autocomplete-panel'))!.nativeElement;
      const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
      expect(panel.getAttribute('aria-labelledby')).toBe(labelId);
      expect(panel.hasAttribute('aria-label')).toBe(false);
    });

    it('should add a custom aria-labelledby to the panel', () => {
      fixture.componentInstance.ariaLabelledby = 'myLabelId';
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.css('.sbb-autocomplete-panel'))!.nativeElement;
      const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
      expect(panel.getAttribute('aria-labelledby')).toBe(`${labelId} myLabelId`);
      expect(panel.hasAttribute('aria-label')).toBe(false);
    });

    it('should clear aria-labelledby from the panel if an aria-label is set', () => {
      fixture.componentInstance.ariaLabel = 'My label';
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.css('.sbb-autocomplete-panel'))!.nativeElement;
      expect(panel.getAttribute('aria-label')).toBe('My label');
      expect(panel.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('should support setting a custom aria-label', () => {
      fixture.componentInstance.ariaLabel = 'Custom Label';
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(By.css('.sbb-autocomplete-panel'))!.nativeElement;

      expect(panel.getAttribute('aria-label')).toEqual('Custom Label');
      expect(panel.hasAttribute('aria-labelledby')).toBe(false);
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

      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.options.first.id,
        'Expected aria-activedescendant to match the active item after 1 down arrow.'
      );

      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
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

  describe('Fallback positions', () => {
    it('should use below positioning by default', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      const inputReference = fixture.debugElement.query(By.css('.sbb-form-field input'))!
        .nativeElement;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputBottom = inputReference.getBoundingClientRect().bottom;
      const panel = overlayContainerElement.querySelector('.sbb-autocomplete-panel')!;
      const panelTop = panel.getBoundingClientRect().top;

      expect(Math.round(inputBottom - panelTop)).toEqual(
        1,
        `Expected panel top to match input bottom by default.`
      );
      expect(panel.classList).not.toContain('sbb-panel-above');
    }));

    it('should reposition the panel on scroll', () => {
      const scrolledSubject = new Subject();
      const spacer = document.createElement('div');
      const fixture = createComponent(SimpleAutocomplete, [
        {
          provide: ScrollDispatcher,
          useValue: { scrolled: () => scrolledSubject },
        },
      ]);

      fixture.detectChanges();

      const inputReference = fixture.debugElement.query(By.css('.sbb-form-field input'))!
        .nativeElement;
      spacer.style.height = '1000px';
      document.body.appendChild(spacer);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      window.scroll(0, 100);
      scrolledSubject.next();
      fixture.detectChanges();

      const inputBottom = inputReference.getBoundingClientRect().bottom;
      const panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      const panelTop = panel.getBoundingClientRect().top;

      expect(Math.floor(inputBottom)).toEqual(
        Math.floor(panelTop),
        'Expected panel top to match input bottom after scrolling.'
      );

      document.body.removeChild(spacer);
      window.scroll(0, 0);
    });

    it('should fall back to above position if panel cannot fit below', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      const inputReference = fixture.debugElement.query(By.css('.sbb-form-field input'))!
        .nativeElement;

      // Push the autocomplete trigger down so it won't have room to open "below"
      inputReference.style.bottom = '0';
      inputReference.style.position = 'fixed';

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputTop = inputReference.getBoundingClientRect().top;
      const panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      const panelBottom = panel.getBoundingClientRect().bottom;

      expect(Math.floor(inputTop)).toEqual(
        Math.floor(panelBottom),
        `Expected panel to fall back to above position.`
      );

      expect(panel.classList).toContain('sbb-autocomplete-panel-above');
    }));

    it('should allow the panel to expand when the number of results increases', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input'))!.nativeElement;
      const inputReference = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;

      // Push the element down so it has a little bit of space, but not enough to render.
      inputReference.style.bottom = '10px';
      inputReference.style.position = 'fixed';

      // Type enough to only show one option.
      typeInElement(inputEl, 'California');
      fixture.detectChanges();
      tick();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      let panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      const initialPanelHeight = panel.getBoundingClientRect().height;

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      // Change the text so we get more than one result.
      clearElement(inputEl);
      typeInElement(inputEl, 'C');
      fixture.detectChanges();
      tick();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;

      expect(panel.getBoundingClientRect().height).toBeGreaterThan(initialPanelHeight);
    }));

    it('should align panel properly when filtering in "above" position', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

      // Push the autocomplete trigger down so it won't have room to open "below"
      input.style.bottom = '0';
      input.style.position = 'fixed';

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      typeInElement(input, 'f');
      fixture.detectChanges();
      tick();

      const inputTop = input.getBoundingClientRect().top;
      const panel = overlayContainerElement.querySelector('.sbb-autocomplete-panel')!;
      const panelBottom = panel.getBoundingClientRect().bottom;

      // add horizontal line
      expect(Math.floor(inputTop + 1)).toEqual(
        Math.floor(panelBottom),
        `Expected panel to stay aligned after filtering.`
      );
    }));

    it('should fall back to above position when requested if options are added while the panel is open', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.componentInstance.numbers = fixture.componentInstance.numbers.slice(0, 1);
      fixture.componentInstance.filteredNumbers = fixture.componentInstance.numbers.slice();
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input'))!.nativeElement;
      const inputReference = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;

      // Push the element down so it has a little bit of space, but not enough to render.
      inputReference.style.bottom = '75px';
      inputReference.style.position = 'fixed';

      dispatchFakeEvent(inputEl, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector('.sbb-autocomplete-panel')!;
      let inputRect = inputEl.getBoundingClientRect();
      let panelRect = panel.getBoundingClientRect();

      // add 1px border
      expect(Math.floor(panelRect.top + 1)).toBe(
        Math.floor(inputRect.bottom),
        `Expected panel top to be below input before repositioning.`
      );

      for (let i = 0; i < 20; i++) {
        fixture.componentInstance.filteredNumbers.push({ code: 'FK', name: 'Fake State' });
        fixture.detectChanges();
      }

      // Request a position update now that there are too many suggestions to fit in the viewport.
      fixture.componentInstance.trigger.updatePosition();

      inputRect = inputEl.getBoundingClientRect();
      panelRect = panel.getBoundingClientRect();

      // subtract 1px horizontal line
      expect(Math.floor(panelRect.bottom - 1)).toBe(
        Math.floor(inputRect.top),
        `Expected panel to fall back to above position after repositioning.`
      );
      tick();
    }));

    it('should not throw if a panel reposition is requested while the panel is closed', () => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      expect(() => fixture.componentInstance.trigger.updatePosition()).not.toThrow();
    });

    it('should be able to force below position even if there is not enough space', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.componentInstance.position = 'below';
      fixture.detectChanges();
      const inputReference = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;
      const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

      // Push the autocomplete trigger down so it won't have room to open below.
      inputReference.style.bottom = '0';
      inputReference.style.position = 'fixed';

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputBottom = input.getBoundingClientRect().bottom;
      const panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      const panelTop = panel.getBoundingClientRect().top;

      expect(Math.floor(inputBottom)).toEqual(
        Math.floor(panelTop),
        'Expected panel to be below the input.'
      );

      expect(panel.classList).not.toContain('sbb-autocomplete-panel-above');
    }));

    it('should be able to force above position even if there is not enough space', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.componentInstance.position = 'above';
      fixture.detectChanges();
      const inputReference = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;
      const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

      // Push the autocomplete trigger up so it won't have room to open above.
      inputReference.style.top = '0';
      inputReference.style.position = 'fixed';

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputTop = input.getBoundingClientRect().top;
      const panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      const panelBottom = panel.getBoundingClientRect().bottom;

      expect(Math.floor(inputTop)).toEqual(
        Math.floor(panelBottom),
        'Expected panel to be above the input.'
      );

      expect(panel.classList).toContain('sbb-autocomplete-panel-above');
    }));

    it('should handle the position being changed after the first open', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      const inputReference = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;
      const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

      const openPanel = () => {
        fixture.componentInstance.trigger.openPanel();
        fixture.detectChanges();
        zone.simulateZoneExit();
        fixture.detectChanges();
      };

      // Push the autocomplete trigger down so it won't have room to open below.
      inputReference.style.bottom = '0';
      inputReference.style.position = 'fixed';
      openPanel();

      let inputRect = input.getBoundingClientRect();
      let panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      let panelRect = panel.getBoundingClientRect();

      expect(Math.floor(inputRect.top)).toEqual(
        Math.floor(panelRect.bottom),
        'Expected panel to be above the input.'
      );
      expect(panel.classList).toContain('sbb-autocomplete-panel-above');

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      fixture.componentInstance.position = 'below';
      fixture.detectChanges();
      openPanel();

      inputRect = input.getBoundingClientRect();
      panel = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      panelRect = panel.getBoundingClientRect();

      expect(Math.floor(inputRect.bottom)).toEqual(
        Math.floor(panelRect.top),
        'Expected panel to be below the input.'
      );
      expect(panel.classList).not.toContain('sbb-autocomplete-panel-above');
    }));
  });

  describe('Option selection', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
    });

    it('should deselect any other selected option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      let options = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;
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

      let options = overlayContainerElement.querySelectorAll(
        'sbb-option'
      ) as NodeListOf<HTMLElement>;
      options[0].click();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const componentOptions = fixture.componentInstance.options.toArray();
      componentOptions.forEach((option) => spyOn(option, 'deselect'));

      expect(componentOptions[0].selected).toBe(true, `Clicked option should be selected.`);

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(componentOptions[0].deselect).toHaveBeenCalled();
      componentOptions.slice(1).forEach((option) => expect(option.deselect).not.toHaveBeenCalled());
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

    it(
      'should skip to the next enabled option if the first one is disabled ' +
        'when using `autoActiveFirstOption`',
      fakeAsync(() => {
        const testComponent = fixture.componentInstance;
        testComponent.trigger.autocomplete.autoActiveFirstOption = true;
        testComponent.numbers[0].disabled = true;
        testComponent.numbers[1].disabled = true;
        testComponent.trigger.openPanel();
        fixture.detectChanges();
        zone.simulateZoneExit();
        fixture.detectChanges();

        expect(overlayContainerElement.querySelectorAll('sbb-option')[2].classList).toContain(
          'sbb-active',
          'Expected third option to be highlighted.'
        );
      })
    );

    it('should remove aria-activedescendant when panel is closed with autoActiveFirstOption', fakeAsync(() => {
      const input: HTMLElement = fixture.nativeElement.querySelector('input');

      expect(input.hasAttribute('aria-activedescendant')).toBe(
        false,
        'Expected no active descendant on init.'
      );

      fixture.componentInstance.trigger.autocomplete.autoActiveFirstOption = true;
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toBeTruthy(
        'Expected active descendant while open.'
      );

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(input.hasAttribute('aria-activedescendant')).toBe(
        false,
        'Expected no active descendant when closed.'
      );
    }));

    it('should be able to configure preselecting the first option globally', fakeAsync(() => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();
      fixture = createComponent(SimpleAutocomplete, [
        { provide: SBB_AUTOCOMPLETE_DEFAULT_OPTIONS, useValue: { autoActiveFirstOption: true } },
      ]);

      fixture.detectChanges();
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
      fixture = TestBed.createComponent(SimpleAutocomplete);

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

      expect(spy).toHaveBeenCalledWith(jasmine.any(SbbOptionSelectionChange));
      // tslint:disable-next-line:no-non-null-assertion
      subscription!.unsubscribe();
    }));

    it('should reposition the panel when the amount of options changes', fakeAsync(() => {
      const formField = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;
      const input = formField.querySelector('input');

      formField.style.bottom = '100px';
      formField.style.position = 'fixed';

      typeInElement(input, 'Cali');
      fixture.detectChanges();
      tick();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputBottom = input.getBoundingClientRect().bottom;
      const panel = overlayContainerElement.querySelector('.sbb-autocomplete-panel')!;
      const panelTop = panel.getBoundingClientRect().top;

      // add 2px border to panel top
      expect(Math.floor(inputBottom)).toBe(
        Math.floor(panelTop + 1),
        `Expected panel top to match input bottom when there is only one option.`
      );

      clearElement(input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const inputTop = input.getBoundingClientRect().top;
      const panelBottom = panel.getBoundingClientRect().bottom;

      // subtract 1px horizontal line from panel bottom
      expect(Math.floor(inputTop)).toBe(
        Math.floor(panelBottom - 1),
        `Expected panel switch to the above position if the options no longer fit.`
      );
    }));
  });

  describe('panel closing', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;
    let trigger: SbbAutocompleteTrigger;
    let closingActionSpy: jasmine.Spy;
    let closingActionsSub: Subscription;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input'))!.nativeElement;

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
      trigger._handleKeydown(tabEvent);
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });

    it('should not emit when tabbing away from a closed panel', () => {
      const tabEvent = createKeyboardEvent('keydown', TAB);

      input.focus();
      zone.simulateZoneExit();

      trigger._handleKeydown(tabEvent);

      // Ensure that it emitted once while the panel was open.
      expect(closingActionSpy).toHaveBeenCalledTimes(1);

      trigger._handleKeydown(tabEvent);

      // Ensure that it didn't emit again when tabbing out again.
      expect(closingActionSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit panel close event when selecting an option', () => {
      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      expect(closingActionSpy).not.toHaveBeenCalled();
      option.click();
      expect(closingActionSpy).toHaveBeenCalledWith(jasmine.any(SbbOptionSelectionChange));
    });

    it('should close the panel when pressing escape', () => {
      expect(closingActionSpy).not.toHaveBeenCalled();
      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('without sbbInput', () => {
    let fixture: ComponentFixture<AutocompleteWithNativeInput>;

    beforeEach(() => {
      fixture = createComponent(AutocompleteWithNativeInput);
      fixture.detectChanges();
    });

    it('should not throw when clicking outside', fakeAsync(() => {
      dispatchFakeEvent(fixture.debugElement.query(By.css('input'))!.nativeElement, 'focus');
      fixture.detectChanges();
      flush();

      expect(() => dispatchFakeEvent(document, 'click')).not.toThrow();
    }));
  });

  describe('with panel classes in the default options', () => {
    it('should apply them if provided as string', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete, [
        { provide: SBB_AUTOCOMPLETE_DEFAULT_OPTIONS, useValue: { overlayPanelClass: 'default1' } },
      ]);

      fixture.detectChanges();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panelClassList = overlayContainerElement.querySelector('.cdk-overlay-pane')!.classList;
      expect(panelClassList).toContain('default1');
    }));

    it('should apply them if provided as array', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete, [
        {
          provide: SBB_AUTOCOMPLETE_DEFAULT_OPTIONS,
          useValue: { overlayPanelClass: ['default1', 'default2'] },
        },
      ]);

      fixture.detectChanges();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panelClassList = overlayContainerElement.querySelector('.cdk-overlay-pane')!.classList;
      expect(panelClassList).toContain('default1');
      expect(panelClassList).toContain('default2');
    }));
  });

  describe('misc', () => {
    it('should allow basic use without any forms directives', () => {
      expect(() => {
        const fixture = createComponent(AutocompleteWithoutForms);
        fixture.detectChanges();

        const input = fixture.debugElement.query(By.css('input')).nativeElement;
        typeInElement(input, 'eins');
        fixture.detectChanges();

        const options = overlayContainerElement.querySelectorAll(
          'sbb-option'
        ) as NodeListOf<HTMLElement>;
        expect(options.length).toBe(1);
      }).not.toThrowError();
    });

    it('should display an empty input when the value is undefined with ngModel', () => {
      const fixture = createComponent(AutocompleteWithNgModel);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('input')).nativeElement.value).toBe('');
    });

    it('should display the number when the selected option is the number zero', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithNumbers);

      fixture.componentInstance.selectedNumber = 0;
      fixture.detectChanges();
      tick();

      expect(fixture.debugElement.query(By.css('input')).nativeElement.value).toBe('0');
    }));

    it('should work when input is wrapped in ngIf', () => {
      const fixture = createComponent(NgIfAutocomplete);
      fixture.detectChanges();

      dispatchFakeEvent(fixture.debugElement.query(By.css('input'))!.nativeElement, 'focusin');
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
      const fixture = createComponent(NgIfAutocomplete);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      fixture.componentInstance.trigger._handleKeydown(downArrowEvent);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'))!.nativeElement;
      typeInElement(input, 'o');
      fixture.detectChanges();

      expect(fixture.componentInstance.sbbOptions.length).toBe(2);
    });

    it('should throw if the user attempts to open the panel too early', () => {
      const fixture = createComponent(AutocompleteWithoutPanel);
      fixture.detectChanges();

      expect(() => {
        fixture.componentInstance.trigger.openPanel();
      }).toThrow(getSbbAutocompleteMissingPanelError());
    });

    it('should not throw on init, even if the panel is not defined', fakeAsync(() => {
      expect(() => {
        const fixture = createComponent(AutocompleteWithoutPanel);
        fixture.componentInstance.control.setValue('Something');
        fixture.detectChanges();
        tick();
      }).not.toThrow();
    }));

    it('should transfer the sbb-autocomplete classes to the panel element', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
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

    it('should remove old classes when the panel class changes', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      tick();
      fixture.detectChanges();

      const classList = overlayContainerElement.querySelector('.sbb-autocomplete-panel')!.classList;

      expect(classList).toContain('sbb-autocomplete-visible');
      expect(classList).toContain('class-one');
      expect(classList).toContain('class-two');

      fixture.componentInstance.panelClass = 'class-three class-four';
      fixture.detectChanges();

      expect(classList).not.toContain('class-one');
      expect(classList).not.toContain('class-two');
      expect(classList).toContain('sbb-autocomplete-visible');
      expect(classList).toContain('class-three');
      expect(classList).toContain('class-four');
    }));

    it('should reset correctly when closed programmatically', fakeAsync(() => {
      const scrolledSubject = new Subject();
      const fixture = createComponent(SimpleAutocomplete, [
        {
          provide: ScrollDispatcher,
          useValue: { scrolled: () => scrolledSubject },
        },
        {
          provide: SBB_AUTOCOMPLETE_SCROLL_STRATEGY,
          useFactory: (overlay: Overlay) => () => overlay.scrollStrategies.close(),
          deps: [Overlay],
        },
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
      const fixture = createComponent(AutocompleteWithNumberInputAndNgModel);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

      typeInElement(input, '1337');
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedValue).toBe(1337);
    }));
  });

  it('should have correct width when opened', () => {
    const widthFixture = createComponent(SimpleAutocomplete);
    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    // Firefox, edge return a decimal value for width, so we need to parse and round it to verify
    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(300);

    widthFixture.componentInstance.trigger.closePanel();
    widthFixture.detectChanges();

    widthFixture.componentInstance.width = 500;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    // Firefox, edge return a decimal value for width, so we need to parse and round it to verify
    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(500);
  });

  it('should update the width while the panel is open', () => {
    const widthFixture = createComponent(SimpleAutocomplete);

    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    const input = widthFixture.debugElement.query(By.css('input'))!.nativeElement;

    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(300);

    widthFixture.componentInstance.width = 500;
    widthFixture.detectChanges();

    input.focus();
    dispatchFakeEvent(input, 'input');
    widthFixture.detectChanges();

    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(500);
  });

  it('should not reopen a closed autocomplete when returning to a blurred tab', () => {
    const fixture = createComponent(SimpleAutocomplete);
    fixture.detectChanges();

    const trigger = fixture.componentInstance.trigger;
    const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

    input.focus();
    fixture.detectChanges();

    expect(trigger.panelOpen).toBe(true, 'Expected panel to be open.');

    trigger.closePanel();
    fixture.detectChanges();

    expect(trigger.panelOpen).toBe(false, 'Expected panel to be closed.');

    // Simulate the user going to a different tab.
    dispatchFakeEvent(window, 'blur');
    input.blur();
    fixture.detectChanges();

    // Simulate the user coming back.
    dispatchFakeEvent(window, 'focus');
    input.focus();
    fixture.detectChanges();

    expect(trigger.panelOpen).toBe(false, 'Expected panel to remain closed.');
  });

  it('should update the panel width if the window is resized', fakeAsync(() => {
    const widthFixture = createComponent(SimpleAutocomplete);

    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(300);

    widthFixture.componentInstance.width = 400;
    widthFixture.detectChanges();

    dispatchFakeEvent(window, 'resize');
    tick(20);

    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(400);
  }));

  it('should have panel width match host width by default', () => {
    const widthFixture = createComponent(SimpleAutocomplete);

    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(Math.ceil(parseFloat(overlayPane.style.width as string))).toBe(300);
  });

  it('should have panel width set to string value', () => {
    const widthFixture = createComponent(SimpleAutocomplete);

    widthFixture.componentInstance.width = 300;
    widthFixture.detectChanges();

    widthFixture.componentInstance.trigger.autocomplete.panelWidth = 'auto';
    widthFixture.componentInstance.trigger.openPanel();
    widthFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.width).toBe('auto');
  });

  it('should have panel width set to number value', () => {
    const widthFixture = createComponent(SimpleAutocomplete);

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
      const fixture = createComponent(AutocompleteWithOnPushDelay);

      fixture.detectChanges();
      dispatchFakeEvent(fixture.debugElement.query(By.css('input'))!.nativeElement, 'focusin');
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
    const fixture = createComponent(AutocompleteWithSelectEvent);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    zone.simulateZoneExit();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'sbb-option'
    ) as NodeListOf<HTMLElement>;
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
    const fixture = createComponent(AutocompleteWithSelectEvent);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    tick();
    fixture.detectChanges();

    fixture.componentInstance.numbers.push('Vier');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'sbb-option'
    ) as NodeListOf<HTMLElement>;
    const spy = fixture.componentInstance.optionSelected;

    options[3].click();
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);

    const event = spy.calls.mostRecent().args[0] as SbbAutocompleteSelectedEvent;

    expect(event.source).toBe(fixture.componentInstance.autocomplete);
    expect(event.option.value).toBe('Vier');
  }));

  it('should emit an event when an option is activated', fakeAsync(() => {
    const fixture = createComponent(AutocompleteWithActivatedEvent);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    zone.simulateZoneExit();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    const spy = fixture.componentInstance.optionActivated;
    const autocomplete = fixture.componentInstance.autocomplete;
    const options = fixture.componentInstance.options.toArray();

    expect(spy).not.toHaveBeenCalled();

    dispatchKeyboardEvent(input, 'keydown', DOWN_ARROW);
    fixture.detectChanges();
    expect(spy.calls.mostRecent().args[0]).toEqual({ source: autocomplete, option: options[0] });

    dispatchKeyboardEvent(input, 'keydown', DOWN_ARROW);
    fixture.detectChanges();
    expect(spy.calls.mostRecent().args[0]).toEqual({ source: autocomplete, option: options[1] });

    dispatchKeyboardEvent(input, 'keydown', DOWN_ARROW);
    fixture.detectChanges();
    expect(spy.calls.mostRecent().args[0]).toEqual({ source: autocomplete, option: options[2] });
  }));

  it('should be able to set a custom panel connection element', () => {
    const fixture = createComponent(AutocompleteWithDifferentOrigin);

    fixture.detectChanges();
    fixture.componentInstance.connectedTo = fixture.componentInstance.alternateOrigin;
    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    fixture.detectChanges();
    zone.simulateZoneExit();

    const overlayRect = overlayContainerElement
      .querySelector('.cdk-overlay-pane')!
      .getBoundingClientRect();
    const originRect = fixture.nativeElement.querySelector('.origin').getBoundingClientRect();

    expect(Math.floor(overlayRect.top)).toBe(
      Math.floor(originRect.bottom),
      'Expected autocomplete panel to align with the bottom of the new origin.'
    );
  });

  it('should be able to change the origin after the panel has been opened', () => {
    const fixture = createComponent(AutocompleteWithDifferentOrigin);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    fixture.detectChanges();
    zone.simulateZoneExit();

    fixture.componentInstance.trigger.closePanel();
    fixture.detectChanges();

    fixture.componentInstance.connectedTo = fixture.componentInstance.alternateOrigin;
    fixture.detectChanges();

    fixture.componentInstance.trigger.openPanel();
    fixture.detectChanges();
    zone.simulateZoneExit();

    const overlayRect = overlayContainerElement
      .querySelector('.cdk-overlay-pane')!
      .getBoundingClientRect();
    const originRect = fixture.nativeElement.querySelector('.origin').getBoundingClientRect();

    expect(Math.floor(overlayRect.top)).toBe(
      Math.floor(originRect.bottom),
      'Expected autocomplete panel to align with the bottom of the new origin.'
    );
  });

  it('should be able to re-type the same value when it is reset while open', fakeAsync(() => {
    const fixture = createComponent(SimpleAutocomplete);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'))!.nativeElement;
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

  it('should not close when clicking inside alternate origin', () => {
    const fixture = createComponent(AutocompleteWithDifferentOrigin);
    fixture.detectChanges();
    fixture.componentInstance.connectedTo = fixture.componentInstance.alternateOrigin;
    fixture.detectChanges();
    fixture.componentInstance.trigger.openPanel();
    fixture.detectChanges();
    zone.simulateZoneExit();

    expect(fixture.componentInstance.trigger.panelOpen).toBe(true);

    const origin = fixture.nativeElement.querySelector('.origin');
    origin.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
  });

  describe('highlighting', () => {
    let fixture: ComponentFixture<AutocompleteLocaleNormalizer>;
    let input: HTMLInputElement;

    const countOfHighlightedSnippets = () =>
      overlayContainerElement.querySelectorAll('sbb-option strong').length;

    beforeEach(() => {
      fixture = createComponent(AutocompleteLocaleNormalizer);
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('input');
    });

    it('should highlight normalized options', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();

      expect(countOfHighlightedSnippets()).toBe(0);

      const params = [
        { value: 'test', expectedCount: 0 },
        { value: 'far', expectedCount: 1 },
        { value: 'FAR', expectedCount: 1 },
        { value: 'FÄR', expectedCount: 1 },
        { value: 'fär', expectedCount: 1 },
        { value: 'Ća', expectedCount: 2 },
      ];
      params.forEach(({ expectedCount, value }) => {
        clearElement(input);
        typeInElement(input, value);
        fixture.detectChanges();
        zone.simulateZoneExit();
        expect(countOfHighlightedSnippets()).toBe(expectedCount);
      });
    }));

    it('should highlight non normalized options', fakeAsync(() => {
      fixture.componentInstance.normalizer = null;
      fixture.componentInstance.trigger.openPanel();

      expect(countOfHighlightedSnippets()).toBe(0);

      const params = [
        { value: 'test', expectedCount: 0 },
        { value: 'far', expectedCount: 1 },
        { value: 'FAR', expectedCount: 1 },
        { value: 'FÄR', expectedCount: 0 },
        { value: 'fär', expectedCount: 0 },
        { value: 'Ća', expectedCount: 1 },
      ];
      params.forEach(({ expectedCount, value }) => {
        clearElement(input);
        typeInElement(input, value);
        fixture.detectChanges();
        zone.simulateZoneExit();
        expect(countOfHighlightedSnippets()).toBe(expectedCount);
      });
    }));

    it('should highlight options which are loaded later', () => {
      typeInElement(input, 'far');
      fixture.detectChanges();
      zone.simulateZoneExit();
      expect(countOfHighlightedSnippets()).toBe(1);

      fixture.componentInstance.options.push('Far 2');

      fixture.detectChanges();
      expect(countOfHighlightedSnippets()).toBe(2);
    });

    it('should highlight options when opening dropdown', fakeAsync(() => {
      fixture.componentInstance.value = 'far';
      fixture.detectChanges();
      flush();
      expect(countOfHighlightedSnippets()).toBe(0);

      fixture.componentInstance.trigger.openPanel();

      fixture.detectChanges();
      zone.simulateZoneExit();
      expect(countOfHighlightedSnippets()).toBe(1);
    }));
  });

  describe('hints', () => {
    let fixture: ComponentFixture<AutocompleteHint>;

    beforeEach(() => {
      fixture = createComponent(AutocompleteHint);
      fixture.detectChanges();
    });

    it('should display panel according to options, hints and configuration', () => {
      const params = [
        { option: true, hint: false, showHintIfNoOptions: true, expectedVisible: true },
        { option: true, hint: false, showHintIfNoOptions: false, expectedVisible: true },
        { option: true, hint: true, showHintIfNoOptions: true, expectedVisible: true },
        { option: true, hint: true, showHintIfNoOptions: false, expectedVisible: true },
        { option: false, hint: true, showHintIfNoOptions: true, expectedVisible: true },
        { option: false, hint: true, showHintIfNoOptions: false, expectedVisible: false },
        { option: false, hint: false, showHintIfNoOptions: true, expectedVisible: false },
        { option: false, hint: false, showHintIfNoOptions: false, expectedVisible: false },
      ];

      params.forEach((param) => {
        fixture.componentInstance.showOption = param.option;
        fixture.componentInstance.showHint = param.hint;
        fixture.componentInstance.showHintIfNoOptions = param.showHintIfNoOptions;
        fixture.detectChanges();

        fixture.componentInstance.trigger.openPanel();
        fixture.detectChanges();

        const panel = overlayContainerElement.querySelector('.sbb-autocomplete-panel');
        expect(panel!.classList.contains('sbb-autocomplete-visible')).toBe(
          param.expectedVisible,
          JSON.stringify(param)
        );
        fixture.componentInstance.trigger.closePanel();
        fixture.detectChanges();
      });
    });
  });
});
