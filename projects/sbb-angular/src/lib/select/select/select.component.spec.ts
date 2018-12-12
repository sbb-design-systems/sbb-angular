import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  TAB,
  UP_ARROW,
  A,
} from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
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
import { Subject, Subscription } from 'rxjs';
import { SelectModule } from '../select.module';
import { dispatchKeyboardEvent, dispatchEvent, dispatchFakeEvent } from '../../_common/testing/dispatch-events';
import { createKeyboardEvent } from '../../_common/testing/event-objects';
import { SBBOptionSelectionChange, OptionComponent } from '../../option/option/option.component';
import { SelectComponent } from './select.component';
import { ErrorStateMatcher } from '../../_common/errors/error-services';
import { FieldModule } from '../../field/field.module';
import { OptionModule } from '../../option/option.module';



/** The debounce interval when typing letters to select an option. */
const LETTER_KEY_DEBOUNCE_INTERVAL = 200;


@Component({
  selector: 'sbb-basic-select',
  template: `
    <div [style.height.px]="heightAbove"></div>
    <sbb-field>
      <sbb-select placeholder="Food" [formControl]="control" [required]="isRequired"
        [tabIndex]="tabIndexOverride" [attr.aria-label]="ariaLabel" [attr.aria-labelledby]="ariaLabelledby"
        [panelClass]="panelClass">
        <sbb-option *ngFor="let food of foods" [value]="food.value" [disabled]="food.disabled">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
    <div [style.height.px]="heightBelow"></div>
  `
})
class BasicSelectComponent {
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

  @ViewChild(SelectComponent) select: SelectComponent;
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;
}

