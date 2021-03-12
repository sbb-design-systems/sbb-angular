import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { createMouseEvent, dispatchEvent } from '@sbb-esta/angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import {
  SbbCheckboxPanel,
  SbbCheckboxPanelModule,
  SbbCheckboxPanelNote,
  SbbCheckboxPanelSubtitle,
  SbbCheckboxPanelWarning,
} from './index';

@Component({
  selector: 'sbb-model-sbb-checkbox-panel-test',
  template: `
    <sbb-checkbox-panel [(ngModel)]="checkValue1" name="test-option" value="1">
      Test option selection 1
    </sbb-checkbox-panel>
    <sbb-checkbox-panel [(ngModel)]="checkValue2" name="test-option" value="2">
      Test option selection 2
    </sbb-checkbox-panel>
  `,
})
class ModelOptionSelectionMultipleTest {
  checkValue1 = false;
  checkValue2 = false;
  @ViewChildren(SbbCheckboxPanel) optionSelections: QueryList<SbbCheckboxPanel>;
}

@Component({
  selector: 'sbb-checkbox-panel-subtitle-test',
  template: `
    <sbb-checkbox-panel [formControl]="control">
      Zürich HB - Basel SBB
      <sbb-checkbox-panel-subtitle>{{ subtitle }}</sbb-checkbox-panel-subtitle>
      <sbb-checkbox-panel-warning>{{ warning }}</sbb-checkbox-panel-warning>
      <sbb-checkbox-panel-note>{{ note }}</sbb-checkbox-panel-note>
    </sbb-checkbox-panel>
  `,
})
class CheckboxPanelSubtitleTest {
  control = new FormControl(false);
  subtitle = 'Valid: Mo, 01.03.2021';
  warning = 'Reservation not possible';
  note = 'CHF 250.00';
}

@Component({
  selector: 'sbb-checkbox-panel-icon-test',
  template: `
    <sbb-checkbox-panel [formControl]="control">
      Test
      <sbb-checkbox-panel-note>
        <sbb-icon svgIcon="kom:heart"></sbb-icon>
      </sbb-checkbox-panel-note>
    </sbb-checkbox-panel>
  `,
})
class CheckboxPanelIconTest {
  control = new FormControl(false);
}

describe('SbbCheckboxPanel', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          SbbCheckboxPanelModule,
          SbbIconModule,
          SbbIconTestingModule,
        ],
        declarations: [
          ModelOptionSelectionMultipleTest,
          CheckboxPanelSubtitleTest,
          CheckboxPanelIconTest,
        ],
      }).compileComponents();
    })
  );

  describe('multi selection', () => {
    let component: ModelOptionSelectionMultipleTest;
    let fixture: ComponentFixture<ModelOptionSelectionMultipleTest>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ModelOptionSelectionMultipleTest);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create mock component and should contain two sbb-checkbox-panel components', () => {
      expect(component).toBeTruthy();

      const optionSelectionComponents = fixture.debugElement.queryAll(
        By.directive(SbbCheckboxPanel)
      );
      expect(optionSelectionComponents).toBeTruthy();
      expect(optionSelectionComponents.length).toBe(2);
    });

    it('should not be mutual exclusive', async () => {
      const opt1: SbbCheckboxPanel = component.optionSelections.toArray()[0];
      const opt2: SbbCheckboxPanel = component.optionSelections.toArray()[1];

      await fixture.whenRenderingDone();

      opt1.toggle();
      fixture.detectChanges();

      let checkedComponents = component.optionSelections.filter((o) => !!o.checked);
      expect(checkedComponents.length).toBe(1);

      opt2.toggle();
      fixture.detectChanges();

      checkedComponents = component.optionSelections.filter((o) => !!o.checked);
      expect(checkedComponents.length).toBe(2);
    });

    it('should checked if model is true', async () => {
      const opt1: SbbCheckboxPanel = component.optionSelections.toArray()[0];
      const opt2: SbbCheckboxPanel = component.optionSelections.toArray()[1];

      component.checkValue1 = true;
      fixture.detectChanges();

      await fixture.whenStable();

      expect(opt1.checked).toBe(true);
      expect(component.checkValue1).toBe(true);

      const element = fixture.debugElement.queryAll(By.css('label'))[1];
      dispatchEvent(element.nativeElement, createMouseEvent('click'));
      fixture.detectChanges();

      await fixture.whenStable();
      expect(opt2.checked).toBe(true);
      expect(component.checkValue2).toBe(true);
    });
  });

  describe('subtitle', () => {
    let component: CheckboxPanelSubtitleTest;
    let fixture: ComponentFixture<CheckboxPanelSubtitleTest>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxPanelSubtitleTest);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should display the subtitle', () => {
      const subtitle = fixture.debugElement.query(By.directive(SbbCheckboxPanelSubtitle));
      const subtitleElement = subtitle.nativeElement as HTMLElement;
      expect(subtitleElement.textContent).toEqual(component.subtitle);
    });

    it('should display the warning', () => {
      const subtitle = fixture.debugElement.query(By.directive(SbbCheckboxPanelWarning));
      const subtitleElement = subtitle.nativeElement as HTMLElement;
      expect(subtitleElement.textContent).toEqual(component.warning);
    });

    it('should display the note', () => {
      const subtitle = fixture.debugElement.query(By.directive(SbbCheckboxPanelNote));
      const subtitleElement = subtitle.nativeElement as HTMLElement;
      expect(subtitleElement.textContent).toEqual(component.note);
    });

    it('should add class on checked', () => {
      const element = fixture.debugElement.query(By.directive(SbbCheckboxPanel))
        .nativeElement as HTMLElement;
      expect(element.classList.contains('sbb-selection-checked')).toBeFalse();
      component.control.setValue(true);
      fixture.detectChanges();
      expect(element.classList.contains('sbb-selection-checked')).toBeTrue();
    });
  });

  describe('note with icon', () => {
    let fixture: ComponentFixture<CheckboxPanelIconTest>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckboxPanelIconTest);
      fixture.detectChanges();
    });

    it('should display the icon', () => {
      const element = fixture.debugElement.query(By.directive(SbbCheckboxPanelNote))
        .nativeElement as HTMLElement;
      expect(element.firstElementChild?.nodeName.toLowerCase()).toEqual('sbb-icon');
    });
  });
});
