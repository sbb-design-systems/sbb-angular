import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import {
  SbbRadioButtonPanel,
  SbbRadioButtonPanelModule,
  SbbRadioButtonPanelNote,
  SbbRadioButtonPanelSubtitle,
  SbbRadioButtonPanelWarning,
} from './index';

@Component({
  selector: 'sbb-model-radio-button-panel-test',
  template: `
    <sbb-radio-group [(ngModel)]="testValue">
      <sbb-radio-button-panel value="1"> Test option selection 1 </sbb-radio-button-panel>
      <sbb-radio-button-panel value="2"> Test option selection 2 </sbb-radio-button-panel>
    </sbb-radio-group>
  `,
  standalone: true,
  imports: [FormsModule, SbbRadioButtonPanelModule],
})
class ModelOptionSelectionTest {
  testValue = '2';
  @ViewChildren(SbbRadioButtonPanel) optionSelections: QueryList<SbbRadioButtonPanel>;
}

@Component({
  selector: 'sbb-radio-button-panel-directive-test',
  template: `
    <sbb-radio-group [formControl]="control">
      <sbb-radio-button-panel [value]="true">
        Test
        <sbb-radio-button-panel-subtitle>{{ subtitle }}</sbb-radio-button-panel-subtitle>
        <sbb-radio-button-panel-warning>{{ warning }}</sbb-radio-button-panel-warning>
        <sbb-radio-button-panel-note>{{ note }}</sbb-radio-button-panel-note>
      </sbb-radio-button-panel>
    </sbb-radio-group>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, SbbRadioButtonPanelModule],
})
class RadioButtonPanelDirectiveTest {
  control = new FormControl(false);
  subtitle = 'Valid: Mo, 01.03.2021';
  warning = 'Reservation not possible';
  note = 'CHF 250.00';
}

@Component({
  selector: 'sbb-radio-button-panel-icon-test',
  template: `
    <sbb-radio-group [formControl]="control">
      <sbb-radio-button-panel>
        Test 1
        <sbb-radio-button-panel-note>
          <sbb-icon svgIcon="heart"></sbb-icon>
        </sbb-radio-button-panel-note>
      </sbb-radio-button-panel>
    </sbb-radio-group>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, SbbRadioButtonPanelModule, SbbIconModule],
})
class RadioButtonPanelIconTest {
  control = new FormControl(false);
}

describe('SbbRadioButtonPanel', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule],
    }).compileComponents();
  }));

  describe('multi selection', () => {
    let component: ModelOptionSelectionTest;
    let fixture: ComponentFixture<ModelOptionSelectionTest>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ModelOptionSelectionTest);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create mock component and should contain two sbb-radio-button-panel components', () => {
      expect(component).toBeTruthy();

      const optionSelectionComponents = fixture.debugElement.queryAll(
        By.directive(SbbRadioButtonPanel),
      );
      expect(optionSelectionComponents).toBeTruthy();
      expect(optionSelectionComponents.length).toBe(2);
    });

    it('should be mutual exclusive', async () => {
      const [label1, label2] = fixture.debugElement.queryAll(By.css('label'));
      await fixture.whenRenderingDone();

      label1.nativeElement.click();
      fixture.detectChanges();

      let checkedComponents = component.optionSelections.filter((o) => o.checked === true);
      expect(checkedComponents.length).toBe(1);

      label2.nativeElement.click();
      fixture.detectChanges();

      checkedComponents = component.optionSelections.filter((o) => o.checked === true);
      expect(checkedComponents.length).toBe(1);
    });

    it('should checked if model is equal to value', async () => {
      const [opt1, opt2] = component.optionSelections.toArray();

      component.testValue = '1';
      fixture.detectChanges();

      await fixture.whenStable();

      expect(opt1.checked).toBe(true);

      const opt2Element = fixture.debugElement.queryAll(By.css('label'))[1];
      opt2Element.nativeElement.click();
      fixture.detectChanges();

      await fixture.whenStable();
      expect(opt2.checked).toBe(true);
      expect(component.testValue).toBe(opt2.value);
    });
  });

  describe('directives', () => {
    let component: RadioButtonPanelDirectiveTest;
    let fixture: ComponentFixture<RadioButtonPanelDirectiveTest>;

    beforeEach(() => {
      fixture = TestBed.createComponent(RadioButtonPanelDirectiveTest);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should display the subtitle', () => {
      const debugElement = fixture.debugElement.query(By.directive(SbbRadioButtonPanelSubtitle));
      const element = debugElement.nativeElement as HTMLElement;
      expect(element.textContent).toEqual(component.subtitle);
    });

    it('should display the warning', () => {
      const debugElement = fixture.debugElement.query(By.directive(SbbRadioButtonPanelWarning));
      const element = debugElement.nativeElement as HTMLElement;
      expect(element.textContent).toEqual(component.warning);
    });

    it('should display the note', () => {
      const debugElement = fixture.debugElement.query(By.directive(SbbRadioButtonPanelNote));
      const element = debugElement.nativeElement as HTMLElement;
      expect(element.textContent).toEqual(component.note);
    });

    it('should add class on checked', () => {
      const element = fixture.debugElement.query(By.directive(SbbRadioButtonPanel))
        .nativeElement as HTMLElement;
      expect(element.classList.contains('sbb-selection-checked')).toBeFalse();
      component.control.setValue(true);
      fixture.detectChanges();
      expect(element.classList.contains('sbb-selection-checked')).toBeTrue();
    });

    it('should not contain a div inside the label', () => {
      const element = fixture.debugElement.nativeElement as HTMLElement;
      expect(element.querySelectorAll('label div').length).toBe(0);
    });
  });

  describe('note with icon', () => {
    let fixture: ComponentFixture<RadioButtonPanelIconTest>;

    beforeEach(() => {
      fixture = TestBed.createComponent(RadioButtonPanelIconTest);
      fixture.detectChanges();
    });

    it('should display the icon', () => {
      const element = fixture.debugElement.query(By.directive(SbbRadioButtonPanelNote))
        .nativeElement as HTMLElement;
      expect(element.firstElementChild?.nodeName.toLowerCase()).toEqual('sbb-icon');
    });
  });
});
