import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  A,
  DOWN_ARROW,
  END,
  ENTER,
  ESCAPE,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  SPACE,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DebugElement,
  inject,
  OnInit,
  Provider,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  ControlValueAccessor,
  FormBuilder,
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
import { SbbErrorStateMatcher, SbbOption, SbbOptionSelectionChange } from '@sbb-esta/angular/core';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  wrappedErrorMessage,
} from '@sbb-esta/angular/core/testing';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { SbbSelect, SbbSelectConfig, SBB_SELECT_CONFIG } from './select';
import {
  getSbbSelectDynamicMultipleError,
  getSbbSelectNonArrayValueError,
  getSbbSelectNonFunctionValueError,
} from './select-errors';
import { SbbSelectModule } from './select.module';

@Component({
  selector: 'sbb-basic-select',
  template: `
    <div [style.height.px]="heightAbove"></div>
    <sbb-form-field [label]="label">
      <sbb-select
        placeholder="Food"
        [formControl]="control"
        [required]="isRequired"
        [tabIndex]="tabIndexOverride"
        [aria-describedby]="ariaDescribedBy"
        [aria-label]="ariaLabel"
        [aria-labelledby]="ariaLabelledby"
        [panelClass]="panelClass"
        [typeaheadDebounceInterval]="typeaheadDebounceInterval"
      >
        @for (food of foods; track food) {
          <sbb-option [value]="food.value" [disabled]="food.disabled">
            {{ capitalize ? food.viewValue.toUpperCase() : food.viewValue }}
          </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
    <div [style.height.px]="heightBelow"></div>
  `,
  standalone: false,
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
  control = new FormControl<string | null>(null);
  isRequired: boolean;
  heightAbove = 0;
  heightBelow = 0;
  tabIndexOverride: number;
  ariaDescribedBy: string;
  ariaLabel: string;
  ariaLabelledby: string;
  panelClass = ['custom-one', 'custom-two'];
  typeaheadDebounceInterval: number;
  label? = 'Label';
  capitalize = false;

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  selector: 'sbb-ng-model-select',
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Food" ngModel [disabled]="isDisabled">
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">{{ food.viewValue }} </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class NgModelSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  isDisabled: boolean;

  @ViewChild(SbbSelect) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  selector: 'sbb-many-selects',
  template: `
    <sbb-form-field>
      <sbb-select placeholder="First">
        <sbb-option value="one">one</sbb-option>
        <sbb-option value="two">two</sbb-option>
      </sbb-select>
    </sbb-form-field>
    <sbb-form-field>
      <sbb-select placeholder="Second">
        <sbb-option value="three">three</sbb-option>
        <sbb-option value="four">four</sbb-option>
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class ManySelects {}

@Component({
  selector: 'sbb-ng-if-select',
  template: `
    @if (isShowing) {
      <div>
        <sbb-form-field>
          <sbb-select placeholder="Food I want to eat right now" [formControl]="control">
            @for (food of foods; track food) {
              <sbb-option [value]="food.value">
                {{ food.viewValue }}
              </sbb-option>
            }
          </sbb-select>
        </sbb-form-field>
      </div>
    }
  `,
  standalone: false,
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
    <sbb-form-field>
      <sbb-select (selectionChange)="changeListener($event)">
        @for (food of foods; track food) {
          <sbb-option [value]="food">{{ food }}</sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
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

  changeListener = jasmine.createSpy('SbbSelect change listener');
}

@Component({
  selector: 'sbb-select-init-without-options',
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Food I want to eat right now" [formControl]="control">
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">
            {{ food.viewValue }}
          </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class SelectInitWithoutOptions {
  foods: any[];
  control = new FormControl('pizza-1');

  @ViewChild(SbbSelect) select: SbbSelect;
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
  template: `<sbb-form-field><sbb-select></sbb-select></sbb-form-field>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomSelectAccessor,
      multi: true,
    },
  ],
  standalone: false,
})
class CustomSelectAccessor implements ControlValueAccessor {
  @ViewChild(SbbSelect) select: SbbSelect;

  writeValue: (value?: any) => void = () => {};
  registerOnChange: (changeFn?: (value: any) => void) => void = () => {};
  registerOnTouched: (touchedFn?: () => void) => void = () => {};
}

