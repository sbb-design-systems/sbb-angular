import {
  Component,
  NgZone,
  OnDestroy,
  Provider,
  provideZoneChangeDetection,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbOption, SbbOptionModule } from '@sbb-esta/angular/core';
import { dispatchFakeEvent } from '@sbb-esta/angular/core/testing';
import { SbbFormField } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { Subscription } from 'rxjs';

import { SbbAutocomplete } from './autocomplete';
import { SbbAutocompleteTrigger } from './autocomplete-trigger';
import { SbbAutocompleteModule } from './autocomplete.module';

const SIMPLE_AUTOCOMPLETE_TEMPLATE = `
  <sbb-form-field [style.width.px]="width">
    @if (hasLabel) {
      <sbb-label>State</sbb-label>
    }
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
    [requireSelection]="requireSelection"
    [aria-label]="ariaLabel"
    [aria-labelledby]="ariaLabelledby"
    (opened)="openedSpy()"
    (closed)="closedSpy()"
  >
    @for (num of filteredNumbers; track num) {
      <sbb-option [value]="num" [style.height.px]="num.height" [disabled]="num.disabled">
        <span>{{ num.code }}: {{ num.name }}</span>
      </sbb-option>
     }
  </sbb-autocomplete>
`;

@Component({
  template: SIMPLE_AUTOCOMPLETE_TEMPLATE,
  standalone: false,
})
class SimpleAutocomplete implements OnDestroy {
  numberCtrl = new FormControl<{ name: string; code: string; height?: number } | string | null>(
    null,
  );
  filteredNumbers: any[];
  valueSub: Subscription;
  position = 'auto';
  width: number;
  autocompleteDisabled = false;
  hasLabel = true;
  requireSelection = false;
  ariaLabel: string;
  ariaLabelledby: string;
  panelClass = 'class-one class-two';
  openedSpy = jasmine.createSpy('autocomplete opened spy');
  closedSpy = jasmine.createSpy('autocomplete closed spy');

  @ViewChild(SbbAutocompleteTrigger, { static: true }) trigger: SbbAutocompleteTrigger;
  @ViewChild(SbbAutocomplete, { static: true }) panel: SbbAutocomplete;
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
        ? this.numbers.filter((s) => s.name.match(new RegExp(val as string, 'gi')))
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

describe('SbbAutocomplete Zone.js integration', () => {
  function createComponent<T>(component: Type<T>, providers: Provider[] = []) {
    TestBed.configureTestingModule({
      imports: [
        SbbAutocompleteModule,
        SbbInputModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        SbbOptionModule,
      ],
      declarations: [component],
      providers: [provideZoneChangeDetection(), ...providers],
    });

    return TestBed.createComponent<T>(component);
  }

  it('should emit from `autocomplete.closed` after click outside inside the NgZone', waitForAsync(async () => {
    const inZoneSpy = jasmine.createSpy('in zone spy');

    const fixture = createComponent(SimpleAutocomplete);
    fixture.detectChanges();
    fixture.detectChanges();

    fixture.componentInstance.trigger.openPanel();
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r));

    const subscription = fixture.componentInstance.trigger.autocomplete.closed.subscribe(() =>
      inZoneSpy(NgZone.isInAngularZone()),
    );
    await new Promise((r) => setTimeout(r));

    dispatchFakeEvent(document, 'click');

    expect(inZoneSpy).toHaveBeenCalledWith(true);

    subscription.unsubscribe();
  }));
});
