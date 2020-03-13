import { CommonModule } from '@angular/common';
import { Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import { RadioChange } from '@sbb-esta/angular-core/radio-button';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { DatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { Observable, of } from 'rxjs';

import { ToggleOptionComponent } from '../toggle-option/toggle-option.component';
import { ToggleModule } from '../toggle.module';

// tslint:disable:i18n
@Component({
  selector: 'sbb-toggle-test-reactive',
  template: `
    <form [formGroup]="form" novalidate>
      <sbb-toggle aria-labelledby="group_label_2" formControlName="test">
        <sbb-toggle-option
          #options
          *ngFor="let option of toggleOptions | async; let i = index"
          [infoText]="i === 0 ? 'info text' : undefined"
          [label]="option.label"
          [value]="option.value"
        >
          <ng-container *ngIf="i === 0">
            <sbb-icon-arrow-right *sbbIcon></sbb-icon-arrow-right>
          </ng-container>
          <ng-container *ngIf="i === 1">
            <sbb-icon-arrows-right-left *sbbIcon></sbb-icon-arrows-right-left>
          </ng-container>
          <sbb-field mode="long" *ngIf="i === 1">
            <sbb-label for="name1">Select date</sbb-label>
            <sbb-datepicker>
              <input sbbDateInput type="text" />
            </sbb-datepicker>
          </sbb-field>
        </sbb-toggle-option>
      </sbb-toggle>
    </form>
  `
})
class ToggleReactiveTestComponent implements OnInit {
  modelReactive = 'Option_2';
  @ContentChildren('options') options: QueryList<ToggleOptionComponent>;

  constructor() {}

  form = new FormGroup({
    test: new FormControl()
  });

  toggleOptions: Observable<any> = of([
    {
      label: 'Einfache Fahrt',
      value: 'Option_1'
    },
    {
      label: 'Hin- und Rückfahrt',
      value: 'Option_2'
    }
  ]);

  ngOnInit() {
    this.form.get('test').valueChanges.subscribe(val => {
      this.modelReactive = val;
    });
  }
}

@Component({
  selector: 'sbb-toggle-test-reactive',
  template: `
    <form [formGroup]="form" novalidate>
      <sbb-toggle aria-labelledby="group_label_2" formControlName="test">
        <sbb-toggle-option
          #options
          *ngFor="let option of toggleOptions | async; let i = index"
          [infoText]="i === 0 ? 'info text' : undefined"
          [label]="option.label"
          [value]="option.value"
        >
          <ng-container *ngIf="i === 0">
            <sbb-icon-arrow-right *sbbIcon></sbb-icon-arrow-right>
          </ng-container>
          <ng-container *ngIf="i === 1">
            <sbb-icon-arrows-right-left *sbbIcon></sbb-icon-arrows-right-left>
          </ng-container>
          <sbb-field mode="long" *ngIf="i === 1">
            <sbb-label for="name1">Select date</sbb-label>
            <sbb-datepicker>
              <input sbbDateInput type="text" />
            </sbb-datepicker>
          </sbb-field>
        </sbb-toggle-option>
      </sbb-toggle>
    </form>
  `
})
class ToggleReactiveDefaultValueTestComponent implements OnInit {
  modelReactive = 'Option_2';
  @ContentChildren('options') options: QueryList<ToggleOptionComponent>;

  form = new FormGroup({
    test: new FormControl('Option_2')
  });

  toggleOptions: Observable<any> = of([
    {
      label: 'Einfache Fahrt',
      value: 'Option_1'
    },
    {
      label: 'Hin- und Rückfahrt',
      value: 'Option_2'
    }
  ]);

  ngOnInit() {
    this.form.get('test').valueChanges.subscribe(val => (this.modelReactive = val));
  }
}

@Component({
  selector: 'sbb-toggle-test-template-driven',
  template: `
    <sbb-toggle aria-labelledby="group_label_1" [(ngModel)]="modelValue" name="test-toggle-2">
      <sbb-toggle-option
        *ngFor="let option of toggleOptions | async; let i = index"
        [label]="option.label"
        [value]="option.value"
      >
        <ng-container *ngIf="i === 0">
          <sbb-icon-arrow-right *sbbIcon></sbb-icon-arrow-right>
        </ng-container>
        <ng-container *ngIf="i === 1">
          <sbb-icon-arrows-right-left *sbbIcon></sbb-icon-arrows-right-left>
        </ng-container>
        <sbb-field mode="long" *ngIf="i === 0">
          <sbb-label for="name1">Select date</sbb-label>
          <sbb-datepicker>
            <input sbbDateInput type="text" />
          </sbb-datepicker>
        </sbb-field>
        <p *ngIf="i === 1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </sbb-toggle-option>
    </sbb-toggle>
  `
})
class ToggleTemplateDrivenTestComponent {
  @ContentChildren('options') options: QueryList<ToggleOptionComponent>;

  constructor() {}

  toggleOptions: Observable<any> = of([
    {
      label: 'Einfache Fahrt',
      value: 'Option_1'
    },
    {
      label: 'Hin- und Rückfahrt',
      value: 'Option_2'
    }
  ]);
}

@Component({
  selector: 'sbb-toggle-test-simple-case',
  template: `
    <sbb-toggle aria-labelledby="group_label_3" (change)="change($event)">
      <sbb-toggle-option label="2. Klasse" infoText="- CHF 5.60" [value]="{ myObjectValue: true }">
      </sbb-toggle-option>
      <sbb-toggle-option
        label="1. Klasse"
        infoText="+ CHF 39.00"
        [value]="{ myObjectValue: false }"
      >
      </sbb-toggle-option>
    </sbb-toggle>
  `
})
class ToggleSimpleCaseTestComponent {
  @ContentChildren('options') options: QueryList<ToggleOptionComponent>;

  change(evt: RadioChange) {}
}

describe('ToggleComponent case reactive using mock component', () => {
  let componentTest: ToggleReactiveTestComponent;
  let fixtureTest: ComponentFixture<ToggleReactiveTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ToggleModule,
        CommonModule,
        IconCollectionModule,
        DatepickerModule,
        FieldModule,
        ReactiveFormsModule,
        IconDirectiveModule
      ],
      declarations: [ToggleReactiveTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(ToggleReactiveTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('component test is created', () => {
    expect(componentTest).toBeTruthy();
  });

  it('it verifies that first toggle button is checked', () => {
    fixtureTest.detectChanges();

    const toggleOptionReferenceValue = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option-button-inner > input')
    );

    const toggleOption1ValueElement = toggleOptionReferenceValue[0].nativeElement;

    expect(toggleOption1ValueElement.attributes.getNamedItem('aria-checked').value).toBe('true');
    expect(toggleOption1ValueElement.value).toBe('Option_1');
  });

  it('it verifies that first toggle button has class sbb-toggle-option-selected', () => {
    const toggleOptionsReference = fixtureTest.debugElement.queryAll(By.css('.sbb-toggle-option'));
    fixtureTest.detectChanges();
    const toggleOption1Element = toggleOptionsReference[0].nativeElement;

    expect(toggleOption1Element.attributes['class'].value).toContain('sbb-toggle-option-selected');
  });

  it('it verifies the click on the second toggle option selected ', () => {
    const toggleOptionsReference = fixtureTest.debugElement.queryAll(By.css('.sbb-toggle-option'));

    const toggleOptionsInputReference = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option input')
    );

    fixtureTest.detectChanges();
    const toggleOption2 = toggleOptionsInputReference[1].nativeElement;

    toggleOption2.click();
    fixtureTest.detectChanges();

    expect(toggleOption2.attributes['aria-expanded'].value).toBe('true');
    expect(toggleOption2.attributes['aria-checked'].value).toBe('true');

    const toggleOption2Component = toggleOptionsReference[1].nativeElement;

    expect(toggleOption2.value).toBe('Option_2');
    expect(toggleOption2Component.attributes['class'].value).toContain(
      'sbb-toggle-option-selected'
    );
  });

  it('it verifies the text content into a toggle button to click on another toggle button', () => {
    fixtureTest.detectChanges();

    const toggleOptionsInputReference = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option input')
    );

    const toggleOptionsContentReference = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option > label > div > span > .sbb-toggle-option-button-info-text ')
    );

    fixtureTest.detectChanges();
    const toggleOption2 = toggleOptionsInputReference[1].nativeElement;

    toggleOption2.click();
    fixtureTest.detectChanges();

    fixtureTest.detectChanges();
    const toggleOptions1Content = toggleOptionsContentReference[0].nativeElement;

    expect(toggleOptions1Content.textContent).toContain('info text');
  });
});

