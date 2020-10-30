import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  A,
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
  QueryList,
  ViewChild,
  ViewChildren,
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
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';
import {
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
} from '@sbb-esta/angular-core/testing';
import { createKeyboardEvent } from '@sbb-esta/angular-core/testing';
import { SbbFieldModule } from '@sbb-esta/angular-public/field';
import { SbbOption, SbbOptionSelectionChange } from '@sbb-esta/angular-public/option';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { SbbSelectModule } from '../select.module';

import { SbbSelect } from './select.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-basic-select',
  template: `
    <div [style.height.px]="heightAbove"></div>
    <sbb-field label="Label">
      <sbb-select
        placeholder="Food"
        [formControl]="control"
        [required]="isRequired"
        [tabIndex]="tabIndexOverride"
        [aria-label]="ariaLabel"
        [aria-labelledby]="ariaLabelledby"
        [panelClass]="panelClass"
        [typeaheadDebounceInterval]="typeaheadDebounceInterval"
      >
        <sbb-option *ngFor="let food of foods" [value]="food.value" [disabled]="food.disabled">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
    <div [style.height.px]="heightBelow"></div>
  `,
})
class BasicSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos', disabled: true },
    { value: 'sandwich-3', viewValue: 'Sandwich' },
    { value: 'chips-4', viewValue: 'Chips' },
    { value: 'eggs-5', viewValue: 'Eggs' },
    { value: 'pasta-6', viewValue: 'Pasta' },
    { value: 'sushi-7', viewValue: 'Sushi' },
  ];
  control = new FormControl();
  isRequired: boolean;
  heightAbove = 0;
  heightBelow = 0;
  tabIndexOverride: number;
  ariaLabel: string;
  ariaLabelledby: string;
  panelClass = ['custom-one', 'custom-two'];
  typeaheadDebounceInterval: number;

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  selector: 'sbb-ng-model-select',
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" ngModel [disabled]="isDisabled">
        <sbb-option *ngFor="let food of foods" [value]="food.value"
          >{{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class NgModelSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  isDisabled: boolean;

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  selector: 'sbb-many-selects',
  template: `
    <sbb-field>
      <sbb-select placeholder="First">
        <sbb-option value="one">one</sbb-option>
        <sbb-option value="two">two</sbb-option>
      </sbb-select>
    </sbb-field>
    <sbb-field>
      <sbb-select placeholder="Second">
        <sbb-option value="three">three</sbb-option>
        <sbb-option value="four">four</sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class ManySelects {}

@Component({
  selector: 'sbb-ng-if-select',
  template: `
    <div *ngIf="isShowing">
      <sbb-field>
        <sbb-select placeholder="Food I want to eat right now" [formControl]="control">
          <sbb-option *ngFor="let food of foods" [value]="food.value">
            {{ food.viewValue }}
          </sbb-option>
        </sbb-select>
      </sbb-field>
    </div>
  `,
})
class NgIfSelect {
  isShowing = false;
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  control = new FormControl('pizza-1');

  @ViewChild(SbbSelect) select: SbbSelect;
}

@Component({
  selector: 'sbb-select-with-change-event',
  template: `
    <sbb-field>
      <sbb-select (selectionChange)="changeListener($event)">
        <sbb-option *ngFor="let food of foods" [value]="food">{{ food }}</sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class SelectWithChangeEvent {
  foods: string[] = [
    'steak-0',
    'pizza-1',
    'tacos-2',
    'sandwich-3',
    'chips-4',
    'eggs-5',
    'pasta-6',
    'sushi-7',
  ];

  changeListener = jasmine.createSpy('SelectComponent change listener');
}

@Component({
  selector: 'sbb-select-init-without-options',
  template: `
    <sbb-field>
      <sbb-select placeholder="Food I want to eat right now" [formControl]="control">
        <sbb-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class SelectInitWithoutOptions {
  foods: any[];
  control = new FormControl('pizza-1');

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;

  addOptions() {
    this.foods = [
      { value: 'steak-0', viewValue: 'Steak' },
      { value: 'pizza-1', viewValue: 'Pizza' },
      { value: 'tacos-2', viewValue: 'Tacos' },
    ];
  }
}

@Component({
  selector: 'sbb-custom-select-accessor',
  template: ` <sbb-field><sbb-select></sbb-select></sbb-field> `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomSelectAccessor,
      multi: true,
    },
  ],
})
class CustomSelectAccessor implements ControlValueAccessor {
  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;

  writeValue: (value?: any) => void = () => {};
  registerOnChange: (changeFn?: (value: any) => void) => void = () => {};
  registerOnTouched: (touchedFn?: () => void) => void = () => {};
}

@Component({
  selector: 'sbb-basic-select-on-push',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [formControl]="control">
        <sbb-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class BasicSelectOnPush {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  control = new FormControl();
}

@Component({
  selector: 'sbb-basic-select-on-push-preselected',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [formControl]="control">
        <sbb-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class BasicSelectOnPushPreselected {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  control = new FormControl('pizza-1');
}

@Component({
  selector: 'sbb-multi-select',
  template: `
    <sbb-field>
      <sbb-select multiple placeholder="Food" [formControl]="control">
        <sbb-option *ngFor="let food of foods" [value]="food.value"
          >{{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class MultiSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: 'sandwich-3', viewValue: 'Sandwich' },
    { value: 'chips-4', viewValue: 'Chips' },
    { value: 'eggs-5', viewValue: 'Eggs' },
    { value: 'pasta-6', viewValue: 'Pasta' },
    { value: 'sushi-7', viewValue: 'Sushi' },
  ];
  control = new FormControl();

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  selector: 'sbb-select-with-plain-tabindex',
  template: ` <sbb-field><sbb-select tabindex="5"></sbb-select></sbb-field> `,
})
class SelectWithPlainTabindex {}

@Component({
  selector: 'sbb-select-early-sibling-access',
  template: `
    <sbb-field>
      <sbb-select #select="sbbSelect"></sbb-select>
    </sbb-field>
    <div *ngIf="select.selected"></div>
  `,
})
class SelectEarlyAccessSibling {}

@Component({
  selector: 'sbb-basic-select-initially-hidden',
  template: `
    <sbb-field>
      <sbb-select [style.display]="isVisible ? 'block' : 'none'">
        <sbb-option value="value">There are no other options</sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class BasicSelectInitiallyHidden {
  isVisible = false;
}

@Component({
  selector: 'sbb-basic-select-no-placeholder',
  template: `
    <sbb-field>
      <sbb-select>
        <sbb-option value="value">There are no other options</sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class BasicSelectNoPlaceholder {}

@Component({
  template: `
    <sbb-field>
      <sbb-select [formControl]="control">
        <sbb-option *ngFor="let food of foods" [value]="food.value"
          >{{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class FalsyValueSelect {
  foods: any[] = [
    { value: 0, viewValue: 'Steak' },
    { value: 1, viewValue: 'Pizza' },
  ];
  control = new FormControl();
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  selector: 'sbb-select-with-groups',
  template: `
    <sbb-field>
      <sbb-select placeholder="Pokemon" [formControl]="control">
        <sbb-option-group
          *ngFor="let group of pokemonTypes"
          [label]="group.name"
          [disabled]="group.disabled"
        >
          <sbb-option *ngFor="let pokemon of group.pokemon" [value]="pokemon.value">
            {{ pokemon.viewValue }}
          </sbb-option>
        </sbb-option-group>
        <sbb-option value="mime-11">Mr. Mime</sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class SelectWithGroups {
  control = new FormControl();
  pokemonTypes = [
    {
      name: 'Grass',
      pokemon: [
        { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
        { value: 'oddish-1', viewValue: 'Oddish' },
        { value: 'bellsprout-2', viewValue: 'Bellsprout' },
      ],
    },
    {
      name: 'Water',
      disabled: true,
      pokemon: [
        { value: 'squirtle-3', viewValue: 'Squirtle' },
        { value: 'psyduck-4', viewValue: 'Psyduck' },
        { value: 'horsea-5', viewValue: 'Horsea' },
      ],
    },
    {
      name: 'Fire',
      pokemon: [
        { value: 'charmander-6', viewValue: 'Charmander' },
        { value: 'vulpix-7', viewValue: 'Vulpix' },
        { value: 'flareon-8', viewValue: 'Flareon' },
      ],
    },
    {
      name: 'Psychic',
      pokemon: [
        { value: 'mew-9', viewValue: 'Mew' },
        { value: 'mewtwo-10', viewValue: 'Mewtwo' },
      ],
    },
  ];

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  selector: 'sbb-select-with-groups',
  template: `
    <sbb-field>
      <sbb-select placeholder="Pokemon" [formControl]="control">
        <sbb-option-group *ngFor="let group of pokemonTypes" [label]="group.name">
          <ng-container *ngFor="let pokemon of group.pokemon">
            <sbb-option [value]="pokemon.value">{{ pokemon.viewValue }}</sbb-option>
          </ng-container>
        </sbb-option-group>
      </sbb-select>
    </sbb-field>
  `,
})
class SelectWithGroupsAndNgContainer {
  control = new FormControl();
  pokemonTypes = [
    {
      name: 'Grass',
      pokemon: [{ value: 'bulbasaur-0', viewValue: 'Bulbasaur' }],
    },
  ];
}

@Component({
  template: `
    <form>
      <sbb-field>
        <sbb-select [(ngModel)]="value"></sbb-select>
      </sbb-field>
    </form>
  `,
})
class InvalidSelectInForm {
  value: any;
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <sbb-field>
        <sbb-select placeholder="Food" formControlName="food">
          <sbb-option value="steak-0">Steak</sbb-option>
          <sbb-option value="pizza-1">Pizza</sbb-option>
        </sbb-select>

        <sbb-form-error>This field is required</sbb-form-error>
      </sbb-field>
    </form>
  `,
})
class SelectInsideFormGroup {
  @ViewChild(FormGroupDirective, { static: true }) formGroupDirective: FormGroupDirective;
  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  formControl = new FormControl('', Validators.required);
  formGroup = new FormGroup({
    food: this.formControl,
  });
}

@Component({
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [(value)]="selectedFood">
        <sbb-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class BasicSelectWithoutForms {
  selectedFood: string | null;
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'sandwich-2', viewValue: 'Sandwich' },
  ];

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
}

@Component({
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [(value)]="selectedFood">
        <sbb-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class BasicSelectWithoutFormsPreselected {
  selectedFood = 'pizza-1';
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
}

@Component({
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [(value)]="selectedFoods" multiple>
        <sbb-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class BasicSelectWithoutFormsMultiple {
  selectedFoods: string[];
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'sandwich-2', viewValue: 'Sandwich' },
  ];

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
}

@Component({
  selector: 'sbb-ng-model-compare-with',
  template: `
    <sbb-field>
      <sbb-select
        [ngModel]="selectedFood"
        (ngModelChange)="setFoodByCopy($event)"
        [compareWith]="comparator"
      >
        <sbb-option *ngFor="let food of foods" [value]="food">{{ food.viewValue }}</sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class NgModelCompareWithSelect {
  foods: { value: string; viewValue: string }[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  selectedFood: { value: string; viewValue: string } = {
    value: 'pizza-1',
    viewValue: 'Pizza',
  };
  comparator: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;

  useCompareByValue() {
    this.comparator = this.compareByValue;
  }

  useCompareByReference() {
    this.comparator = this.compareByReference;
  }

  useNullComparator() {
    this.comparator = null;
  }

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.value === f2.value;
  }

  compareByReference(f1: any, f2: any) {
    return f1 === f2;
  }

  setFoodByCopy(newValue: { value: string; viewValue: string }) {
    this.selectedFood = { ...{}, ...newValue };
  }
}

@Component({
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [(ngModel)]="selectedFoods">
        <sbb-option *ngFor="let food of foods" [value]="food.value"
          >{{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class SingleSelectWithPreselectedArrayValues {
  foods: any[] = [
    { value: ['steak-0', 'steak-1'], viewValue: 'Steak' },
    { value: ['pizza-1', 'pizza-2'], viewValue: 'Pizza' },
    { value: ['tacos-2', 'tacos-3'], viewValue: 'Tacos' },
  ];

  selectedFoods = this.foods[1].value;

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  template: `
    <sbb-field>
      <sbb-label>Select a thing</sbb-label>

      <sbb-select [placeholder]="placeholder">
        <sbb-option value="thing">A thing</sbb-option>
      </sbb-select>
    </sbb-field>
  `,
})
class SelectWithFormFieldLabel {
  placeholder: string;
}

/** Default debounce interval when typing letters to select an option. */
const DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL = 200;

describe('SbbSelect', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const scrolledSubject = new Subject();
  let platform: Platform;

  /**
   * Configures the test module for SelectComponent with the given declarations. This is broken out so
   * that we're only compiling the necessary test components for each test in order to speed up
   * overall test time.
   * @param declarations Components to declare for this block
   */
  function configureSbbSelectTestingModule(declarations: any[]) {
    TestBed.configureTestingModule({
      imports: [
        SbbSelectModule,
        SbbIconTestingModule,
        SbbFieldModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      declarations: declarations,
      providers: [
        {
          provide: ScrollDispatcher,
          useFactory: () => ({
            scrolled: () => scrolledSubject.asObservable(),
            register() {},
            deregister() {},
          }),
        },
      ],
    }).compileComponents();

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(
      waitForAsync(() => {
        configureSbbSelectTestingModule([
          BasicSelect,
          MultiSelect,
          SelectWithGroups,
          SelectWithGroupsAndNgContainer,
          SelectWithFormFieldLabel,
          SelectWithChangeEvent,
        ]);
      })
    );

    describe('accessibility', () => {
      describe('for select', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let select: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicSelect);
          fixture.detectChanges();
          select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
        }));

        it('should set the role of the select to combobox', fakeAsync(() => {
          expect(select.getAttribute('role')).toEqual('combobox');
          expect(select.getAttribute('aria-autocomplete')).toBe('none');
          expect(select.getAttribute('aria-haspopup')).toBe('true');
        }));

        it('should point the aria-controls attribute to the listbox', fakeAsync(() => {
          expect(select.hasAttribute('aria-controls')).toBe(false);

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const ariaControls = select.getAttribute('aria-controls');
          expect(ariaControls).toBeTruthy();
          expect(ariaControls).toBe(document.querySelector('.sbb-select-panel')!.id);
        }));

        it('should point the aria-owns attribute to the listbox on the trigger', fakeAsync(() => {
          const trigger = select.querySelector('.sbb-select-trigger')!;
          expect(trigger.hasAttribute('aria-owns')).toBe(false);

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const ariaOwns = trigger.getAttribute('aria-owns');
          expect(ariaOwns).toBeTruthy();
          expect(ariaOwns).toBe(document.querySelector('.sbb-select-panel')!.id);
        }));

        it('should set aria-expanded based on the select open state', fakeAsync(() => {
          expect(select.getAttribute('aria-expanded')).toBe('false');

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          expect(select.getAttribute('aria-expanded')).toBe('true');
        }));

        it('should support setting a custom aria-label', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();

          expect(select.getAttribute('aria-label')).toEqual('Custom Label');
          expect(select.hasAttribute('aria-labelledby')).toBeFalsy();
        }));

        it('should be able to add an extra aria-labelledby on top of the default', fakeAsync(() => {
          fixture.componentInstance.ariaLabelledby = 'myLabelId';
          fixture.detectChanges();

          const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
          const valueId = fixture.nativeElement.querySelector('.sbb-select-value').id;

          expect(select.getAttribute('aria-labelledby')).toBe(`${labelId} ${valueId} myLabelId`);
        }));

        it('should set aria-labelledby to the value and label IDs', fakeAsync(() => {
          fixture.detectChanges();

          const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
          const valueId = fixture.nativeElement.querySelector('.sbb-select-value').id;
          expect(select.getAttribute('aria-labelledby')).toBe(`${labelId} ${valueId}`);
        }));

        it('should set the tabindex of the select to 0 by default', fakeAsync(() => {
          expect(select.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to override the tabindex', fakeAsync(() => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.detectChanges();

          expect(select.getAttribute('tabindex')).toBe('3');
        }));

        it('should set aria-required for required selects', fakeAsync(() => {
          expect(select.getAttribute('aria-required')).toEqual(
            'false',
            `Expected aria-required attr to be false for normal selects.`
          );

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.getAttribute('aria-required')).toEqual(
            'true',
            `Expected aria-required attr to be true for required selects.`
          );
        }));

        it('should set the sbb-select-required class for required selects', fakeAsync(() => {
          expect(select.classList).not.toContain(
            'sbb-select-required',
            `Expected the sbb-select-required class not to be set.`
          );

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.classList).toContain(
            'sbb-select-required',
            `Expected the sbb-select-required class to be set.`
          );
        }));

        it('should set aria-invalid for selects that are invalid and touched', fakeAsync(() => {
          expect(select.getAttribute('aria-invalid')).toEqual(
            'false',
            `Expected aria-invalid attr to be false for valid selects.`
          );

          fixture.componentInstance.isRequired = true;
          fixture.componentInstance.control.markAsTouched();
          fixture.detectChanges();

          expect(select.getAttribute('aria-invalid')).toEqual(
            'true',
            `Expected aria-invalid attr to be true for invalid selects.`
          );
        }));

        it('should set aria-disabled for disabled selects', fakeAsync(() => {
          expect(select.getAttribute('aria-disabled')).toEqual('false');

          fixture.componentInstance.control.disable();
          fixture.detectChanges();

          expect(select.getAttribute('aria-disabled')).toEqual('true');
        }));

        it('should set the tabindex of the select to -1 if disabled', fakeAsync(() => {
          fixture.componentInstance.control.disable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('-1');

          fixture.componentInstance.control.enable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('0');
        }));

        it('should set `aria-labelledby` to the value ID if there is no form field', () => {
          fixture.destroy();

          const labelFixture = TestBed.createComponent(SelectWithChangeEvent);
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
          const valueId = labelFixture.nativeElement.querySelector('.sbb-select-value').id;

          expect(select.getAttribute('aria-labelledby')?.trim()).toBe(valueId);
        });

        it('should select options via the UP/DOWN arrow keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(options[0].selected).toBe(true, 'Expected first option to be selected.');
          expect(formControl.value).toBe(
            options[0].value,
            'Expected value from first option to have been set on the model.'
          );

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected).toBe(true, 'Expected fourth option to be selected.');
          expect(formControl.value).toBe(
            options[3].value,
            'Expected value from fourth option to have been set on the model.'
          );

          dispatchKeyboardEvent(select, 'keydown', UP_ARROW);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(
            options[1].value,
            'Expected value from second option to have been set on the model.'
          );

          flush();
        }));

        it(
          'should go back to first option if value is reset after interacting using the' +
            'arrow keys on a closed select',
          fakeAsync(() => {
            const formControl = fixture.componentInstance.control;
            const options = fixture.componentInstance.options.toArray();

            expect(formControl.value).toBeFalsy('Expected no initial value.');

            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
            flush();

            expect(options[0].selected).toBe(true, 'Expected first option to be selected.');
            expect(formControl.value).toBe(
              options[0].value,
              'Expected value from first option to have been set on the model.'
            );

            formControl.reset();
            fixture.detectChanges();

            expect(options[0].selected).toBe(false, 'Expected first option to be deselected.');
            expect(formControl.value).toBeFalsy('Expected value to be reset.');

            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
            flush();

            expect(options[0].selected).toBe(true, 'Expected first option to be selected again.');
            expect(formControl.value).toBe(
              options[0].value,
              'Expected value from first option to have been set on the model again.'
            );
          })
        );

        it('should select first/last options via the HOME/END keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const firstOption = fixture.componentInstance.options.first;
          const lastOption = fixture.componentInstance.options.last;

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          const endEvent = dispatchKeyboardEvent(select, 'keydown', END);

          expect(endEvent.defaultPrevented).toBe(true);
          expect(lastOption.selected).toBe(true, 'Expected last option to be selected.');
          expect(formControl.value).toBe(
            lastOption.value,
            'Expected value from last option to have been set on the model.'
          );

          const homeEvent = dispatchKeyboardEvent(select, 'keydown', HOME);

          expect(homeEvent.defaultPrevented).toBe(true);
          expect(firstOption.selected).toBe(true, 'Expected first option to be selected.');
          expect(formControl.value).toBe(
            firstOption.value,
            'Expected value from first option to have been set on the model.'
          );

          flush();
        }));

        it('should resume focus from selected item after selecting via click', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          (overlayContainerElement.querySelectorAll('sbb-option')[3] as HTMLElement).click();
          fixture.detectChanges();
          flush();

          expect(formControl.value).toBe(options[3].value);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          fixture.detectChanges();

          expect(formControl.value).toBe(options[4].value);
          flush();
        }));

        it('should select options via LEFT/RIGHT arrow keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          expect(options[0].selected).toBe(true, 'Expected first option to be selected.');
          expect(formControl.value).toBe(
            options[0].value,
            'Expected value from first option to have been set on the model.'
          );

          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);
          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected).toBe(true, 'Expected fourth option to be selected.');
          expect(formControl.value).toBe(
            options[3].value,
            'Expected value from fourth option to have been set on the model.'
          );

          dispatchKeyboardEvent(select, 'keydown', LEFT_ARROW);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(
            options[1].value,
            'Expected value from second option to have been set on the model.'
          );
          flush();
        }));

        it('should announce changes via the keyboard on a closed select', fakeAsync(
          inject([LiveAnnouncer], (liveAnnouncer: LiveAnnouncer) => {
            spyOn(liveAnnouncer, 'announce');

            dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

            expect(liveAnnouncer.announce).toHaveBeenCalledWith('Steak', jasmine.any(Number));

            flush();
          })
        ));

        it('should not throw when reaching a reset option using the arrow keys on a closed select', fakeAsync(() => {
          fixture.componentInstance.foods = [
            { value: 'steak-0', viewValue: 'Steak' },
            { value: null, viewValue: 'None' },
          ];
          fixture.detectChanges();
          fixture.componentInstance.control.setValue('steak-0');

          expect(() => {
            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
            fixture.detectChanges();
          }).not.toThrow();

          flush();
        }));

        it('should open a single-selection select using ALT + DOWN_ARROW', fakeAsync(() => {
          const { control: formControl, select: selectInstance } = fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(formControl.value).toBeFalsy('Expected no initial value.');

          const event = createKeyboardEvent('keydown', DOWN_ARROW, undefined, { alt: true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');
          expect(formControl.value).toBeFalsy('Expected value not to have changed.');
        }));

        it('should open a single-selection select using ALT + UP_ARROW', fakeAsync(() => {
          const { control: formControl, select: selectInstance } = fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(formControl.value).toBeFalsy('Expected no initial value.');

          const event = createKeyboardEvent('keydown', UP_ARROW, undefined, { alt: true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');
          expect(formControl.value).toBeFalsy('Expected value not to have changed.');
        }));

        it('should close when pressing ALT + DOWN_ARROW', fakeAsync(() => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');

          const event = createKeyboardEvent('keydown', DOWN_ARROW, undefined, { alt: true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(event.defaultPrevented).toBe(true, 'Expected default action to be prevented.');
        }));

        it('should close when pressing ALT + UP_ARROW', fakeAsync(() => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');

          const event = createKeyboardEvent('keydown', UP_ARROW, undefined, { alt: true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(event.defaultPrevented).toBe(true, 'Expected default action to be prevented.');
        }));

        it('should be able to select options by typing on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchEvent(select, createKeyboardEvent('keydown', 80, 'p'));
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(
            options[1].value,
            'Expected value from second option to have been set on the model.'
          );

          dispatchEvent(select, createKeyboardEvent('keydown', 69, 'e'));
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL);

          expect(options[5].selected).toBe(true, 'Expected sixth option to be selected.');
          expect(formControl.value).toBe(
            options[5].value,
            'Expected value from sixth option to have been set on the model.'
          );
        }));

        it('should not open the select when pressing space while typing', fakeAsync(() => {
          const selectInstance = fixture.componentInstance.select;

          fixture.componentInstance.typeaheadDebounceInterval = DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL;
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed on init.');

          dispatchEvent(select, createKeyboardEvent('keydown', 80, 'p'));
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL / 2);
          fixture.detectChanges();

          dispatchKeyboardEvent(select, 'keydown', SPACE);
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(
            false,
            'Expected select to remain closed after space was pressed.'
          );

          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL / 2);
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(
            false,
            'Expected select to be closed when the timer runs out.'
          );
        }));

        it('should be able to customize the typeahead debounce interval', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          fixture.componentInstance.typeaheadDebounceInterval = 1337;
          fixture.detectChanges();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchEvent(select, createKeyboardEvent('keydown', 80, 'p'));
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL);

          expect(formControl.value).toBeFalsy('Expected no value after a bit of time has passed.');

          tick(1337);

          expect(options[1].selected).toBe(
            true,
            'Expected second option to be selected after all the time has passed.'
          );
          expect(formControl.value).toBe(
            options[1].value,
            'Expected value from second option to have been set on the model.'
          );
        }));

        it('should open the panel when pressing a vertical arrow key on a closed multiple select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          const initialValue = instance.control.value;

          expect(instance.select.panelOpen).toBe(false, 'Expected panel to be closed.');

          const event = dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(instance.select.panelOpen).toBe(true, 'Expected panel to be open.');
          expect(instance.control.value).toBe(initialValue, 'Expected value to stay the same.');
          expect(event.defaultPrevented).toBe(true, 'Expected default to be prevented.');
        }));

        it('should open the panel when pressing a horizontal arrow key on closed multiple select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          const initialValue = instance.control.value;

          expect(instance.select.panelOpen).toBe(false, 'Expected panel to be closed.');

          const event = dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          expect(instance.select.panelOpen).toBe(true, 'Expected panel to be open.');
          expect(instance.control.value).toBe(initialValue, 'Expected value to stay the same.');
          expect(event.defaultPrevented).toBe(true, 'Expected default to be prevented.');
        }));

        it('should do nothing when typing on a closed multi-select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          const initialValue = instance.control.value;

          expect(instance.select.panelOpen).toBe(false, 'Expected panel to be closed.');

          dispatchEvent(select, createKeyboardEvent('keydown', 80, 'p'));

          expect(instance.select.panelOpen).toBe(false, 'Expected panel to stay closed.');
          expect(instance.control.value).toBe(initialValue, 'Expected value to stay the same.');
        }));

        it('should do nothing if the key manager did not change the active item', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          expect(formControl.value).toBeNull('Expected form control value to be empty.');
          expect(formControl.pristine).toBe(true, 'Expected form control to be clean.');

          dispatchKeyboardEvent(select, 'keydown', 16); // Press a random key.

          expect(formControl.value).toBeNull('Expected form control value to stay empty.');
          expect(formControl.pristine).toBe(true, 'Expected form control to stay clean.');
        }));

        it('should continue from the selected option when the value is set programmatically', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          fixture.detectChanges();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value).toBe('pasta-6');
          expect(fixture.componentInstance.options.toArray()[6].selected).toBe(true);
          flush();
        }));

        it(
          'should not shift focus when the selected options are updated programmatically ' +
            'in a multi select',
          fakeAsync(() => {
            fixture.destroy();

            const multiFixture = TestBed.createComponent(MultiSelect);

            multiFixture.detectChanges();
            select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
            multiFixture.componentInstance.select.open();
            multiFixture.detectChanges();

            const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
              HTMLElement
            >;

            options[3].focus();
            expect(document.activeElement).toBe(
              options[3],
              'Expected fourth option to be focused.'
            );

            multiFixture.componentInstance.control.setValue(['steak-0', 'sushi-7']);
            multiFixture.detectChanges();

            expect(document.activeElement).toBe(
              options[3],
              'Expected fourth option to remain focused.'
            );
          })
        );

        it('should not cycle through the options if the control is disabled', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          formControl.disable();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value).toBe('eggs-5', 'Expected value to remain unchaged.');
        }));

        it('should not wrap selection after reaching the end of the options', fakeAsync(() => {
          const lastOption = fixture.componentInstance.options.last;

          fixture.componentInstance.options.forEach(() => {
            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          });

          expect(lastOption.selected).toBe(true, 'Expected last option to be selected.');

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(lastOption.selected).toBe(true, 'Expected last option to stay selected.');

          flush();
        }));

        it('should not open a multiple select when tabbing through', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          expect(multiFixture.componentInstance.select.panelOpen).toBe(
            false,
            'Expected panel to be closed initially.'
          );

          dispatchKeyboardEvent(select, 'keydown', TAB);

          expect(multiFixture.componentInstance.select.panelOpen).toBe(
            false,
            'Expected panel to stay closed.'
          );
        }));

        it('should toggle the next option when pressing shift + DOWN_ARROW on a multi-select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const event = createKeyboardEvent('keydown', DOWN_ARROW, undefined, { shift: true });

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          multiFixture.componentInstance.select.open();
          multiFixture.detectChanges();
          flush();

          expect(multiFixture.componentInstance.select.value).toBeFalsy();

          dispatchEvent(select, event);
          multiFixture.detectChanges();

          expect(multiFixture.componentInstance.select.value).toEqual(['pizza-1']);

          dispatchEvent(select, event);
          multiFixture.detectChanges();

          expect(multiFixture.componentInstance.select.value).toEqual(['pizza-1', 'tacos-2']);
        }));

        it('should toggle the previous option when pressing shift + UP_ARROW on a multi-select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const event = createKeyboardEvent('keydown', UP_ARROW, undefined, { shift: true });

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          multiFixture.componentInstance.select.open();
          multiFixture.detectChanges();
          flush();

          // Move focus down first.
          for (let i = 0; i < 5; i++) {
            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
            multiFixture.detectChanges();
          }

          expect(multiFixture.componentInstance.select.value).toBeFalsy();

          dispatchEvent(select, event);
          multiFixture.detectChanges();

          expect(multiFixture.componentInstance.select.value).toEqual(['chips-4']);

          dispatchEvent(select, event);
          multiFixture.detectChanges();

          expect(multiFixture.componentInstance.select.value).toEqual(['sandwich-3', 'chips-4']);
        }));

        it('should prevent the default action when pressing space', fakeAsync(() => {
          const event = dispatchKeyboardEvent(select, 'keydown', SPACE);
          expect(event.defaultPrevented).toBe(true);
        }));

        it('should prevent the default action when pressing enter', fakeAsync(() => {
          const event = dispatchKeyboardEvent(select, 'keydown', ENTER);
          expect(event.defaultPrevented).toBe(true);
        }));

        it('should not prevent the default actions on selection keys when pressing a modifier', fakeAsync(() => {
          [ENTER, SPACE].forEach((key) => {
            const event = createKeyboardEvent('keydown', key, undefined, { shift: true });
            expect(event.defaultPrevented).toBe(false);
          });
        }));

        it('should consider the selection a result of a user action when closed', fakeAsync(() => {
          const option = fixture.componentInstance.options.first;
          const spy = jasmine.createSpy('option selection spy');
          const subscription = option.onSelectionChange
            .pipe(map((e) => e.isUserInput))
            .subscribe(spy);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          expect(spy).toHaveBeenCalledWith(true);

          subscription.unsubscribe();
          flush();
        }));

        it('should be able to focus the select trigger', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already

          fixture.componentInstance.select.focus();

          expect(document.activeElement).toBe(select, 'Expected select element to be focused.');
        }));

        it('should set `aria-multiselectable` to true on the listbox inside multi select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
          multiFixture.componentInstance.select.open();
          multiFixture.detectChanges();
          flush();

          const panel = document.querySelector('.sbb-select-panel')!;
          expect(panel.getAttribute('aria-multiselectable')).toBe('true');
        }));

        it('should set aria-multiselectable false on single-selection instances', fakeAsync(() => {
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const panel = document.querySelector('.sbb-select-panel')!;
          expect(panel.getAttribute('aria-multiselectable')).toBe('false');
        }));

        it('should set aria-activedescendant only while the panel is open', fakeAsync(() => {
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();

          const host = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          expect(host.hasAttribute('aria-activedescendant')).toBe(
            false,
            'Expected no aria-activedescendant on init.'
          );

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('sbb-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[4].id,
            'Expected aria-activedescendant to match the active option.'
          );

          fixture.componentInstance.select.close();
          fixture.detectChanges();
          flush();

          expect(host.hasAttribute('aria-activedescendant')).toBe(
            false,
            'Expected no aria-activedescendant when closed.'
          );
        }));

        it('should set aria-activedescendant based on the focused option', fakeAsync(() => {
          const host = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('sbb-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(options[0].id);

          [1, 2, 3].forEach(() => {
            dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
            fixture.detectChanges();
          });

          expect(host.getAttribute('aria-activedescendant')).toBe(options[4].id);

          dispatchKeyboardEvent(host, 'keydown', UP_ARROW);
          fixture.detectChanges();

          expect(host.getAttribute('aria-activedescendant')).toBe(options[3].id);
        }));

        it('should not change the aria-activedescendant using the horizontal arrow keys', fakeAsync(() => {
          const host = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('sbb-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(options[0].id);

          [1, 2, 3].forEach(() => {
            dispatchKeyboardEvent(host, 'keydown', RIGHT_ARROW);
            fixture.detectChanges();
          });

          expect(host.getAttribute('aria-activedescendant')).toBe(options[0].id);
        }));

        it('should restore focus to the trigger after selecting an option in multi-select mode', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
          instance.select.open();
          multiFixture.detectChanges();

          // Ensure that the select isn't focused to begin with.
          select.blur();
          expect(document.activeElement).not.toBe(select, 'Expected trigger not to be focused.');

          const option = overlayContainerElement.querySelector('sbb-option')! as HTMLElement;
          option.click();
          multiFixture.detectChanges();

          expect(document.activeElement).toBe(select, 'Expected trigger to be focused.');
        }));

        it('should set a role of listbox on the select panel', fakeAsync(() => {
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const panel = document.querySelector('.sbb-select-panel')!;
          expect(panel.getAttribute('role')).toBe('listbox');
        }));

        it('should point the aria-labelledby of the panel to the field label', fakeAsync(() => {
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
          const panel = document.querySelector('.sbb-select-panel')!;
          expect(panel.getAttribute('aria-labelledby')).toBe(labelId);
        }));

        it('should add a custom aria-labelledby to the panel', fakeAsync(() => {
          fixture.componentInstance.ariaLabelledby = 'myLabelId';
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
          const panel = document.querySelector('.sbb-select-panel')!;
          expect(panel.getAttribute('aria-labelledby')).toBe(`${labelId} myLabelId`);
        }));

        it('should clear aria-labelledby from the panel if an aria-label is set', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'My label';
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const panel = document.querySelector('.sbb-select-panel')!;
          expect(panel.getAttribute('aria-label')).toBe('My label');
          expect(panel.hasAttribute('aria-labelledby')).toBe(false);
        }));
      });

      describe('for options', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let trigger: HTMLElement;
        let options: HTMLElement[];

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicSelect);
          fixture.detectChanges();
          trigger = fixture.debugElement.query(By.css('.sbb-select-trigger'))!.nativeElement;
          trigger.click();
          fixture.detectChanges();

          options = Array.from(overlayContainerElement.querySelectorAll('sbb-option'));
        }));

        it('should set the role of sbb-option to option', fakeAsync(() => {
          expect(options[0].getAttribute('role')).toEqual('option');
          expect(options[1].getAttribute('role')).toEqual('option');
          expect(options[2].getAttribute('role')).toEqual('option');
        }));

        it('should set aria-selected on each option for single select', fakeAsync(() => {
          expect(options.every((option) => !option.hasAttribute('aria-selected'))).toBe(
            true,
            'Expected all unselected single-select options not to have aria-selected set.'
          );

          options[1].click();
          fixture.detectChanges();

          trigger.click();
          fixture.detectChanges();
          flush();

          expect(options[1].getAttribute('aria-selected')).toEqual(
            'true',
            'Expected selected single-select option to have aria-selected="true".'
          );
          options.splice(1, 1);
          expect(options.every((option) => !option.hasAttribute('aria-selected'))).toBe(
            true,
            'Expected all unselected single-select options not to have aria-selected set.'
          );
        }));

        it('should set aria-selected on each option for multi-select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          multiFixture.detectChanges();

          trigger = multiFixture.debugElement.query(By.css('.sbb-select-trigger'))!.nativeElement;
          trigger.click();
          multiFixture.detectChanges();

          options = Array.from(overlayContainerElement.querySelectorAll('sbb-option'));

          expect(
            options.every(
              (option) =>
                option.hasAttribute('aria-selected') &&
                option.getAttribute('aria-selected') === 'false'
            )
          ).toBe(
            true,
            'Expected all unselected multi-select options to have aria-selected="false".'
          );

          options[1].click();
          multiFixture.detectChanges();

          trigger.click();
          multiFixture.detectChanges();
          flush();

          expect(options[1].getAttribute('aria-selected')).toEqual(
            'true',
            'Expected selected multi-select option to have aria-selected="true".'
          );
          options.splice(1, 1);
          expect(
            options.every(
              (option) =>
                option.hasAttribute('aria-selected') &&
                option.getAttribute('aria-selected') === 'false'
            )
          ).toBe(
            true,
            'Expected all unselected multi-select options to have aria-selected="false".'
          );
        }));

        it('should set the tabindex of each option according to disabled state', fakeAsync(() => {
          expect(options[0].getAttribute('tabindex')).toEqual('0');
          expect(options[1].getAttribute('tabindex')).toEqual('0');
          expect(options[2].getAttribute('tabindex')).toEqual('-1');
        }));

        it('should set aria-disabled for disabled options', fakeAsync(() => {
          expect(options[0].getAttribute('aria-disabled')).toEqual('false');
          expect(options[1].getAttribute('aria-disabled')).toEqual('false');
          expect(options[2].getAttribute('aria-disabled')).toEqual('true');

          fixture.componentInstance.foods[2]['disabled'] = false;
          fixture.detectChanges();

          expect(options[0].getAttribute('aria-disabled')).toEqual('false');
          expect(options[1].getAttribute('aria-disabled')).toEqual('false');
          expect(options[2].getAttribute('aria-disabled')).toEqual('false');
        }));

        it('should remove the active state from options that have been deselected while closed', fakeAsync(() => {
          let activeOptions = options.filter((option) => option.classList.contains('sbb-active'));
          expect(activeOptions).toEqual(
            [options[0]],
            'Expected first option to have active styles.'
          );

          options[1].click();
          fixture.detectChanges();
          trigger.click();
          fixture.detectChanges();
          flush();

          activeOptions = options.filter((option) => option.classList.contains('sbb-active'));
          expect(activeOptions).toEqual(
            [options[1]],
            'Expected only selected option to be marked as active after it is clicked.'
          );

          fixture.componentInstance.control.setValue(fixture.componentInstance.foods[7].value);
          fixture.detectChanges();
          trigger.click();
          fixture.detectChanges();
          flush();

          activeOptions = options.filter((option) => option.classList.contains('sbb-active'));
          expect(activeOptions).toEqual(
            [options[7]],
            'Expected only selected option to be marked as active after the value has changed.'
          );
        }));
      });

      describe('for option groups', () => {
        let fixture: ComponentFixture<SelectWithGroups>;
        let trigger: HTMLElement;
        let groups: NodeListOf<HTMLElement>;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(SelectWithGroups);
          fixture.detectChanges();
          trigger = fixture.debugElement.query(By.css('.sbb-select-trigger'))!.nativeElement;
          trigger.click();
          fixture.detectChanges();
          groups = overlayContainerElement.querySelectorAll('sbb-option-group') as NodeListOf<
            HTMLElement
          >;
        }));

        it('should set the appropriate role', fakeAsync(() => {
          expect(groups[0].getAttribute('role')).toBe('group');
        }));

        it('should set the `aria-labelledby` attribute', fakeAsync(() => {
          const group = groups[0];
          const label = group.querySelector('label')!;

          expect(label.getAttribute('id')).toBeTruthy('Expected label to have an id.');
          expect(group.getAttribute('aria-labelledby')).toBe(
            label.getAttribute('id'),
            'Expected `aria-labelledby` to match the label id.'
          );
        }));

        it('should set the `aria-disabled` attribute if the group is disabled', fakeAsync(() => {
          expect(groups[1].getAttribute('aria-disabled')).toBe('true');
        }));
      });
    });

    describe('overlay panel', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;
      let select: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      });

      it('should not throw when attempting to open too early', () => {
        // Create component and then immediately open without running change detection
        fixture = TestBed.createComponent(BasicSelect);
        expect(() => fixture.componentInstance.select.open()).not.toThrow();
      });

      it('should open the panel when trigger is clicked', () => {
        trigger.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(overlayContainerElement.textContent).toContain('Steak');
        expect(overlayContainerElement.textContent).toContain('Pizza');
        expect(overlayContainerElement.textContent).toContain('Tacos');
      });

      it('should close the panel when an item is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should close the panel when a click occurs outside the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const backdrop = overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop'
        ) as HTMLElement;

        backdrop.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should not attempt to open a select that does not have any options', fakeAsync(() => {
        fixture.componentInstance.foods = [];
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should close the panel when tabbing out', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);

        dispatchKeyboardEvent(select, 'keydown', TAB);
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should restore focus to the host before tabbing away', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);

        // Use a spy since focus can be flaky in unit tests.
        spyOn(select, 'focus').and.callThrough();

        dispatchKeyboardEvent(select, 'keydown', TAB);
        fixture.detectChanges();
        flush();

        expect(select.focus).toHaveBeenCalled();
      }));

      it('should close when tabbing out from inside the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);

        // tslint:disable-next-line:no-non-null-assertion
        const panel = overlayContainerElement.querySelector('.sbb-select-panel')!;
        dispatchKeyboardEvent(panel, 'keydown', TAB);
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should focus the first option when pressing HOME', () => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();

        const event = dispatchKeyboardEvent(select, 'keydown', HOME);
        fixture.detectChanges();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(0);
        expect(event.defaultPrevented).toBe(true);
      });

      it('should focus the last option when pressing END', () => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();

        const event = dispatchKeyboardEvent(select, 'keydown', END);
        fixture.detectChanges();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(7);
        expect(event.defaultPrevented).toBe(true);
      });

      it('should be able to set extra classes on the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();
        const panel = overlayContainerElement.querySelector('.sbb-select-panel') as HTMLElement;

        expect(panel.classList).toContain('custom-one');
        expect(panel.classList).toContain('custom-two');
      }));

      it('should prevent the default action when pressing SPACE on an option', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();
        // tslint:disable-next-line:no-non-null-assertion
        const option = overlayContainerElement.querySelector('sbb-option')!;
        const event = dispatchKeyboardEvent(option, 'keydown', SPACE);

        expect(event.defaultPrevented).toBe(true);
      }));

      it('should prevent the default action when pressing ENTER on an option', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const option = overlayContainerElement.querySelector('sbb-option')!;
        const event = dispatchKeyboardEvent(option, 'keydown', ENTER);

        expect(event.defaultPrevented).toBe(true);
      }));

      it(
        'should not consider itself as blurred if the trigger loses focus while the ' +
          'panel is still open',
        fakeAsync(() => {
          const selectElement = fixture.nativeElement.querySelector('.sbb-select');
          const selectInstance = fixture.componentInstance.select;

          dispatchFakeEvent(selectElement, 'focus');
          fixture.detectChanges();
          flush();

          expect(selectInstance.focused).toBe(true, 'Expected select to be focused.');

          selectInstance.open();
          fixture.detectChanges();
          flush();
          dispatchFakeEvent(selectElement, 'blur');
          fixture.detectChanges();

          expect(selectInstance.focused).toBe(true, 'Expected select element to remain focused.');
        })
      );
    });

    describe('selection logic', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;
      let select: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      });

      it('should select an option when it is clicked', () => {
        trigger.click();
        fixture.detectChanges();

        let option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();

        option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

        expect(option.classList).toContain('sbb-selected');
        expect(fixture.componentInstance.options.first.selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(
          fixture.componentInstance.options.first
        );
      });

      it('should be able to select an option using the OptionComponent API', () => {
        trigger.click();
        fixture.detectChanges();

        const optionInstances = fixture.componentInstance.options.toArray();
        const optionNodes: NodeListOf<HTMLElement> = overlayContainerElement.querySelectorAll(
          'sbb-option'
        );

        optionInstances[1].select();
        fixture.detectChanges();

        expect(optionNodes[1].classList).toContain('sbb-selected');
        expect(optionInstances[1].selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(optionInstances[1]);
      });

      it('should deselect other options when one is selected', () => {
        trigger.click();
        fixture.detectChanges();

        let options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
          HTMLElement
        >;

        options[0].click();
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();

        options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        expect(options[1].classList).not.toContain('sbb-selected');
        expect(options[2].classList).not.toContain('sbb-selected');

        const optionInstances = fixture.componentInstance.options.toArray();
        expect(optionInstances[1].selected).toBe(false);
        expect(optionInstances[2].selected).toBe(false);
      });

      it('should deselect other options when one is programmatically selected', fakeAsync(() => {
        const control = fixture.componentInstance.control;
        const foods = fixture.componentInstance.foods;

        trigger.click();
        fixture.detectChanges();
        flush();

        let options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
          HTMLElement
        >;

        options[0].click();
        fixture.detectChanges();
        flush();

        control.setValue(foods[1].value);
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;

        expect(options[0].classList).not.toContain(
          'sbb-selected',
          'Expected first option to no longer be selected'
        );
        expect(options[1].classList).toContain(
          'sbb-selected',
          'Expected second option to be selected'
        );

        const optionInstances = fixture.componentInstance.options.toArray();

        expect(optionInstances[0].selected).toBe(
          false,
          'Expected first option to no longer be selected'
        );
        expect(optionInstances[1].selected).toBe(true, 'Expected second option to be selected');
      }));

      it('should remove selection if option has been removed', fakeAsync(() => {
        const selectComponent = fixture.componentInstance.select;

        trigger.click();
        fixture.detectChanges();
        flush();

        const firstOption = overlayContainerElement.querySelectorAll(
          'sbb-option'
        )[0] as HTMLElement;

        firstOption.click();
        fixture.detectChanges();

        expect(selectComponent.selected).toBe(
          selectComponent.options.first,
          'Expected first option to be selected.'
        );

        fixture.componentInstance.foods = [];
        fixture.detectChanges();
        flush();

        expect(selectComponent.selected).toBeUndefined(
          'Expected selection to be removed when option no longer exists.'
        );
      }));

      it('should display the selected option in the trigger', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        const value = fixture.debugElement.query(By.css('.sbb-select-value')).nativeElement;

        expect(value.textContent).toContain('Steak');
      }));

      it('should focus the selected option if an option is selected', fakeAsync(() => {
        // must wait for initial writeValue promise to finish
        flush();

        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        // must wait for animation to finish
        fixture.detectChanges();
        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toEqual(1);
      }));

      it('should select an option that was added after initialization', fakeAsync(() => {
        fixture.componentInstance.foods.push({
          viewValue: 'Potatoes',
          value: 'potatoes-8',
        });
        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
          HTMLElement
        >;
        options[8].click();
        fixture.detectChanges();
        flush();

        expect(select.textContent).toContain('Potatoes');
        expect(fixture.componentInstance.select.selected).toBe(
          fixture.componentInstance.options.last
        );
      }));

      it('should update the trigger when the selected option label is changed', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        expect(select.textContent!.trim()).toBe('Pizza');

        fixture.componentInstance.foods[1].viewValue = 'Calzone';
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        expect(select.textContent!.trim()).toBe('Calzone');
      }));

      it('should not select disabled options', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
          HTMLElement
        >;
        options[2].click();
        fixture.detectChanges();
        flush();
        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[2].classList).not.toContain('sbb-selected');
        expect(fixture.componentInstance.select.selected).toBeUndefined();
      }));

      it('should not select options inside a disabled group', fakeAsync(() => {
        fixture.destroy();
        flush();

        const groupFixture = TestBed.createComponent(SelectWithGroups);
        groupFixture.detectChanges();
        groupFixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement.click();
        groupFixture.detectChanges();

        const disabledGroup = overlayContainerElement.querySelectorAll('sbb-option-group')[1];
        const options = disabledGroup.querySelectorAll('sbb-option');

        (options[0] as HTMLElement).click();
        groupFixture.detectChanges();
        flush();

        expect(groupFixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[0].classList).not.toContain('sbb-selected');
        expect(groupFixture.componentInstance.select.selected).toBeUndefined();
      }));

      it('should not throw if triggerValue accessed with no selected value', fakeAsync(() => {
        expect(() => fixture.componentInstance.select.triggerValue).not.toThrow();
      }));

      it('should emit to `optionSelectionChanges` when an option is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const spy = jasmine.createSpy('option selection spy');
        const subscription = fixture.componentInstance.select.optionSelectionChanges.subscribe(spy);
        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledWith(jasmine.any(SbbOptionSelectionChange));

        subscription.unsubscribe();
      }));
    });

    describe('forms integration', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;
      let select: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      });

      it('should take an initial view value with reactive forms', () => {
        fixture.componentInstance.control = new FormControl('pizza-1');
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent).toContain(
          'Pizza',
          `Expected trigger to be populated by the control's initial value.`
        );

        trigger.click();
        fixture.detectChanges();

        const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
          HTMLElement
        >;
        expect(options[1].classList).toContain(
          'sbb-selected',
          `Expected option with the control's initial value to be selected.`
        );
      });

      it('should set the view value from the form', () => {
        let value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent.trim()).toBe('Food');

        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent).toContain(
          'Pizza',
          `Expected trigger to be populated by the control's new value.`
        );

        trigger.click();
        fixture.detectChanges();

        const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
          HTMLElement
        >;
        expect(options[1].classList).toContain(
          'sbb-selected',
          `Expected option with the control's new value to be selected.`
        );
      });

      it('should update the form value when the view changes', () => {
        expect(fixture.componentInstance.control.value).toEqual(
          null,
          `Expected the control's value to be empty initially.`
        );

        trigger.click();
        fixture.detectChanges();

        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.control.value).toEqual(
          'steak-0',
          `Expected control's value to be set to the new option.`
        );
      });

      it('should clear the selection when a nonexistent option value is selected', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        fixture.componentInstance.control.setValue('gibberish');
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent.trim()).toBe(
          'Food',
          `Expected trigger to show the placeholder.`
        );
        expect(select.textContent).not.toContain(
          'Pizza',
          `Expected trigger is cleared when option value is not found.`
        );

        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
          HTMLElement
        >;
        expect(options[1].classList).not.toContain(
          'sbb-selected',
          `Expected option w/ the old value not to be selected.`
        );
      }));

      it('should clear the selection when the control is reset', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();
        flush();

        fixture.componentInstance.control.reset();
        fixture.detectChanges();
        flush();

        const value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent.trim()).toBe(
          'Food',
          `Expected trigger to show the placeholder.`
        );
        expect(select.textContent).not.toContain(
          'Pizza',
          `Expected trigger is cleared when option value is not found.`
        );

        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
          HTMLElement
        >;
        expect(options[1].classList).not.toContain(
          'sbb-selected',
          `Expected option w/ the old value not to be selected.`
        );
      }));

      it('should set the control to touched when the select is blurred', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched).toEqual(
          false,
          `Expected the control to start off as untouched.`
        );

        trigger.click();
        dispatchFakeEvent(select, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched).toEqual(
          false,
          `Expected the control to stay untouched when menu opened.`
        );

        const backdrop = overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop'
        ) as HTMLElement;
        backdrop.click();
        dispatchFakeEvent(select, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched).toEqual(
          true,
          `Expected the control to be touched as soon as focus left the select.`
        );
      }));

      it('should set the control to touched when the panel is closed', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched).toBe(
          false,
          'Expected the control to start off as untouched.'
        );

        trigger.click();
        dispatchFakeEvent(select, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched).toBe(
          false,
          'Expected the control to stay untouched when menu opened.'
        );

        fixture.componentInstance.select.close();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched).toBe(
          true,
          'Expected the control to be touched when the panel was closed.'
        );
      }));

      it('should not set touched when a disabled select is touched', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched).toBe(
          false,
          'Expected the control to start off as untouched.'
        );

        fixture.componentInstance.control.disable();
        dispatchFakeEvent(select, 'blur');

        expect(fixture.componentInstance.control.touched).toBe(
          false,
          'Expected the control to stay untouched.'
        );
      }));

      it('should set the control to dirty when the select value changes in DOM', fakeAsync(() => {
        expect(fixture.componentInstance.control.dirty).toEqual(
          false,
          `Expected control to start out pristine.`
        );

        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.dirty).toEqual(
          true,
          `Expected control to be dirty after value was changed by user.`
        );
      }));

      it('should not set the control to dirty when the value changes programmatically', fakeAsync(() => {
        expect(fixture.componentInstance.control.dirty).toEqual(
          false,
          `Expected control to start out pristine.`
        );

        fixture.componentInstance.control.setValue('pizza-1');

        expect(fixture.componentInstance.control.dirty).toEqual(
          false,
          `Expected control to stay pristine after programmatic change.`
        );
      }));
    });

    describe('disabled behavior', () => {
      it('should disable itself when control is disabled programmatically', () => {
        const fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();

        fixture.componentInstance.control.disable();
        fixture.detectChanges();

        const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
        const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        expect(getComputedStyle(select).getPropertyValue('cursor')).toEqual(
          'default',
          `Expected cursor to be default arrow on disabled control.`
        );

        trigger.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent).toEqual(
          '',
          `Expected select panel to stay closed.`
        );
        expect(fixture.componentInstance.select.panelOpen).toBe(
          false,
          `Expected select panelOpen property to stay false.`
        );

        fixture.componentInstance.control.enable();
        fixture.detectChanges();
        expect(getComputedStyle(select).getPropertyValue('cursor')).toEqual(
          'pointer',
          `Expected cursor to be a pointer on enabled control.`
        );

        trigger.click();
        fixture.detectChanges();
        expect(overlayContainerElement.textContent).toContain(
          'Steak',
          `Expected select panel to open normally on re-enabled control`
        );
        expect(fixture.componentInstance.select.panelOpen).toBe(
          true,
          `Expected select panelOpen property to become true.`
        );
      });
    });
  });

  describe('when initialized without options', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectInitWithoutOptions])));

    it('should select the proper option when option list is initialized later', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectInitWithoutOptions);
      const instance = fixture.componentInstance;

      fixture.detectChanges();
      flush();

      // Wait for the initial writeValue promise.
      expect(instance.select.selected).toBeFalsy();

      instance.addOptions();
      fixture.detectChanges();
      flush();

      // Wait for the next writeValue promise.
      expect(instance.select.selected).toBe(instance.options.toArray()[1]);
    }));
  });

  describe('with a selectionChange event handler', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectWithChangeEvent])));

    let fixture: ComponentFixture<SelectWithChangeEvent>;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectWithChangeEvent);
      fixture.detectChanges();
      flush();
      trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
    }));

    it('should emit an event when the selected option has changed', () => {
      trigger.click();
      fixture.detectChanges();
      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalled();
    });

    it('should not emit multiple change events for the same option', () => {
      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      option.click();
      option.click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);
    });

    it('should only emit one event when pressing arrow keys on closed select', fakeAsync(() => {
      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);

      flush();
    }));
  });

  describe('with ngModel', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([NgModelSelect])));

    it('should disable itself when control is disabled using the property', () => {
      const fixture = TestBed.createComponent(NgModelSelect);
      fixture.detectChanges();

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();

      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('.sbb-select')).nativeElement;
      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      expect(getComputedStyle(select).getPropertyValue('cursor')).toEqual(
        'default',
        `Expected cursor to be default arrow on disabled control.`
      );

      trigger.click();
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toEqual(
        '',
        `Expected select panel to stay closed.`
      );
      expect(fixture.componentInstance.select.panelOpen).toBe(
        false,
        `Expected select panelOpen property to stay false.`
      );

      fixture.componentInstance.isDisabled = false;
      fixture.detectChanges();

      fixture.detectChanges();

      expect(getComputedStyle(trigger).getPropertyValue('cursor')).toEqual(
        'pointer',
        `Expected cursor to be a pointer on enabled control.`
      );

      trigger.click();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain(
        'Steak',
        `Expected select panel to open normally on re-enabled control`
      );
      expect(fixture.componentInstance.select.panelOpen).toBe(
        true,
        `Expected select panelOpen property to become true.`
      );
    });
  });

  describe('with ngIf', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([NgIfSelect])));

    it(
      'should handle nesting in an ngIf',
      waitForAsync(() => {
        const fixture = TestBed.createComponent(NgIfSelect);
        fixture.detectChanges();

        fixture.componentInstance.isShowing = true;
        fixture.detectChanges();

        const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        trigger.style.width = '300px';

        trigger.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const value = fixture.debugElement.query(By.css('.sbb-select-value'));
          expect(value.nativeElement.textContent).toContain(
            'Pizza',
            `Expected trigger to be populated by the control's initial value.`
          );

          const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
          expect(pane.style.width).toEqual('362px');

          expect(fixture.componentInstance.select.panelOpen).toBe(true);
          expect(overlayContainerElement.textContent).toContain('Steak');
          expect(overlayContainerElement.textContent).toContain('Pizza');
          expect(overlayContainerElement.textContent).toContain('Tacos');
        });
      })
    );
  });

  describe('with multiple sbb-select elements in one view', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([ManySelects])));

    let fixture: ComponentFixture<ManySelects>;
    let triggers: DebugElement[];
    let options: NodeListOf<HTMLElement>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ManySelects);
      fixture.detectChanges();
      triggers = fixture.debugElement.queryAll(By.css('.sbb-select-trigger'));

      triggers[0].nativeElement.click();
      fixture.detectChanges();

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
    });

    it('should set the option id properly', fakeAsync(() => {
      const firstOptionID = options[0].id;

      expect(options[0].id).toContain(
        'sbb-option',
        `Expected option ID to have the correct prefix.`
      );
      expect(options[0].id).not.toEqual(options[1].id, `Expected option IDs to be unique.`);

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop'
      ) as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      flush();

      triggers[1].nativeElement.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
      expect(options[0].id).toContain(
        'sbb-option',
        `Expected option ID to have the correct prefix.`
      );
      expect(options[0].id).not.toEqual(firstOptionID, `Expected option IDs to be unique.`);
      expect(options[0].id).not.toEqual(options[1].id, `Expected option IDs to be unique.`);
    }));
  });

  describe('with tabindex', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectWithPlainTabindex])));

    it('should be able to set the tabindex via the native attribute', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindex);
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      expect(select.getAttribute('tabindex')).toBe('5');
    }));
  });

  describe('change events', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectWithPlainTabindex])));

    it('should complete the stateChanges stream on destroy', () => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindex);
      fixture.detectChanges();

      const debugElement = fixture.debugElement.query(By.directive(SbbSelect));
      const select = debugElement.componentInstance;

      const spy = jasmine.createSpy('stateChanges complete');
      const subscription = select.stateChanges.subscribe(undefined, undefined, spy);

      fixture.destroy();
      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    });
  });

  describe('when initially hidden', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([BasicSelectInitiallyHidden])));

    it('should set the width of the overlay if the element was hidden initially', () => {
      const fixture = TestBed.createComponent(BasicSelectInitiallyHidden);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      trigger.style.width = '200px';
      fixture.componentInstance.isVisible = true;
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();

      const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      expect(pane.style.width).toBe('262px');
    });
  });

  describe('with no placeholder', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([BasicSelectNoPlaceholder])));

    it('should set the width of the overlay if there is no placeholder', () => {
      const fixture = TestBed.createComponent(BasicSelectNoPlaceholder);

      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      // tslint:disable-next-line:radix
      expect(parseInt(pane.style.width as string)).toBeGreaterThan(0);
    });
  });

  describe('when invalid inside a form', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([InvalidSelectInForm])));

    it('should not throw SelectionModel errors in addition to ngModel errors', fakeAsync(() => {
      const fixture = TestBed.createComponent(InvalidSelectInForm);

      // The first change detection run will throw the "ngModel is missing a name" error.
      expect(() => fixture.detectChanges()).toThrowError(/the name attribute must be set/g);

      // The second run shouldn't throw selection-model related errors.
      expect(() => fixture.detectChanges()).not.toThrow();
    }));
  });

  describe('with ngModel using compareWith', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([NgModelCompareWithSelect])));

    let fixture: ComponentFixture<NgModelCompareWithSelect>;
    let instance: NgModelCompareWithSelect;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(NgModelCompareWithSelect);
      instance = fixture.componentInstance;
      fixture.detectChanges();
      flush();
    }));

    describe('comparing by value', () => {
      it('should have a selection', fakeAsync(() => {
        const selectedOption = instance.select.selected as SbbOption;
        expect(selectedOption.value.value).toEqual('pizza-1');
      }));

      it('should update when making a new selection', fakeAsync(() => {
        instance.options.last._selectViaInteraction();
        fixture.detectChanges();
        flush();

        const selectedOption = instance.select.selected as SbbOption;
        expect(instance.selectedFood.value).toEqual('tacos-2');
        expect(selectedOption.value.value).toEqual('tacos-2');
      }));
    });
  });

  describe(`when the select's value is accessed on initialization`, () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectEarlyAccessSibling])));

    it('should not throw when trying to access the selected value on init', fakeAsync(() => {
      expect(() => {
        TestBed.createComponent(SelectEarlyAccessSibling).detectChanges();
      }).not.toThrow();
    }));
  });

  describe('inside of a form group', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectInsideFormGroup])));

    let fixture: ComponentFixture<SelectInsideFormGroup>;
    let testComponent: SelectInsideFormGroup;
    let select: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectInsideFormGroup);
      fixture.detectChanges();
      flush();
      testComponent = fixture.componentInstance;
      select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
    }));

    it('should not set the invalid class on a clean select', fakeAsync(() => {
      expect(testComponent.formGroup.untouched).toBe(true, 'Expected the form to be untouched.');
      expect(testComponent.formControl.invalid).toBe(true, 'Expected form control to be invalid.');
      expect(select.classList).not.toContain(
        'sbb-select-invalid',
        'Expected select not to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to false.'
      );
    }));

    it('should appear as invalid if it becomes touched', fakeAsync(() => {
      expect(select.classList).not.toContain(
        'sbb-select-invalid',
        'Expected select not to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to false.'
      );

      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(select.classList).toContain(
        'sbb-select-invalid',
        'Expected select to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'true',
        'Expected aria-invalid to be set to true.'
      );
    }));

    it('should not have the invalid class when the select becomes valid', fakeAsync(() => {
      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(select.classList).toContain(
        'sbb-select-invalid',
        'Expected select to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'true',
        'Expected aria-invalid to be set to true.'
      );

      testComponent.formControl.setValue('pizza-1');
      fixture.detectChanges();

      expect(select.classList).not.toContain(
        'sbb-select-invalid',
        'Expected select not to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to false.'
      );
    }));

    it('should appear as invalid when the parent form group is submitted', fakeAsync(() => {
      expect(select.classList).not.toContain(
        'sbb-select-invalid',
        'Expected select not to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'false',
        'Expected aria-invalid to be set to false.'
      );

      dispatchFakeEvent(fixture.debugElement.query(By.css('form')).nativeElement, 'submit');
      fixture.detectChanges();

      expect(select.classList).toContain(
        'sbb-select-invalid',
        'Expected select to appear invalid.'
      );
      expect(select.getAttribute('aria-invalid')).toBe(
        'true',
        'Expected aria-invalid to be set to true.'
      );
    }));
  });

  describe('with preselected array values', () => {
    beforeEach(
      waitForAsync(() => configureSbbSelectTestingModule([SingleSelectWithPreselectedArrayValues]))
    );

    it('should be able to preselect an array value in single-selection mode', fakeAsync(() => {
      const fixture = TestBed.createComponent(SingleSelectWithPreselectedArrayValues);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;

      expect(select.textContent).toContain('Pizza');
      expect(fixture.componentInstance.options.toArray()[1].selected).toBe(true);
    }));
  });

  describe('with a falsy value', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([FalsyValueSelect])));

    it('should be able to programmatically select a falsy option', () => {
      const fixture = TestBed.createComponent(FalsyValueSelect);

      fixture.detectChanges();
      fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement.click();
      fixture.componentInstance.control.setValue(0);
      fixture.detectChanges();

      expect(fixture.componentInstance.options.first.selected).toBe(
        true,
        'Expected first option to be selected'
      );
      expect(overlayContainerElement.querySelectorAll('sbb-option')[0].classList).toContain(
        'sbb-selected',
        'Expected first option to be selected'
      );
    });
  });

  describe('with OnPush', () => {
    beforeEach(
      waitForAsync(() =>
        configureSbbSelectTestingModule([BasicSelectOnPush, BasicSelectOnPushPreselected])
      )
    );

    it('should set the trigger text based on the value when initialized', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPushPreselected);

      fixture.detectChanges();
      flush();

      const select = fixture.debugElement.query(By.css('.sbb-select')).nativeElement;

      fixture.detectChanges();
      flush();

      expect(select.textContent).toContain('Pizza');
    }));

    it('should update the trigger based on the value', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPush);
      fixture.detectChanges();
      flush();
      const select = fixture.debugElement.query(By.css('.sbb-select')).nativeElement;

      fixture.componentInstance.control.setValue('pizza-1');
      fixture.detectChanges();
      flush();

      expect(select.textContent).toContain('Pizza');

      fixture.componentInstance.control.reset();
      fixture.detectChanges();
      flush();

      expect(select.textContent).not.toContain('Pizza');
    }));
  });

  describe('without Angular forms', () => {
    beforeEach(
      waitForAsync(() =>
        configureSbbSelectTestingModule([
          BasicSelectWithoutForms,
          BasicSelectWithoutFormsPreselected,
          BasicSelectWithoutFormsMultiple,
        ])
      )
    );

    it('should set the value when options are clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);

      fixture.detectChanges();
      expect(fixture.componentInstance.selectedFood).toBeFalsy();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('steak-0');
      expect(fixture.componentInstance.select.value).toBe('steak-0');
      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      expect(select.textContent).toContain('Steak');

      trigger.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelectorAll('sbb-option')[2] as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('sandwich-2');
      expect(fixture.componentInstance.select.value).toBe('sandwich-2');
      expect(trigger.textContent).toContain('Sandwich');
    }));

    it('should mark options as selected when the value is set', () => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);

      fixture.detectChanges();

      fixture.componentInstance.selectedFood = 'sandwich-2';
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      expect(select.textContent).toContain('Sandwich');

      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelectorAll('sbb-option')[2];

      expect(option.classList).toContain('sbb-selected');
      expect(fixture.componentInstance.select.value).toBe('sandwich-2');
    });

    it('should reset the label when a null value is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);

      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.selectedFood).toBeFalsy();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('steak-0');
      expect(fixture.componentInstance.select.value).toBe('steak-0');
      expect(select.textContent).toContain('Steak');

      fixture.componentInstance.selectedFood = null;
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select.value).toBeNull();
      expect(select.textContent).not.toContain('Steak');
    }));

    it('should reflect the preselected value', async () => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsPreselected);
      fixture.detectChanges();

      await fixture.whenRenderingDone();
      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      fixture.detectChanges();

      expect(select.textContent).toContain('Pizza');

      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelectorAll('sbb-option')[1];

      expect(option.classList).toContain('sbb-selected');
      expect(fixture.componentInstance.select.value).toBe('pizza-1');
    });

    it('should be able to select multiple values', async () => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsMultiple);

      fixture.detectChanges();
      await fixture.whenRenderingDone();

      expect(fixture.componentInstance.selectedFoods).toBeFalsy();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      options[0].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods).toEqual(['steak-0']);
      expect(fixture.componentInstance.select.value).toEqual(['steak-0']);
      expect(select.textContent).toContain('Steak');

      options[2].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods).toEqual(['steak-0', 'sandwich-2']);
      expect(fixture.componentInstance.select.value).toEqual(['steak-0', 'sandwich-2']);
      expect(select.textContent).toContain('Steak, Sandwich');

      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods).toEqual(['steak-0', 'pizza-1', 'sandwich-2']);
      expect(fixture.componentInstance.select.value).toEqual(['steak-0', 'pizza-1', 'sandwich-2']);
      expect(select.textContent).toContain('Steak, Pizza, Sandwich');
    });

    it('should update the data binding before emitting the change event', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      const instance = fixture.componentInstance;
      const spy = jasmine.createSpy('change spy');

      fixture.detectChanges();
      flush();
      instance.select.selectionChange.subscribe(() => spy(instance.selectedFood));

      expect(instance.selectedFood).toBeFalsy();

      fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(instance.selectedFood).toBe('steak-0');
      expect(spy).toHaveBeenCalledWith('steak-0');
    }));
  });

  describe('with multiple selection', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([MultiSelect])));

    let fixture: ComponentFixture<MultiSelect>;
    let testInstance: MultiSelect;
    let trigger: HTMLElement;
    let select: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(MultiSelect);
      testInstance = fixture.componentInstance;
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
    });

    it('should be able to select multiple values', () => {
      trigger.click();
      fixture.detectChanges();
      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      options[0].click();
      options[2].click();
      options[5].click();
      fixture.detectChanges();
      expect(testInstance.control.value).toEqual(['steak-0', 'tacos-2', 'eggs-5']);
    });

    it('should be able to toggle an option on and off', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();
      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      option.click();
      fixture.detectChanges();
      flush();
      expect(testInstance.control.value).toEqual(['steak-0']);

      option.click();
      fixture.detectChanges();
      flush();
      expect(testInstance.control.value).toEqual([]);
    }));

    it('should update the label', () => {
      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      options[0].click();
      options[2].click();
      options[5].click();
      fixture.detectChanges();

      expect(select.textContent).toContain('Steak, Tacos, Eggs');

      options[2].click();
      fixture.detectChanges();

      expect(select.textContent).toContain('Steak, Eggs');
    });

    it('should be able to set the selected value by taking an array', fakeAsync(() => {
      trigger.click();
      testInstance.control.setValue(['steak-0', 'eggs-5']);
      fixture.detectChanges();
      flush();
      const optionNodes = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      const optionInstances = testInstance.options.toArray();

      expect(optionNodes[0].classList).toContain('sbb-selected');
      expect(optionNodes[5].classList).toContain('sbb-selected');

      expect(optionInstances[0].selected).toBe(true);
      expect(optionInstances[5].selected).toBe(true);
    }));

    it('should override the previously-selected value when setting an array', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();
      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      options[0].click();
      fixture.detectChanges();
      flush();
      expect(options[0].classList).toContain('sbb-selected');

      testInstance.control.setValue(['eggs-5']);
      fixture.detectChanges();
      flush();
      expect(options[0].classList).not.toContain('sbb-selected');
      expect(options[5].classList).toContain('sbb-selected');
    }));

    it('should not close the panel when clicking on options', () => {
      trigger.click();
      fixture.detectChanges();

      expect(testInstance.select.panelOpen).toBe(true);

      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      options[0].click();
      options[1].click();
      fixture.detectChanges();

      expect(testInstance.select.panelOpen).toBe(true);
    });

    it('should sort the selected options based on their order in the panel', () => {
      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      options[2].click();
      options[0].click();
      options[1].click();
      fixture.detectChanges();

      expect(select.textContent).toContain('Steak, Pizza, Tacos');
      expect(fixture.componentInstance.control.value).toEqual(['steak-0', 'pizza-1', 'tacos-2']);
    });

    it('should sort the values that get set via the model based on the panel order', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();
      testInstance.control.setValue(['tacos-2', 'steak-0', 'pizza-1']);
      fixture.detectChanges();
      flush();
      expect(select.textContent).toContain('Steak, Pizza, Tacos');
    }));

    it('should pass the `multiple` value to all of the option instances', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      expect(testInstance.options.toArray().every((option) => !!option.multiple)).toBe(
        true,
        'Expected `multiple` to have been added to initial set of options.'
      );

      testInstance.foods.push({ value: 'cake-8', viewValue: 'Cake' });
      fixture.detectChanges();
      flush();
      expect(testInstance.options.toArray().every((option) => !!option.multiple)).toBe(
        true,
        'Expected `multiple` to have been set on dynamically-added option.'
      );
    }));

    it('should update the active item index on click', () => {
      trigger.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(0);

      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      options[2].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(2);
    });

    it('should be to select an option with a `null` value', () => {
      fixture.componentInstance.foods = [
        { value: null, viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: null, viewValue: 'Tacos' },
      ];

      fixture.detectChanges();
      trigger.click();
      fixture.detectChanges();
      const options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<
        HTMLElement
      >;

      options[0].click();
      options[1].click();
      options[2].click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([null, 'pizza-1', null]);
    });

    it('should select all options when pressing ctrl + a', fakeAsync(() => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      expect(testInstance.control.value).toBeFalsy();
      expect(options.every((option) => option.selected)).toBe(false);

      fixture.componentInstance.select.open();
      fixture.detectChanges();
      flush();
      dispatchKeyboardEvent(selectElement, 'keydown', A, undefined, { control: true });
      fixture.detectChanges();

      expect(options.every((option) => option.selected)).toBe(true);
      expect(testInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7',
      ]);
    }));

    it('should skip disabled options when using ctrl + a', fakeAsync(() => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      for (let i = 0; i < 3; i++) {
        options[i].disabled = true;
      }

      expect(testInstance.control.value).toBeFalsy();

      fixture.componentInstance.select.open();
      fixture.detectChanges();
      flush();
      dispatchKeyboardEvent(selectElement, 'keydown', A, undefined, { control: true });
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7',
      ]);
    }));

    it('should select all options when pressing ctrl + a when some options are selected', fakeAsync(() => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      options[0].select();
      fixture.detectChanges();
      flush();
      expect(testInstance.control.value).toEqual(['steak-0']);
      expect(options.some((option) => option.selected)).toBe(true);

      fixture.componentInstance.select.open();
      fixture.detectChanges();
      flush();
      dispatchKeyboardEvent(selectElement, 'keydown', A, undefined, { control: true });
      fixture.detectChanges();

      expect(options.every((option) => option.selected)).toBe(true);
      expect(testInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7',
      ]);
    }));

    it('should deselect all options with ctrl + a if all options are selected', fakeAsync(() => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      options.forEach((option) => option.select());
      fixture.detectChanges();
      flush();
      expect(testInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7',
      ]);
      expect(options.every((option) => option.selected)).toBe(true);

      fixture.componentInstance.select.open();
      fixture.detectChanges();
      flush();
      dispatchKeyboardEvent(selectElement, 'keydown', A, undefined, { control: true });
      fixture.detectChanges();
      flush();
      expect(options.some((option) => option.selected)).toBe(false);
      expect(testInstance.control.value).toEqual([]);
    }));
  });

  describe('sbb-field integration', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([BasicSelect])));

    let fixture: ComponentFixture<BasicSelect>;
    let selectComponent: SbbSelect;

    beforeEach(() => {
      fixture = TestBed.createComponent(BasicSelect);
      fixture.detectChanges();
      selectComponent = fixture.componentInstance.select;
    });

    it('should forward focus and open panel when clicking sbb-field label', () => {
      const label = fixture.debugElement.query(By.css('label'));

      spyOn(selectComponent, 'focus');
      expect(selectComponent.focus).not.toHaveBeenCalled();
      expect(selectComponent.panelOpen).toBeFalse();

      dispatchMouseEvent(label.nativeElement, 'click');
      fixture.detectChanges();

      expect(selectComponent.panelOpen).toBeTrue();
      expect(selectComponent.focus).toHaveBeenCalled();
    });
  });
});