@Component({
  selector: 'sbb-comp-with-custom-select',
  template: `<sbb-custom-select-accessor [formControl]="ctrl"></sbb-custom-select-accessor>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomSelectAccessor,
      multi: true,
    },
  ],
  standalone: false,
})
class CompWithCustomSelect {
  ctrl = new FormControl('initial value');
  @ViewChild(CustomSelectAccessor, { static: true }) customAccessor: CustomSelectAccessor;
}

@Component({
  selector: 'sbb-select-infinite-loop',
  template: `
    <sbb-form-field>
      <sbb-select [(ngModel)]="value"></sbb-select>
    </sbb-form-field>
    <sbb-throws-error-on-init></sbb-throws-error-on-init>
  `,
  standalone: false,
})
class SelectWithErrorSibling {
  value: string;
}

@Component({
  selector: 'sbb-throws-error-on-init',
  template: '',
  standalone: false,
})
class ThrowsErrorOnInit implements OnInit {
  ngOnInit() {
    throw Error('Oh no!');
  }
}

@Component({
  selector: 'sbb-basic-select-on-push',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Food" [formControl]="control">
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">
            {{ food.viewValue }}
          </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class BasicSelectOnPush {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  control = new FormControl('');
}

@Component({
  selector: 'sbb-basic-select-on-push-preselected',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Food" [formControl]="control">
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">
            {{ food.viewValue }}
          </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class BasicSelectOnPushPreselected {
  @ViewChild(SbbSelect) select: SbbSelect;
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
    <sbb-form-field>
      <sbb-select
        multiple
        placeholder="Food"
        [formControl]="control"
        [sortComparator]="sortComparator"
      >
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">{{ food.viewValue }} </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
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
  control = new FormControl<string[] | null>(null);

  @ViewChild(SbbSelect) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
  sortComparator: (a: SbbOption, b: SbbOption, options: SbbOption[]) => number;
}

@Component({
  selector: 'sbb-select-with-plain-tabindex',
  template: `<sbb-form-field><sbb-select tabindex="5"></sbb-select></sbb-form-field>`,
  standalone: false,
})
class SelectWithPlainTabindex {}

@Component({
  selector: 'sbb-select-early-sibling-access',
  template: `
    <sbb-form-field>
      <sbb-select #select="sbbSelect"></sbb-select>
    </sbb-form-field>
    @if (select.selected) {
      <div></div>
    }
  `,
  standalone: false,
})
class SelectEarlyAccessSibling {}

@Component({
  selector: 'sbb-basic-select-initially-hidden',
  template: `
    <sbb-form-field>
      <sbb-select [style.display]="isVisible ? 'block' : 'none'">
        <sbb-option value="value">There are no other options</sbb-option>
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class BasicSelectInitiallyHidden {
  isVisible = false;
}

@Component({
  selector: 'sbb-basic-select-no-placeholder',
  template: `
    <sbb-form-field>
      <sbb-select>
        <sbb-option value="value">There are no other options</sbb-option>
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class BasicSelectNoPlaceholder {}

@Component({
  selector: 'sbb-reset-values-select',
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Food" [formControl]="control">
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">
            {{ food.viewValue }}
          </sbb-option>
        }
        <sbb-option>None</sbb-option>
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class ResetValuesSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: false, viewValue: 'Falsy' },
    { viewValue: 'Undefined' },
    { value: null, viewValue: 'Null' },
  ];
  control = new FormControl('' as string | boolean | null);

  @ViewChild(SbbSelect) select: SbbSelect;
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-select [formControl]="control">
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">{{ food.viewValue }} </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class FalsyValueSelect {
  foods: any[] = [
    { value: 0, viewValue: 'Steak' },
    { value: 1, viewValue: 'Pizza' },
  ];
  control = new FormControl<number | null>(null);
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  selector: 'sbb-select-with-groups',
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Pokemon" [formControl]="control">
        @for (group of pokemonTypes; track group) {
          <sbb-optgroup [label]="group.name" [disabled]="group.disabled">
            @for (pokemon of group.pokemon; track pokemon) {
              <sbb-option [value]="pokemon.value">
                {{ pokemon.viewValue }}
              </sbb-option>
            }
          </sbb-optgroup>
        }
        <sbb-option value="mime-11">Mr. Mime</sbb-option>
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class SelectWithGroups {
  control = new FormControl('');
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

  @ViewChild(SbbSelect) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  selector: 'sbb-select-with-groups',
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Pokemon" [formControl]="control">
        @for (group of pokemonTypes; track group) {
          <sbb-optgroup [label]="group.name">
            @for (pokemon of group.pokemon; track pokemon) {
              <sbb-option [value]="pokemon.value">{{ pokemon.viewValue }}</sbb-option>
            }
          </sbb-optgroup>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class SelectWithGroupsAndNgContainer {
  control = new FormControl('');
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
      <sbb-form-field>
        <sbb-select [(ngModel)]="value"></sbb-select>
      </sbb-form-field>
    </form>
  `,
  standalone: false,
})
class InvalidSelectInForm {
  value: any;
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <sbb-form-field>
        <sbb-select placeholder="Food" formControlName="food">
          @for (option of options; track option) {
            <sbb-option [value]="option.value">
              {{ option.viewValue }}
            </sbb-option>
          }
        </sbb-select>

        <sbb-error>This field is required</sbb-error>
      </sbb-form-field>
    </form>
  `,
  standalone: false,
})
class SelectInsideFormGroup {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild(SbbSelect) select: SbbSelect;
  options = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];
  formControl = new FormControl('', Validators.required);
  formGroup = new FormGroup({
    food: this.formControl,
  });
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Food" [(value)]="selectedFood">
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">
            {{ food.viewValue }}
          </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class BasicSelectWithoutForms {
  selectedFood: string | null;
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'sandwich-2', viewValue: 'Sandwich' },
  ];

  @ViewChild(SbbSelect) select: SbbSelect;
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Food" [(value)]="selectedFood">
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">
            {{ food.viewValue }}
          </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class BasicSelectWithoutFormsPreselected {
  selectedFood = 'pizza-1';
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];

  @ViewChild(SbbSelect) select: SbbSelect;
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Food" [(value)]="selectedFoods" multiple>
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">
            {{ food.viewValue }}
          </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class BasicSelectWithoutFormsMultiple {
  selectedFoods: string[];
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'sandwich-2', viewValue: 'Sandwich' },
  ];

  @ViewChild(SbbSelect) select: SbbSelect;
}

@Component({
  selector: 'sbb-ng-model-compare-with',
  template: `
    <sbb-form-field>
      <sbb-select
        [ngModel]="selectedFood"
        (ngModelChange)="setFoodByCopy($event)"
        [compareWith]="comparator"
      >
        @for (food of foods; track food) {
          <sbb-option [value]="food">{{ food.viewValue }}</sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
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

  @ViewChild(SbbSelect) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;

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
    <sbb-select placeholder="Food" [formControl]="control" [errorStateMatcher]="errorStateMatcher">
      @for (food of foods; track food) {
        <sbb-option [value]="food.value">
          {{ food.viewValue }}
        </sbb-option>
      }
    </sbb-select>
  `,
  standalone: false,
})
class CustomErrorBehaviorSelect {
  @ViewChild(SbbSelect) select: SbbSelect;
  control = new FormControl('');
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];
  errorStateMatcher: SbbErrorStateMatcher;
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Food" [(ngModel)]="selectedFoods">
        @for (food of foods; track food) {
          <sbb-option [value]="food.value">{{ food.viewValue }} </sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class SingleSelectWithPreselectedArrayValues {
  foods: any[] = [
    { value: ['steak-0', 'steak-1'], viewValue: 'Steak' },
    { value: ['pizza-1', 'pizza-2'], viewValue: 'Pizza' },
    { value: ['tacos-2', 'tacos-3'], viewValue: 'Tacos' },
  ];

  selectedFoods = this.foods[1].value;

  @ViewChild(SbbSelect) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-label>Select a thing</sbb-label>

      <sbb-select [placeholder]="placeholder">
        <sbb-option value="thing">A thing</sbb-option>
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class SelectWithFormFieldLabel {
  placeholder: string;
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-label>Select something</sbb-label>
      @if (showSelect) {
        <sbb-select>
          <sbb-option value="1">One</sbb-option>
        </sbb-select>
      }
    </sbb-form-field>
  `,
  standalone: false,
})
class SelectWithNgIfAndLabel {
  showSelect = true;
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-select multiple [ngModel]="value">
        @for (item of items; track item) {
          <sbb-option [value]="item">{{ item }}</sbb-option>
        }
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class MultiSelectWithLotsOfOptions {
  items = new Array(1000).fill(0).map((_, i) => i);
  value: number[] = [];

  checkAll() {
    this.value = [...this.items];
  }

  uncheckAll() {
    this.value = [];
  }
}

@Component({
  selector: 'sbb-basic-select-with-reset',
  template: `
    <sbb-form-field>
      <sbb-select [formControl]="control">
        <sbb-option>Reset</sbb-option>
        <sbb-option value="a">A</sbb-option>
        <sbb-option value="b">B</sbb-option>
        <sbb-option value="c">C</sbb-option>
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class SelectWithResetOptionAndFormControl {
  @ViewChild(SbbSelect) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
  control = new FormControl('');
}

@Component({
  selector: 'sbb-select-with-placeholder-in-ngcontainer-with-ngIf',
  template: `
    <sbb-form-field>
      @if (true) {
        <sbb-select placeholder="Product Area">
          <sbb-option value="a">A</sbb-option>
          <sbb-option value="b">B</sbb-option>
          <sbb-option value="c">C</sbb-option>
        </sbb-select>
      }
    </sbb-form-field>
  `,
  standalone: false,
})
class SelectInNgContainer {}

@Component({
  template: `
    <form [formGroup]="form">
      <sbb-form-field>
        <sbb-select formControlName="control">
          <sbb-option value="1">One</sbb-option>
        </sbb-select>
      </sbb-form-field>
    </form>
  `,
  standalone: false,
})
class SelectInsideDynamicFormGroup {
  @ViewChild(SbbSelect) select: SbbSelect;
  form: FormGroup;

  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  constructor(private _formBuilder: FormBuilder) {
    this.assignGroup(false);
  }

  assignGroup(isDisabled: boolean) {
    this.form = this._formBuilder.group({
      control: { value: '', disabled: isDisabled },
    });
    this._changeDetectorRef.markForCheck();
  }
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-select placeholder="Product Area" readonly>
        <sbb-option value="a">A</sbb-option>
      </sbb-select>
    </sbb-form-field>
  `,
  standalone: false,
})
class SelectReadonly {}

/** Default debounce interval when typing letters to select an option. */
const DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL = 200;

describe('SbbSelect', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const scrolledSubject = new Subject<void>();

  /**
   * Configures the test module for SbbSelect with the given declarations. This is broken out so
   * that we're only compiling the necessary test components for each test in order to speed up
   * overall test time.
   * @param declarations Components to declare for this block
   * @param providers Additional providers for this block
   */
  function configureSbbSelectTestingModule(declarations: any[], providers: Provider[] = []) {
    TestBed.configureTestingModule({
      imports: [
        SbbSelectModule,
        SbbIconTestingModule,
        SbbFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      declarations: declarations,
      providers: [
        {
          provide: ScrollDispatcher,
          useFactory: () => ({
            scrolled: () => scrolledSubject,
          }),
        },
        ...providers,
      ],
    });

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(waitForAsync(() => {
      configureSbbSelectTestingModule([
        BasicSelect,
        MultiSelect,
        SelectWithGroups,
        SelectWithGroupsAndNgContainer,
        SelectWithFormFieldLabel,
        SelectWithChangeEvent,
        SelectInsideDynamicFormGroup,
      ]);
    }));

    describe('accessibility', () => {
      describe('for select', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let select: HTMLElement;

        beforeEach(() => {
          fixture = TestBed.createComponent(BasicSelect);
          fixture.detectChanges();
          select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
        });

        it('should set the role of the select to combobox', () => {
          expect(select.getAttribute('role')).toEqual('combobox');
          expect(select.getAttribute('aria-haspopup')).toBe('listbox');
        });

        it('should point the aria-controls attribute to the listbox', fakeAsync(() => {
          expect(select.hasAttribute('aria-controls')).toBe(false);

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const ariaControls = select.getAttribute('aria-controls');
          expect(ariaControls).toBeTruthy();
          expect(ariaControls).toBe(document.querySelector('.sbb-panel')!.id);
        }));

        it('should set aria-expanded based on the select open state', fakeAsync(() => {
          expect(select.getAttribute('aria-expanded')).toBe('false');

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          expect(select.getAttribute('aria-expanded')).toBe('true');
        }));

        it('should support setting a custom aria-label', () => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          expect(select.getAttribute('aria-label')).toEqual('Custom Label');
          expect(select.hasAttribute('aria-labelledby')).toBeFalsy();
        });

        it('should be able to add an extra aria-labelledby on top of the default', () => {
          fixture.componentInstance.ariaLabelledby = 'myLabelId';
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
          const valueId = fixture.nativeElement.querySelector('.sbb-select-value').id;

          expect(select.getAttribute('aria-labelledby')).toBe(`${labelId} ${valueId} myLabelId`);
        });

        it('should set aria-labelledby to the value and label IDs', () => {
          fixture.detectChanges();

          const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
          const valueId = fixture.nativeElement.querySelector('.sbb-select-value').id;
          expect(select.getAttribute('aria-labelledby')).toBe(`${labelId} ${valueId}`);
        });

        it('should trim the trigger aria-labelledby when there is no label', fakeAsync(() => {
          // Reset the `placeholder` which also controls the label of the form field.
          fixture.componentInstance.select.placeholder = '';
          fixture.componentInstance.label = undefined;
          fixture.detectChanges();

          // Note that we assert that there are no spaces around the value.
          const valueId = fixture.nativeElement.querySelector('.sbb-select-value').id;
          expect(select.getAttribute('aria-labelledby')).toBe(`${valueId}`);
        }));

        it('should set the tabindex of the select to 0 by default', () => {
          expect(select.getAttribute('tabindex')).toEqual('0');
        });

        it('should be able to override the tabindex', () => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          expect(select.getAttribute('tabindex')).toBe('3');
        });

        it('should set aria-required for required selects', () => {
          expect(select.getAttribute('aria-required'))
            .withContext(`Expected aria-required attr to be false for normal selects.`)
            .toEqual('false');

          fixture.componentInstance.isRequired = true;
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          expect(select.getAttribute('aria-required'))
            .withContext(`Expected aria-required attr to be true for required selects.`)
            .toEqual('true');
        });

        it('should set the sbb-select-required class for required selects', () => {
          expect(select.classList).not.toContain(
            'sbb-select-required',
            `Expected the sbb-select-required class not to be set.`,
          );

          fixture.componentInstance.isRequired = true;
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          expect(select.classList)
            .withContext(`Expected the sbb-select-required class to be set.`)
            .toContain('sbb-select-required');
        });

        it('should set aria-invalid for selects that are invalid and touched', () => {
          expect(select.getAttribute('aria-invalid'))
            .withContext(`Expected aria-invalid attr to be false for valid selects.`)
            .toEqual('false');

          fixture.componentInstance.isRequired = true;
          fixture.componentInstance.control.markAsTouched();
          fixture.detectChanges();

          expect(select.getAttribute('aria-invalid'))
            .withContext(`Expected aria-invalid attr to be true for invalid selects.`)
            .toEqual('true');
        });

        it('should set aria-disabled for disabled selects', () => {
          expect(select.getAttribute('aria-disabled')).toEqual('false');

          fixture.componentInstance.control.disable();
          fixture.detectChanges();

          expect(select.getAttribute('aria-disabled')).toEqual('true');
        });

        it('should set the tabindex of the select to -1 if disabled', () => {
          fixture.componentInstance.control.disable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('-1');

          fixture.componentInstance.control.enable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('0');
        });

        it('should set `aria-labelledby` to the value ID if there is no form field', () => {
          fixture.destroy();

          const labelFixture = TestBed.createComponent(SelectWithChangeEvent);
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
          const valueId = labelFixture.nativeElement.querySelector('.sbb-select-value').id;

          expect(select.getAttribute('aria-labelledby')?.trim()).toBe(valueId);
        });

        it('should support user binding to `aria-describedby`', () => {
          fixture.componentInstance.ariaDescribedBy = 'test';
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();
          expect(select.getAttribute('aria-describedby')).toBe('test');
        });

        it('should select options via the UP/DOWN arrow keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(options[0].selected)
            .withContext('Expected first option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from first option to have been set on the model.')
            .toBe(options[0].value);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected)
            .withContext('Expected fourth option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from fourth option to have been set on the model.')
            .toBe(options[3].value);

          dispatchKeyboardEvent(select, 'keydown', UP_ARROW);

          expect(options[1].selected)
            .withContext('Expected second option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from second option to have been set on the model.')
            .toBe(options[1].value);

          flush();
        }));

        it('should go back to first option if value is reset after interacting using the arrow keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          flush();

          expect(options[0].selected)
            .withContext('Expected first option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from first option to have been set on the model.')
            .toBe(options[0].value);

          formControl.reset();
          fixture.detectChanges();

          expect(options[0].selected)
            .withContext('Expected first option to be deselected.')
            .toBe(false);
          expect(formControl.value).withContext('Expected value to be reset.').toBeFalsy();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          flush();

          expect(options[0].selected)
            .withContext('Expected first option to be selected again.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from first option to have been set on the model again.')
            .toBe(options[0].value);
        }));

        it('should select first/last options via the HOME/END keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const firstOption = fixture.componentInstance.options.first;
          const lastOption = fixture.componentInstance.options.last;

          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

          const endEvent = dispatchKeyboardEvent(select, 'keydown', END);

          expect(endEvent.defaultPrevented).toBe(true);
          expect(lastOption.selected)
            .withContext('Expected last option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from last option to have been set on the model.')
            .toBe(lastOption.value);

          const homeEvent = dispatchKeyboardEvent(select, 'keydown', HOME);

          expect(homeEvent.defaultPrevented).toBe(true);
          expect(firstOption.selected)
            .withContext('Expected first option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from first option to have been set on the model.')
            .toBe(firstOption.value);

          flush();
        }));

        it('should select first/last options via the PAGE_DOWN/PAGE_UP keys on a closed select with less than 10 options', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const firstOption = fixture.componentInstance.options.first;
          const lastOption = fixture.componentInstance.options.last;

          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();
          expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(-1);

          const endEvent = dispatchKeyboardEvent(select, 'keydown', PAGE_DOWN);

          expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(7);
          expect(endEvent.defaultPrevented).toBe(true);
          expect(lastOption.selected)
            .withContext('Expected last option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from last option to have been set on the model.')
            .toBe(lastOption.value);

          const homeEvent = dispatchKeyboardEvent(select, 'keydown', PAGE_UP);

          expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(0);
          expect(homeEvent.defaultPrevented).toBe(true);
          expect(firstOption.selected)
            .withContext('Expected first option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from first option to have been set on the model.')
            .toBe(firstOption.value);

          flush();
        }));

        it('should resume focus from selected item after selecting via click', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

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

          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          expect(options[0].selected)
            .withContext('Expected first option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from first option to have been set on the model.')
            .toBe(options[0].value);

          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);
          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          // Note that the third option is skipped, because it is disabled.
          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected)
            .withContext('Expected fourth option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from fourth option to have been set on the model.')
            .toBe(options[3].value);

          dispatchKeyboardEvent(select, 'keydown', LEFT_ARROW);

          expect(options[1].selected)
            .withContext('Expected second option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from second option to have been set on the model.')
            .toBe(options[1].value);
          flush();
        }));

        it('should announce changes via the keyboard on a closed select', fakeAsync(() => {
          const liveAnnouncer = TestBed.inject(LiveAnnouncer);
          spyOn(liveAnnouncer, 'announce');

          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          expect(liveAnnouncer.announce).toHaveBeenCalledWith('Steak', jasmine.any(Number));

          flush();
        }));

        it('should not throw when reaching a reset option using the arrow keys on a closed select', fakeAsync(() => {
          fixture.componentInstance.foods = [
            { value: 'steak-0', viewValue: 'Steak' },
            { value: null, viewValue: 'None' },
          ];
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();
          fixture.componentInstance.control.setValue('steak-0');

          expect(() => {
            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
            fixture.detectChanges();
          }).not.toThrow();

          flush();
        }));

        it('should open a single-selection select using ALT + DOWN_ARROW', () => {
          const { control: formControl, select: selectInstance } = fixture.componentInstance;

          expect(selectInstance.panelOpen).withContext('Expected select to be closed.').toBe(false);
          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

          const event = createKeyboardEvent('keydown', DOWN_ARROW, undefined, { alt: true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).withContext('Expected select to be open.').toBe(true);
          expect(formControl.value).withContext('Expected value not to have changed.').toBeFalsy();
        });

        it('should open a single-selection select using ALT + UP_ARROW', () => {
          const { control: formControl, select: selectInstance } = fixture.componentInstance;

          expect(selectInstance.panelOpen).withContext('Expected select to be closed.').toBe(false);
          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

          const event = createKeyboardEvent('keydown', UP_ARROW, undefined, { alt: true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).withContext('Expected select to be open.').toBe(true);
          expect(formControl.value).withContext('Expected value not to have changed.').toBeFalsy();
        });

        it('should close when pressing ALT + DOWN_ARROW', () => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).withContext('Expected select to be open.').toBe(true);

          const event = createKeyboardEvent('keydown', DOWN_ARROW, undefined, { alt: true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).withContext('Expected select to be closed.').toBe(false);
          expect(event.defaultPrevented)
            .withContext('Expected default action to be prevented.')
            .toBe(true);
        });

        it('should close when pressing ALT + UP_ARROW', () => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).withContext('Expected select to be open.').toBe(true);

          const event = createKeyboardEvent('keydown', UP_ARROW, undefined, { alt: true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).withContext('Expected select to be closed.').toBe(false);
          expect(event.defaultPrevented)
            .withContext('Expected default action to be prevented.')
            .toBe(true);
        });

        it('should be able to select options by typing on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

          dispatchEvent(select, createKeyboardEvent('keydown', 80, 'p'));
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL);

          expect(options[1].selected)
            .withContext('Expected second option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from second option to have been set on the model.')
            .toBe(options[1].value);

          dispatchEvent(select, createKeyboardEvent('keydown', 69, 'e'));
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL);

          expect(options[5].selected)
            .withContext('Expected sixth option to be selected.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from sixth option to have been set on the model.')
            .toBe(options[5].value);
        }));

        it('should not open the select when pressing space while typing', fakeAsync(() => {
          const selectInstance = fixture.componentInstance.select;

          fixture.componentInstance.typeaheadDebounceInterval = DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL;
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          expect(selectInstance.panelOpen)
            .withContext('Expected select to be closed on init.')
            .toBe(false);

          dispatchEvent(select, createKeyboardEvent('keydown', 80, 'p'));
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL / 2);
          fixture.detectChanges();

          dispatchKeyboardEvent(select, 'keydown', SPACE);
          fixture.detectChanges();

          expect(selectInstance.panelOpen)
            .withContext('Expected select to remain closed after space was pressed.')
            .toBe(false);

          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL / 2);
          fixture.detectChanges();

          expect(selectInstance.panelOpen)
            .withContext('Expected select to be closed when the timer runs out.')
            .toBe(false);
        }));

        it('should be able to customize the typeahead debounce interval', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          fixture.componentInstance.typeaheadDebounceInterval = 1337;
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

          dispatchEvent(select, createKeyboardEvent('keydown', 80, 'p'));
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL);

          expect(formControl.value)
            .withContext('Expected no value after a bit of time has passed.')
            .toBeFalsy();

          tick(1337);

          expect(options[1].selected)
            .withContext('Expected second option to be selected after all the time has passed.')
            .toBe(true);
          expect(formControl.value)
            .withContext('Expected value from second option to have been set on the model.')
            .toBe(options[1].value);
        }));

        it('should cancel the typeahead selection on blur', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).withContext('Expected no initial value.').toBeFalsy();

          dispatchEvent(select, createKeyboardEvent('keydown', 80, 'p'));
          dispatchFakeEvent(select, 'blur');
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL);

          expect(options.some((o) => o.selected))
            .withContext('Expected no options to be selected.')
            .toBe(false);
          expect(formControl.value).withContext('Expected no value to be assigned.').toBeFalsy();
        }));

        it('should open the panel when pressing a vertical arrow key on a closed multiple select', () => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          const initialValue = instance.control.value;

          expect(instance.select.panelOpen).withContext('Expected panel to be closed.').toBe(false);

          const event = dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(instance.select.panelOpen).withContext('Expected panel to be open.').toBe(true);
          expect(instance.control.value)
            .withContext('Expected value to stay the same.')
            .toBe(initialValue);
          expect(event.defaultPrevented)
            .withContext('Expected default to be prevented.')
            .toBe(true);
        });

        it('should open the panel when pressing a horizontal arrow key on closed multiple select', () => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          const initialValue = instance.control.value;

          expect(instance.select.panelOpen).withContext('Expected panel to be closed.').toBe(false);

          const event = dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          expect(instance.select.panelOpen).withContext('Expected panel to be open.').toBe(true);
          expect(instance.control.value)
            .withContext('Expected value to stay the same.')
            .toBe(initialValue);
          expect(event.defaultPrevented)
            .withContext('Expected default to be prevented.')
            .toBe(true);
        });

        it('should do nothing when typing on a closed multi-select', () => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          const instance = multiFixture.componentInstance;

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          const initialValue = instance.control.value;

          expect(instance.select.panelOpen).withContext('Expected panel to be closed.').toBe(false);

          dispatchEvent(select, createKeyboardEvent('keydown', 80, 'p'));

          expect(instance.select.panelOpen)
            .withContext('Expected panel to stay closed.')
            .toBe(false);
          expect(instance.control.value)
            .withContext('Expected value to stay the same.')
            .toBe(initialValue);
        });

        it('should do nothing if the key manager did not change the active item', () => {
          const formControl = fixture.componentInstance.control;

          expect(formControl.value)
            .withContext('Expected form control value to be empty.')
            .toBeNull();
          expect(formControl.pristine).withContext('Expected form control to be clean.').toBe(true);

          dispatchKeyboardEvent(select, 'keydown', 16); // Press a random key.

          expect(formControl.value)
            .withContext('Expected form control value to stay empty.')
            .toBeNull();
          expect(formControl.pristine)
            .withContext('Expected form control to stay clean.')
            .toBe(true);
        });

        it('should continue from the selected option when the value is set programmatically', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          fixture.detectChanges();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value).toBe('pasta-6');
          expect(fixture.componentInstance.options.toArray()[6].selected).toBe(true);
          flush();
        }));

        it('should not shift focus when the selected options are updated programmatically in a multi select', () => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
          multiFixture.componentInstance.select.open();
          multiFixture.detectChanges();

          const options = overlayContainerElement.querySelectorAll(
            'sbb-option',
          ) as NodeListOf<HTMLElement>;

          options[3].focus();
          expect(document.activeElement)
            .withContext('Expected fourth option to be focused.')
            .toBe(options[3]);

          multiFixture.componentInstance.control.setValue(['steak-0', 'sushi-7']);
          multiFixture.detectChanges();

          expect(document.activeElement)
            .withContext('Expected fourth option to remain focused.')
            .toBe(options[3]);
        });

        it('should not cycle through the options if the control is disabled', () => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          formControl.disable();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value)
            .withContext('Expected value to remain unchaged.')
            .toBe('eggs-5');
        });

        it('should not wrap selection after reaching the end of the options', () => {
          const lastOption = fixture.componentInstance.options.last;

          fixture.componentInstance.options.forEach(() => {
            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          });

          expect(lastOption.selected)
            .withContext('Expected last option to be selected.')
            .toBe(true);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(lastOption.selected)
            .withContext('Expected last option to stay selected.')
            .toBe(true);
        });

        it('should not open a multiple select when tabbing through', () => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);

          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          expect(multiFixture.componentInstance.select.panelOpen)
            .withContext('Expected panel to be closed initially.')
            .toBe(false);

          dispatchKeyboardEvent(select, 'keydown', TAB);

          expect(multiFixture.componentInstance.select.panelOpen)
            .withContext('Expected panel to stay closed.')
            .toBe(false);
        });

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

        it('should prevent the default action when pressing space', () => {
          const event = dispatchKeyboardEvent(select, 'keydown', SPACE);
          expect(event.defaultPrevented).toBe(true);
        });

        it('should prevent the default action when pressing enter', () => {
          const event = dispatchKeyboardEvent(select, 'keydown', ENTER);
          expect(event.defaultPrevented).toBe(true);
        });

        it('should not prevent the default actions on selection keys when pressing a modifier', () => {
          [ENTER, SPACE].forEach((key) => {
            const event = createKeyboardEvent('keydown', key, undefined, { shift: true });
            expect(event.defaultPrevented).toBe(false);
          });
        });

        it('should consider the selection a result of a user action when closed', () => {
          const option = fixture.componentInstance.options.first;
          const spy = jasmine.createSpy('option selection spy');
          const subscription = option.onSelectionChange
            .pipe(map((e) => e.isUserInput))
            .subscribe(spy);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          expect(spy).toHaveBeenCalledWith(true);

          subscription.unsubscribe();
        });

        it('should be able to focus the select trigger', () => {
          document.body.focus(); // ensure that focus isn't on the trigger already

          fixture.componentInstance.select.focus();

          expect(document.activeElement)
            .withContext('Expected select element to be focused.')
            .toBe(select);
        });

        it('should set `aria-multiselectable` to true on the listbox inside multi select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          multiFixture.detectChanges();
          select = multiFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
          multiFixture.componentInstance.select.open();
          multiFixture.detectChanges();
          flush();

          const panel = document.querySelector('.sbb-panel')!;
          expect(panel.getAttribute('aria-multiselectable')).toBe('true');
        }));

        it('should set aria-multiselectable false on single-selection instances', fakeAsync(() => {
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const panel = document.querySelector('.sbb-panel')!;
          expect(panel.getAttribute('aria-multiselectable')).toBe('false');
        }));

        it('should set aria-activedescendant only while the panel is open', fakeAsync(() => {
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();

          const host = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

          expect(host.hasAttribute('aria-activedescendant'))
            .withContext('Expected no aria-activedescendant on init.')
            .toBe(false);

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('sbb-option');

          expect(host.getAttribute('aria-activedescendant'))
            .withContext('Expected aria-activedescendant to match the active option.')
            .toBe(options[4].id);

          fixture.componentInstance.select.close();
          fixture.detectChanges();
          flush();

          expect(host.hasAttribute('aria-activedescendant'))
            .withContext('Expected no aria-activedescendant when closed.')
            .toBe(false);
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

        it('should restore focus to the trigger after selecting an option in multi-select mode', () => {
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

          expect(document.activeElement)
            .withContext('Expected trigger to be focused.')
            .toBe(select);
        });

        it('should set a role of listbox on the select panel', fakeAsync(() => {
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const panel = document.querySelector('.sbb-panel')!;
          expect(panel.getAttribute('role')).toBe('listbox');
        }));

        it('should point the aria-labelledby of the panel to the field label', fakeAsync(() => {
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
          const panel = document.querySelector('.sbb-panel')!;
          expect(panel.getAttribute('aria-labelledby')).toBe(labelId);
        }));

        it('should add a custom aria-labelledby to the panel', fakeAsync(() => {
          fixture.componentInstance.ariaLabelledby = 'myLabelId';
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const labelId = fixture.nativeElement.querySelector('.sbb-form-field-label').id;
          const panel = document.querySelector('.sbb-panel')!;
          expect(panel.getAttribute('aria-labelledby')).toBe(`${labelId} myLabelId`);
        }));

        it('should trim the custom panel aria-labelledby when there is no label', fakeAsync(() => {
          // Reset the `placeholder` which also controls the label of the form field.
          fixture.componentInstance.select.placeholder = '';
          fixture.componentInstance.label = undefined;
          fixture.componentInstance.ariaLabelledby = 'myLabelId';
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          // Note that we assert that there are no spaces around the value.
          const panel = document.querySelector('.sbb-select-panel')!;
          expect(panel.getAttribute('aria-labelledby')).toBe(`myLabelId`);
        }));

        it('should clear aria-labelledby from the panel if an aria-label is set', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'My label';
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const panel = document.querySelector('.sbb-panel')!;
          expect(panel.getAttribute('aria-label')).toBe('My label');
          expect(panel.hasAttribute('aria-labelledby')).toBe(false);
        }));
      });

      describe('for options', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let select: HTMLElement;
        let options: HTMLElement[];

        beforeEach(() => {
          fixture = TestBed.createComponent(BasicSelect);
          fixture.detectChanges();
          select = fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;
          select.click();
          fixture.detectChanges();

          options = Array.from(overlayContainerElement.querySelectorAll('sbb-option'));
        });

        it('should set the role of sbb-option to option', fakeAsync(() => {
          expect(options[0].getAttribute('role')).toEqual('option');
          expect(options[1].getAttribute('role')).toEqual('option');
          expect(options[2].getAttribute('role')).toEqual('option');
        }));

        it('should set aria-selected on each option for single select', fakeAsync(() => {
          expect(options.every((option) => option.getAttribute('aria-selected') === 'false'))
            .withContext(
              'Expected all unselected single-select options to have aria-selected="false".',
            )
            .toBe(true);

          options[1].click();
          fixture.detectChanges();

          select.click();
          fixture.detectChanges();
          flush();

          expect(options[1].getAttribute('aria-selected'))
            .withContext('Expected selected single-select option to have aria-selected="true".')
            .toEqual('true');
          options.splice(1, 1);
          expect(options.every((option) => option.getAttribute('aria-selected') === 'false'))
            .withContext(
              'Expected all unselected single-select options to have aria-selected="false".',
            )
            .toBe(true);
        }));

        it('should set aria-selected on each option for multi-select', fakeAsync(() => {
          fixture.destroy();

          const multiFixture = TestBed.createComponent(MultiSelect);
          multiFixture.detectChanges();

          select = multiFixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;
          select.click();
          multiFixture.detectChanges();

          options = Array.from(overlayContainerElement.querySelectorAll('sbb-option'));

          expect(
            options.every(
              (option) =>
                option.hasAttribute('aria-selected') &&
                option.getAttribute('aria-selected') === 'false',
            ),
          )
            .withContext(
              'Expected all unselected multi-select options to have ' + 'aria-selected="false".',
            )
            .toBe(true);

          options[1].click();
          multiFixture.detectChanges();

          select.click();
          multiFixture.detectChanges();
          flush();

          expect(options[1].getAttribute('aria-selected'))
            .withContext('Expected selected multi-select option to have ' + 'aria-selected="true".')
            .toEqual('true');
          options.splice(1, 1);
          expect(
            options.every(
              (option) =>
                option.hasAttribute('aria-selected') &&
                option.getAttribute('aria-selected') === 'false',
            ),
          )
            .withContext(
              'Expected all unselected multi-select options to have ' + 'aria-selected="false".',
            )
            .toBe(true);
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
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          expect(options[0].getAttribute('aria-disabled')).toEqual('false');
          expect(options[1].getAttribute('aria-disabled')).toEqual('false');
          expect(options[2].getAttribute('aria-disabled')).toEqual('false');
        }));

        it('should remove the active state from options that have been deselected while closed', fakeAsync(() => {
          let activeOptions = options.filter((option) => option.classList.contains('sbb-focused'));
          expect(activeOptions)
            .withContext('Expected first option to have active styles.')
            .toEqual([options[0]]);

          options[1].click();
          fixture.detectChanges();
          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          activeOptions = options.filter((option) => option.classList.contains('sbb-focused'));
          expect(activeOptions)
            .withContext(
              'Expected only selected option to be marked as active after ' + 'it is clicked.',
            )
            .toEqual([options[1]]);

          fixture.componentInstance.control.setValue(fixture.componentInstance.foods[7].value);
          fixture.detectChanges();
          fixture.componentInstance.select.close();
          fixture.detectChanges();
          flush();

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          activeOptions = options.filter((option) => option.classList.contains('sbb-focused'));
          expect(activeOptions)
            .withContext(
              'Expected only selected option to be marked as active after the ' +
                'value has changed.',
            )
            .toEqual([options[7]]);
        }));
      });

      describe('for option groups', () => {
        let fixture: ComponentFixture<SelectWithGroups>;
        let select: HTMLElement;
        let groups: NodeListOf<HTMLElement>;

        beforeEach(() => {
          fixture = TestBed.createComponent(SelectWithGroups);
          fixture.detectChanges();
          select = fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;
          select.click();
          fixture.detectChanges();
          groups = overlayContainerElement.querySelectorAll(
            'sbb-optgroup',
          ) as NodeListOf<HTMLElement>;
        });

        it('should set the appropriate role', fakeAsync(() => {
          expect(groups[0].getAttribute('role')).toBe('group');
        }));

        it('should set the `aria-labelledby` attribute', fakeAsync(() => {
          const group = groups[0];
          const label = group.querySelector('label')!;

          expect(label.getAttribute('id'))
            .withContext('Expected label to have an id.')
            .toBeTruthy();
          expect(group.getAttribute('aria-labelledby'))
            .withContext('Expected `aria-labelledby` to match the label id.')
            .toBe(label.getAttribute('id'));
        }));

        it('should set the `aria-disabled` attribute if the group is disabled', fakeAsync(() => {
          expect(groups[1].getAttribute('aria-disabled')).toBe('true');
        }));
      });
    });

    describe('overlay panel', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let select: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
      });

      it('should not throw when attempting to open too early', () => {
        // Create component and then immediately open without running change detection
        fixture = TestBed.createComponent(BasicSelect);
        expect(() => fixture.componentInstance.select.open()).not.toThrow();
      });

      it('should open the panel when trigger is clicked', fakeAsync(() => {
        select.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(overlayContainerElement.textContent).toContain('Steak');
        expect(overlayContainerElement.textContent).toContain('Pizza');
        expect(overlayContainerElement.textContent).toContain('Tacos');
      }));

      it('should close the panel when an item is clicked', fakeAsync(() => {
        select.click();
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
        select.click();
        fixture.detectChanges();
        flush();

        const backdrop = overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop',
        ) as HTMLElement;

        backdrop.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should set the width of the overlay based on the trigger', async () => {
        select.style.width = '200px';

        select.click();
        fixture.detectChanges();
        await fixture.whenStable();

        const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
        expect(pane.style.width).toBe('200px');

        const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-panel');
        const scrollContainerWidth = scrollContainer!.getBoundingClientRect().width;
        expect(scrollContainerWidth).toBeCloseTo(
          200,
          0,
          'Expected select panel width to be 100% of the select field trigger',
        );
      });

      it('should set the width of the overlay based on a larger trigger width', async () => {
        // the trigger width exceeds the minimum width of the sbb-panel
        select.style.width = '320px';

        select.click();
        fixture.detectChanges();
        await fixture.whenStable();

        const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
        expect(pane.style.width).toBe('320px');

        const scrollContainer = document.querySelector('.cdk-overlay-pane .sbb-panel');
        const scrollContainerWidth = scrollContainer!.getBoundingClientRect().width;
        expect(scrollContainerWidth).toBeCloseTo(
          320,
          0,
          'Expected select panel width to be 100% of the select field trigger',
        );
      });

      it('should update the width of the panel on resize', fakeAsync(() => {
        select.style.width = '300px';

        select.click();
        fixture.detectChanges();
        flush();

        const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
        const initialWidth = parseInt(pane.style.width || '0', 10);

        expect(initialWidth).toBeGreaterThan(0);

        select.style.width = '400px';
        dispatchFakeEvent(window, 'resize');
        fixture.detectChanges();
        tick(1000);
        fixture.detectChanges();

        expect(parseInt(pane.style.width || '0', 10)).toBeGreaterThan(initialWidth);
      }));

      it('should not attempt to open a select that does not have any options', () => {
        fixture.componentInstance.foods = [];
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        select.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      });

      it('should close the panel when tabbing out', fakeAsync(() => {
        select.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);

        dispatchKeyboardEvent(select, 'keydown', TAB);
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should restore focus to the host before tabbing away', fakeAsync(() => {
        select.click();
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
        select.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);

        const panel = overlayContainerElement.querySelector('.sbb-panel')!;
        dispatchKeyboardEvent(panel, 'keydown', TAB);
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should focus the first option when pressing HOME', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        select.click();
        fixture.detectChanges();
        flush();

        const event = dispatchKeyboardEvent(select, 'keydown', HOME);
        fixture.detectChanges();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(0);
        expect(event.defaultPrevented).toBe(true);
      }));

      it('should focus the last option when pressing END', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        select.click();
        fixture.detectChanges();
        flush();

        const event = dispatchKeyboardEvent(select, 'keydown', END);
        fixture.detectChanges();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(7);
        expect(event.defaultPrevented).toBe(true);
      }));

      it('should focus the last option when pressing PAGE_DOWN with less than 10 options', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        select.click();
        fixture.detectChanges();
        flush();

        const event = dispatchKeyboardEvent(select, 'keydown', PAGE_DOWN);
        fixture.detectChanges();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(7);
        expect(event.defaultPrevented).toBe(true);
      }));

      it('should focus the first option when pressing PAGE_UP with index < 10', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        select.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBeLessThan(10);
        const event = dispatchKeyboardEvent(select, 'keydown', PAGE_UP);
        fixture.detectChanges();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(0);
        expect(event.defaultPrevented).toBe(true);
      }));

      it('should be able to set extra classes on the panel', () => {
        select.click();
        fixture.detectChanges();

        const panel = overlayContainerElement.querySelector('.sbb-panel') as HTMLElement;

        expect(panel.classList).toContain('custom-one');
        expect(panel.classList).toContain('custom-two');
      });

      it('should prevent the default action when pressing SPACE on an option', () => {
        select.click();
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        const option = overlayContainerElement.querySelector('sbb-option')!;
        const event = dispatchKeyboardEvent(option, 'keydown', SPACE);

        expect(event.defaultPrevented).toBe(true);
      });

      it('should prevent the default action when pressing ENTER on an option', () => {
        select.click();
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        const option = overlayContainerElement.querySelector('sbb-option')!;
        const event = dispatchKeyboardEvent(option, 'keydown', ENTER);

        expect(event.defaultPrevented).toBe(true);
      });

      it('should be able to render options inside groups with an ng-container', () => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroupsAndNgContainer);
        groupFixture.detectChanges();
        select = groupFixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;
        select.click();
        groupFixture.detectChanges();

        expect(document.querySelectorAll('.cdk-overlay-container sbb-option').length)
          .withContext('Expected at least one option to be rendered.')
          .toBeGreaterThan(0);
      });

      it('should not consider itself as blurred if the trigger loses focus while the panel is still open', fakeAsync(() => {
        const selectElement = fixture.nativeElement.querySelector('.sbb-select');
        const selectInstance = fixture.componentInstance.select;

        dispatchFakeEvent(selectElement, 'focus');
        fixture.detectChanges();
        flush();

        expect(selectInstance.focused).withContext('Expected select to be focused.').toBe(true);

        selectInstance.open();
        fixture.detectChanges();
        flush();
        dispatchFakeEvent(selectElement, 'blur');
        fixture.detectChanges();

        expect(selectInstance.focused)
          .withContext('Expected select element to remain focused.')
          .toBe(true);
      }));
    });

    describe('selection logic', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let select: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
      });

      it('should focus the first option if no option is selected', fakeAsync(() => {
        select.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toEqual(0);
      }));

      it('should select an option when it is clicked', fakeAsync(() => {
        select.click();
        fixture.detectChanges();
        flush();

        let option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        select.click();
        fixture.detectChanges();
        flush();

        option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

        expect(option.classList).toContain('sbb-selected');
        expect(fixture.componentInstance.options.first.selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(
          fixture.componentInstance.options.first,
        );
      }));

      it('should be able to select an option using the SbbOption API', fakeAsync(() => {
        select.click();
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
        select.click();
        fixture.detectChanges();
        flush();

        let options = overlayContainerElement.querySelectorAll(
          'sbb-option',
        ) as NodeListOf<HTMLElement>;

        options[0].click();
        fixture.detectChanges();
        flush();

        select.click();
        fixture.detectChanges();
        flush();

        options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
        expect(options[1].classList).not.toContain('sbb-selected');
        expect(options[2].classList).not.toContain('sbb-selected');

        const optionInstances = fixture.componentInstance.options.toArray();
        expect(optionInstances[1].selected).toBe(false);
        expect(optionInstances[2].selected).toBe(false);
      }));

      it('should deselect other options when one is programmatically selected', fakeAsync(() => {
        const control = fixture.componentInstance.control;
        const foods = fixture.componentInstance.foods;

        select.click();
        fixture.detectChanges();
        flush();

        let options = overlayContainerElement.querySelectorAll(
          'sbb-option',
        ) as NodeListOf<HTMLElement>;

        options[0].click();
        fixture.detectChanges();
        flush();

        control.setValue(foods[1].value);
        fixture.detectChanges();

        select.click();
        fixture.detectChanges();
        flush();

        options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;

        expect(options[0].classList).not.toContain(
          'sbb-selected',
          'Expected first option to no longer be selected',
        );
        expect(options[1].classList)
          .withContext('Expected second option to be selected')
          .toContain('sbb-selected');

        const optionInstances = fixture.componentInstance.options.toArray();

        expect(optionInstances[0].selected)
          .withContext('Expected first option to no longer be selected')
          .toBe(false);
        expect(optionInstances[1].selected)
          .withContext('Expected second option to be selected')
          .toBe(true);
      }));

      it('should remove selection if option has been removed', fakeAsync(() => {
        const selectComponent = fixture.componentInstance.select;

        select.click();
        fixture.detectChanges();
        flush();

        const firstOption = overlayContainerElement.querySelectorAll(
          'sbb-option',
        )[0] as HTMLElement;

        firstOption.click();
        fixture.detectChanges();

        expect(selectComponent.selected)
          .withContext('Expected first option to be selected.')
          .toBe(selectComponent.options.first);

        fixture.componentInstance.foods = [];
        fixture.detectChanges();
        flush();

        expect(selectComponent.selected)
          .withContext('Expected selection to be removed when option no longer exists.')
          .toBeUndefined();
      }));

      it('should display the selected option in the trigger', fakeAsync(() => {
        select.click();
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

        select.click();
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
        select.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll(
          'sbb-option',
        ) as NodeListOf<HTMLElement>;
        options[8].click();
        fixture.detectChanges();
        flush();

        expect(select.textContent).toContain('Potatoes');
        expect(fixture.componentInstance.select.selected).toBe(
          fixture.componentInstance.options.last,
        );
      }));

      it('should update the trigger when the selected option label is changed', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        expect(select.textContent!.trim()).toBe('Pizza');

        fixture.componentInstance.foods[1].viewValue = 'Calzone';
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        // tslint:disable-next-line:no-non-null-assertion
        expect(select.textContent!.trim()).toBe('Calzone');
      }));

      it('should update the trigger value if the text as a result of an expression change', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        expect(select.textContent!.trim()).toBe('Pizza');

        fixture.componentInstance.capitalize = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        fixture.checkNoChanges();

        expect(select.textContent!.trim()).toBe('PIZZA');
      }));

      it('should not select disabled options', () => {
        select.click();
        fixture.detectChanges();

        const options = overlayContainerElement.querySelectorAll(
          'sbb-option',
        ) as NodeListOf<HTMLElement>;
        options[2].click();
        fixture.detectChanges();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[2].classList).not.toContain('sbb-selected');
        expect(fixture.componentInstance.select.selected).toBeUndefined();
      });

      it('should not select options inside a disabled group', () => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroups);
        groupFixture.detectChanges();
        groupFixture.debugElement.query(By.css('.sbb-select'))!.nativeElement.click();
        groupFixture.detectChanges();

        const disabledGroup = overlayContainerElement.querySelectorAll('sbb-optgroup')[1];
        const options = disabledGroup.querySelectorAll('sbb-option');

        (options[0] as HTMLElement).click();
        groupFixture.detectChanges();

        expect(groupFixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[0].classList).not.toContain('sbb-selected');
        expect(groupFixture.componentInstance.select.selected).toBeUndefined();
      });

      it('should not throw if triggerValue accessed with no selected value', fakeAsync(() => {
        expect(() => fixture.componentInstance.select.triggerValue).not.toThrow();
      }));

      it('should emit to `optionSelectionChanges` when an option is selected', fakeAsync(() => {
        select.click();
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

      it('should handle accessing `optionSelectionChanges` before the options are initialized', fakeAsync(() => {
        fixture.destroy();
        fixture = TestBed.createComponent(BasicSelect);

        const spy = jasmine.createSpy('option selection spy');
        let subscription: Subscription;

        expect(fixture.componentInstance.select.options).toBeFalsy();
        expect(() => {
          subscription = fixture.componentInstance.select.optionSelectionChanges.subscribe(spy);
        }).not.toThrow();

        fixture.detectChanges();

        select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
        select.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledWith(jasmine.any(SbbOptionSelectionChange));

        subscription!.unsubscribe();
      }));

      it('should emit to `optionSelectionChanges` after the list of options has changed', fakeAsync(() => {
        const spy = jasmine.createSpy('option selection spy');
        const subscription = fixture.componentInstance.select.optionSelectionChanges.subscribe(spy);
        const selectFirstOption = () => {
          select.click();
          fixture.detectChanges();
          flush();

          const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
          option.click();
          fixture.detectChanges();
          flush();
        };

        fixture.componentInstance.foods = [{ value: 'salad-8', viewValue: 'Salad' }];
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        selectFirstOption();

        expect(spy).toHaveBeenCalledTimes(1);

        fixture.componentInstance.foods = [{ value: 'fruit-9', viewValue: 'Fruit' }];
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        selectFirstOption();

        expect(spy).toHaveBeenCalledTimes(2);

        subscription!.unsubscribe();
      }));

      it('should not indicate programmatic value changes as user interactions', () => {
        const events: SbbOptionSelectionChange[] = [];
        const subscription = fixture.componentInstance.select.optionSelectionChanges.subscribe(
          (event: SbbOptionSelectionChange) => events.push(event),
        );

        fixture.componentInstance.control.setValue('eggs-5');
        fixture.detectChanges();

        expect(events.map((event) => event.isUserInput)).toEqual([false]);

        subscription.unsubscribe();
      });
    });

    describe('forms integration', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let select: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
      });

      it('should take an initial view value with reactive forms', fakeAsync(() => {
        fixture.componentInstance.control = new FormControl('pizza-1');
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.sbb-select-value'))!;
        expect(value.nativeElement.textContent)
          .withContext(`Expected trigger to be populated by the control's initial value.`)
          .toContain('Pizza');

        select.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll(
          'sbb-option',
        ) as NodeListOf<HTMLElement>;
        expect(options[1].classList)
          .withContext(`Expected option with the control's initial value to be selected.`)
          .toContain('sbb-selected');
      }));

      it('should set the view value from the form', fakeAsync(() => {
        let value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent.trim()).toBe('Food');

        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent)
          .withContext(`Expected trigger to be populated by the control's new value.`)
          .toContain('Pizza');

        select.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll(
          'sbb-option',
        ) as NodeListOf<HTMLElement>;
        expect(options[1].classList)
          .withContext(`Expected option with the control's new value to be selected.`)
          .toContain('sbb-selected');
      }));

      it('should update the form value when the view changes', fakeAsync(() => {
        expect(fixture.componentInstance.control.value)
          .withContext(`Expected the control's value to be empty initially.`)
          .toEqual(null);

        select.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.value)
          .withContext(`Expected control's value to be set to the new option.`)
          .toEqual('steak-0');
      }));

      it('should clear the selection when a nonexistent option value is selected', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        fixture.componentInstance.control.setValue('gibberish');
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.sbb-select-value'));
        expect(value.nativeElement.textContent.trim())
          .withContext(`Expected trigger to show the placeholder.`)
          .toBe('Food');
        expect(select.textContent)
          .not.withContext(`Expected trigger is cleared when option value is not found.`)
          .toContain('Pizza');

        select.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll(
          'sbb-option',
        ) as NodeListOf<HTMLElement>;
        expect(options[1].classList).not.toContain(
          'sbb-selected',
          `Expected option w/ the old value not to be selected.`,
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
        expect(value.nativeElement.textContent.trim())
          .withContext(`Expected trigger to show the placeholder.`)
          .toBe('Food');
        expect(select.textContent).not.toContain(
          'Pizza',
          `Expected trigger is cleared when option value is not found.`,
        );

        select.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll(
          'sbb-option',
        ) as NodeListOf<HTMLElement>;
        expect(options[1].classList).not.toContain(
          'sbb-selected',
          `Expected option w/ the old value not to be selected.`,
        );
      }));

      it('should set the control to touched when the select is blurred', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched)
          .withContext(`Expected the control to start off as untouched.`)
          .toEqual(false);

        select.click();
        dispatchFakeEvent(select, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .withContext(`Expected the control to stay untouched when menu opened.`)
          .toEqual(false);

        const backdrop = overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop',
        ) as HTMLElement;
        backdrop.click();
        dispatchFakeEvent(select, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .withContext(`Expected the control to be touched as soon as focus left the select.`)
          .toEqual(true);
      }));

      it('should set the control to touched when the panel is closed', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched)
          .withContext('Expected the control to start off as untouched.')
          .toBe(false);

        select.click();
        dispatchFakeEvent(select, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .withContext('Expected the control to stay untouched when menu opened.')
          .toBe(false);

        fixture.componentInstance.select.close();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .withContext('Expected the control to be touched when the panel was closed.')
          .toBe(true);
      }));

      it('should not set touched when a disabled select is touched', () => {
        expect(fixture.componentInstance.control.touched)
          .withContext('Expected the control to start off as untouched.')
          .toBe(false);

        fixture.componentInstance.control.disable();
        dispatchFakeEvent(select, 'blur');

        expect(fixture.componentInstance.control.touched)
          .withContext('Expected the control to stay untouched.')
          .toBe(false);
      });

      it('should set the control to dirty when the select value changes in DOM', fakeAsync(() => {
        expect(fixture.componentInstance.control.dirty)
          .withContext(`Expected control to start out pristine.`)
          .toEqual(false);

        select.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.dirty)
          .withContext(`Expected control to be dirty after value was changed by user.`)
          .toEqual(true);
      }));

      it('should not set the control to dirty when the value changes programmatically', () => {
        expect(fixture.componentInstance.control.dirty)
          .withContext(`Expected control to start out pristine.`)
          .toEqual(false);

        fixture.componentInstance.control.setValue('pizza-1');

        expect(fixture.componentInstance.control.dirty)
          .withContext(`Expected control to stay pristine after programmatic change.`)
          .toEqual(false);
      });

      it('should propagate the value set through the `value` property to the form field', fakeAsync(() => {
        const control = fixture.componentInstance.control;

        expect(control.value).toBeFalsy();

        fixture.componentInstance.select.value = 'pizza-1';
        fixture.detectChanges();

        expect(control.value).toBe('pizza-1');
      }));
    });

    describe('disabled behavior', () => {
      it('should disable itself when control is disabled programmatically', fakeAsync(() => {
        const fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();

        fixture.componentInstance.control.disable();
        fixture.detectChanges();

        const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
        expect(getComputedStyle(select).getPropertyValue('cursor'))
          .withContext(`Expected cursor to be default arrow on disabled control.`)
          .toEqual('default');

        select.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent)
          .withContext(`Expected select panel to stay closed.`)
          .toEqual('');
        expect(fixture.componentInstance.select.panelOpen)
          .withContext(`Expected select panelOpen property to stay false.`)
          .toBe(false);

        fixture.componentInstance.control.enable();
        fixture.detectChanges();
        expect(getComputedStyle(select).getPropertyValue('cursor'))
          .withContext(`Expected cursor to be a pointer on enabled control.`)
          .toEqual('pointer');

        select.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent)
          .withContext(`Expected select panel to open normally on re-enabled control`)
          .toContain('Steak');
        expect(fixture.componentInstance.select.panelOpen)
          .withContext(`Expected select panelOpen property to become true.`)
          .toBe(true);
      }));

      it('should keep the disabled state in sync if the form group is swapped and disabled at the same time', () => {
        const fixture = TestBed.createComponent(SelectInsideDynamicFormGroup);
        fixture.detectChanges();
        const instance = fixture.componentInstance;

        expect(instance.select.disabled).toBe(false);

        instance.assignGroup(true);
        fixture.detectChanges();

        expect(instance.select.disabled).toBe(true);
      });
    });

    describe('keyboard scrolling', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let host: HTMLElement;
      let panel: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelect);

        fixture.componentInstance.foods = [];

        for (let i = 0; i < 30; i++) {
          fixture.componentInstance.foods.push({ value: `value-${i}`, viewValue: `Option ${i}` });
        }

        fixture.detectChanges();
        fixture.componentInstance.select.open();
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        host = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
        panel = overlayContainerElement.querySelector('.sbb-select-panel')! as HTMLElement;
      }));

      it('should not scroll to options that are completely in the view', () => {
        const initialScrollPosition = panel.scrollTop;

        [1, 2, 3].forEach(() => {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
        });

        expect(panel.scrollTop)
          .withContext('Expected scroll position not to change')
          .toBe(initialScrollPosition);
      });

      it('should scroll down to the active option', () => {
        panel.style.height = '256px';

        for (let i = 0; i < 15; i++) {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
        }

        // <option index * height> - <panel height> + <panel padding> = 16 * 31 - 256 + 10 = 250
        expect(panel.scrollTop).withContext('Expected scroll to be at the 16th option.').toBe(250);
      });

      it('should scroll up to the active option', () => {
        panel.style.height = '256px';

        // Scroll to the bottom.
        for (let i = 0; i < fixture.componentInstance.foods.length; i++) {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
        }

        for (let i = 0; i < 20; i++) {
          dispatchKeyboardEvent(host, 'keydown', UP_ARROW);
        }

        // <option index * height> + <panel padding> = 9 * 31 + 10 = 289
        expect(panel.scrollTop).withContext('Expected scroll to be at the 9th option.').toBe(289);
      });

      it('should skip option group labels', fakeAsync(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroups);

        groupFixture.detectChanges();
        groupFixture.componentInstance.select.open();
        groupFixture.detectChanges();
        flush();

        host = groupFixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
        panel = overlayContainerElement.querySelector('.sbb-select-panel')! as HTMLElement;

        panel.style.height = '256px';

        for (let i = 0; i < 5; i++) {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
          flush();
        }

        // Note that we press down 5 times, but it will skip
        // 3 options because the second group is disabled.
        // <option index * height> + <group count * group height> - <panel height> = 9 * 31 + 3 * 42 - 256 = 149
        expect(panel.scrollTop)
          .withContext('Expected scroll to be at the 9th option.')
          .toBeCloseTo(150, -1);
      }));

      it('should scroll to the top when pressing HOME', () => {
        for (let i = 0; i < 20; i++) {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
          fixture.detectChanges();
        }

        expect(panel.scrollTop)
          .withContext('Expected panel to be scrolled down.')
          .toBeGreaterThan(0);

        dispatchKeyboardEvent(host, 'keydown', HOME);
        fixture.detectChanges();

        expect(panel.scrollTop).withContext('Expected panel to be scrolled to the top').toBe(0);
      });

      it('should scroll to the bottom of the panel when pressing END', () => {
        panel.style.height = '256px';

        dispatchKeyboardEvent(host, 'keydown', END);
        fixture.detectChanges();

        // <option amount> * <option height> - <panel height> + <panel padding> = 30 * 31 - 256 + 10 = 684
        expect(panel.scrollTop)
          .withContext('Expected panel to be scrolled to the bottom')
          .toBe(684);
      });

      it('should scroll 10 to the top or to first element when pressing PAGE_UP', () => {
        panel.style.height = '256px';

        for (let i = 0; i < 18; i++) {
          dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
          fixture.detectChanges();
        }

        expect(panel.scrollTop)
          .withContext('Expected panel to be scrolled down.')
          .toBeGreaterThan(0);

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(18);

        dispatchKeyboardEvent(host, 'keydown', PAGE_UP);
        fixture.detectChanges();

        //  <top padding> + <option amount> * <option height>
        // 10 + 8 × 31
        expect(panel.scrollTop).withContext('Expected panel to be scrolled to the top').toBe(258);
        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(8);

        dispatchKeyboardEvent(host, 'keydown', PAGE_UP);
        fixture.detectChanges();

        expect(panel.scrollTop).withContext('Expected panel to be scrolled to the top').toBe(0);
        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(0);
      });

      it('should scroll 10 to the bottom of the panel when pressing PAGE_DOWN', () => {
        panel.style.height = '256px';

        dispatchKeyboardEvent(host, 'keydown', PAGE_DOWN);
        fixture.detectChanges();

        // <top padding> + <option amount> * <option height> - <panel height> =
        //    10 + 11 * 31 - 256 = 93
        expect(panel.scrollTop)
          .withContext('Expected panel to be scrolled 10 to the bottom')
          .toBe(95);
        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(10);

        dispatchKeyboardEvent(host, 'keydown', PAGE_DOWN);
        fixture.detectChanges();

        // <top padding> + <option amount> * <option height> - <panel height> =
        //    10 + 21 * 31 - 256 = 403
        expect(panel.scrollTop)
          .withContext('Expected panel to be scrolled 10 to the bottom')
          .toBe(405);
        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(20);

        dispatchKeyboardEvent(host, 'keydown', PAGE_DOWN);
        fixture.detectChanges();

        // <top padding> + <option amount> * <option height> - <panel height> =
        //    10 + 30 * 31 - 256 = 684
        expect(panel.scrollTop)
          .withContext('Expected panel to be scrolled 10 to the bottom')
          .toBe(684);
        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(29);
      });

      it('should scroll to the active option when typing', fakeAsync(() => {
        panel.style.height = '256px';

        for (let i = 0; i < 15; i++) {
          // Press the letter 'o' 15 times since all the options are named 'Option <index>'
          dispatchEvent(host, createKeyboardEvent('keydown', 79, 'o'));
          fixture.detectChanges();
          tick(DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL);
        }
        flush();

        // <option index * height> - <panel height> + <panel padding> = 16 * 31 - 256 + 10 = 250
        expect(panel.scrollTop).withContext('Expected scroll to be at the 16th option.').toBe(250);
      }));
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
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      flush();

      // Wait for the next writeValue promise.
      expect(instance.select.selected).toBe(instance.options.toArray()[1]);
    }));
  });

  describe('with a selectionChange event handler', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectWithChangeEvent])));

    let fixture: ComponentFixture<SelectWithChangeEvent>;
    let select: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SelectWithChangeEvent);
      fixture.detectChanges();
      select = fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;
    });

    it('should emit an event when the selected option has changed', () => {
      select.click();
      fixture.detectChanges();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalled();
    });

    it('should not emit multiple change events for the same option', () => {
      select.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      option.click();
      option.click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);
    });

    it('should only emit one event when pressing arrow keys on closed select', fakeAsync(() => {
      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);

      flush();
    }));
  });

  describe('with ngModel', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([NgModelSelect])));

    it('should disable itself when control is disabled using the property', fakeAsync(() => {
      const fixture = TestBed.createComponent(NgModelSelect);
      fixture.detectChanges();

      fixture.componentInstance.isDisabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      flush();

      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;
      expect(getComputedStyle(select).getPropertyValue('cursor'))
        .withContext(`Expected cursor to be default arrow on disabled control.`)
        .toEqual('default');

      select.click();
      fixture.detectChanges();
      flush();

      expect(overlayContainerElement.textContent)
        .withContext(`Expected select panel to stay closed.`)
        .toEqual('');
      expect(fixture.componentInstance.select.panelOpen)
        .withContext(`Expected select panelOpen property to stay false.`)
        .toBe(false);

      fixture.componentInstance.isDisabled = false;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      flush();

      fixture.detectChanges();
      expect(getComputedStyle(select).getPropertyValue('cursor'))
        .withContext(`Expected cursor to be a pointer on enabled control.`)
        .toEqual('pointer');

      select.click();
      fixture.detectChanges();
      flush();

      expect(overlayContainerElement.textContent)
        .withContext(`Expected select panel to open normally on re-enabled control`)
        .toContain('Steak');
      expect(fixture.componentInstance.select.panelOpen)
        .withContext(`Expected select panelOpen property to become true.`)
        .toBe(true);
    }));
  });

  describe('with ngIf', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([NgIfSelect])));

    it('should handle nesting in an ngIf', fakeAsync(() => {
      const fixture = TestBed.createComponent(NgIfSelect);
      fixture.detectChanges();

      fixture.componentInstance.isShowing = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
      select.style.width = '300px';

      select.click();
      flush();
      fixture.detectChanges();

      const value = fixture.debugElement.query(By.css('.sbb-select-value'))!;
      expect(value.nativeElement.textContent)
        .withContext(`Expected trigger to be populated by the control's initial value.`)
        .toContain('Pizza');

      const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      expect(pane.style.width).toEqual('300px');

      expect(fixture.componentInstance.select.panelOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Steak');
      expect(overlayContainerElement.textContent).toContain('Pizza');
      expect(overlayContainerElement.textContent).toContain('Tacos');
    }));
  });

  describe('with multiple sbb-select elements in one view', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([ManySelects])));

    let fixture: ComponentFixture<ManySelects>;
    let selects: DebugElement[];
    let options: NodeListOf<HTMLElement>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(ManySelects);
      fixture.detectChanges();
      selects = fixture.debugElement.queryAll(By.css('.sbb-select'));

      selects[0].nativeElement.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
    }));

    it('should set the option id', fakeAsync(() => {
      const firstOptionID = options[0].id;

      expect(options[0].id)
        .withContext(`Expected option ID to have the correct prefix.`)
        .toContain('sbb-option');
      expect(options[0].id).not.toEqual(options[1].id, `Expected option IDs to be unique.`);

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop',
      ) as HTMLElement;
      backdrop.click();
      fixture.detectChanges();
      flush();

      selects[1].nativeElement.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('sbb-option') as NodeListOf<HTMLElement>;
      expect(options[0].id)
        .withContext(`Expected option ID to have the correct prefix.`)
        .toContain('sbb-option');
      expect(options[0].id).not.toEqual(firstOptionID, `Expected option IDs to be unique.`);
      expect(options[0].id).not.toEqual(options[1].id, `Expected option IDs to be unique.`);
    }));
  });

  describe('with a sibling component that throws an error', () => {
    beforeEach(waitForAsync(() =>
      configureSbbSelectTestingModule([SelectWithErrorSibling, ThrowsErrorOnInit])));

    it('should not crash the browser when a sibling throws an error on init', () => {
      // Note that this test can be considered successful if the error being thrown didn't
      // end up crashing the testing setup altogether.
      expect(() => {
        TestBed.createComponent(SelectWithErrorSibling).detectChanges();
      }).toThrowError(new RegExp('Oh no!', 'g'));
    });
  });

  describe('with tabindex', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectWithPlainTabindex])));

    it('should be able to set the tabindex via the native attribute', () => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindex);
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
      expect(select.getAttribute('tabindex')).toBe('5');
    });
  });

  describe('change events', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectWithPlainTabindex])));

    it('should complete the stateChanges stream on destroy', () => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindex);
      fixture.detectChanges();

      const debugElement = fixture.debugElement.query(By.directive(SbbSelect))!;
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

    it('should set the width of the overlay if the element was hidden initially', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectInitiallyHidden);
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
      select.style.width = '200px';
      fixture.componentInstance.isVisible = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      select.click();
      fixture.detectChanges();
      flush();

      const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      expect(pane.style.width).toBe('200px');
    }));
  });

  describe('with no placeholder', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([BasicSelectNoPlaceholder])));

    it('should set the width of the overlay if there is no placeholder', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectNoPlaceholder);

      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;

      select.click();
      fixture.detectChanges();
      flush();

      const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      // tslint:disable-next-line:radix
      expect(parseInt(pane.style.width as string)).toBeGreaterThan(0);
    }));
  });

  describe('when invalid inside a form', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([InvalidSelectInForm])));

    it('should not throw SelectionModel errors in addition to ngModel errors', () => {
      const fixture = TestBed.createComponent(InvalidSelectInForm);

      // The first change detection run will throw the "ngModel is missing a name" error.
      expect(() => fixture.detectChanges()).toThrowError(/the name attribute must be set/g);
      fixture.changeDetectorRef.markForCheck();

      // The second run shouldn't throw selection-model related errors.
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('with ngModel using compareWith', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([NgModelCompareWithSelect])));

    let fixture: ComponentFixture<NgModelCompareWithSelect>;
    let instance: NgModelCompareWithSelect;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(NgModelCompareWithSelect);
      instance = fixture.componentInstance;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      flush();
    }));

    describe('comparing by value', () => {
      it('should have a selection', fakeAsync(() => {
        const selectedOption = instance.select.selected as unknown as SbbOption;
        expect(selectedOption.value.value).toEqual('pizza-1');
      }));

      it('should update when making a new selection', fakeAsync(() => {
        instance.options.last._selectViaInteraction();
        fixture.detectChanges();
        flush();

        const selectedOption = instance.select.selected as unknown as SbbOption;
        expect(instance.selectedFood.value).toEqual('tacos-2');
        expect(selectedOption.value.value).toEqual('tacos-2');
      }));
    });

    describe('comparing by reference', () => {
      beforeEach(fakeAsync(() => {
        spyOn(instance, 'compareByReference').and.callThrough();
        instance.useCompareByReference();
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        flush();
      }));

      it('should use the comparator', () => {
        expect(instance.compareByReference).toHaveBeenCalled();
      });

      it('should initialize with no selection despite having a value', () => {
        expect(instance.selectedFood.value).toBe('pizza-1');
        expect(instance.select.selected).toBeUndefined();
      });

      it('should not update the selection if value is copied on change', fakeAsync(() => {
        instance.options.first._selectViaInteraction();
        fixture.detectChanges();
        flush();

        expect(instance.selectedFood.value).toEqual('steak-0');
        expect(instance.select.selected).toBeUndefined();
      }));

      it('should throw an error when using a non-function comparator', () => {
        instance.useNullComparator();

        expect(() => {
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();
        }).toThrowError(wrappedErrorMessage(getSbbSelectNonFunctionValueError()));
      });
    });
  });

  describe(`when the select's value is accessed on initialization`, () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectEarlyAccessSibling])));

    it('should not throw when trying to access the selected value on init', () => {
      expect(() => {
        TestBed.createComponent(SelectEarlyAccessSibling).detectChanges();
      }).not.toThrow();
    });

    it('should not throw when reading selected value programmatically in single selection mode', () => {
      expect(() => {
        const fixture = TestBed.createComponent(SelectEarlyAccessSibling);
        const select = fixture.debugElement.query(By.directive(SbbSelect)).componentInstance;
        // We're checking that accessing the getter won't throw.
        select.multiple = false;
        return select.selected;
      }).not.toThrow();
    });

    it('should not throw when reading selected value programmatically in multi selection mode', () => {
      expect(() => {
        const fixture = TestBed.createComponent(SelectEarlyAccessSibling);
        const select = fixture.debugElement.query(By.directive(SbbSelect)).componentInstance;
        // We're checking that accessing the getter won't throw.
        select.multiple = true;
        return select.selected;
      }).not.toThrow();
    });
  });

  describe('with ngIf and sbb-label', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectWithNgIfAndLabel])));

    it('should not throw when using ngIf on a select with an associated label', () => {
      expect(() => {
        const fixture = TestBed.createComponent(SelectWithNgIfAndLabel);
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('inside of a form group', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectInsideFormGroup])));

    let fixture: ComponentFixture<SelectInsideFormGroup>;
    let testComponent: SelectInsideFormGroup;
    let select: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SelectInsideFormGroup);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
    });

    it('should not set the invalid class on a clean select', fakeAsync(() => {
      expect(testComponent.formGroup.untouched)
        .withContext('Expected the form to be untouched.')
        .toBe(true);
      expect(testComponent.formControl.invalid)
        .withContext('Expected form control to be invalid.')
        .toBe(true);
      expect(select.classList).not.toContain(
        'sbb-select-invalid',
        'Expected select not to appear invalid.',
      );
      expect(select.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to false.')
        .toBe('false');
    }));

    it('should appear as invalid if it becomes touched', fakeAsync(() => {
      expect(select.classList).not.toContain(
        'sbb-select-invalid',
        'Expected select not to appear invalid.',
      );
      expect(select.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to false.')
        .toBe('false');

      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(select.classList)
        .withContext('Expected select to appear invalid.')
        .toContain('sbb-select-invalid');
      expect(select.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to true.')
        .toBe('true');
    }));

    it('should not have the invalid class when the select becomes valid', fakeAsync(() => {
      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(select.classList)
        .withContext('Expected select to appear invalid.')
        .toContain('sbb-select-invalid');
      expect(select.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to true.')
        .toBe('true');

      testComponent.formControl.setValue('pizza-1');
      fixture.detectChanges();

      expect(select.classList).not.toContain(
        'sbb-select-invalid',
        'Expected select not to appear invalid.',
      );
      expect(select.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to false.')
        .toBe('false');
    }));

    it('should appear as invalid when the parent form group is submitted', fakeAsync(() => {
      expect(select.classList).not.toContain(
        'sbb-select-invalid',
        'Expected select not to appear invalid.',
      );
      expect(select.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to false.')
        .toBe('false');

      dispatchFakeEvent(fixture.debugElement.query(By.css('form'))!.nativeElement, 'submit');
      fixture.detectChanges();

      expect(select.classList)
        .withContext('Expected select to appear invalid.')
        .toContain('sbb-select-invalid');
      expect(select.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to true.')
        .toBe('true');
    }));

    it('should render the error messages when the parent form is submitted', fakeAsync(() => {
      const debugEl = fixture.debugElement.nativeElement;

      expect(debugEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error messages')
        .toBe(0);

      dispatchFakeEvent(fixture.debugElement.query(By.css('form'))!.nativeElement, 'submit');
      fixture.detectChanges();

      expect(debugEl.querySelectorAll('sbb-error').length)
        .withContext('Expected one error message')
        .toBe(1);
    }));

    it('should override error matching behavior via injection token', () => {
      const errorStateMatcher: SbbErrorStateMatcher = {
        isErrorState: jasmine.createSpy('error state matcher').and.returnValue(true),
      };

      fixture.destroy();

      TestBed.resetTestingModule().configureTestingModule({
        imports: [
          SbbSelectModule,
          ReactiveFormsModule,
          FormsModule,
          NoopAnimationsModule,
          SbbFormFieldModule,
          SbbIconTestingModule,
        ],
        declarations: [SelectInsideFormGroup],
        providers: [{ provide: SbbErrorStateMatcher, useValue: errorStateMatcher }],
      });

      const errorFixture = TestBed.createComponent(SelectInsideFormGroup);
      const component = errorFixture.componentInstance;

      errorFixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      expect(errorStateMatcher.isErrorState).toHaveBeenCalled();
    });

    it('should notify that the state changed when the options have changed', fakeAsync(() => {
      testComponent.formControl.setValue('pizza-1');
      fixture.detectChanges();

      const spy = jasmine.createSpy('stateChanges spy');
      const subscription = testComponent.select.stateChanges.subscribe(spy);

      testComponent.options = [];
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    }));
  });

  describe('with custom error behavior', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([CustomErrorBehaviorSelect])));

    it('should be able to override the error matching behavior via an @Input', () => {
      const fixture = TestBed.createComponent(CustomErrorBehaviorSelect);
      const component = fixture.componentInstance;
      const matcher = jasmine.createSpy('error state matcher').and.returnValue(true);

      fixture.detectChanges();

      expect(component.control.invalid).toBe(false);
      expect(component.select.errorState).toBe(false);

      fixture.componentInstance.errorStateMatcher = { isErrorState: matcher };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      fixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      expect(matcher).toHaveBeenCalled();
    });
  });

  describe('with preselected array values', () => {
    beforeEach(waitForAsync(() =>
      configureSbbSelectTestingModule([SingleSelectWithPreselectedArrayValues])));

    it('should be able to preselect an array value in single-selection mode', fakeAsync(() => {
      const fixture = TestBed.createComponent(SingleSelectWithPreselectedArrayValues);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

      expect(select.textContent).toContain('Pizza');
      expect(fixture.componentInstance.options.toArray()[1].selected).toBe(true);
    }));
  });

  describe('with custom value accessor', () => {
    beforeEach(waitForAsync(() =>
      configureSbbSelectTestingModule([CompWithCustomSelect, CustomSelectAccessor])));

    it('should support use inside a custom value accessor', () => {
      const fixture = TestBed.createComponent(CompWithCustomSelect);
      spyOn(fixture.componentInstance.customAccessor, 'writeValue');
      fixture.detectChanges();

      expect(fixture.componentInstance.customAccessor.select.ngControl)
        .withContext('Expected sbb-select NOT to inherit control from parent value accessor.')
        .toBeFalsy();
      expect(fixture.componentInstance.customAccessor.writeValue).toHaveBeenCalled();
    });
  });

  describe('with a falsy value', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([FalsyValueSelect])));

    it('should be able to programmatically select a falsy option', fakeAsync(() => {
      const fixture = TestBed.createComponent(FalsyValueSelect);

      fixture.detectChanges();
      fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement.click();
      fixture.componentInstance.control.setValue(0);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.options.first.selected)
        .withContext('Expected first option to be selected')
        .toBe(true);
      expect(overlayContainerElement.querySelectorAll('sbb-option')[0].classList)
        .withContext('Expected first option to be selected')
        .toContain('sbb-selected');
    }));
  });

  describe('with OnPush', () => {
    beforeEach(waitForAsync(() =>
      configureSbbSelectTestingModule([BasicSelectOnPush, BasicSelectOnPushPreselected])));

    it('should set the trigger text based on the value when initialized', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPushPreselected);

      fixture.detectChanges();
      flush();

      const select = fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;

      fixture.detectChanges();
      flush();

      expect(select.textContent).toContain('Pizza');
    }));

    it('should update the trigger based on the value', () => {
      const fixture = TestBed.createComponent(BasicSelectOnPush);
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;

      fixture.componentInstance.control.setValue('pizza-1');
      fixture.detectChanges();

      expect(select.textContent).toContain('Pizza');

      fixture.componentInstance.control.reset();
      fixture.detectChanges();

      expect(select.textContent).not.toContain('Pizza');
    });

    it('should sync up the form control value with the component value', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPushPreselected);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBe('pizza-1');
      expect(fixture.componentInstance.select.value).toBe('pizza-1');
    }));
  });

  describe('when resetting the value by setting null or undefined', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([ResetValuesSelect])));

    let fixture: ComponentFixture<ResetValuesSelect>;
    let select: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(ResetValuesSelect);
      fixture.detectChanges();
      select = fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement;

      select.click();
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
      expect(select.textContent).not.toContain('Undefined');
    }));

    it('should reset when an option with a null value is selected', fakeAsync(() => {
      options[5].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeNull();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(select.textContent).not.toContain('Null');
    }));

    it('should reset when a blank option is selected', fakeAsync(() => {
      options[6].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeUndefined();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(select.textContent).not.toContain('None');
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
      expect(select.textContent).toContain('Falsy');
    }));

    it('should not consider the reset values as selected when resetting the form control', () => {
      fixture.componentInstance.control.reset();
      fixture.detectChanges();

      expect(fixture.componentInstance.control.value).toBeNull();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(select.textContent).not.toContain('Null');
      expect(select.textContent).not.toContain('Undefined');
    });
  });

  describe('with reset option and a form control', () => {
    let fixture: ComponentFixture<SelectWithResetOptionAndFormControl>;
    let options: HTMLElement[];

    beforeEach(() => {
      configureSbbSelectTestingModule([SelectWithResetOptionAndFormControl]);
      fixture = TestBed.createComponent(SelectWithResetOptionAndFormControl);
      fixture.detectChanges();
      fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement.click();
      fixture.detectChanges();
      options = Array.from(overlayContainerElement.querySelectorAll('sbb-option'));
    });

    it('should set the select value', fakeAsync(() => {
      fixture.componentInstance.control.setValue('a');
      fixture.detectChanges();
      expect(fixture.componentInstance.select.value).toBe('a');
    }));

    it('should reset the control value', fakeAsync(() => {
      fixture.componentInstance.control.setValue('a');
      fixture.detectChanges();

      options[0].click();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.control.value).toBeUndefined();
    }));

    it('should reflect the value in the form control', fakeAsync(() => {
      options[1].click();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.select.value).toBe('a');
      expect(fixture.componentInstance.control.value).toBe('a');
    }));
  });

  describe('without Angular forms', () => {
    beforeEach(waitForAsync(() =>
      configureSbbSelectTestingModule([
        BasicSelectWithoutForms,
        BasicSelectWithoutFormsPreselected,
        BasicSelectWithoutFormsMultiple,
      ])));

    it('should set the value when options are clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);

      fixture.detectChanges();
      expect(fixture.componentInstance.selectedFood).toBeFalsy();

      const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

      select.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('steak-0');
      expect(fixture.componentInstance.select.value).toBe('steak-0');
      expect(select.textContent).toContain('Steak');

      select.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelectorAll('sbb-option')[2] as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('sandwich-2');
      expect(fixture.componentInstance.select.value).toBe('sandwich-2');
      expect(select.textContent).toContain('Sandwich');
    }));

    it('should mark options as selected when the value is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);

      fixture.detectChanges();
      fixture.componentInstance.selectedFood = 'sandwich-2';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
      expect(select.textContent).toContain('Sandwich');

      select.click();
      fixture.detectChanges();
      flush();

      const option = overlayContainerElement.querySelectorAll('sbb-option')[2];

      expect(option.classList).toContain('sbb-selected');
      expect(fixture.componentInstance.select.value).toBe('sandwich-2');
    }));

    it('should reset the label when a null value is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);

      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.selectedFood).toBeFalsy();

      const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

      select.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('steak-0');
      expect(fixture.componentInstance.select.value).toBe('steak-0');
      expect(select.textContent).toContain('Steak');

      fixture.componentInstance.selectedFood = null;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select.value).toBeNull();
      expect(select.textContent).not.toContain('Steak');
    }));

    it('should reflect the preselected value', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsPreselected);

      fixture.detectChanges();
      flush();

      const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
      fixture.detectChanges();
      expect(select.textContent).toContain('Pizza');

      select.click();
      fixture.detectChanges();
      flush();

      const option = overlayContainerElement.querySelectorAll('sbb-option')[1];

      expect(option.classList).toContain('sbb-selected');
      expect(fixture.componentInstance.select.value).toBe('pizza-1');
    }));

    it('should be able to select multiple values', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsMultiple);

      fixture.detectChanges();
      expect(fixture.componentInstance.selectedFoods).toBeFalsy();

      const select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;

      select.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

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
    }));

    it('should restore focus to the host element', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      const select = fixture.debugElement.nativeElement.querySelector('sbb-select');

      fixture.detectChanges();
      select.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(document.activeElement).withContext('Expected trigger to be focused.').toBe(select);
    }));

    it('should not restore focus to the host element when clicking outside', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      const select = fixture.debugElement.nativeElement.querySelector('sbb-select');
      fixture.detectChanges();
      select.focus();
      select.click();
      fixture.detectChanges();
      flush();

      expect(document.activeElement).withContext('Expected trigger to be focused.').toBe(select);

      select.blur(); // Blur manually since the programmatic click might not do it.
      (overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(document.activeElement).not.toBe(select, 'Expected trigger not to be focused.');
    }));

    it('should update the data binding before emitting the change event', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      const instance = fixture.componentInstance;
      const spy = jasmine.createSpy('change spy');

      fixture.detectChanges();
      flush();
      instance.select.selectionChange.subscribe(() => spy(instance.selectedFood));

      expect(instance.selectedFood).toBeFalsy();

      fixture.debugElement.query(By.css('.sbb-select'))!.nativeElement.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(instance.selectedFood).toBe('steak-0');
      expect(spy).toHaveBeenCalledWith('steak-0');
    }));

    it('should select the active option when tabbing away while open', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('.sbb-select');

      expect(fixture.componentInstance.selectedFood).toBeFalsy();

      select.click();
      fixture.detectChanges();
      flush();

      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
      fixture.detectChanges();
      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      dispatchKeyboardEvent(select, 'keydown', TAB);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBe('sandwich-2');
      expect(fixture.componentInstance.select.value).toBe('sandwich-2');
      expect(select.textContent).toContain('Sandwich');
    }));

    it('should not select the active option when tabbing away while close', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('.sbb-select');

      expect(fixture.componentInstance.selectedFood).toBeFalsy();

      select.click();
      fixture.detectChanges();
      flush();

      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
      fixture.detectChanges();
      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
      fixture.detectChanges();
      dispatchKeyboardEvent(select, 'keydown', ESCAPE);
      fixture.detectChanges();

      dispatchKeyboardEvent(select, 'keydown', TAB);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFood).toBeFalsy();
    }));

    it('should not change the multiple value selection when tabbing away', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutFormsMultiple);
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedFoods)
        .withContext('Expected no value on init.')
        .toBeFalsy();

      const select = fixture.nativeElement.querySelector('.sbb-select');
      select.click();
      fixture.detectChanges();

      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
      fixture.detectChanges();
      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      dispatchKeyboardEvent(select, 'keydown', TAB);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.selectedFoods)
        .withContext('Expected no value after tabbing away.')
        .toBeFalsy();
    }));

    it('should emit once when a reset value is selected', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      const instance = fixture.componentInstance;
      const spy = jasmine.createSpy('change spy');

      instance.selectedFood = 'sandwich-2';
      instance.foods[0].value = null;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const subscription = instance.select.selectionChange.subscribe(spy);

      fixture.debugElement.query(By.css('.sbb-select')).nativeElement.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(spy).toHaveBeenCalledTimes(1);

      subscription.unsubscribe();
    }));

    it('should not emit the change event multiple times when a reset option is selected twice in a row', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectWithoutForms);
      const instance = fixture.componentInstance;
      const spy = jasmine.createSpy('change spy');

      instance.foods[0].value = null;
      fixture.detectChanges();

      const subscription = instance.select.selectionChange.subscribe(spy);

      fixture.debugElement.query(By.css('.sbb-select')).nativeElement.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(spy).not.toHaveBeenCalled();

      fixture.debugElement.query(By.css('.sbb-select')).nativeElement.click();
      fixture.detectChanges();
      flush();

      (overlayContainerElement.querySelector('sbb-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect(spy).not.toHaveBeenCalled();

      subscription.unsubscribe();
    }));
  });

  describe('with multiple selection', () => {
    beforeEach(waitForAsync(() =>
      configureSbbSelectTestingModule([MultiSelect, MultiSelectWithLotsOfOptions])));

    let fixture: ComponentFixture<MultiSelect>;
    let testInstance: MultiSelect;
    let select: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(MultiSelect);
      testInstance = fixture.componentInstance;
      fixture.detectChanges();
      select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
    });

    it('should be able to select multiple values', () => {
      select.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      options[2].click();
      options[5].click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual(['steak-0', 'tacos-2', 'eggs-5']);
    });

    it('should be able to toggle an option on and off', () => {
      select.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector('sbb-option') as HTMLElement;

      option.click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual(['steak-0']);

      option.click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([]);
    });

    it('should update the label', fakeAsync(() => {
      select.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      options[2].click();
      options[5].click();
      fixture.detectChanges();

      expect(select.textContent).toContain('Steak, Tacos, Eggs');

      options[2].click();
      fixture.detectChanges();

      expect(select.textContent).toContain('Steak, Eggs');
    }));

    it('should be able to set the selected value by taking an array', () => {
      select.click();
      testInstance.control.setValue(['steak-0', 'eggs-5']);
      fixture.detectChanges();

      const optionNodes = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

      const optionInstances = testInstance.options.toArray();

      expect(optionNodes[0].classList).toContain('sbb-selected');
      expect(optionNodes[5].classList).toContain('sbb-selected');

      expect(optionInstances[0].selected).toBe(true);
      expect(optionInstances[5].selected).toBe(true);
    });

    it('should override the previously-selected value when setting an array', () => {
      select.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      fixture.detectChanges();

      expect(options[0].classList).toContain('sbb-selected');

      testInstance.control.setValue(['eggs-5']);
      fixture.detectChanges();

      expect(options[0].classList).not.toContain('sbb-selected');
      expect(options[5].classList).toContain('sbb-selected');
    });

    it('should not close the panel when clicking on options', () => {
      select.click();
      fixture.detectChanges();

      expect(testInstance.select.panelOpen).toBe(true);

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      options[1].click();
      fixture.detectChanges();

      expect(testInstance.select.panelOpen).toBe(true);
    });

    it('should sort the selected options based on their order in the panel', fakeAsync(() => {
      select.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

      options[2].click();
      options[0].click();
      options[1].click();
      fixture.detectChanges();

      expect(select.textContent).toContain('Steak, Pizza, Tacos');
      expect(fixture.componentInstance.control.value).toEqual(['steak-0', 'pizza-1', 'tacos-2']);
    }));

    it('should be able to customize the value sorting logic', fakeAsync(() => {
      fixture.componentInstance.sortComparator = (a, b, optionsArray) => {
        return optionsArray.indexOf(b) - optionsArray.indexOf(a);
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      select.click();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

      for (let i = 0; i < 3; i++) {
        options[i].click();
      }
      fixture.detectChanges();

      // Expect the items to be in reverse order.
      expect(select.textContent).toContain('Tacos, Pizza, Steak');
      expect(fixture.componentInstance.control.value).toEqual(['tacos-2', 'pizza-1', 'steak-0']);
    }));

    it('should sort the values that get set via the model based on the panel order', () => {
      select.click();
      fixture.detectChanges();

      testInstance.control.setValue(['tacos-2', 'steak-0', 'pizza-1']);
      fixture.detectChanges();

      expect(select.textContent).toContain('Steak, Pizza, Tacos');
    });

    it('should throw an exception when trying to set a non-array value', () => {
      expect(() => {
        testInstance.control.setValue('not-an-array' as any);
      }).toThrowError(wrappedErrorMessage(getSbbSelectNonArrayValueError()));
    });

    it('should throw an exception when trying to change multiple mode after init', () => {
      expect(() => {
        testInstance.select.multiple = false;
      }).toThrowError(wrappedErrorMessage(getSbbSelectDynamicMultipleError()));
    });

    it('should pass the `multiple` value to all of the option instances', fakeAsync(() => {
      select.click();
      fixture.detectChanges();
      flush();

      expect(testInstance.options.toArray().every((option) => !!option.multiple))
        .withContext('Expected `multiple` to have been added to initial set of options.')
        .toBe(true);

      testInstance.foods.push({ value: 'cake-8', viewValue: 'Cake' });
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      flush();

      expect(testInstance.options.toArray().every((option) => !!option.multiple))
        .withContext('Expected `multiple` to have been set on dynamically-added option.')
        .toBe(true);
    }));

    it('should update the active item index on click', fakeAsync(() => {
      select.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(0);

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

      options[2].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(2);
    }));

    it('should be to select an option with a `null` value', () => {
      fixture.componentInstance.foods = [
        { value: null, viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: null, viewValue: 'Tacos' },
      ];
      fixture.changeDetectorRef.markForCheck();

      fixture.detectChanges();
      select.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'sbb-option',
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      options[1].click();
      options[2].click();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([null!, 'pizza-1', null!]);
    });

    it('should select all options when pressing ctrl + a', () => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      expect(testInstance.control.value).toBeFalsy();
      expect(options.every((option) => option.selected)).toBe(false);

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent('keydown', A, undefined, { control: true });
      dispatchEvent(selectElement, event);
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

      const event = createKeyboardEvent('keydown', A, undefined, { control: true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual([
        'sandwich-3',
        'chips-4',
        'eggs-5',
        'pasta-6',
        'sushi-7',
      ]);
    });

    it('should select all options when pressing ctrl + a when some options are selected', () => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      options[0].select();
      fixture.detectChanges();

      expect(testInstance.control.value).toEqual(['steak-0']);
      expect(options.some((option) => option.selected)).toBe(true);

      fixture.componentInstance.select.open();
      fixture.detectChanges();

      const event = createKeyboardEvent('keydown', A, undefined, { control: true });
      dispatchEvent(selectElement, event);
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
    });

    it('should deselect all options with ctrl + a if all options are selected', () => {
      const selectElement = fixture.nativeElement.querySelector('sbb-select');
      const options = fixture.componentInstance.options.toArray();

      options.forEach((option) => option.select());
      fixture.detectChanges();

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

      const event = createKeyboardEvent('keydown', A, undefined, { control: true });
      dispatchEvent(selectElement, event);
      fixture.detectChanges();

      expect(options.some((option) => option.selected)).toBe(false);
      expect(testInstance.control.value).toEqual([]);
    });

    it('should not throw when selecting a large amount of options', fakeAsync(() => {
      fixture.destroy();

      const lotsOfOptionsFixture = TestBed.createComponent(MultiSelectWithLotsOfOptions);

      expect(() => {
        lotsOfOptionsFixture.componentInstance.checkAll();
        lotsOfOptionsFixture.detectChanges();
        flush();
      }).not.toThrow();
    }));

    it('should be able to programmatically set an array with duplicate values', () => {
      testInstance.foods = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'pizza-1', viewValue: 'Pizza' },
      ];
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      testInstance.control.setValue(['steak-0', 'pizza-1', 'pizza-1', 'pizza-1']);
      fixture.detectChanges();

      select.click();
      fixture.detectChanges();

      const optionNodes = Array.from(overlayContainerElement.querySelectorAll('sbb-option'));
      const optionInstances = testInstance.options.toArray();

      expect(optionNodes.map((node) => node.classList.contains('sbb-selected'))).toEqual([
        true,
        true,
        true,
        true,
        false,
        false,
      ]);

      expect(optionInstances.map((instance) => instance.selected)).toEqual([
        true,
        true,
        true,
        true,
        false,
        false,
      ]);
    });

    it('should update the option selected state if the same array is mutated and passed back in', () => {
      const value: string[] = [];
      select.click();
      testInstance.control.setValue(value);
      fixture.detectChanges();

      const optionNodes = Array.from<HTMLElement>(
        overlayContainerElement.querySelectorAll('sbb-option'),
      );
      const optionInstances = testInstance.options.toArray();

      expect(optionNodes.some((option) => option.classList.contains('sbb-selected'))).toBe(false);
      expect(optionInstances.some((option) => option.selected)).toBe(false);

      value.push('eggs-5');
      testInstance.control.setValue(value);
      fixture.detectChanges();

      expect(optionNodes[5].classList).toContain('sbb-selected');
      expect(optionInstances[5].selected).toBe(true);
    });
  });

  it('should be able to provide default values through an injection token', fakeAsync(() => {
    configureSbbSelectTestingModule(
      [NgModelSelect],
      [
        {
          provide: SBB_SELECT_CONFIG,
          useValue: {
            typeaheadDebounceInterval: 1337,
            overlayPanelClass: 'test-panel-class',
          } as SbbSelectConfig,
        },
      ],
    );
    const fixture = TestBed.createComponent(NgModelSelect);
    fixture.detectChanges();
    const select = fixture.componentInstance.select;
    select.open();
    fixture.detectChanges();
    flush();

    expect(select.typeaheadDebounceInterval).toBe(1337);
    expect(document.querySelector('.cdk-overlay-pane')?.classList).toContain('test-panel-class');
  }));

  it('should not not throw if the select is inside an ng-container with ngIf', () => {
    configureSbbSelectTestingModule([SelectInNgContainer]);
    const fixture = TestBed.createComponent(SelectInNgContainer);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('page up/down with disabled options', () => {
    let fixture: ComponentFixture<BasicSelectWithFirstAndLastOptionDisabled>;
    let host: HTMLElement;

    beforeEach(waitForAsync(() =>
      configureSbbSelectTestingModule([BasicSelectWithFirstAndLastOptionDisabled])));

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(BasicSelectWithFirstAndLastOptionDisabled);

      fixture.detectChanges();
      fixture.componentInstance.select.open();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      host = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
    }));

    it('should scroll to the second one pressing PAGE_UP, because the first one is disabled', fakeAsync(() => {
      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(1);

      dispatchKeyboardEvent(host, 'keydown', PAGE_UP);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(1);

      dispatchKeyboardEvent(host, 'keydown', PAGE_UP);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(1);
    }));

    it('should scroll by PAGE_DOWN to the one before the last, because last one is disabled', fakeAsync(() => {
      dispatchKeyboardEvent(host, 'keydown', PAGE_DOWN);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(6);

      dispatchKeyboardEvent(host, 'keydown', PAGE_DOWN);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(6);
    }));
  });

  describe('sbb-form-field integration', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([BasicSelect])));

    let fixture: ComponentFixture<BasicSelect>;
    let selectComponent: SbbSelect;

    beforeEach(() => {
      fixture = TestBed.createComponent(BasicSelect);
      fixture.detectChanges();
      selectComponent = fixture.componentInstance.select;
    });

    it('should forward focus and open panel when clicking sbb-form-field label', () => {
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

  describe('readonly', () => {
    beforeEach(waitForAsync(() => configureSbbSelectTestingModule([SelectReadonly])));

    let fixture: ComponentFixture<SelectReadonly>;
    let select: HTMLElement;
    let selectComponent: SbbSelect;

    beforeEach(() => {
      fixture = TestBed.createComponent(SelectReadonly);
      fixture.detectChanges();
      select = fixture.debugElement.query(By.css('sbb-select'))!.nativeElement;
      selectComponent = fixture.debugElement.query(By.directive(SbbSelect)).componentInstance;
    });

    it(`should have sbb-readonly class`, fakeAsync(() => {
      expect(select.classList).toContain('sbb-readonly');
    }));

    it(`should display '-' as placeholder`, fakeAsync(() => {
      expect(select.querySelector('.sbb-select-placeholder')!.textContent!.trim()).toBe('-');
    }));

    it(`should hide arrow`, fakeAsync(() => {
      expect(getComputedStyle(select.querySelector('.sbb-select-arrow-icon')!).display).toBe(
        'none',
      );
    }));

    it(`should remove focusability`, fakeAsync(() => {
      expect(select.getAttribute('tabindex')).toBe('-1');
    }));

    it(`should prevent opening panel by keyboard`, fakeAsync(() => {
      dispatchKeyboardEvent(select, 'keydown', SPACE);
      fixture.detectChanges();

      expect(selectComponent.panelOpen).toBe(false);
    }));

    it(`should prevent opening panel programmatically`, fakeAsync(() => {
      selectComponent.open();
      fixture.detectChanges();

      expect(selectComponent.panelOpen).toBe(false);
    }));

    it(`should prevent opening panel by click`, fakeAsync(() => {
      select.click();
      fixture.detectChanges();

      expect(selectComponent.panelOpen).toBe(false);
    }));
  });
});

