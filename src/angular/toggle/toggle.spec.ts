import { CommonModule } from '@angular/common';
import { Component, ContentChildren, QueryList } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbRadioChange } from '@sbb-esta/angular/radio-button';
import { Observable, of } from 'rxjs';

import { SbbToggleOption } from './toggle-option';
import { SbbToggleModule } from './toggle.module';

@Component({
  selector: 'sbb-toggle-test-reactive',
  template: `
    <form [formGroup]="form" novalidate>
      <sbb-toggle aria-labelledby="group_label_2" formControlName="test">
        @for (option of toggleOptions | async; track option; let i = $index) {
          <sbb-toggle-option
            [subtitle]="i === 0 ? 'info text' : undefined"
            [label]="option.label"
            [value]="option.value"
          >
            @if (i === 0) {
              <sbb-toggle-icon>
                <sbb-icon svgIcon="arrow-right-small"></sbb-icon>
              </sbb-toggle-icon>
            }
            @if (i === 1) {
              <sbb-toggle-icon>
                <sbb-icon svgIcon="arrows-right-left-small"></sbb-icon>
              </sbb-toggle-icon>
            }
            <sbb-toggle-details>
              @if (i === 1) {
                <sbb-form-field class="sbb-form-field-long">
                  <sbb-label>Select date</sbb-label>
                  <sbb-datepicker>
                    <input sbbDateInput sbbInput type="text" />
                  </sbb-datepicker>
                </sbb-form-field>
              }
            </sbb-toggle-details>
          </sbb-toggle-option>
        }
      </sbb-toggle>
    </form>
  `,
})
class ToggleReactiveTestComponent {
  rawOptions = [
    {
      label: 'Einfache Fahrt',
      value: 'Option_1',
    },
    {
      label: 'Hin- und Rückfahrt',
      value: 'Option_2',
    },
  ];
  toggleOptions: Observable<any> = of(this.rawOptions);

  form = new FormGroup({
    test: new FormControl(this.rawOptions[0].value),
  });
}

@Component({
  selector: 'sbb-toggle-test-reactive',
  template: `
    <form [formGroup]="form" novalidate>
      <sbb-toggle aria-labelledby="group_label_2" formControlName="test">
        @for (option of toggleOptions | async; track option; let i = $index) {
          <sbb-toggle-option
            [subtitle]="i === 0 ? 'info text' : undefined"
            [label]="option.label"
            [value]="option.value"
          >
            @if (i === 0) {
              <sbb-toggle-icon>
                <sbb-icon svgIcon="arrow-right-small"></sbb-icon>
              </sbb-toggle-icon>
            }
            @if (i === 1) {
              <sbb-toggle-icon>
                <sbb-icon svgIcon="arrows-right-left-small"></sbb-icon>
              </sbb-toggle-icon>
            }
            <sbb-toggle-details>
              @if (i === 1) {
                <sbb-form-field class="sbb-form-field-long">
                  <sbb-label>Select date</sbb-label>
                  <sbb-datepicker>
                    <input sbbDateInput sbbInput type="text" />
                  </sbb-datepicker>
                </sbb-form-field>
              }
            </sbb-toggle-details>
          </sbb-toggle-option>
        }
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
      @for (option of toggleOptions | async; track option; let i = $index) {
        <sbb-toggle-option [label]="option.label" [value]="option.value">
          @if (i === 0) {
            <sbb-toggle-icon>
              <sbb-icon svgIcon="arrow-right-small"></sbb-icon>
            </sbb-toggle-icon>
          }
          @if (i === 1) {
            <sbb-toggle-icon>
              <sbb-icon svgIcon="arrows-right-left-small"></sbb-icon>
            </sbb-toggle-icon>
          }
          <sbb-toggle-details>
            @if (i === 0) {
              <sbb-form-field class="sbb-form-field-long">
                <sbb-label>Select date</sbb-label>
                <sbb-datepicker>
                  <input sbbDateInput sbbInput type="text" />
                </sbb-datepicker>
              </sbb-form-field>
            }
            @if (i === 1) {
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            }
          </sbb-toggle-details>
        </sbb-toggle-option>
      }
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
      <sbb-toggle-option [value]="{ myObjectValue: true }">
        <sbb-toggle-label>2. Klasse</sbb-toggle-label>
        <sbb-toggle-subtitle>- CHF 5.60</sbb-toggle-subtitle>
      </sbb-toggle-option>
      <sbb-toggle-option
        label="1. Klasse"
        subtitle="+ CHF 39.00"
        [value]="{ myObjectValue: false }"
      >
      </sbb-toggle-option>
    </sbb-toggle>
  `,
})
class ToggleSimpleCaseTestComponent {
  @ContentChildren('options') options: QueryList<SbbToggleOption>;