describe('ToggleComponent case reactive with default value using mock component', () => {
  let componentTest: ToggleReactiveDefaultValueTestComponent;
  let fixtureTest: ComponentFixture<ToggleReactiveDefaultValueTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ToggleModule,
        CommonModule,
        IconCollectionModule,
        DatepickerModule,
        FieldModule,
        ReactiveFormsModule,
        IconDirectiveModule
      ],
      declarations: [ToggleReactiveDefaultValueTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(ToggleReactiveDefaultValueTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('component test is created', () => {
    expect(componentTest).toBeTruthy();
  });

  it('it verifies that second toggle button is checked', () => {
    fixtureTest.detectChanges();

    const toggleOptionReferenceValue = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option-button-inner > input')
    );

    const toggleOption2ValueElement = toggleOptionReferenceValue[1].nativeElement;
    console.log(toggleOption2ValueElement);

    expect(toggleOption2ValueElement.attributes.getNamedItem('aria-checked').value).toBe('true');
    expect(toggleOption2ValueElement.value).toBe('Option_2');
  });
});

describe('ToggleComponent case template driven using mock component', () => {
  let componentTest: ToggleTemplateDrivenTestComponent;
  let fixtureTest: ComponentFixture<ToggleTemplateDrivenTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ToggleModule,
        CommonModule,
        IconCollectionModule,
        DatepickerModule,
        FieldModule,
        FormsModule
      ],
      declarations: [ToggleTemplateDrivenTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(ToggleTemplateDrivenTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('component test is created', async(async () => {
    expect(componentTest).toBeTruthy();
  }));

  it('it verifies if the first toggle option is selected ', () => {
    fixtureTest.detectChanges();

    const toggleOption1ReferenceValue = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option-button-inner > input')
    );

    const toggleOption1ValueElement = toggleOption1ReferenceValue[0].nativeElement;

    expect(toggleOption1ValueElement.value).toBe('Option_1');
  });

  it('it verifies the click on the second toggle option selected ', () => {
    const toggleOptionsReference = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option-button-inner > input')
    );

    const toggleOption2 = toggleOptionsReference[1];
    toggleOption2.nativeElement.click();

    fixtureTest.detectChanges();

    expect(toggleOption2.attributes['aria-expanded']).toBeTruthy();
    expect(toggleOption2.attributes['aria-checked']).toBeTruthy();
    expect(toggleOption2.nativeElement.value).toBe('Option_2');

    const toggleOptionsComponent = fixtureTest.debugElement.queryAll(By.css('.sbb-toggle-option'));

    const toggleOptionsComponent2 = toggleOptionsComponent[1].nativeElement;

    expect(toggleOptionsComponent2.attributes['class'].value).toContain(
      'sbb-toggle-option-selected'
    );
  });
});