@Component({
  selector: 'sbb-ng-model-select',
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" ngModel [disabled]="isDisabled">
        <sbb-option *ngFor="let food of foods"
                    [value]="food.value">{{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class NgModelSelectComponent {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  isDisabled: boolean;

  @ViewChild(SelectComponent) select: SelectComponent;
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;
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
  `
})
class ManySelectsComponent { }

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
class NgIfSelectComponent {
  isShowing = false;
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];
  control = new FormControl('pizza-1');

  @ViewChild(SelectComponent) select: SelectComponent;
}

@Component({
  selector: 'sbb-select-with-change-event',
  template: `
    <sbb-field>
      <sbb-select (selectionChange)="changeListener($event)">
        <sbb-option *ngFor="let food of foods" [value]="food">{{ food }}</sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class SelectWithChangeEventComponent {
  foods: string[] = [
    'steak-0',
    'pizza-1',
    'tacos-2',
    'sandwich-3',
    'chips-4',
    'eggs-5',
    'pasta-6',
    'sushi-7'
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
  `
})
class SelectInitWithoutOptionsComponent {
  foods: any[];
  control = new FormControl('pizza-1');

  @ViewChild(SelectComponent) select: SelectComponent;
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;

  addOptions() {
    this.foods = [
      { value: 'steak-0', viewValue: 'Steak' },
      { value: 'pizza-1', viewValue: 'Pizza' },
      { value: 'tacos-2', viewValue: 'Tacos' }
    ];
  }
}

@Component({
  selector: 'sbb-custom-select-accessor',
  template: `<sbb-field><sbb-select></sbb-select></sbb-field>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CustomSelectAccessorComponent,
    multi: true
  }]
})
class CustomSelectAccessorComponent implements ControlValueAccessor {
  @ViewChild(SelectComponent) select: SelectComponent;

  writeValue: (value?: any) => void = () => { };
  registerOnChange: (changeFn?: (value: any) => void) => void = () => { };
  registerOnTouched: (touchedFn?: () => void) => void = () => { };
}

@Component({
  selector: 'sbb-comp-with-custom-select',
  template: `<custom-select-accessor [formControl]="ctrl"></custom-select-accessor>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CustomSelectAccessorComponent,
    multi: true
  }]
})
class CompWithCustomSelectComponent {
  ctrl = new FormControl('initial value');
  @ViewChild(CustomSelectAccessorComponent) customAccessor: CustomSelectAccessorComponent;
}

@Component({
  selector: 'sbb-select-infinite-loop',
  template: `
    <sbb-field>
      <sbb-select [(ngModel)]="value"></sbb-select>
    </sbb-field>
    <throws-error-on-init></throws-error-on-init>
  `
})
class SelectWithErrorSiblingComponent {
  value: string;
}

@Component({
  selector: 'sbb-throws-error-on-init',
  template: ''
})
class ThrowsErrorOnInitComponent implements OnInit {
  ngOnInit() {
    throw Error('Oh no!');
  }
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
  `
})
class BasicSelectOnPushComponent {
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
  `
})
class BasicSelectOnPushPreselectedComponent {
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
        <sbb-option *ngFor="let food of foods"
                    [value]="food.value">{{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class MultiSelectComponent {
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

  @ViewChild(SelectComponent) select: SelectComponent;
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;
}

@Component({
  selector: 'sbb-select-with-plain-tabindex',
  template: `<sbb-field><sbb-select tabindex="5"></sbb-select></sbb-field>`
})
class SelectWithPlainTabindexComponent { }

@Component({
  selector: 'sbb-select-early-sibling-access',
  template: `
    <sbb-field>
      <sbb-select #select="sbbSelect"></sbb-select>
    </sbb-field>
    <div *ngIf="select.selected"></div>
  `
})
class SelectEarlyAccessSiblingComponent { }

@Component({
  selector: 'sbb-basic-select-initially-hidden',
  template: `
    <sbb-field>
      <sbb-select [style.display]="isVisible ? 'block' : 'none'">
        <sbb-option value="value">There are no other options</sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class BasicSelectInitiallyHiddenComponent {
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
  `
})
class BasicSelectNoPlaceholderComponent { }

@Component({
  selector: 'sbb-basic-select-with-theming',
  template: `
    <sbb-field [color]="theme">
      <sbb-select placeholder="Food">
        <sbb-option value="steak-0">Steak</sbb-option>
        <sbb-option value="pizza-1">Pizza</sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class BasicSelectWithThemingComponent {
  @ViewChild(SelectComponent) select: SelectComponent;
  theme: string;
}

@Component({
  selector: 'sbb-reset-values-select',
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [formControl]="control">
        <sbb-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
        <sbb-option>None</sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class ResetValuesSelectComponent {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: false, viewValue: 'Falsy' },
    { viewValue: 'Undefined' },
    { value: null, viewValue: 'Null' },
  ];
  control = new FormControl();

  @ViewChild(SelectComponent) select: SelectComponent;
}

@Component({
  template: `
    <sbb-field>
      <sbb-select [formControl]="control">
        <sbb-option *ngFor="let food of foods"
                    [value]="food.value">{{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class FalsyValueSelectComponent {
  foods: any[] = [
    { value: 0, viewValue: 'Steak' },
    { value: 1, viewValue: 'Pizza' },
  ];
  control = new FormControl();
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;
}

@Component({
  selector: 'sbb-select-with-groups',
  template: `
    <sbb-field>
      <sbb-select placeholder="Pokemon" [formControl]="control">
        <sbb-option-group *ngFor="let group of pokemonTypes" [label]="group.name"
          [disabled]="group.disabled">
          <sbb-option *ngFor="let pokemon of group.pokemon" [value]="pokemon.value">
            {{ pokemon.viewValue }}
          </sbb-option>
        </sbb-option-group>
        <sbb-option value="mime-11">Mr. Mime</sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class SelectWithGroupsComponent {
  control = new FormControl();
  pokemonTypes = [
    {
      name: 'Grass',
      pokemon: [
        { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
        { value: 'oddish-1', viewValue: 'Oddish' },
        { value: 'bellsprout-2', viewValue: 'Bellsprout' }
      ]
    },
    {
      name: 'Water',
      disabled: true,
      pokemon: [
        { value: 'squirtle-3', viewValue: 'Squirtle' },
        { value: 'psyduck-4', viewValue: 'Psyduck' },
        { value: 'horsea-5', viewValue: 'Horsea' }
      ]
    },
    {
      name: 'Fire',
      pokemon: [
        { value: 'charmander-6', viewValue: 'Charmander' },
        { value: 'vulpix-7', viewValue: 'Vulpix' },
        { value: 'flareon-8', viewValue: 'Flareon' }
      ]
    },
    {
      name: 'Psychic',
      pokemon: [
        { value: 'mew-9', viewValue: 'Mew' },
        { value: 'mewtwo-10', viewValue: 'Mewtwo' },
      ]
    }
  ];

  @ViewChild(SelectComponent) select: SelectComponent;
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;
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
  `
})
class SelectWithGroupsAndNgContainerComponent {
  control = new FormControl();
  pokemonTypes = [
    {
      name: 'Grass',
      pokemon: [{ value: 'bulbasaur-0', viewValue: 'Bulbasaur' }]
    }
  ];
}

@Component({
  template: `
    <form>
      <sbb-field>
        <sbb-select [(ngModel)]="value"></sbb-select>
      </sbb-field>
    </form>
  `
})
class InvalidSelectInFormComponent {
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

        <sbb-error>This field is required</sbb-error>
      </sbb-field>
    </form>
  `
})
class SelectInsideFormGroupComponent {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild(SelectComponent) select: SelectComponent;
  formControl = new FormControl('', Validators.required);
  formGroup = new FormGroup({
    food: this.formControl
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
  `
})
class BasicSelectWithoutFormsComponent {
  selectedFood: string | null;
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'sandwich-2', viewValue: 'Sandwich' },
  ];

  @ViewChild(SelectComponent) select: SelectComponent;
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
  `
})
class BasicSelectWithoutFormsPreselectedComponent {
  selectedFood = 'pizza-1';
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];

  @ViewChild(SelectComponent) select: SelectComponent;
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
  `
})
class BasicSelectWithoutFormsMultipleComponent {
  selectedFoods: string[];
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'sandwich-2', viewValue: 'Sandwich' },
  ];

  @ViewChild(SelectComponent) select: SelectComponent;
}

@Component({
  selector: 'sbb-select-with-custom-trigger',
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [formControl]="control" #select="matSelect">
        <sbb-select-trigger>
          {{ select.selected?.viewValue.split('').reverse().join('') }}
        </sbb-select-trigger>
        <sbb-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class SelectWithCustomTriggerComponent {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];
  control = new FormControl();
}

@Component({
  selector: 'sbb-ng-model-compare-with',
  template: `
    <sbb-field>
      <sbb-select [ngModel]="selectedFood" (ngModelChange)="setFoodByCopy($event)"
                 [compareWith]="comparator">
        <sbb-option *ngFor="let food of foods" [value]="food">{{ food.viewValue }}</sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class NgModelCompareWithSelectComponent {
  foods: ({ value: string, viewValue: string })[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  selectedFood: { value: string, viewValue: string } = { value: 'pizza-1', viewValue: 'Pizza' };
  comparator: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  @ViewChild(SelectComponent) select: SelectComponent;
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;

  useCompareByValue() { this.comparator = this.compareByValue; }

  useCompareByReference() { this.comparator = this.compareByReference; }

  useNullComparator() { this.comparator = null; }

  compareByValue(f1: any, f2: any) { return f1 && f2 && f1.value === f2.value; }

  compareByReference(f1: any, f2: any) { return f1 === f2; }

  setFoodByCopy(newValue: { value: string, viewValue: string }) {
    this.selectedFood = { ...{}, ...newValue };
  }
}

@Component({
  template: `
    <sbb-select placeholder="Food" [formControl]="control" [errorStateMatcher]="errorStateMatcher">
      <sbb-option *ngFor="let food of foods" [value]="food.value">
        {{ food.viewValue }}
      </sbb-option>
    </sbb-select>
  `
})
class CustomErrorBehaviorSelectComponent {
  @ViewChild(SelectComponent) select: SelectComponent;
  control = new FormControl();
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];
  errorStateMatcher: ErrorStateMatcher;
}

@Component({
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [(ngModel)]="selectedFoods">
        <sbb-option *ngFor="let food of foods"
                    [value]="food.value">{{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class SingleSelectWithPreselectedArrayValuesComponent {
  foods: any[] = [
    { value: ['steak-0', 'steak-1'], viewValue: 'Steak' },
    { value: ['pizza-1', 'pizza-2'], viewValue: 'Pizza' },
    { value: ['tacos-2', 'tacos-3'], viewValue: 'Tacos' },
  ];

  selectedFoods = this.foods[1].value;

  @ViewChild(SelectComponent) select: SelectComponent;
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;
}

@Component({
  selector: 'sbb-select-without-option-centering',
  template: `
    <sbb-field>
      <sbb-select placeholder="Food" [formControl]="control" disableOptionCentering>
        <sbb-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class SelectWithoutOptionCenteringComponent {
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
  control = new FormControl('pizza-1');

  @ViewChild(SelectComponent) select: SelectComponent;
  @ViewChildren(OptionComponent) options: QueryList<OptionComponent>;
}

@Component({
  template: `
    <sbb-field>
      <sbb-label>Select a thing</sbb-label>

      <sbb-select [placeholder]="placeholder">
        <sbb-option value="thing">A thing</sbb-option>
      </sbb-select>
    </sbb-field>
  `
})
class SelectWithFormFieldLabelComponent {
  placeholder: string;
}


xdescribe('SelectComponent', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const scrolledSubject = new Subject();
  let viewportRuler: ViewportRuler;
  let platform: Platform;

  /**
   * Configures the test module for MatSelect with the given declarations. This is broken out so
   * that we're only compiling the necessary test components for each test in order to speed up
   * overall test time.
   * @param declarations Components to declare for this block
   */
  function configureSbbSelectTestingModule(declarations: any[]) {
    TestBed.configureTestingModule({
      imports: [
        SelectModule,
        FieldModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      declarations: declarations,
      providers: [
        {
          provide: ScrollDispatcher, useFactory: () => ({
            scrolled: () => scrolledSubject.asObservable(),
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
    beforeEach(async(() => {
      configureSbbSelectTestingModule([
        BasicSelectComponent,
        MultiSelectComponent,
        SelectWithGroupsComponent,
        SelectWithGroupsAndNgContainerComponent,
        SelectWithFormFieldLabelComponent,
        SelectWithChangeEventComponent,
      ]);
    }));

    describe('accessibility', () => {
      describe('for select', () => {
        let fixture: ComponentFixture<BasicSelectComponent>;
        let select: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicSelectComponent);
          fixture.detectChanges();
          select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
        }));

        it('should set the role of the select to listbox', fakeAsync(() => {
          flush();
          expect(select.getAttribute('role')).toEqual('listbox');
        }));

        it('should set the aria label of the select to the placeholder', fakeAsync(() => {
          expect(select.getAttribute('aria-label')).toEqual('Food');
        }));

        it('should support setting a custom aria-label', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();

          expect(select.getAttribute('aria-label')).toEqual('Custom Label');
        }));

        it('should not set an aria-label if aria-labelledby is specified', fakeAsync(() => {
          fixture.componentInstance.ariaLabelledby = 'myLabelId';
          fixture.detectChanges();

          expect(select.getAttribute('aria-label')).toBeFalsy('Expected no aria-label to be set.');
          expect(select.getAttribute('aria-labelledby')).toBe('myLabelId');
        }));

        it('should not have aria-labelledby in the DOM if it`s not specified', fakeAsync(() => {
          fixture.detectChanges();
          expect(select.hasAttribute('aria-labelledby')).toBeFalsy();
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
          expect(select.getAttribute('aria-required'))
            .toEqual('false', `Expected aria-required attr to be false for normal selects.`);

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.getAttribute('aria-required'))
            .toEqual('true', `Expected aria-required attr to be true for required selects.`);
        }));

        it('should set the sbb-select-required class for required selects', fakeAsync(() => {
          expect(select.classList).not.toContain(
            'sbb-select-required', `Expected the sbb-select-required class not to be set.`);

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.classList).toContain(
            'sbb-select-required', `Expected the sbb-select-required class to be set.`);
        }));

        it('should set aria-invalid for selects that are invalid and touched', fakeAsync(() => {
          expect(select.getAttribute('aria-invalid'))
            .toEqual('false', `Expected aria-invalid attr to be false for valid selects.`);

          fixture.componentInstance.isRequired = true;
          fixture.componentInstance.control.markAsTouched();
          fixture.detectChanges();

          expect(select.getAttribute('aria-invalid'))
            .toEqual('true', `Expected aria-invalid attr to be true for invalid selects.`);
        }));

        it('should set aria-disabled for disabled selects', fakeAsync(() => {
          expect(select.getAttribute('aria-disabled')).toEqual('false');

          fixture.componentInstance.control.disable();
          fixture.detectChanges();

          expect(select.getAttribute('aria-disabled')).toEqual('true');
        }));

        it('should set the tabindex of the select to -1 if disabled', fakeAsync(() => {
          fixture.componentInstance.control.disable();
          flush();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('-1');

          fixture.componentInstance.control.enable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('0');
        }));

        it('should not set `aria-labelledby` if there is a placeholder', () => {
          fixture.destroy();

          const labelFixture = TestBed.createComponent(SelectWithFormFieldLabelComponent);
          labelFixture.componentInstance.placeholder = 'Thing selector';
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(By.css('sbb-select')).nativeElement;

          expect(select.getAttribute('aria-labelledby')).toBeFalsy();
        });

        it('should not set `aria-labelledby` if there is no form field label', () => {
          fixture.destroy();

          const labelFixture = TestBed.createComponent(SelectWithChangeEventComponent);
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(By.css('sbb-select')).nativeElement;

          expect(select.getAttribute('aria-labelledby')).toBeFalsy();
        });

        it('should select options via the UP/DOWN arrow keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(options[0].selected).toBe(true, 'Expected first option to be selected.');
          expect(formControl.value).toBe(options[0].value,
            'Expected value from first option to have been set on the model.');

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected).toBe(true, 'Expected fourth option to be selected.');
          expect(formControl.value).toBe(options[3].value,
            'Expected value from fourth option to have been set on the model.');

          dispatchKeyboardEvent(select, 'keydown', UP_ARROW);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(options[1].value,
            'Expected value from second option to have been set on the model.');
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
        }));

        it('should open a single-selection select using ALT + DOWN_ARROW', fakeAsync(() => {
          const { control: formControl, select: selectInstance } = fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(formControl.value).toBeFalsy('Expected no initial value.');

          const event = createKeyboardEvent('keydown', DOWN_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');
          expect(formControl.value).toBeFalsy('Expected value not to have changed.');
        }));

        it('should open a single-selection select using ALT + UP_ARROW', fakeAsync(() => {
          const { control: formControl, select: selectInstance } = fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(formControl.value).toBeFalsy('Expected no initial value.');

          const event = createKeyboardEvent('keydown', UP_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');
          expect(formControl.value).toBeFalsy('Expected value not to have changed.');
        }));

        it('should close when pressing ALT + DOWN_ARROW', fakeAsync(() => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          flush();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');

          const event = createKeyboardEvent('keydown', DOWN_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(event.defaultPrevented).toBe(true, 'Expected default action to be prevented.');
        }));

        it('should should close when pressing ALT + UP_ARROW', fakeAsync(() => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          flush();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');

          const event = createKeyboardEvent('keydown', UP_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(event.defaultPrevented).toBe(true, 'Expected default action to be prevented.');
        }));

        it('should be able to select options by typing on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchEvent(select, createKeyboardEvent('keydown', 80, undefined, 'p'));
          tick(200);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(options[1].value,
            'Expected value from second option to have been set on the model.');

          dispatchEvent(select, createKeyboardEvent('keydown', 69, undefined, 'e'));
          tick(200);

          expect(options[5].selected).toBe(true, 'Expected sixth option to be selected.');
          expect(formControl.value).toBe(options[5].value,
            'Expected value from sixth option to have been set on the model.');
        }));

        it('should open the panel when pressing a vertical arrow key on a closed multiple select',
          fakeAsync(() => {
            fixture.destroy();

            const multiFixture = TestBed.createComponent(MultiSelectComponent);
            const instance = multiFixture.componentInstance;

            multiFixture.detectChanges();
            select = multiFixture.debugElement.query(By.css('sbb-select')).nativeElement;

            const initialValue = instance.control.value;

            expect(instance.select.panelOpen).toBe(false, 'Expected panel to be closed.');

            const event = dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

            expect(instance.select.panelOpen).toBe(true, 'Expected panel to be open.');
            expect(instance.control.value).toBe(initialValue, 'Expected value to stay the same.');
            expect(event.defaultPrevented).toBe(true, 'Expected default to be prevented.');
          }));

        it('should open the panel when pressing a horizontal arrow key on closed multiple select',
          fakeAsync(() => {
            fixture.destroy();

            const multiFixture = TestBed.createComponent(MultiSelectComponent);
            const instance = multiFixture.componentInstance;

            multiFixture.detectChanges();
            select = multiFixture.debugElement.query(By.css('sbb-select')).nativeElement;

            const initialValue = instance.control.value;

            expect(instance.select.panelOpen).toBe(false, 'Expected panel to be closed.');

            const event = dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

            expect(instance.select.panelOpen).toBe(true, 'Expected panel to be open.');
            expect(instance.control.value).toBe(initialValue, 'Expected value to stay the same.');
            expect(event.defaultPrevented).toBe(true, 'Expected default to be prevented.');
          }));

        it('should do nothing when typing on a closed multi-select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelectComponent);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select')).nativeElement;

          const initialValue = instance.control.value;

          expect(instance.select.panelOpen).toBe(false, 'Expected panel to be closed.');

          dispatchEvent(select, createKeyboardEvent('keydown', 80, undefined, 'p'));

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

        it('should continue from the selected option when the value is set programmatically',
          fakeAsync(() => {
            const formControl = fixture.componentInstance.control;

            formControl.setValue('eggs-5');
            fixture.detectChanges();

            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

            expect(formControl.value).toBe('pasta-6');
            expect(fixture.componentInstance.options.toArray()[6].selected).toBe(true);
          }));

        it('should not shift focus when the selected options are updated programmatically ' +
          'in a multi select', fakeAsync(() => {
            fixture.destroy();

            const multiFixture = TestBed.createComponent(MultiSelectComponent);
            flush();
            multiFixture.detectChanges();
            select = multiFixture.debugElement.query(By.css('sbb-select')).nativeElement;
            multiFixture.componentInstance.select.open();
            flush();
            multiFixture.detectChanges();

            const options =
              overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;

            options[3].focus();
            flush();
            expect(document.activeElement).toBe(options[3], 'Expected fourth option to be focused.');

            multiFixture.componentInstance.control.setValue(['steak-0', 'sushi-7']);
            flush();
            multiFixture.detectChanges();

            expect(document.activeElement)
              .toBe(options[3], 'Expected fourth option to remain focused.');
          }));

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
        }));

        it('should not open a multiple select when tabbing through', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelectComponent);

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select')).nativeElement;

          expect(multiFixture.componentInstance.select.panelOpen)
            .toBe(false, 'Expected panel to be closed initially.');

          dispatchKeyboardEvent(select, 'keydown', TAB);

          expect(multiFixture.componentInstance.select.panelOpen)
            .toBe(false, 'Expected panel to stay closed.');
        }));

        it('should toggle the next option when pressing shift + DOWN_ARROW on a multi-select',
          fakeAsync(() => {
            fixture.destroy();

            const multiFixture = TestBed.createComponent(MultiSelectComponent);
            const event = createKeyboardEvent('keydown', DOWN_ARROW);
            Object.defineProperty(event, 'shiftKey', { get: () => true });

            multiFixture.detectChanges();
            select = multiFixture.debugElement.query(By.css('sbb-select')).nativeElement;

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

        it('should toggle the previous option when pressing shift + UP_ARROW on a multi-select',
          fakeAsync(() => {
            fixture.destroy();

            const multiFixture = TestBed.createComponent(MultiSelectComponent);
            const event = createKeyboardEvent('keydown', UP_ARROW);
            Object.defineProperty(event, 'shiftKey', { get: () => true });

            multiFixture.detectChanges();
            select = multiFixture.debugElement.query(By.css('sbb-select')).nativeElement;

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

        it('should be able to focus the select trigger', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already

          fixture.componentInstance.select.focus();

          expect(document.activeElement).toBe(select, 'Expected select element to be focused.');
        }));

        // Having `aria-hidden` on the trigger avoids issues where
        // screen readers read out the wrong amount of options.
        it('should set aria-hidden on the trigger element', fakeAsync(() => {
          const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;

          expect(trigger.getAttribute('aria-hidden'))
            .toBe('true', 'Expected aria-hidden to be true when the select is open.');
        }));

        it('should set `aria-multiselectable` to true on multi-select instances', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelectComponent);

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select')).nativeElement;

          expect(select.getAttribute('aria-multiselectable')).toBe('true');
        }));

        it('should set aria-multiselectable false on single-selection instances', fakeAsync(() => {
          expect(select.getAttribute('aria-multiselectable')).toBe('false');
        }));

        it('should set aria-activedescendant only while the panel is open', fakeAsync(() => {
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();

          const host = fixture.debugElement.query(By.css('sbb-select')).nativeElement;

          expect(host.hasAttribute('aria-activedescendant'))
            .toBe(false, 'Expected no aria-activedescendant on init.');

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('sbb-option');

          expect(host.getAttribute('aria-activedescendant'))
            .toBe(options[4].id, 'Expected aria-activedescendant to match the active option.');

          fixture.componentInstance.select.close();
          fixture.detectChanges();
          flush();

          expect(host.hasAttribute('aria-activedescendant'))
            .toBe(false, 'Expected no aria-activedescendant when closed.');
        }));

        it('should set aria-activedescendant based on the focused option', fakeAsync(() => {
          const host = fixture.debugElement.query(By.css('sbb-select')).nativeElement;

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

        it('should not change the aria-activedescendant using the horizontal arrow keys',
          fakeAsync(() => {
            const host = fixture.debugElement.query(By.css('sbb-select')).nativeElement;

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

        it('should restore focus to the trigger after selecting an option in multi-select mode',
          fakeAsync(() => {
            fixture.destroy();

            const multiFixture = TestBed.createComponent(MultiSelectComponent);
            const instance = multiFixture.componentInstance;

            multiFixture.detectChanges();
            select = multiFixture.debugElement.query(By.css('sbb-select')).nativeElement;
            instance.select.open();
            multiFixture.detectChanges();

            // Ensure that the select isn't focused to begin with.
            select.blur();
            expect(document.activeElement).not.toBe(select, 'Expected trigger not to be focused.');

            // tslint:disable-next-line:no-non-null-assertion
            const option = overlayContainerElement.querySelector('sbb-option')! as HTMLElement;
            option.click();
            multiFixture.detectChanges();

            expect(document.activeElement).toBe(select, 'Expected trigger to be focused.');
          }));

      });

      describe('for options', () => {
        let fixture: ComponentFixture<BasicSelectComponent>;
        let trigger: HTMLElement;
        let options: NodeListOf<HTMLElement>;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicSelectComponent);
          fixture.detectChanges();
          trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
          trigger.click();
          fixture.detectChanges();

          options =
            overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        }));

        it('should set the role of sbb-option to option', fakeAsync(() => {
          expect(options[0].getAttribute('role')).toEqual('option');
          expect(options[1].getAttribute('role')).toEqual('option');
          expect(options[2].getAttribute('role')).toEqual('option');
        }));

        it('should set aria-selected on each option', fakeAsync(() => {
          expect(options[0].getAttribute('aria-selected')).toEqual('false');
          expect(options[1].getAttribute('aria-selected')).toEqual('false');
          expect(options[2].getAttribute('aria-selected')).toEqual('false');

          options[1].click();
          fixture.detectChanges();

          trigger.click();
          fixture.detectChanges();
          flush();

          expect(options[0].getAttribute('aria-selected')).toEqual('false');
          expect(options[1].getAttribute('aria-selected')).toEqual('true');
          expect(options[2].getAttribute('aria-selected')).toEqual('false');
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
      });

      describe('for option groups', () => {
        let fixture: ComponentFixture<SelectWithGroupsComponent>;
        let trigger: HTMLElement;
        let groups: NodeListOf<HTMLElement>;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(SelectWithGroupsComponent);
          fixture.detectChanges();
          trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
          trigger.click();
          fixture.detectChanges();
          groups =
            overlayContainerElement.querySelectorAll('sbb-option-group') as NodeListOf<HTMLElement>;
        }));

        it('should set the appropriate role', fakeAsync(() => {
          expect(groups[0].getAttribute('role')).toBe('group');
        }));

        it('should set the `aria-labelledby` attribute', fakeAsync(() => {
          const group = groups[0];
          // tslint:disable-next-line:no-non-null-assertion
          const label = group.querySelector('label')!;

          expect(label.getAttribute('id')).toBeTruthy('Expected label to have an id.');
          expect(group.getAttribute('aria-labelledby'))
            .toBe(label.getAttribute('id'), 'Expected `aria-labelledby` to match the label id.');
        }));

        it('should set the `aria-disabled` attribute if the group is disabled', fakeAsync(() => {
          expect(groups[1].getAttribute('aria-disabled')).toBe('true');
        }));
      });
    });

    describe('overlay panel', () => {
      let fixture: ComponentFixture<BasicSelectComponent>;
      let trigger: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelectComponent);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      }));

      it('should not throw when attempting to open too early', () => {
        // Create component and then immediately open without running change detection
        fixture = TestBed.createComponent(BasicSelectComponent);
        expect(() => fixture.componentInstance.select.open()).not.toThrow();
      });

      it('should open the panel when trigger is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(overlayContainerElement.textContent).toContain('Steak');
        expect(overlayContainerElement.textContent).toContain('Pizza');
        expect(overlayContainerElement.textContent).toContain('Tacos');
      }));

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

        const backdrop =
          overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;

        backdrop.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should set the width of the overlay based on the trigger', fakeAsync(() => {
        trigger.style.width = '200px';

        trigger.click();
        fixture.detectChanges();
        flush();

        const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
        expect(pane.style.minWidth).toBe('200px');
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

        dispatchKeyboardEvent(trigger, 'keydown', TAB);
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should restore focus to the host before tabbing away', fakeAsync(() => {
        const select = fixture.nativeElement.querySelector('.sbb-select');

        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);

        // Use a spy since focus can be flaky in unit tests.
        spyOn(select, 'focus').and.callThrough();

        dispatchKeyboardEvent(trigger, 'keydown', TAB);
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

      it('should focus the first option when pressing HOME', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        const event = dispatchKeyboardEvent(trigger, 'keydown', HOME);
        fixture.detectChanges();

        expect(fixture.componentInstance.select.keyManager.activeItemIndex).toBe(0);
        expect(event.defaultPrevented).toBe(true);
      }));

      it('should focus the last option when pressing END', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        const event = dispatchKeyboardEvent(trigger, 'keydown', END);
        fixture.detectChanges();

        expect(fixture.componentInstance.select.keyManager.activeItemIndex).toBe(7);
        expect(event.defaultPrevented).toBe(true);
      }));

      it('should be able to set extra classes on the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const panel = overlayContainerElement.querySelector('.sbb-select-panel') as HTMLElement;

        expect(panel.classList).toContain('custom-one');
        expect(panel.classList).toContain('custom-two');
      }));

      it('should prevent the default action when pressing SPACE on an option', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        const option = overlayContainerElement.querySelector('sbb-option')!;
        const event = dispatchKeyboardEvent(option, 'keydown', SPACE);

        expect(event.defaultPrevented).toBe(true);
      }));

      it('should prevent the default action when pressing ENTER on an option', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        const option = overlayContainerElement.querySelector('sbb-option')!;
        const event = dispatchKeyboardEvent(option, 'keydown', ENTER);

        expect(event.defaultPrevented).toBe(true);
      }));

      it('should be able to render options inside groups with an ng-container', fakeAsync(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroupsAndNgContainerComponent);
        groupFixture.detectChanges();
        trigger = groupFixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        trigger.click();
        groupFixture.detectChanges();

        expect(document.querySelectorAll('.cdk-overlay-container sbb-option').length)
          .toBeGreaterThan(0, 'Expected at least one option to be rendered.');
      }));

      it('should not consider itself as blurred if the trigger loses focus while the ' +
        'panel is still open', fakeAsync(() => {
          const selectElement = fixture.nativeElement.querySelector('.sbb-select');
          const selectInstance = fixture.componentInstance.select;

          dispatchFakeEvent(selectElement, 'focus');
          fixture.detectChanges();

          expect(selectInstance.focused).toBe(true, 'Expected select to be focused.');

          selectInstance.open();
          fixture.detectChanges();
          flush();
          dispatchFakeEvent(selectElement, 'blur');
          fixture.detectChanges();

          expect(selectInstance.focused).toBe(true, 'Expected select element to remain focused.');
        }));

    });

    describe('selection logic', () => {
      let fixture: ComponentFixture<BasicSelectComponent>;
      let trigger: HTMLElement;
      let formField: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelectComponent);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        formField = fixture.debugElement.query(By.css('.sbb-field')).nativeElement;
      }));

      it('should not float label if no option is selected', fakeAsync(() => {
        expect(formField.classList.contains('sbb-field-should-float'))
          .toBe(false, 'Label should not be floating');
      }));

      it('should focus the first option if no option is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.keyManager.activeItemIndex).toEqual(0);
      }));

      it('should select an option when it is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        let option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

        expect(option.classList).toContain('sbb-selected');
        expect(fixture.componentInstance.options.first.selected).toBe(true);
        expect(fixture.componentInstance.select.selected)
          .toBe(fixture.componentInstance.options.first);
      }));

      it('should be able to select an option using the MatOption API', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const optionInstances = fixture.componentInstance.options.toArray();
        const optionNodes: NodeListOf<HTMLElement> =
          overlayContainerElement.querySelectorAll('sbb-option');

        optionInstances[1].select();
        fixture.detectChanges();

        expect(optionNodes[1].classList).toContain('sbb-selected');
        expect(optionInstances[1].selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(optionInstances[1]);
      }));

      it('should deselect other options when one is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        let options =
          overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;

        options[0].click();
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        options =
          overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        expect(options[1].classList).not.toContain('sbb-selected');
        expect(options[2].classList).not.toContain('sbb-selected');

        const optionInstances = fixture.componentInstance.options.toArray();
        expect(optionInstances[1].selected).toBe(false);
        expect(optionInstances[2].selected).toBe(false);
      }));

      it('should deselect other options when one is programmatically selected', fakeAsync(() => {
        const control = fixture.componentInstance.control;
        const foods = fixture.componentInstance.foods;

        trigger.click();
        fixture.detectChanges();
        flush();

        let options =
          overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;

        options[0].click();
        fixture.detectChanges();
        flush();

        control.setValue(foods[1].value);
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;

        expect(options[0].classList)
          .not.toContain('sbb-selected', 'Expected first option to no longer be selected');
        expect(options[1].classList)
          .toContain('sbb-selected', 'Expected second option to be selected');

        const optionInstances = fixture.componentInstance.options.toArray();

        expect(optionInstances[0].selected)
          .toBe(false, 'Expected first option to no longer be selected');
        expect(optionInstances[1].selected)
          .toBe(true, 'Expected second option to be selected');
      }));

      it('should remove selection if option has been removed', fakeAsync(() => {
        const select = fixture.componentInstance.select;

        trigger.click();
        fixture.detectChanges();
        flush();

        const firstOption = overlayContainerElement.querySelectorAll('sbb-option')[0] as HTMLElement;

        firstOption.click();
        fixture.detectChanges();

        expect(select.selected).toBe(select.options.first, 'Expected first option to be selected.');

        fixture.componentInstance.foods = [];
        fixture.detectChanges();
        flush();

        expect(select.selected)
          .toBeUndefined('Expected selection to be removed when option no longer exists.');
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

        expect(formField.classList.contains('sbb-field-should-float'))
          .toBe(true, 'Label should be floating');
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
        expect(fixture.componentInstance.select.keyManager.activeItemIndex).toEqual(1);
      }));

      it('should select an option that was added after initialization', fakeAsync(() => {
        fixture.componentInstance.foods.push({ viewValue: 'Potatoes', value: 'potatoes-8' });
        trigger.click();
        fixture.detectChanges();
        flush();

        const options =
          overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        options[8].click();
        fixture.detectChanges();
        flush();

        expect(trigger.textContent).toContain('Potatoes');
        expect(fixture.componentInstance.select.selected)
          .toBe(fixture.componentInstance.options.last);
      }));

      it('should update the trigger when the selected option label is changed', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        expect(trigger.textContent!.trim()).toBe('Pizza');

        fixture.componentInstance.foods[1].viewValue = 'Calzone';
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        expect(trigger.textContent!.trim()).toBe('Calzone');
      }));

      it('should not select disabled options', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const options =
          overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        options[2].click();
        fixture.detectChanges();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[2].classList).not.toContain('sbb-selected');
        expect(fixture.componentInstance.select.selected).toBeUndefined();
      }));

      it('should not select options inside a disabled group', fakeAsync(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroupsComponent);
        groupFixture.detectChanges();
        groupFixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement.click();
        groupFixture.detectChanges();

        const disabledGroup = overlayContainerElement.querySelectorAll('sbb-option-group')[1];
        const options = disabledGroup.querySelectorAll('sbb-option');

        (options[0] as HTMLElement).click();
        groupFixture.detectChanges();

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

        expect(spy).toHaveBeenCalledWith(jasmine.any(SBBOptionSelectionChange));

        subscription.unsubscribe();
      }));

      it('should handle accessing `optionSelectionChanges` before the options are initialized',
        fakeAsync(() => {
          fixture.destroy();
          fixture = TestBed.createComponent(BasicSelectComponent);

          const spy = jasmine.createSpy('option selection spy');
          let subscription: Subscription;

          expect(fixture.componentInstance.select.options).toBeFalsy();
          expect(() => {
            subscription = fixture.componentInstance.select.optionSelectionChanges.subscribe(spy);
          }).not.toThrow();

          fixture.detectChanges();
          trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;

          trigger.click();
          fixture.detectChanges();
          flush();

          const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
          option.click();
          fixture.detectChanges();
          flush();

          expect(spy).toHaveBeenCalledWith(jasmine.any(SBBOptionSelectionChange));

          // tslint:disable-next-line:no-non-null-assertion
          subscription!.unsubscribe();
        }));

    });

    describe('forms integration', () => {
      let fixture: ComponentFixture<BasicSelectComponent>;
      let trigger: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelectComponent);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      }));

      it('should take an initial view value with reactive forms', fakeAsync(() => {
        fixture.componentInstance.control = new FormControl('pizza-1');
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent)
          .toContain('Pizza', `Expected trigger to be populated by the control's initial value.`);

        trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        trigger.click();
        fixture.detectChanges();
        flush();

        const options =
          overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        expect(options[1].classList)
          .toContain('sbb-selected',
            `Expected option with the control's initial value to be selected.`);
      }));

      it('should set the view value from the form', fakeAsync(() => {
        let value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent.trim()).toBe('Food');

        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent)
          .toContain('Pizza', `Expected trigger to be populated by the control's new value.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const options =
          overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        expect(options[1].classList).toContain(
          'sbb-selected', `Expected option with the control's new value to be selected.`);
      }));

      it('should update the form value when the view changes', fakeAsync(() => {
        expect(fixture.componentInstance.control.value)
          .toEqual(null, `Expected the control's value to be empty initially.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.value)
          .toEqual('steak-0', `Expected control's value to be set to the new option.`);
      }));

      it('should clear the selection when a nonexistent option value is selected', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        fixture.componentInstance.control.setValue('gibberish');
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent.trim())
          .toBe('Food', `Expected trigger to show the placeholder.`);
        expect(trigger.textContent)
          .not.toContain('Pizza', `Expected trigger is cleared when option value is not found.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const options =
          overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        expect(options[1].classList)
          .not.toContain('sbb-selected', `Expected option w/ the old value not to be selected.`);
      }));


      it('should clear the selection when the control is reset', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        fixture.componentInstance.control.reset();
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent.trim())
          .toBe('Food', `Expected trigger to show the placeholder.`);
        expect(trigger.textContent)
          .not.toContain('Pizza', `Expected trigger is cleared when option value is not found.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const options =
          overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        expect(options[1].classList)
          .not.toContain('sbb-selected', `Expected option w/ the old value not to be selected.`);
      }));

      it('should set the control to touched when the select is blurred', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched)
          .toEqual(false, `Expected the control to start off as untouched.`);

        trigger.click();
        dispatchFakeEvent(trigger, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .toEqual(false, `Expected the control to stay untouched when menu opened.`);

        const backdrop =
          overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
        backdrop.click();
        dispatchFakeEvent(trigger, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .toEqual(true, `Expected the control to be touched as soon as focus left the select.`);
      }));

      it('should set the control to touched when the panel is closed', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched)
          .toBe(false, 'Expected the control to start off as untouched.');

        trigger.click();
        dispatchFakeEvent(trigger, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .toBe(false, 'Expected the control to stay untouched when menu opened.');

        fixture.componentInstance.select.close();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .toBe(true, 'Expected the control to be touched when the panel was closed.');
      }));

      it('should not set touched when a disabled select is touched', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched)
          .toBe(false, 'Expected the control to start off as untouched.');

        fixture.componentInstance.control.disable();
        dispatchFakeEvent(trigger, 'blur');

        expect(fixture.componentInstance.control.touched)
          .toBe(false, 'Expected the control to stay untouched.');
      }));

      it('should set the control to dirty when the select value changes in DOM', fakeAsync(() => {
        expect(fixture.componentInstance.control.dirty)
          .toEqual(false, `Expected control to start out pristine.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.dirty)
          .toEqual(true, `Expected control to be dirty after value was changed by user.`);
      }));

      it('should not set the control to dirty when the value changes programmatically',
        fakeAsync(() => {
          expect(fixture.componentInstance.control.dirty)
            .toEqual(false, `Expected control to start out pristine.`);

          fixture.componentInstance.control.setValue('pizza-1');

          expect(fixture.componentInstance.control.dirty)
            .toEqual(false, `Expected control to stay pristine after programmatic change.`);
        }));

      it('should set an asterisk after the label if control is required', fakeAsync(() => {
        let requiredMarker = fixture.debugElement.query(By.css('.sbb-field-required-marker'));
        expect(requiredMarker)
          .toBeNull(`Expected label not to have an asterisk, as control was not required.`);

        fixture.componentInstance.isRequired = true;
        fixture.detectChanges();

        requiredMarker = fixture.debugElement.query(By.css('.sbb-field-required-marker'));
        expect(requiredMarker)
          .not.toBeNull(`Expected label to have an asterisk, as control was required.`);
      }));
    });

    describe('disabled behavior', () => {
      it('should disable itself when control is disabled programmatically', fakeAsync(() => {
        const fixture = TestBed.createComponent(BasicSelectComponent);
        fixture.detectChanges();

        fixture.componentInstance.control.disable();
        fixture.detectChanges();
        const trigger =
          fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        expect(getComputedStyle(trigger).getPropertyValue('cursor'))
          .toEqual('default', `Expected cursor to be default arrow on disabled control.`);

        trigger.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent)
          .toEqual('', `Expected select panel to stay closed.`);
        expect(fixture.componentInstance.select.panelOpen)
          .toBe(false, `Expected select panelOpen property to stay false.`);

        fixture.componentInstance.control.enable();
        fixture.detectChanges();
        expect(getComputedStyle(trigger).getPropertyValue('cursor'))
          .toEqual('pointer', `Expected cursor to be a pointer on enabled control.`);

        trigger.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent)
          .toContain('Steak', `Expected select panel to open normally on re-enabled control`);
        expect(fixture.componentInstance.select.panelOpen)
          .toBe(true, `Expected select panelOpen property to become true.`);
      }));
    });

    describe('keyboard scrolling', () => {
      let fixture: ComponentFixture<BasicSelectComponent>;
      let host: HTMLElement;
      let panel: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelectComponent);

        fixture.componentInstance.foods = [];

        for (let i = 0; i < 30; i++) {
          fixture.componentInstance.foods.push({ value: `value-${i}`, viewValue: `Option ${i}` });
        }

        fixture.detectChanges();
        fixture.componentInstance.select.open();
        fixture.detectChanges();
        flush();

        host = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
        // tslint:disable-next-line:no-non-null-assertion
        panel = overlayContainerElement.querySelector('.sbb-select-panel')! as HTMLElement;
      }));

      it('should not scroll to options that are completely in the view', fakeAsync(() => {
        const initialScrollPosition = panel.scrollTop;

        [1, 2, 3].forEach(() => {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
        });

        expect(panel.scrollTop)
          .toBe(initialScrollPosition, 'Expected scroll position not to change');
      }));

      it('should scroll down to the active option', fakeAsync(() => {
        for (let i = 0; i < 15; i++) {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
        }

        // <option index * height> - <panel height> = 16 * 48 - 256 = 512
        expect(panel.scrollTop).toBe(512, 'Expected scroll to be at the 16th option.');
      }));

      it('should scroll up to the active option', fakeAsync(() => {
        // Scroll to the bottom.
        for (let i = 0; i < fixture.componentInstance.foods.length; i++) {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
        }

        for (let i = 0; i < 20; i++) {
          dispatchKeyboardEvent(host, 'keydown', UP_ARROW);
        }

        // <option index * height> = 9 * 48 = 432
        expect(panel.scrollTop).toBe(432, 'Expected scroll to be at the 9th option.');
      }));

      it('should skip option group labels', fakeAsync(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroupsComponent);

        groupFixture.detectChanges();
        groupFixture.componentInstance.select.open();
        groupFixture.detectChanges();
        flush();

        host = groupFixture.debugElement.query(By.css('sbb-select')).nativeElement;
        // tslint:disable-next-line:no-non-null-assertion
        panel = overlayContainerElement.querySelector('.sbb-select-panel')! as HTMLElement;

        for (let i = 0; i < 5; i++) {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
        }

        // Note that we press down 5 times, but it will skip
        // 3 options because the second group is disabled.
        // <(option index + group labels) * height> - <panel height> = (9 + 3) * 48 - 256 = 320
        expect(panel.scrollTop).toBe(320, 'Expected scroll to be at the 9th option.');
      }));

      it('should scroll top the top when pressing HOME', fakeAsync(() => {
        for (let i = 0; i < 20; i++) {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
          fixture.detectChanges();
        }

        expect(panel.scrollTop).toBeGreaterThan(0, 'Expected panel to be scrolled down.');

        dispatchKeyboardEvent(host, 'keydown', HOME);
        fixture.detectChanges();

        expect(panel.scrollTop).toBe(0, 'Expected panel to be scrolled to the top');
      }));

      it('should scroll to the bottom of the panel when pressing END', fakeAsync(() => {
        dispatchKeyboardEvent(host, 'keydown', END);
        fixture.detectChanges();

        // <option amount> * <option height> - <panel height> = 30 * 48 - 256 = 1184
        expect(panel.scrollTop).toBe(1184, 'Expected panel to be scrolled to the bottom');
      }));

      it('should scroll to the active option when typing', fakeAsync(() => {
        for (let i = 0; i < 15; i++) {
          // Press the letter 'o' 15 times since all the options are named 'Option <index>'
          dispatchEvent(host, createKeyboardEvent('keydown', 79, undefined, 'o'));
          fixture.detectChanges();
          tick(LETTER_KEY_DEBOUNCE_INTERVAL);
        }
        flush();

        // <option index * height> - <panel height> = 16 * 48 - 256 = 512
        expect(panel.scrollTop).toBe(512, 'Expected scroll to be at the 16th option.');
      }));

    });
  });

  describe('when initialized without options', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([SelectInitWithoutOptionsComponent])));

    it('should select the proper option when option list is initialized later', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectInitWithoutOptionsComponent);
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
    beforeEach(async(() => configureSbbSelectTestingModule([SelectWithChangeEventComponent])));

    let fixture: ComponentFixture<SelectWithChangeEventComponent>;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectWithChangeEventComponent);
      fixture.detectChanges();

      trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
    }));

    it('should emit an event when the selected option has changed', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalled();
    }));

    it('should not emit multiple change events for the same option', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      option.click();
      option.click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);
    }));

    it('should only emit one event when pressing arrow keys on closed select', fakeAsync(() => {
      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);
    }));
  });

  describe('with ngModel', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([NgModelSelectComponent])));

    it('should disable itself when control is disabled using the property', fakeAsync(() => {
      const fixture = TestBed.createComponent(NgModelSelectComponent);
      fixture.detectChanges();

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      flush();

      fixture.detectChanges();
      const trigger =
        fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      expect(getComputedStyle(trigger).getPropertyValue('cursor'))
        .toEqual('default', `Expected cursor to be default arrow on disabled control.`);

      trigger.click();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent)
        .toEqual('', `Expected select panel to stay closed.`);
      expect(fixture.componentInstance.select.panelOpen)
        .toBe(false, `Expected select panelOpen property to stay false.`);

      fixture.componentInstance.isDisabled = false;
      fixture.detectChanges();
      flush();

      fixture.detectChanges();
      expect(getComputedStyle(trigger).getPropertyValue('cursor'))
        .toEqual('pointer', `Expected cursor to be a pointer on enabled control.`);

      trigger.click();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent)
        .toContain('Steak', `Expected select panel to open normally on re-enabled control`);
      expect(fixture.componentInstance.select.panelOpen)
        .toBe(true, `Expected select panelOpen property to become true.`);
    }));
  });

  describe('with ngIf', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([NgIfSelectComponent])));

    it('should handle nesting in an ngIf', fakeAsync(() => {
      const fixture = TestBed.createComponent(NgIfSelectComponent);
      fixture.detectChanges();

      fixture.componentInstance.isShowing = true;
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      trigger.style.width = '300px';

      trigger.click();
      fixture.detectChanges();
      flush();

      const value = fixture.debugElement.query(By.css('.sbb-select-value'));
      expect(value.nativeElement.textContent)
        .toContain('Pizza', `Expected trigger to be populated by the control's initial value.`);

      const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      expect(pane.style.minWidth).toEqual('300px');

      expect(fixture.componentInstance.select.panelOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Steak');
      expect(overlayContainerElement.textContent).toContain('Pizza');
      expect(overlayContainerElement.textContent).toContain('Tacos');
    }));
  });

  describe('with multiple sbb-select elements in one view', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([ManySelectsComponent])));

    let fixture: ComponentFixture<ManySelectsComponent>;
    let triggers: DebugElement[];
    let options: NodeListOf<HTMLElement>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(ManySelectsComponent);
      fixture.detectChanges();
      triggers = fixture.debugElement.queryAll(By.css('.sbb-select-trigger'));

      triggers[0].nativeElement.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
    }));

    it('should set aria-owns properly', fakeAsync(() => {
      const selects = fixture.debugElement.queryAll(By.css('sbb-select'));

      expect(selects[0].nativeElement.getAttribute('aria-owns'))
        .toContain(options[0].id, `Expected aria-owns to contain IDs of its child options.`);
      expect(selects[0].nativeElement.getAttribute('aria-owns'))
        .toContain(options[1].id, `Expected aria-owns to contain IDs of its child options.`);

      const backdrop =
        overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      flush();

      triggers[1].nativeElement.click();
      fixture.detectChanges();
      flush();

      options =
        overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
      expect(selects[1].nativeElement.getAttribute('aria-owns'))
        .toContain(options[0].id, `Expected aria-owns to contain IDs of its child options.`);
      expect(selects[1].nativeElement.getAttribute('aria-owns'))
        .toContain(options[1].id, `Expected aria-owns to contain IDs of its child options.`);
    }));

    it('should remove aria-owns when the options are not visible', fakeAsync(() => {
      const select = fixture.debugElement.query(By.css('sbb-select'));

      expect(select.nativeElement.hasAttribute('aria-owns'))
        .toBe(true, 'Expected select to have aria-owns while open.');

      const backdrop =
        overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      flush();

      expect(select.nativeElement.hasAttribute('aria-owns'))
        .toBe(false, 'Expected select not to have aria-owns when closed.');
    }));

    it('should set the option id properly', fakeAsync(() => {
      const firstOptionID = options[0].id;

      expect(options[0].id)
        .toContain('sbb-option', `Expected option ID to have the correct prefix.`);
      expect(options[0].id).not.toEqual(options[1].id, `Expected option IDs to be unique.`);

      const backdrop =
        overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      flush();

      triggers[1].nativeElement.click();
      fixture.detectChanges();
      flush();

      options =
        overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
      expect(options[0].id)
        .toContain('sbb-option', `Expected option ID to have the correct prefix.`);
      expect(options[0].id).not.toEqual(firstOptionID, `Expected option IDs to be unique.`);
      expect(options[0].id).not.toEqual(options[1].id, `Expected option IDs to be unique.`);
    }));
  });

  describe('with a sibling component that throws an error', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([
      SelectWithErrorSiblingComponent,
      ThrowsErrorOnInitComponent
    ])));

    it('should not crash the browser when a sibling throws an error on init', fakeAsync(() => {
      // Note that this test can be considered successful if the error being thrown didn't
      // end up crashing the testing setup altogether.
      expect(() => {
        TestBed.createComponent(SelectWithErrorSiblingComponent).detectChanges();
      }).toThrowError(new RegExp('Oh no!', 'g'));
    }));
  });

  describe('with tabindex', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([SelectWithPlainTabindexComponent])));

    it('should be able to set the tabindex via the native attribute', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindexComponent);
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
      expect(select.getAttribute('tabindex')).toBe('5');
    }));
  });

  describe('change events', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([SelectWithPlainTabindexComponent])));

    it('should complete the stateChanges stream on destroy', () => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindexComponent);
      fixture.detectChanges();

      const debugElement = fixture.debugElement.query(By.directive(SelectComponent));
      const select = debugElement.componentInstance;

      const spy = jasmine.createSpy('stateChanges complete');
      const subscription = select.stateChanges.subscribe(undefined, undefined, spy);

      fixture.destroy();
      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    });
  });

  describe('when initially hidden', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([BasicSelectInitiallyHiddenComponent])));

    it('should set the width of the overlay if the element was hidden initially', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectInitiallyHiddenComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      trigger.style.width = '200px';
      fixture.componentInstance.isVisible = true;
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();
      flush();

      const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      expect(pane.style.minWidth).toBe('200px');
    }));
  });

  describe('with no placeholder', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([BasicSelectNoPlaceholderComponent])));

    it('should set the width of the overlay if there is no placeholder', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectNoPlaceholderComponent);

      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      // tslint:disable-next-line:radix
      expect(parseInt(pane.style.minWidth as string)).toBeGreaterThan(0);
    }));
  });

  describe('with theming', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([BasicSelectWithThemingComponent])));

    let fixture: ComponentFixture<BasicSelectWithThemingComponent>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(BasicSelectWithThemingComponent);
      fixture.detectChanges();
    }));

    it('should transfer the theme to the select panel', fakeAsync(() => {
      fixture.componentInstance.theme = 'warn';
      fixture.detectChanges();

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      // tslint:disable-next-line:no-non-null-assertion
      const panel = overlayContainerElement.querySelector('.sbb-select-panel')! as HTMLElement;
      expect(panel.classList).toContain('sbb-warn');
    }));
  });

  describe('when invalid inside a form', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([InvalidSelectInFormComponent])));

    it('should not throw SelectionModel errors in addition to ngModel errors', fakeAsync(() => {
      const fixture = TestBed.createComponent(InvalidSelectInFormComponent);

      // The first change detection run will throw the "ngModel is missing a name" error.
      expect(() => fixture.detectChanges()).toThrowError(/the name attribute must be set/g);

      // The second run shouldn't throw selection-model related errors.
      expect(() => fixture.detectChanges()).not.toThrow();
    }));
  });

  describe('with ngModel using compareWith', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([NgModelCompareWithSelectComponent])));

    let fixture: ComponentFixture<NgModelCompareWithSelectComponent>;
    let instance: NgModelCompareWithSelectComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(NgModelCompareWithSelectComponent);
      instance = fixture.componentInstance;
      fixture.detectChanges();
    }));

    describe('comparing by value', () => {

      it('should have a selection', fakeAsync(() => {
        const selectedOption = instance.select.selected as OptionComponent;
        expect(selectedOption.value.value).toEqual('pizza-1');
      }));

      it('should update when making a new selection', fakeAsync(() => {
        instance.options.last.selectViaInteraction();
        fixture.detectChanges();
        flush();

        const selectedOption = instance.select.selected as OptionComponent;
        expect(instance.selectedFood.value).toEqual('tacos-2');
        expect(selectedOption.value.value).toEqual('tacos-2');
      }));
    });
  });

  describe(`when the select's value is accessed on initialization`, () => {
    beforeEach(async(() => configureSbbSelectTestingModule([SelectEarlyAccessSiblingComponent])));

    it('should not throw when trying to access the selected value on init', fakeAsync(() => {
      expect(() => {
        TestBed.createComponent(SelectEarlyAccessSiblingComponent).detectChanges();
      }).not.toThrow();
    }));
  });

  describe('inside of a form group', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([SelectInsideFormGroupComponent])));

    let fixture: ComponentFixture<SelectInsideFormGroupComponent>;
    let testComponent: SelectInsideFormGroupComponent;
    let select: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectInsideFormGroupComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      select = fixture.debugElement.query(By.css('sbb-select')).nativeElement;
    }));

    it('should not set the invalid class on a clean select', fakeAsync(() => {
      expect(testComponent.formGroup.untouched).toBe(true, 'Expected the form to be untouched.');
      expect(testComponent.formControl.invalid).toBe(true, 'Expected form control to be invalid.');
      expect(select.classList)
        .not.toContain('sbb-select-invalid', 'Expected select not to appear invalid.');
      expect(select.getAttribute('aria-invalid'))
        .toBe('false', 'Expected aria-invalid to be set to false.');
    }));

    it('should appear as invalid if it becomes touched', fakeAsync(() => {
      expect(select.classList)
        .not.toContain('sbb-select-invalid', 'Expected select not to appear invalid.');
      expect(select.getAttribute('aria-invalid'))
        .toBe('false', 'Expected aria-invalid to be set to false.');

      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(select.classList)
        .toContain('sbb-select-invalid', 'Expected select to appear invalid.');
      expect(select.getAttribute('aria-invalid'))
        .toBe('true', 'Expected aria-invalid to be set to true.');
    }));

    it('should not have the invalid class when the select becomes valid', fakeAsync(() => {
      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(select.classList)
        .toContain('sbb-select-invalid', 'Expected select to appear invalid.');
      expect(select.getAttribute('aria-invalid'))
        .toBe('true', 'Expected aria-invalid to be set to true.');

      testComponent.formControl.setValue('pizza-1');
      fixture.detectChanges();

      expect(select.classList)
        .not.toContain('sbb-select-invalid', 'Expected select not to appear invalid.');
      expect(select.getAttribute('aria-invalid'))
        .toBe('false', 'Expected aria-invalid to be set to false.');
    }));

    it('should appear as invalid when the parent form group is submitted', fakeAsync(() => {
      expect(select.classList)
        .not.toContain('sbb-select-invalid', 'Expected select not to appear invalid.');
      expect(select.getAttribute('aria-invalid'))
        .toBe('false', 'Expected aria-invalid to be set to false.');

      dispatchFakeEvent(fixture.debugElement.query(By.css('form')).nativeElement, 'submit');
      fixture.detectChanges();

      expect(select.classList)
        .toContain('sbb-select-invalid', 'Expected select to appear invalid.');
      expect(select.getAttribute('aria-invalid'))
        .toBe('true', 'Expected aria-invalid to be set to true.');
    }));

    it('should render the error messages when the parent form is submitted', fakeAsync(() => {
      const debugEl = fixture.debugElement.nativeElement;

      expect(debugEl.querySelectorAll('sbb-error').length).toBe(0, 'Expected no error messages');

      dispatchFakeEvent(fixture.debugElement.query(By.css('form')).nativeElement, 'submit');
      fixture.detectChanges();

      expect(debugEl.querySelectorAll('sbb-error').length).toBe(1, 'Expected one error message');
    }));

    it('should override error matching behavior via injection token', fakeAsync(() => {
      const errorStateMatcher: ErrorStateMatcher = {
        isErrorState: jasmine.createSpy('error state matcher').and.returnValue(true)
      };

      fixture.destroy();

      TestBed.resetTestingModule().configureTestingModule({
        imports: [SelectModule, ReactiveFormsModule, FormsModule, NoopAnimationsModule],
        declarations: [SelectInsideFormGroupComponent],
        providers: [{ provide: ErrorStateMatcher, useValue: errorStateMatcher }],
      });

      const errorFixture = TestBed.createComponent(SelectInsideFormGroupComponent);
      const component = errorFixture.componentInstance;

      errorFixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      expect(errorStateMatcher.isErrorState).toHaveBeenCalled();
    }));
  });

  describe('with custom error behavior', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([CustomErrorBehaviorSelectComponent])));

    it('should be able to override the error matching behavior via an @Input', fakeAsync(() => {
      const fixture = TestBed.createComponent(CustomErrorBehaviorSelectComponent);
      const component = fixture.componentInstance;
      const matcher = jasmine.createSpy('error state matcher').and.returnValue(true);

      fixture.detectChanges();

      expect(component.control.invalid).toBe(false);
      expect(component.select.errorState).toBe(false);

      fixture.componentInstance.errorStateMatcher = { isErrorState: matcher };
      fixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      expect(matcher).toHaveBeenCalled();
    }));
  });

  describe('with preselected array values', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([
      SingleSelectWithPreselectedArrayValuesComponent,
    ])));

    it('should be able to preselect an array value in single-selection mode', fakeAsync(() => {
      const fixture = TestBed.createComponent(SingleSelectWithPreselectedArrayValuesComponent);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;

      expect(trigger.textContent).toContain('Pizza');
      expect(fixture.componentInstance.options.toArray()[1].selected).toBe(true);
    }));
  });

  describe('with custom value accessor', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([
      CompWithCustomSelectComponent,
      CustomSelectAccessorComponent,
    ])));

    it('should support use inside a custom value accessor', fakeAsync(() => {
      const fixture = TestBed.createComponent(CompWithCustomSelectComponent);
      spyOn(fixture.componentInstance.customAccessor, 'writeValue');
      fixture.detectChanges();

      expect(fixture.componentInstance.customAccessor.select.ngControl)
        .toBeFalsy('Expected sbb-select NOT to inherit control from parent value accessor.');
      expect(fixture.componentInstance.customAccessor.writeValue).toHaveBeenCalled();
    }));
  });

  describe('with a falsy value', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([FalsyValueSelectComponent])));

    it('should be able to programmatically select a falsy option', fakeAsync(() => {
      const fixture = TestBed.createComponent(FalsyValueSelectComponent);

      fixture.detectChanges();
      fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement.click();
      fixture.componentInstance.control.setValue(0);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.options.first.selected)
        .toBe(true, 'Expected first option to be selected');
      expect(overlayContainerElement.querySelectorAll('sbb-option')[0].classList)
        .toContain('sbb-selected', 'Expected first option to be selected');
    }));
  });

  describe('with OnPush', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([
      BasicSelectOnPushComponent,
      BasicSelectOnPushPreselectedComponent,
    ])));

    it('should set the trigger text based on the value when initialized', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPushPreselectedComponent);

      fixture.detectChanges();
      flush();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;

      fixture.detectChanges();

      expect(trigger.textContent).toContain('Pizza');
    }));

    it('should update the trigger based on the value', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPushComponent);
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;

      fixture.componentInstance.control.setValue('pizza-1');
      fixture.detectChanges();

      expect(trigger.textContent).toContain('Pizza');

      fixture.componentInstance.control.reset();
      fixture.detectChanges();

      expect(trigger.textContent).not.toContain('Pizza');
    }));
  });

  describe('with custom trigger', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([SelectWithCustomTriggerComponent])));

    it('should allow the user to customize the label', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectWithCustomTriggerComponent);
      fixture.detectChanges();

      fixture.componentInstance.control.setValue('pizza-1');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('.sbb-select-value')).nativeElement;

      expect(label.textContent).toContain('azziP',
        'Expected the displayed text to be "Pizza" in reverse.');
    }));
  });

  describe('when reseting the value by setting null or undefined', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([ResetValuesSelectComponent])));

    let fixture: ComponentFixture<ResetValuesSelectComponent>;
    let trigger: HTMLElement;
    let formField: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(ResetValuesSelectComponent);
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      formField = fixture.debugElement.query(By.css('.sbb-field')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
      options[0].click();
      fixture.detectChanges();
      flush();
    }));

    it('should reset when an option with an undefined value is selected', fakeAsync(() => {
      options[4].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeUndefined();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(formField.classList).not.toContain('sbb-field-should-float');
      expect(trigger.textContent).not.toContain('Undefined');
    }));

    it('should reset when an option with a null value is selected', fakeAsync(() => {
      options[5].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeNull();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(formField.classList).not.toContain('sbb-field-should-float');
      expect(trigger.textContent).not.toContain('Null');
    }));

    it('should reset when a blank option is selected', fakeAsync(() => {
      options[6].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeUndefined();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(formField.classList).not.toContain('sbb-field-should-float');
      expect(trigger.textContent).not.toContain('None');
    }));

    it('should not mark the reset option as selected ', fakeAsync(() => {
      options[5].click();
      fixture.detectChanges();
      flush();

      fixture.componentInstance.select.open();
      fixture.detectChanges();
      flush();

      expect(options[5].classList).not.toContain('sbb-selected');
    }));

    it('should not reset when any other falsy option is selected', fakeAsync(() => {
      options[3].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBe(false);
      expect(fixture.componentInstance.select.selected).toBeTruthy();
      expect(formField.classList).toContain('sbb-field-should-float');
      expect(trigger.textContent).toContain('Falsy');
    }));

    it('should not consider the reset values as selected when resetting the form control',
      fakeAsync(() => {
        expect(formField.classList).toContain('sbb-field-should-float');

        fixture.componentInstance.control.reset();
        fixture.detectChanges();

        expect(fixture.componentInstance.control.value).toBeNull();
        expect(fixture.componentInstance.select.selected).toBeFalsy();
        expect(formField.classList).not.toContain('sbbf-field-should-float');
        expect(trigger.textContent).not.toContain('Null');
        expect(trigger.textContent).not.toContain('Undefined');
      }));
  });

  describe('without Angular forms', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([
      BasicSelectWithoutFormsComponent,
      BasicSelectWithoutFormsPreselectedComponent,
      BasicSelectWithoutFormsMultipleComponent,
    ])));

    it('should set the value when options are clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsComponent);

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
      expect(trigger.textContent).toContain('Steak');

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

    it('should mark options as selected when the value is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsComponent);

      fixture.detectChanges();
      fixture.componentInstance.selectedFood = 'sandwich-2';
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      expect(trigger.textContent).toContain('Sandwich');

      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelectorAll('sbb-option')[2];

      expect(option.classList).toContain('sbb-selected');
      expect(fixture.componentInstance.select.value).toBe('sandwich-2');
    }));

    it('should reset the label when a null value is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsComponent);

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
      expect(trigger.textContent).toContain('Steak');

      fixture.componentInstance.selectedFood = null;
      fixture.detectChanges();

      expect(fixture.componentInstance.select.value).toBeNull();
      expect(trigger.textContent).not.toContain('Steak');
    }));

    it('should reflect the preselected value', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsPreselectedComponent);

      fixture.detectChanges();
      flush();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      fixture.detectChanges();
      expect(trigger.textContent).toContain('Pizza');

      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelectorAll('sbb-option')[1];

      expect(option.classList).toContain('sbb-selected');
      expect(fixture.componentInstance.select.value).toBe('pizza-1');
    }));

    it('should be able to select multiple values', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsMultipleComponent);

      fixture.detectChanges();
      expect(fixture.componentInstance.selectedFoods).toBeFalsy();

      const trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      const options =
        overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;

      options[0].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods).toEqual(['steak-0']);
      expect(fixture.componentInstance.select.value).toEqual(['steak-0']);
      expect(trigger.textContent).toContain('Steak');

      options[2].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods).toEqual(['steak-0', 'sandwich-2']);
      expect(fixture.componentInstance.select.value).toEqual(['steak-0', 'sandwich-2']);
      expect(trigger.textContent).toContain('Steak, Sandwich');

      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods).toEqual(['steak-0', 'pizza-1', 'sandwich-2']);
      expect(fixture.componentInstance.select.value).toEqual(['steak-0', 'pizza-1', 'sandwich-2']);
      expect(trigger.textContent).toContain('Steak, Pizza, Sandwich');
    }));

    it('should restore focus to the host element', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsComponent);

      fixture.detectChanges();
      fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      const select = fixture.debugElement.nativeElement.querySelector('sbb-select');

      expect(document.activeElement).toBe(select, 'Expected trigger to be focused.');
    }));

    it('should not restore focus to the host element when clicking outside', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsComponent);
      const select = fixture.debugElement.nativeElement.querySelector('sbb-select');

      fixture.detectChanges();
      fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement.click();
      fixture.detectChanges();
      flush();

      expect(document.activeElement).toBe(select, 'Expected trigger to be focused.');

      select.blur(); // Blur manually since the programmatic click might not do it.
      (overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(document.activeElement).not.toBe(select, 'Expected trigger not to be focused.');
    }));

    it('should update the data binding before emitting the change event', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsComponent);
      const instance = fixture.componentInstance;
      const spy = jasmine.createSpy('change spy');

      fixture.detectChanges();
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

  describe('with option centering disabled', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([
      SelectWithoutOptionCenteringComponent,
    ])));

    let fixture: ComponentFixture<SelectWithoutOptionCenteringComponent>;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectWithoutOptionCenteringComponent);
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
    }));

    it('should not align the active option with the trigger if centering is disabled',
      fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-select-panel')!;

        // The panel should be scrolled to 0 because centering the option disabled.
        expect(scrollContainer.scrollTop).toEqual(0, `Expected panel not to be scrolled.`);
        // The trigger should contain 'Pizza' because it was preselected
        expect(trigger.textContent).toContain('Pizza');
        // The selected index should be 1 because it was preselected
        expect(fixture.componentInstance.options.toArray()[1].selected).toBe(true);
      }));
  });

  describe('positioning', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([
      BasicSelectComponent,
      MultiSelectComponent,
      SelectWithGroupsComponent,
    ])));

    beforeEach((inject([ViewportRuler], (vr: ViewportRuler) => {
      viewportRuler = vr;
    })));

    let fixture: ComponentFixture<BasicSelectComponent>;
    let trigger: HTMLElement;
    let formField: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(BasicSelectComponent);
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
      formField = fixture.debugElement.query(By.css('sbb-field')).nativeElement;
    }));

    /**
     * Asserts that the given option is aligned with the trigger.
     * @param index The index of the option.
     * @param selectInstance Instance of the `sbb-select` component to check against.
     */
    function checkTriggerAlignedWithOption(index: number, selectInstance =
      fixture.componentInstance.select): void {

      // tslint:disable-next-line:no-non-null-assertion
      const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
      const triggerTop = trigger.getBoundingClientRect().top;
      const overlayTop = overlayPane.getBoundingClientRect().top;
      const options = overlayPane.querySelectorAll('sbb-option');
      const optionTop = options[index].getBoundingClientRect().top;
      // tslint:disable-next-line:radix
      const triggerFontSize = parseInt(window.getComputedStyle(trigger)['font-size']);
      const triggerLineHeightEm = 1.125;

      // Extra trigger height beyond the font size caused by the fact that the line-height is
      // greater than 1em.
      const triggerExtraLineSpaceAbove = (1 - triggerLineHeightEm) * triggerFontSize / 2;
      const topDifference = Math.floor(optionTop) -
        Math.floor(triggerTop - triggerFontSize - triggerExtraLineSpaceAbove);

      // Expect the coordinates to be within a pixel of each other. We can't rely on comparing
      // the exact value, because different browsers report the various sizes with slight (< 1px)
      // deviations.
      expect(Math.abs(topDifference) < 2)
        .toBe(true, `Expected trigger to align with option ${index}.`);

      // For the animation to start at the option's center, its origin must be the distance
      // from the top of the overlay to the option top + half the option height (48/2 = 24).
      const expectedOrigin = Math.floor(optionTop - overlayTop + 24);
      const rawYOrigin = selectInstance.transformOrigin.split(' ')[1].trim();
      // tslint:disable-next-line:radix
      const origin = Math.floor(parseInt(rawYOrigin));

      // Because the origin depends on the Y axis offset, we also have to
      // round down and check that the difference is within a pixel.
      expect(Math.abs(expectedOrigin - origin) < 2).toBe(true,
        `Expected panel animation to originate in the center of option ${index}.`);
    }

    describe('ample space to open', () => {
      beforeEach(fakeAsync(() => {
        // these styles are necessary because we are first testing the overlay's position
        // if there is room for it to open to its full extent in either direction.
        formField.style.position = 'fixed';
        formField.style.top = '285px';
        formField.style.left = '20px';
      }));

      it('should align the first option with trigger text if no option is selected',
        fakeAsync(() => {
          // We shouldn't push it too far down for this one, because the default may
          // end up being too much when running the tests on mobile browsers.
          formField.style.top = '100px';
          trigger.click();
          fixture.detectChanges();
          flush();

          // tslint:disable-next-line:no-non-null-assertion
          const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-select-panel')!;

          // The panel should be scrolled to 0 because centering the option is not possible.
          expect(scrollContainer.scrollTop).toEqual(0, `Expected panel not to be scrolled.`);
          checkTriggerAlignedWithOption(0);
        }));

      it('should align a selected option too high to be centered with the trigger text',
        fakeAsync(() => {
          // Select the second option, because it can't be scrolled any further downward
          fixture.componentInstance.control.setValue('pizza-1');
          fixture.detectChanges();

          trigger.click();
          fixture.detectChanges();
          flush();

          // tslint:disable-next-line:no-non-null-assertion
          const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-select-panel')!;

          // The panel should be scrolled to 0 because centering the option is not possible.
          expect(scrollContainer.scrollTop).toEqual(0, `Expected panel not to be scrolled.`);
          checkTriggerAlignedWithOption(1);
        }));

      it('should align a selected option in the middle with the trigger text', fakeAsync(() => {
        // Select the fifth option, which has enough space to scroll to the center
        fixture.componentInstance.control.setValue('chips-4');
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-select-panel')!;

        // The selected option should be scrolled to the center of the panel.
        // This will be its original offset from the scrollTop - half the panel height + half
        // the option height. 4 (index) * 48 (option height) = 192px offset from scrollTop
        // 192 - 256/2 + 48/2 = 88px
        expect(scrollContainer.scrollTop)
          .toEqual(88, `Expected overlay panel to be scrolled to center the selected option.`);

        checkTriggerAlignedWithOption(4);
      }));

      it('should align a selected option at the scroll max with the trigger text', fakeAsync(() => {
        // Select the last option in the list
        fixture.componentInstance.control.setValue('sushi-7');
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-select-panel')!;

        // The selected option should be scrolled to the max scroll position.
        // This will be the height of the scrollContainer - the panel height.
        // 8 options * 48px = 384 scrollContainer height, 384 - 256 = 128px max scroll
        expect(scrollContainer.scrollTop)
          .toEqual(128, `Expected overlay panel to be scrolled to its maximum position.`);

        checkTriggerAlignedWithOption(7);
      }));

      it('should account for preceding label groups when aligning the option', fakeAsync(() => {
        // Test is off-by-one on edge for some reason, but verified that it looks correct through
        // manual testing.
        if (platform.EDGE) {
          return;
        }

        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroupsComponent);
        groupFixture.detectChanges();
        trigger = groupFixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
        formField = groupFixture.debugElement.query(By.css('sbb-field')).nativeElement;

        formField.style.position = 'fixed';
        formField.style.top = '200px';
        formField.style.left = '100px';

        // Select an option in the third group, which has a couple of group labels before it.
        groupFixture.componentInstance.control.setValue('vulpix-7');
        groupFixture.detectChanges();

        trigger.click();
        groupFixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-select-panel')!;

        // The selected option should be scrolled to the center of the panel.
        // This will be its original offset from the scrollTop - half the panel height + half the
        // option height. 10 (option index + 3 group labels before it) * 48 (option height) = 480
        // 480 (offset from scrollTop) - 256/2 + 48/2 = 376px
        expect(Math.floor(scrollContainer.scrollTop))
          .toBe(376, `Expected overlay panel to be scrolled to center the selected option.`);

        checkTriggerAlignedWithOption(7, groupFixture.componentInstance.select);
      }));
    });

    describe('limited space to open vertically', () => {
      beforeEach(fakeAsync(() => {
        formField.style.position = 'fixed';
        formField.style.left = '20px';
      }));

      it('should adjust position of centered option if there is little space above',
        fakeAsync(() => {
          const selectMenuHeight = 256;
          const selectMenuViewportPadding = 8;
          const selectItemHeight = 48;
          const selectedIndex = 4;
          const fontSize = 16;
          const lineHeightEm = 1.125;
          const expectedExtraScroll = 5;

          // Trigger element height.
          const triggerHeight = fontSize * lineHeightEm;

          // Ideal space above selected item in order to center it.
          const idealSpaceAboveSelectedItem = (selectMenuHeight - selectItemHeight) / 2;

          // Actual space above selected item.
          const actualSpaceAboveSelectedItem = selectItemHeight * selectedIndex;

          // Ideal scroll position to center.
          const idealScrollTop = actualSpaceAboveSelectedItem - idealSpaceAboveSelectedItem;

          // Top-most select-position that allows for perfect centering.
          const topMostPositionForPerfectCentering =
            idealSpaceAboveSelectedItem + selectMenuViewportPadding +
            (selectItemHeight - triggerHeight) / 2;

          // Position of select relative to top edge of sbb-field.
          const formFieldTopSpace =
            trigger.getBoundingClientRect().top - formField.getBoundingClientRect().top;

          const formFieldTop =
            topMostPositionForPerfectCentering - formFieldTopSpace - expectedExtraScroll;

          formField.style.top = `${formFieldTop}px`;

          // Select an option in the middle of the list
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();
          flush();

          trigger.click();
          fixture.detectChanges();
          flush();

          // tslint:disable-next-line:no-non-null-assertion
          const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-select-panel')!;

          expect(Math.ceil(scrollContainer.scrollTop))
            .toEqual(Math.ceil(idealScrollTop + 5),
              `Expected panel to adjust scroll position to fit in viewport.`);

          checkTriggerAlignedWithOption(4);
        }));

      it('should adjust position of centered option if there is little space below',
        fakeAsync(() => {
          const selectMenuHeight = 256;
          const selectMenuViewportPadding = 8;
          const selectItemHeight = 48;
          const selectedIndex = 4;
          const fontSize = 16;
          const lineHeightEm = 1.125;
          const expectedExtraScroll = 5;

          // Trigger element height.
          const triggerHeight = fontSize * lineHeightEm;

          // Ideal space above selected item in order to center it.
          const idealSpaceAboveSelectedItem = (selectMenuHeight - selectItemHeight) / 2;

          // Actual space above selected item.
          const actualSpaceAboveSelectedItem = selectItemHeight * selectedIndex;

          // Ideal scroll position to center.
          const idealScrollTop = actualSpaceAboveSelectedItem - idealSpaceAboveSelectedItem;

          // Bottom-most select-position that allows for perfect centering.
          const bottomMostPositionForPerfectCentering =
            idealSpaceAboveSelectedItem + selectMenuViewportPadding +
            (selectItemHeight - triggerHeight) / 2;

          // Position of select relative to bottom edge of sbb-field:
          const formFieldBottomSpace =
            formField.getBoundingClientRect().bottom - trigger.getBoundingClientRect().bottom;

          const formFieldBottom =
            bottomMostPositionForPerfectCentering - formFieldBottomSpace - expectedExtraScroll;

          // Push the select to a position with not quite enough space on the bottom to open
          // with the option completely centered (needs 113px at least: 256/2 - 48/2 + 9)
          formField.style.bottom = `${formFieldBottom}px`;

          // Select an option in the middle of the list
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();
          flush();

          fixture.detectChanges();

          trigger.click();
          fixture.detectChanges();
          flush();

          // tslint:disable-next-line:no-non-null-assertion
          const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-select-panel')!;

          // Scroll should adjust by the difference between the bottom space available
          // (56px from the bottom of the screen - 8px padding = 48px)
          // and the height of the panel below the option (113px).
          // 113px - 48px = 75px difference. Original scrollTop 88px - 75px = 23px
          const difference = Math.ceil(scrollContainer.scrollTop) -
            Math.ceil(idealScrollTop - expectedExtraScroll);

          // Note that different browser/OS combinations report the different dimensions with
          // slight deviations (< 1px). We round the expectation and check that the values
          // are within a pixel of each other to avoid flakes.
          expect(Math.abs(difference) < 2)
            .toBe(true, `Expected panel to adjust scroll position to fit in viewport.`);

          checkTriggerAlignedWithOption(4);
        }));

      it('should fall back to "above" positioning if scroll adjustment will not help',
        fakeAsync(() => {
          // Push the select to a position with not enough space on the bottom to open
          formField.style.bottom = '56px';
          fixture.detectChanges();

          // Select an option that cannot be scrolled any farther upward
          fixture.componentInstance.control.setValue('coke-0');
          fixture.detectChanges();

          trigger.click();
          fixture.detectChanges();
          flush();

          // tslint:disable-next-line:no-non-null-assertion
          const overlayPane = document.querySelector('.cdk-overlay-pane')!;
          const triggerBottom = trigger.getBoundingClientRect().bottom;
          const overlayBottom = overlayPane.getBoundingClientRect().bottom;
          // tslint:disable-next-line:no-non-null-assertion
          const scrollContainer = overlayPane.querySelector('.sbb-select-panel')!;

          // Expect no scroll to be attempted
          expect(scrollContainer.scrollTop).toEqual(0, `Expected panel not to be scrolled.`);

          const difference = Math.floor(overlayBottom) - Math.floor(triggerBottom);

          // Check that the values are within a pixel of each other. This avoids sub-pixel
          // deviations between OS and browser versions.
          expect(Math.abs(difference) < 2)
            .toEqual(true, `Expected trigger bottom to align with overlay bottom.`);

          expect(fixture.componentInstance.select.transformOrigin)
            .toContain(`bottom`, `Expected panel animation to originate at the bottom.`);
        }));

      it('should fall back to "below" positioning if scroll adjustment won\'t help',
        fakeAsync(() => {
          // Push the select to a position with not enough space on the top to open
          formField.style.top = '85px';

          // Select an option that cannot be scrolled any farther downward
          fixture.componentInstance.control.setValue('sushi-7');
          fixture.detectChanges();
          flush();

          trigger.click();
          fixture.detectChanges();
          flush();

          // tslint:disable-next-line:no-non-null-assertion
          const overlayPane = document.querySelector('.cdk-overlay-pane')!;
          const triggerTop = trigger.getBoundingClientRect().top;
          const overlayTop = overlayPane.getBoundingClientRect().top;
          // tslint:disable-next-line:no-non-null-assertion
          const scrollContainer = overlayPane.querySelector('.sbb-select-panel')!;

          // Expect scroll to remain at the max scroll position
          expect(scrollContainer.scrollTop).toEqual(128, `Expected panel to be at max scroll.`);

          expect(Math.floor(overlayTop))
            .toEqual(Math.floor(triggerTop), `Expected trigger top to align with overlay top.`);

          expect(fixture.componentInstance.select.transformOrigin)
            .toContain(`top`, `Expected panel animation to originate at the top.`);
        }));

    });

    describe('limited space to open horizontally', () => {
      beforeEach(fakeAsync(() => {
        formField.style.position = 'absolute';
        formField.style.top = '200px';
      }));

      it('should stay within the viewport when overflowing on the left in ltr', fakeAsync(() => {
        formField.style.left = '-100px';
        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const panelLeft = document.querySelector('.sbb-select-panel')!.getBoundingClientRect().left;

        expect(panelLeft).toBeGreaterThan(0,
          `Expected select panel to be inside the viewport in ltr.`);
      }));

      it('should stay within the viewport when overflowing on the left in rtl', fakeAsync(() => {
        formField.style.left = '-100px';
        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const panelLeft = document.querySelector('.sbb-select-panel')!.getBoundingClientRect().left;

        expect(panelLeft).toBeGreaterThan(0,
          `Expected select panel to be inside the viewport in rtl.`);
      }));

      it('should stay within the viewport when overflowing on the right in ltr', fakeAsync(() => {
        formField.style.right = '-100px';
        trigger.click();
        fixture.detectChanges();
        flush();

        const viewportRect = viewportRuler.getViewportRect().right;
        // tslint:disable-next-line:no-non-null-assertion
        const panelRight = document.querySelector('.sbb-select-panel')!
          .getBoundingClientRect().right;

        expect(viewportRect - panelRight).toBeGreaterThan(0,
          `Expected select panel to be inside the viewport in ltr.`);
      }));

      it('should keep the position within the viewport on repeat openings', fakeAsync(() => {
        formField.style.left = '-100px';
        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        let panelLeft = document.querySelector('.sbb-select-panel')!.getBoundingClientRect().left;

        expect(panelLeft)
          .toBeGreaterThanOrEqual(0, `Expected select panel to be inside the viewport.`);

        fixture.componentInstance.select.close();
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        panelLeft = document.querySelector('.sbb-select-panel')!.getBoundingClientRect().left;

        expect(panelLeft).toBeGreaterThanOrEqual(0,
          `Expected select panel continue being inside the viewport.`);
      }));
    });

    describe('when scrolled', () => {
      const startingWindowHeight = window.innerHeight;

      // Need to set the scrollTop two different ways to support
      // both Chrome and Firefox.
      function setScrollTop(num: number) {
        document.body.scrollTop = num;
        document.documentElement.scrollTop = num;
      }

      beforeEach(fakeAsync(() => {
        // Make the div above the select very tall, so the page will scroll
        fixture.componentInstance.heightAbove = 2000;
        fixture.detectChanges();
        setScrollTop(0);

        // Give the select enough horizontal space to open
        formField.style.marginLeft = '20px';
        formField.style.marginRight = '20px';
      }));

      it('should align the first option properly when scrolled', fakeAsync(() => {
        // Give the select enough space to open
        fixture.componentInstance.heightBelow = 400;
        fixture.detectChanges();

        // Space that is needed in order to show the menu below the trigger.
        // 256 (height of the menu overlay) - 45 (estimated height of the trigger)
        const requiredSpaceBelow = 256 - 45;

        // Scroll the select into view. Make sure that there is enough space for the menu
        // to open below the trigger (depending on the screen resolution)
        setScrollTop(2000 - requiredSpaceBelow);


        // In the iOS simulator (BrowserStack & SauceLabs), adding the content to the
        // body causes karma's iframe for the test to stretch to fit that content once we attempt to
        // scroll the page. Setting width / height / maxWidth / maxHeight on the iframe does not
        // successfully constrain its size. As such, skip assertions in environments where the
        // window size has changed since the start of the test.
        if (window.innerHeight > startingWindowHeight) {
          return;
        }

        trigger.click();
        fixture.detectChanges();
        flush();

        checkTriggerAlignedWithOption(0);
      }));

      it('should align a centered option properly when scrolled', fakeAsync(() => {
        // Give the select enough space to open
        fixture.componentInstance.heightBelow = 400;
        fixture.detectChanges();

        fixture.componentInstance.control.setValue('chips-4');
        fixture.detectChanges();
        flush();

        // Space that is needed in order to show the menu below the trigger.
        // 256 (height of the menu overlay) - 45 (estimated height of the trigger)
        // Even though there might be less options displayed below the trigger because the
        // selected option is the fourth item, we want to make sure we have enough space here.
        const requiredSpaceBelow = 256 - 45;

        // Scroll the select into view. Make sure that there is enough space for the menu
        // to open below the trigger (depending on the screen resolution)
        setScrollTop(2000 - requiredSpaceBelow);

        // In the iOS simulator (BrowserStack & SauceLabs), adding the content to the
        // body causes karma's iframe for the test to stretch to fit that content once we attempt
        // to scroll the page. Setting width / height / maxWidth / maxHeight on the iframe does
        // not successfully constrain its size. As such, skip assertions in environments where the
        // window size has changed since the start of the test.
        if (window.innerHeight > startingWindowHeight) {
          return;
        }

        trigger.click();
        fixture.detectChanges();
        flush();

        checkTriggerAlignedWithOption(4);
      }));

      it('should align a centered option properly when scrolling while the panel is open',
        fakeAsync(() => {
          fixture.componentInstance.heightBelow = 400;
          fixture.componentInstance.heightAbove = 400;
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();
          flush();

          trigger.click();
          fixture.detectChanges();
          flush();

          setScrollTop(100);
          scrolledSubject.next();
          fixture.detectChanges();

          checkTriggerAlignedWithOption(4);
        }));

      it('should fall back to "above" positioning properly when scrolled', fakeAsync(() => {
        // Give the select insufficient space to open below the trigger
        fixture.componentInstance.heightAbove = 0;
        fixture.componentInstance.heightBelow = 100;
        trigger.style.marginTop = '2000px';
        fixture.detectChanges();

        // Scroll the select into view
        setScrollTop(1400);

        // In the iOS simulator (BrowserStack & SauceLabs), adding the content to the
        // body causes karma's iframe for the test to stretch to fit that content once we attempt to
        // scroll the page. Setting width / height / maxWidth / maxHeight on the iframe does not
        // successfully constrain its size. As such, skip assertions in environments where the
        // window size has changed since the start of the test.
        if (window.innerHeight > startingWindowHeight) {
          return;
        }

        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
        const triggerBottom = trigger.getBoundingClientRect().bottom;
        const overlayBottom = overlayPane.getBoundingClientRect().bottom;
        const difference = Math.floor(overlayBottom) - Math.floor(triggerBottom);

        // Check that the values are within a pixel of each other. This avoids sub-pixel
        // deviations between OS and browser versions.
        expect(Math.abs(difference) < 2)
          .toEqual(true, `Expected trigger bottom to align with overlay bottom.`);
      }));

      it('should fall back to "below" positioning properly when scrolled', fakeAsync(() => {
        // Give plenty of space for the select to open below the trigger
        fixture.componentInstance.heightBelow = 650;
        fixture.detectChanges();

        // Select an option too low in the list to fit in limited space above
        fixture.componentInstance.control.setValue('sushi-7');
        fixture.detectChanges();

        // Scroll the select so that it has insufficient space to open above the trigger
        setScrollTop(1950);

        // In the iOS simulator (BrowserStack & SauceLabs), adding the content to the
        // body causes karma's iframe for the test to stretch to fit that content once we attempt to
        // scroll the page. Setting width / height / maxWidth / maxHeight on the iframe does not
        // successfully constrain its size. As such, skip assertions in environments where the
        // window size has changed since the start of the test.
        if (window.innerHeight > startingWindowHeight) {
          return;
        }

        trigger.click();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane')!;
        const triggerTop = trigger.getBoundingClientRect().top;
        const overlayTop = overlayPane.getBoundingClientRect().top;

        expect(Math.floor(overlayTop))
          .toEqual(Math.floor(triggerTop), `Expected trigger top to align with overlay top.`);
      }));
    });
  });

  describe('with multiple selection', () => {
    beforeEach(async(() => configureSbbSelectTestingModule([MultiSelectComponent])));

    let fixture: ComponentFixture<MultiSelectComponent>;
    let testInstance: MultiSelectComponent;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MultiSelectComponent);
      testInstance = fixture.componentInstance;
      fixture.detectChanges();

      trigger = fixture.debugElement.query(By.css('.sbb-select-trigger')).nativeElement;
    }));

    it('should be able to select multiple values', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as
        NodeListOf<HTMLElement>;

      options[0].click();
      options[2].click();
      options[5].click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual(['steak-0', 'tacos-2', 'eggs-5']);
    }));

    it('should be able to toggle an option on and off', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      option.click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual(['steak-0']);

      option.click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([]);
    }));

    it('should update the label', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as
        NodeListOf<HTMLElement>;

      options[0].click();
      options[2].click();
      options[5].click();
      fixture.detectChanges();

      expect(trigger.textContent).toContain('Steak, Tacos, Eggs');

      options[2].click();
      fixture.detectChanges();

      expect(trigger.textContent).toContain('Steak, Eggs');
    }));

    it('should be able to set the selected value by taking an array', fakeAsync(() => {
      trigger.click();
      testInstance.control.setValue(['steak-0', 'eggs-5']);
      fixture.detectChanges();

      const optionNodes = overlayContainerElement.querySelectorAll('sbb-option') as
        NodeListOf<HTMLElement>;

      const optionInstances = testInstance.options.toArray();

      expect(optionNodes[0].classList).toContain('sbb-selected');
      expect(optionNodes[5].classList).toContain('sbb-selected');

      expect(optionInstances[0].selected).toBe(true);
      expect(optionInstances[5].selected).toBe(true);
    }));

    it('should override the previously-selected value when setting an array', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as
        NodeListOf<HTMLElement>;

      options[0].click();
      fixture.detectChanges();

      expect(options[0].classList).toContain('sbb-selected');

      testInstance.control.setValue(['eggs-5']);
      fixture.detectChanges();

      expect(options[0].classList).not.toContain('sbb-selected');
      expect(options[5].classList).toContain('sbb-selected');
    }));

    it('should not close the panel when clicking on options', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      expect(testInstance.select.panelOpen).toBe(true);

      const options = overlayContainerElement.querySelectorAll('sbb-option') as
        NodeListOf<HTMLElement>;

      options[0].click();
      options[1].click();
      fixture.detectChanges();

      expect(testInstance.select.panelOpen).toBe(true);
    }));

    it('should sort the selected options based on their order in the panel', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as
        NodeListOf<HTMLElement>;

      options[2].click();
      options[0].click();
      options[1].click();
      fixture.detectChanges();

      expect(trigger.textContent).toContain('Steak, Pizza, Tacos');
      expect(fixture.componentInstance.control.value).toEqual(['steak-0', 'pizza-1', 'tacos-2']);
    }));

    it('should sort the values that get set via the model based on the panel order',
      fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        testInstance.control.setValue(['tacos-2', 'steak-0', 'pizza-1']);
        fixture.detectChanges();

        expect(trigger.textContent).toContain('Steak, Pizza, Tacos');
      }));

    it('should pass the `multiple` value to all of the option instances', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      expect(testInstance.options.toArray().every(option => !!option.multiple)).toBe(true,
        'Expected `multiple` to have been added to initial set of options.');

      testInstance.foods.push({ value: 'cake-8', viewValue: 'Cake' });
      fixture.detectChanges();

      expect(testInstance.options.toArray().every(option => !!option.multiple)).toBe(true,
        'Expected `multiple` to have been set on dynamically-added option.');
    }));

    it('should update the active item index on click', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select.keyManager.activeItemIndex).toBe(0);

      const options = overlayContainerElement.querySelectorAll('sbb-option') as
        NodeListOf<HTMLElement>;

      options[2].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.select.keyManager.activeItemIndex).toBe(2);
    }));

    it('should be to select an option with a `null` value', fakeAsync(() => {
      fixture.componentInstance.foods = [
        { value: null, viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: null, viewValue: 'Tacos' },
      ];

      fixture.detectChanges();
      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll('sbb-option') as
        NodeListOf<HTMLElement>;

      options[0].click();
      options[1].click();
      options[2].click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([null, 'pizza-1', null]);
    }));

    it('should select all options when pressing ctrl + a', () => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      expect(testInstance.control.value).toBeFalsy();
      expect(options.every(option => option.selected)).toBe(false);

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent('keydown', A, selectElement);
      Object.defineProperty(event, 'ctrlKey', { get: () => true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(options.every(option => option.selected)).toBe(true);
      expect(testInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7'
      ]);
    });

    it('should skip disabled options when using ctrl + a', () => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      for (let i = 0; i < 3; i++) {
        options[i].disabled = true;
      }

      expect(testInstance.control.value).toBeFalsy();

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent('keydown', A, selectElement);
      Object.defineProperty(event, 'ctrlKey', { get: () => true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7'
      ]);
    });

    it('should select all options when pressing ctrl + a when some options are selected', () => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      options[0].select();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual(['steak-0']);
      expect(options.some(option => option.selected)).toBe(true);

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent('keydown', A, selectElement);
      Object.defineProperty(event, 'ctrlKey', { get: () => true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(options.every(option => option.selected)).toBe(true);
      expect(testInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7'
      ]);
    });

    it('should deselect all options with ctrl + a if all options are selected', () => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      options.forEach(option => option.select());
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([
        'steak-0',
        'pizza-1',
        'tacos-2',
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7'
      ]);
      expect(options.every(option => option.selected)).toBe(true);

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent('keydown', A, selectElement);
      Object.defineProperty(event, 'ctrlKey', { get: () => true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(options.some(option => option.selected)).toBe(false);
      expect(testInstance.control.value).toEqual([]);
    });

  });
});
