import { CommonModule } from '@angular/common';
import { Component, ContentChildren, QueryList } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';
import { SbbRadioChange } from '@sbb-esta/angular-core/radio-button';
import { SbbDatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { Observable, of } from 'rxjs';

import { SbbToggleOption } from '../toggle-option/toggle-option.component';
import { SbbToggleModule } from '../toggle.module';

@Component({
  selector: 'sbb-toggle-test-reactive',
  template: `
    <form [formGroup]="form" novalidate>
      <sbb-toggle aria-labelledby="group_label_2" formControlName="test">
        <sbb-toggle-option
          *ngFor="let option of toggleOptions | async; let i = index"
          [infoText]="i === 0 ? 'info text' : undefined"
          [label]="option.label"
          [value]="option.value"
        >
          <ng-container *ngIf="i === 0">
            <sbb-icon svgIcon="kom:arrow-right-small" *sbbIcon></sbb-icon>
          </ng-container>
          <ng-container *ngIf="i === 1">
            <sbb-icon svgIcon="kom:arrows-right-left-small" *sbbIcon></sbb-icon>
          </ng-container>
          <sbb-form-field class="sbb-form-field-long" *ngIf="i === 1">
            <sbb-label>Select date</sbb-label>
            <sbb-datepicker>
              <input sbbDateInput sbbInput type="text" />
            </sbb-datepicker>
          </sbb-form-field>
        </sbb-toggle-option>
      </sbb-toggle>
    </form>
  `,
})
class ToggleReactiveTestComponent {
  toggleOptions: Observable<any> = of([
    {
      label: 'Einfache Fahrt',
      value: 'Option_1',
    },
    {
      label: 'Hin- und Rückfahrt',
      value: 'Option_2',
    },
  ]);

  form = new FormGroup({
    test: new FormControl(),
  });
}

@Component({
  selector: 'sbb-toggle-test-reactive',
  template: `
    <form [formGroup]="form" novalidate>
      <sbb-toggle aria-labelledby="group_label_2" formControlName="test">
        <sbb-toggle-option
          *ngFor="let option of toggleOptions | async; let i = index"
          [infoText]="i === 0 ? 'info text' : undefined"
          [label]="option.label"
          [value]="option.value"
        >
          <ng-container *ngIf="i === 0">
            <sbb-icon svgIcon="kom:arrow-right-small" *sbbIcon></sbb-icon>
          </ng-container>
          <ng-container *ngIf="i === 1">
            <sbb-icon svgIcon="kom:arrows-right-left-small" *sbbIcon></sbb-icon>
          </ng-container>
          <sbb-form-field class="sbb-form-field-long" *ngIf="i === 1">
            <sbb-label>Select date</sbb-label>
            <sbb-datepicker>
              <input sbbDateInput sbbInput type="text" />
            </sbb-datepicker>
          </sbb-form-field>
        </sbb-toggle-option>
      </sbb-toggle>
    </form>
  `,
})
class ToggleReactiveDefaultValueTestComponent {
  form = new FormGroup({
    test: new FormControl('Option_2'),
  });

  toggleOptions: Observable<any> = of([
    {
      label: 'Einfache Fahrt',
      value: 'Option_1',
    },
    {
      label: 'Hin- und Rückfahrt',
      value: 'Option_2',
    },
  ]);
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
          <sbb-icon svgIcon="kom:arrow-right-small" *sbbIcon></sbb-icon>
        </ng-container>
        <ng-container *ngIf="i === 1">
          <sbb-icon svgIcon="kom:arrows-right-left-small" *sbbIcon></sbb-icon>
        </ng-container>
        <sbb-form-field class="sbb-form-field-long" *ngIf="i === 0">
          <sbb-label>Select date</sbb-label>
          <sbb-datepicker>
            <input sbbDateInput sbbInput type="text" />
          </sbb-datepicker>
        </sbb-form-field>
        <p *ngIf="i === 1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </sbb-toggle-option>
    </sbb-toggle>
  `,
})
class ToggleTemplateDrivenTestComponent {
  modelValue: any;

  toggleOptions: Observable<any> = of([
    {
      label: 'Einfache Fahrt',
      value: 'Option_1',
    },
    {
      label: 'Hin- und Rückfahrt',
      value: 'Option_2',
    },
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
  `,
})
class ToggleSimpleCaseTestComponent {
  @ContentChildren('options') options: QueryList<SbbToggleOption>;

  change(evt: SbbRadioChange) {}
}
@Component({
  selector: 'sbb-toggle-only-second-with-content',
  template: `
    <sbb-toggle aria-label="Choose journey" [formControl]="journey">
      <sbb-toggle-option infoText="info text" label="Single Journey" value="SingleJourney">
        <sbb-icon svgIcon="kom:arrow-right-small" *sbbIcon></sbb-icon>
      </sbb-toggle-option>
      <sbb-toggle-option label="Single and return journey" value="ReturnJourney">
        <sbb-icon svgIcon="kom:arrows-right-left-small" *sbbIcon></sbb-icon>
        <p class="content">Content</p>
      </sbb-toggle-option>
    </sbb-toggle>
  `,
})
class ToggleOnlySecondWithContentTestComponent {
  journey = new FormControl('ReturnJourney');
}