describe('ToggleComponent simple case using mock component', () => {
  let componentTest: ToggleSimpleCaseTestComponent;
  let fixtureTest: ComponentFixture<ToggleSimpleCaseTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ToggleModule, CommonModule, IconCollectionModule],
      declarations: [ToggleSimpleCaseTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(ToggleSimpleCaseTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('component test is created', async(async () => {
    expect(componentTest).toBeTruthy();
  }));

  it('it verifies the text content in the first toggle button selected', () => {
    const toggleOptionsComponentReference = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option')
    );

    const toggleOptions1Component = toggleOptionsComponentReference[0].nativeElement;
    expect(toggleOptions1Component.attributes['infotext'].value).toBe('- CHF 5.60');
  });

  it('it verifies the click on the second toggle button is selected', () => {
    const toggleOptionsReference = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option-button-inner > input')
    );

    const toggleOption2 = toggleOptionsReference[1];
    toggleOption2.nativeElement.click();

    fixtureTest.detectChanges();

    expect(toggleOption2.attributes['aria-checked']).toBeTruthy();

    const toggleOptionsComponent = fixtureTest.debugElement.queryAll(By.css('.sbb-toggle-option'));

    const toggleOptionsComponent2 = toggleOptionsComponent[1].nativeElement;

    expect(toggleOptionsComponent2.attributes['class'].value).toContain(
      'sbb-toggle-option-selected'
    );
  });
});