  change(_evt: SbbRadioChange) {}
}
@Component({
  selector: 'sbb-toggle-only-second-with-content',
  template: `
    <sbb-toggle aria-label="Choose journey" [formControl]="journey">
      <sbb-toggle-option subtitle="info text" label="Single Journey" value="SingleJourney">
        <sbb-toggle-icon>
          <sbb-icon svgIcon="arrow-right-small"></sbb-icon>
        </sbb-toggle-icon>
      </sbb-toggle-option>
      <sbb-toggle-option label="Single and return journey" value="ReturnJourney">
        <sbb-toggle-icon>
          <sbb-icon svgIcon="arrows-right-left-small"></sbb-icon>
        </sbb-toggle-icon>
        <sbb-toggle-details>
          <p class="content">Content</p>
        </sbb-toggle-details>
      </sbb-toggle-option>
    </sbb-toggle>
  `,
})
class ToggleOnlySecondWithContentTestComponent {
  journey = new FormControl('ReturnJourney');
}

describe('SbbToggle', () => {
  describe('case reactive using mock component', () => {
    let fixtureTest: ComponentFixture<ToggleReactiveTestComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbToggleModule,
          CommonModule,
          NoopAnimationsModule,
          SbbIconModule,
          SbbDatepickerModule,
          SbbInputModule,
          ReactiveFormsModule,
          SbbIconTestingModule,
        ],
        declarations: [ToggleReactiveTestComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixtureTest = TestBed.createComponent(ToggleReactiveTestComponent);
      fixtureTest.detectChanges();
    });

    it('it verifies that first toggle button is checked when there is no default value set', async () => {
      await fixtureTest.whenStable();
      fixtureTest.detectChanges();

      const toggleOptionReferenceValue = fixtureTest.debugElement.queryAll(By.css('input'));

      const toggleOption1ValueElement = toggleOptionReferenceValue[0].nativeElement;

      expect(toggleOption1ValueElement.checked).toBeTruthy();
      expect(toggleOption1ValueElement.value).toBe('Option_1');
      expect(fixtureTest.componentInstance.form.get('test')?.value).toBe('Option_1');
    });

    it('it verifies that first toggle button has class sbb-toggle-option-selected', async () => {
      fixtureTest.detectChanges();
      await fixtureTest.whenStable();

      const toggleOptionsReference = fixtureTest.debugElement.queryAll(
        By.directive(SbbToggleOption),
      );
      const toggleOption1Element = toggleOptionsReference[0].nativeElement as HTMLElement;

      expect(toggleOption1Element.classList).toContain('sbb-toggle-option-selected');
    });

    it('it verifies the click on the second toggle option selected ', () => {
      const toggleOptionsReference = fixtureTest.debugElement.queryAll(
        By.css('.sbb-toggle-option'),
      );

      const toggleOptionsInputReference = fixtureTest.debugElement.queryAll(
        By.css('.sbb-toggle-option input'),
      );

      fixtureTest.detectChanges();
      const toggleOption2 = toggleOptionsInputReference[1].nativeElement;

      toggleOption2.click();
      fixtureTest.detectChanges();

      expect(toggleOption2.checked).toBeTruthy();
      const toggleOption2Component = toggleOptionsReference[1].nativeElement;

      expect(toggleOption2.value).toBe('Option_2');
      expect(toggleOption2Component.attributes['class'].value).toContain(
        'sbb-toggle-option-selected',
      );
    });

    it('it verifies the text content into a toggle button to click on another toggle button', () => {
      fixtureTest.detectChanges();

      const toggleOptionsInputReference = fixtureTest.debugElement.queryAll(
        By.css('.sbb-toggle-option input'),
      );

      const toggleOptionsContentReference = fixtureTest.debugElement.queryAll(
        By.css('.sbb-toggle-option-button-subtitle '),
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

  describe('case reactive with default value using mock component', () => {
    let fixtureTest: ComponentFixture<ToggleReactiveDefaultValueTestComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbToggleModule,
          CommonModule,
          NoopAnimationsModule,
          SbbIconModule,
          SbbDatepickerModule,
          SbbInputModule,
          ReactiveFormsModule,
          SbbIconTestingModule,
        ],
        declarations: [ToggleReactiveDefaultValueTestComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixtureTest = TestBed.createComponent(ToggleReactiveDefaultValueTestComponent);
      fixtureTest.detectChanges();
    });

    it('it verifies that second toggle button is checked', () => {
      fixtureTest.detectChanges();

      const toggleOptionReferenceValue = fixtureTest.debugElement.queryAll(By.css('input'));

      const toggleOption2ValueElement = toggleOptionReferenceValue[1].nativeElement;

      expect(toggleOption2ValueElement.checked).toBeTruthy();
      expect(toggleOption2ValueElement.value).toBe('Option_2');
    });
  });

  describe('case template driven using mock component', () => {
    let fixtureTest: ComponentFixture<ToggleTemplateDrivenTestComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbToggleModule,
          CommonModule,
          NoopAnimationsModule,
          SbbIconModule,
          SbbDatepickerModule,
          SbbInputModule,
          FormsModule,
          SbbIconTestingModule,
        ],
        declarations: [ToggleTemplateDrivenTestComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixtureTest = TestBed.createComponent(ToggleTemplateDrivenTestComponent);
      fixtureTest.detectChanges();
    });

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

      expect(toggleOption2.properties['checked']).toBeTruthy();
      expect(toggleOption2.nativeElement.value).toBe('Option_2');

      const toggleOptionsComponent = fixtureTest.debugElement.queryAll(
        By.css('.sbb-toggle-option'),
      );

      const toggleOptionsComponent2 = toggleOptionsComponent[1].nativeElement;

      expect(toggleOptionsComponent2.attributes['class'].value).toContain(
        'sbb-toggle-option-selected',
      );
    });
  });

  describe('simple case using mock component', () => {
    let fixtureTest: ComponentFixture<ToggleSimpleCaseTestComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbToggleModule, CommonModule, NoopAnimationsModule, SbbIconTestingModule],
        declarations: [ToggleSimpleCaseTestComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixtureTest = TestBed.createComponent(ToggleSimpleCaseTestComponent);
      fixtureTest.detectChanges();
    });

    it('it verifies the text content in the first toggle button selected', () => {
      const toggleOptionsComponentReference = fixtureTest.debugElement.queryAll(
        By.css('.sbb-toggle-option'),
      );

      const toggleOptions1Component = toggleOptionsComponentReference[0].query(
        By.css('.sbb-toggle-option-button-subtitle'),
      );
      expect(toggleOptions1Component.nativeElement.textContent.trim()).toBe('- CHF 5.60');
    });

    it('it verifies the click on the second toggle button is selected', () => {
      const toggleOptionsReference = fixtureTest.debugElement.queryAll(By.css('input'));

      const toggleOption2 = toggleOptionsReference[1];
      toggleOption2.nativeElement.click();

      fixtureTest.detectChanges();

      expect(toggleOption2.properties['checked']).toBeTruthy();

      const toggleOptionsComponent = fixtureTest.debugElement.queryAll(
        By.css('.sbb-toggle-option'),
      );
      const toggleOptionsComponent2 = toggleOptionsComponent[1].nativeElement;

      expect(toggleOptionsComponent2.attributes['class'].value).toContain(
        'sbb-toggle-option-selected',
      );
    });
  });

  describe('case with only toggle content for second toggle', () => {
    let fixtureTest: ComponentFixture<ToggleOnlySecondWithContentTestComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbToggleModule,
          CommonModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
          SbbIconModule,
          SbbIconTestingModule,
        ],
        declarations: [ToggleOnlySecondWithContentTestComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixtureTest = TestBed.createComponent(ToggleOnlySecondWithContentTestComponent);
      fixtureTest.detectChanges();
    });

    it('it verifies that second toggle is selected and showing content', async () => {
      await fixtureTest.whenStable();
      fixtureTest.detectChanges();
      const secondToggleOption = fixtureTest.debugElement.queryAll(
        By.directive(SbbToggleOption),
      )[1];

      expect(fixtureTest.debugElement.query(By.css('.content'))).toBeTruthy();
      expect(secondToggleOption.nativeElement.attributes['class'].value).toContain(
        'sbb-toggle-option-selected',
      );
    });

    it('it verifies that no content is shown when switching to first toggle', fakeAsync(() => {
      fixtureTest.detectChanges();
      flush();
      fixtureTest.detectChanges();
      const firstToggleOption = fixtureTest.debugElement.queryAll(By.directive(SbbToggleOption))[0];

      firstToggleOption.query(By.css('.sbb-toggle-option-button')).nativeElement.click();
      fixtureTest.detectChanges();
      flush();
      fixtureTest.detectChanges();

      expect(fixtureTest.debugElement.query(By.css('.content'))).toBeFalsy();
      expect(firstToggleOption.nativeElement.attributes['class'].value).toContain(
        'sbb-toggle-option-selected',
      );
    }));
  });
});