@Component({
  selector: 'basic-select',
  template: `
    <div [style.height.px]="heightAbove"></div>
    <sbb-form-field>
      @if (hasLabel) {
        <sbb-label>Select a food</sbb-label>
      }
      <sbb-select
        placeholder="Food"
        [formControl]="control"
        [required]="isRequired"
        [tabIndex]="tabIndexOverride"
        [aria-describedby]="ariaDescribedBy"
        [aria-label]="ariaLabel"
        [aria-labelledby]="ariaLabelledby"
        [panelClass]="panelClass"
        [typeaheadDebounceInterval]="typeaheadDebounceInterval"
      >
        @for (food of foods; track food) {
          <sbb-option [value]="food.value" [disabled]="food.disabled">
            {{ food.viewValue }}
          </sbb-option>
        }
      </sbb-select>
      @if (hint) {
        <sbb-hint>{{ hint }}</sbb-hint>
      }
    </sbb-form-field>
    <div [style.height.px]="heightBelow"></div>
  `,
  standalone: false,
})
class BasicSelectWithFirstAndLastOptionDisabled {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak', disabled: true },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: 'sandwich-3', viewValue: 'Sandwich' },
    { value: 'chips-4', viewValue: 'Chips' },
    { value: 'eggs-5', viewValue: 'Eggs' },
    { value: 'pasta-6', viewValue: 'Pasta' },
    { value: 'sushi-7', viewValue: 'Sushi', disabled: true },
  ];
  control = new FormControl<string | null>(null);
  isRequired: boolean;
  heightAbove = 0;
  heightBelow = 0;
  hasLabel = true;
  hint: string;
  tabIndexOverride: number;
  ariaDescribedBy: string;
  ariaLabel: string;
  ariaLabelledby: string;
  panelClass = ['custom-one', 'custom-two'];
  typeaheadDebounceInterval: number;

  @ViewChild(SbbSelect, { static: true }) select: SbbSelect;
  @ViewChildren(SbbOption) options: QueryList<SbbOption>;
}