describe('SbbToggle case reactive using mock component', () => {
  let componentTest: ToggleReactiveTestComponent;
  let fixtureTest: ComponentFixture<ToggleReactiveTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbToggleModule,
          CommonModule,
          SbbIconModule,
          SbbDatepickerModule,
          SbbFormFieldModule,
          ReactiveFormsModule,
          SbbIconDirectiveModule,
          SbbIconTestingModule,
        ],
        declarations: [ToggleReactiveTestComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(ToggleReactiveTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('component test is created', () => {
    expect(componentTest).toBeTruthy();
  });

  it('it verifies that first toggle button is checked when there is no default value set', async () => {
    await fixtureTest.whenStable();
    fixtureTest.detectChanges();

    const toggleOptionReferenceValue = fixtureTest.debugElement.queryAll(By.css('input'));

    const toggleOption1ValueElement = toggleOptionReferenceValue[0].nativeElement;

    expect(toggleOption1ValueElement.attributes.getNamedItem('aria-checked').value).toBe('true');
    expect(toggleOption1ValueElement.value).toBe('Option_1');
    expect(fixtureTest.componentInstance.form.get('test')?.value).toBe('Option_1');
  });

  it('it verifies that first toggle button has class sbb-toggle-option-selected', async () => {
    await fixtureTest.whenStable();
    fixtureTest.detectChanges();

    const toggleOptionsReference = fixtureTest.debugElement.queryAll(By.directive(SbbToggleOption));
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
      By.css('.sbb-toggle-option-button-info-text ')
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

describe('SbbToggle case reactive with default value using mock component', () => {
  let componentTest: ToggleReactiveDefaultValueTestComponent;
  let fixtureTest: ComponentFixture<ToggleReactiveDefaultValueTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbToggleModule,
          CommonModule,
          SbbIconModule,
          SbbDatepickerModule,
          SbbFormFieldModule,
          ReactiveFormsModule,
          SbbIconDirectiveModule,
          SbbIconTestingModule,
        ],
        declarations: [ToggleReactiveDefaultValueTestComponent],
      }).compileComponents();
    })
  );

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

    const toggleOptionReferenceValue = fixtureTest.debugElement.queryAll(By.css('input'));

    const toggleOption2ValueElement = toggleOptionReferenceValue[1].nativeElement;

    expect(toggleOption2ValueElement.attributes.getNamedItem('aria-checked').value).toBe('true');
    expect(toggleOption2ValueElement.value).toBe('Option_2');
  });
});

describe('SbbToggle case template driven using mock component', () => {
  let componentTest: ToggleTemplateDrivenTestComponent;
  let fixtureTest: ComponentFixture<ToggleTemplateDrivenTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbToggleModule,
          CommonModule,
          SbbIconModule,
          SbbDatepickerModule,
          SbbFormFieldModule,
          FormsModule,
          SbbIconTestingModule,
        ],
        declarations: [ToggleTemplateDrivenTestComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(ToggleTemplateDrivenTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it(
    'component test is created',
    waitForAsync(async () => {
      expect(componentTest).toBeTruthy();
    })
  );

  it('it verifies if the first toggle option is selected ', () => {
    fixtureTest.detectChanges();

    const toggleOption1ReferenceValue = fixtureTest.debugElement.queryAll(By.css('input'));

    const toggleOption1ValueElement = toggleOption1ReferenceValue[0].nativeElement;

    expect(toggleOption1ValueElement.value).toBe('Option_1');
  });

  it('it verifies the click on the second toggle option selected ', () => {
    const toggleOptionsReference = fixtureTest.debugElement.queryAll(By.css('input'));

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

describe('SbbToggle simple case using mock component', () => {
  let componentTest: ToggleSimpleCaseTestComponent;
  let fixtureTest: ComponentFixture<ToggleSimpleCaseTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbToggleModule, CommonModule, SbbIconTestingModule],
        declarations: [ToggleSimpleCaseTestComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(ToggleSimpleCaseTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it(
    'component test is created',
    waitForAsync(async () => {
      expect(componentTest).toBeTruthy();
    })
  );

  it('it verifies the text content in the first toggle button selected', () => {
    const toggleOptionsComponentReference = fixtureTest.debugElement.queryAll(
      By.css('.sbb-toggle-option')
    );

    const toggleOptions1Component = toggleOptionsComponentReference[0].nativeElement;
    expect(toggleOptions1Component.attributes['infotext'].value).toBe('- CHF 5.60');
  });

  it('it verifies the click on the second toggle button is selected', () => {
    const toggleOptionsReference = fixtureTest.debugElement.queryAll(By.css('input'));

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

describe('SbbToggle case with only toggle content for second toggle', () => {
  let fixtureTest: ComponentFixture<ToggleOnlySecondWithContentTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbToggleModule,
          CommonModule,
          ReactiveFormsModule,
          SbbIconModule,
          SbbIconDirectiveModule,
          SbbIconTestingModule,
        ],
        declarations: [ToggleOnlySecondWithContentTestComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(ToggleOnlySecondWithContentTestComponent);
    fixtureTest.detectChanges();
  });

  it('it verifies that second toggle is selected and showing content', async () => {
    await fixtureTest.whenStable();
    fixtureTest.detectChanges();
    const secondToggleOption = fixtureTest.debugElement.queryAll(By.directive(SbbToggleOption))[1];

    expect(fixtureTest.debugElement.query(By.css('.content'))).toBeTruthy();
    expect(secondToggleOption.nativeElement.attributes['class'].value).toContain(
      'sbb-toggle-option-selected'
    );
  });

  it('it verifies that no content is shown when switching to first toggle', async () => {
    await fixtureTest.whenStable();
    fixtureTest.detectChanges();
    const firstToggleOption = fixtureTest.debugElement.queryAll(By.directive(SbbToggleOption))[0];

    firstToggleOption.query(By.css('.sbb-toggle-option-button')).nativeElement.click();
    fixtureTest.detectChanges();

    expect(fixtureTest.debugElement.query(By.css('.content'))).toBeFalsy();
    expect(firstToggleOption.nativeElement.attributes['class'].value).toContain(
      'sbb-toggle-option-selected'
    );
  });
});
