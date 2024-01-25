import { Direction, Directionality } from '@angular/cdk/bidi';
import { END, ENTER, HOME, LEFT_ARROW, RIGHT_ARROW, SPACE } from '@angular/cdk/keycodes';
import { CdkStep, STEPPER_GLOBAL_OPTIONS, STEP_STATE } from '@angular/cdk/stepper';
import {
  Component,
  DebugElement,
  EventEmitter,
  OnInit,
  Provider,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchKeyboardEvent,
} from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { merge, Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import {
  SbbProcessflow,
  SbbProcessflowModule,
  SbbProcessflowNext,
  SbbProcessflowPrevious,
  SbbStep,
} from './index';

const VALID_REGEX = /valid/;
let dir: { value: Direction; readonly change: EventEmitter<Direction> };

describe('SbbProcessflow', () => {
  beforeEach(() => {
    dir = {
      value: 'ltr',
      change: new EventEmitter(),
    };
  });

  describe('basic processflow', () => {
    let fixture: ComponentFixture<SimpleSbbVerticalStepperApp>;

    beforeEach(() => {
      fixture = createComponent(SimpleSbbVerticalStepperApp);
      fixture.detectChanges();
    });

    it('should default to the first step', () => {
      const processflowComponent: SbbProcessflow = fixture.debugElement.query(
        By.css('sbb-processflow'),
      )!.componentInstance;

      expect(processflowComponent.selectedIndex).toBe(0);
    });

    it('should throw when a negative `selectedIndex` is assigned', () => {
      const processflowComponent: SbbProcessflow = fixture.debugElement.query(
        By.css('sbb-processflow'),
      )!.componentInstance;

      expect(() => {
        processflowComponent.selectedIndex = -10;
        fixture.detectChanges();
      }).toThrowError(/Cannot assign out-of-bounds/);
    });

    it('should throw when an out-of-bounds `selectedIndex` is assigned', () => {
      const processflowComponent: SbbProcessflow = fixture.debugElement.query(
        By.css('sbb-processflow'),
      )!.componentInstance;

      expect(() => {
        processflowComponent.selectedIndex = 1337;
        fixture.detectChanges();
      }).toThrowError(/Cannot assign out-of-bounds/);
    });

    it('should change selected index on header click', () => {
      const stepHeaders = fixture.debugElement.queryAll(By.css('.sbb-processflow-header'));
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;

      expect(processflowComponent.selectedIndex).toBe(0);
      expect(processflowComponent.selected instanceof SbbStep).toBe(true);

      // select the second step
      let stepHeaderEl = stepHeaders[1].nativeElement;
      stepHeaderEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);
      expect(processflowComponent.selected instanceof SbbStep).toBe(true);

      // select the third step
      stepHeaderEl = stepHeaders[2].nativeElement;
      stepHeaderEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(2);
      expect(processflowComponent.selected instanceof SbbStep).toBe(true);
    });

    it('should set the "tablist" role on processflow', () => {
      const processflowEl = fixture.debugElement.query(By.css('sbb-processflow'))!.nativeElement;
      expect(processflowEl.getAttribute('role')).toBe('tablist');
    });

    it('should add the `sbb-processflow-content-hidden` class to invisible elements', () => {
      const stepContents = fixture.debugElement.queryAll(By.css(`.sbb-processflow-content`));
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;
      const firstStepContentEl = stepContents[0].nativeElement;
      expect(firstStepContentEl.classList.contains('sbb-processflow-content-hidden')).toBeFalse();

      processflowComponent.selectedIndex = 1;
      fixture.detectChanges();

      expect(firstStepContentEl.classList.contains('sbb-processflow-content-hidden')).toBeTrue();
      expect(firstStepContentEl.clientHeight).toBe(0);
      const secondStepContentEl = stepContents[1].nativeElement;
      expect(secondStepContentEl.classList.contains('sbb-processflow-content-hidden')).toBeFalse();
    });

    it('should display the correct label', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;
      let selectedLabel = fixture.nativeElement.querySelector('[aria-selected="true"]');
      expect(selectedLabel.textContent).toMatch('Step 1');

      processflowComponent.selectedIndex = 2;
      fixture.detectChanges();

      selectedLabel = fixture.nativeElement.querySelector('[aria-selected="true"]');
      expect(selectedLabel.textContent).toMatch('Step 3');

      fixture.componentInstance.inputLabel = 'New Label';
      fixture.detectChanges();

      selectedLabel = fixture.nativeElement.querySelector('[aria-selected="true"]');
      expect(selectedLabel.textContent).toMatch('New Label');
    });

    it('should go to next available step when the next button is clicked', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;

      expect(processflowComponent.selectedIndex).toBe(0);

      let nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);

      nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[1]
        .nativeElement;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(2);

      nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[2]
        .nativeElement;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(2);
    });

    it('should set the next processflow button type to "submit"', () => {
      const button = fixture.debugElement.query(By.directive(SbbProcessflowNext))!.nativeElement;
      expect(button.type)
        .withContext(`Expected the button to have "submit" set as type.`)
        .toBe('submit');
    });

    it('should go to previous available step when the previous button is clicked', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;

      expect(processflowComponent.selectedIndex).toBe(0);

      processflowComponent.selectedIndex = 2;
      let previousButtonNativeEl = fixture.debugElement.queryAll(
        By.directive(SbbProcessflowPrevious),
      )[2].nativeElement;
      previousButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);

      previousButtonNativeEl = fixture.debugElement.queryAll(
        By.directive(SbbProcessflowPrevious),
      )[1].nativeElement;
      previousButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(0);

      previousButtonNativeEl = fixture.debugElement.queryAll(
        By.directive(SbbProcessflowPrevious),
      )[0].nativeElement;
      previousButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(0);
    });

    it('should set the previous processflow button type to "button"', () => {
      const button = fixture.debugElement.query(
        By.directive(SbbProcessflowPrevious),
      )!.nativeElement;
      expect(button.type)
        .withContext(`Expected the button to have "button" set as type.`)
        .toBe('button');
    });

    it('should set the correct step position for animation', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;

      expect(processflowComponent._getAnimationDirection(0)).toBe('current');
      expect(processflowComponent._getAnimationDirection(1)).toBe('next');
      expect(processflowComponent._getAnimationDirection(2)).toBe('next');

      processflowComponent.selectedIndex = 1;
      fixture.detectChanges();

      expect(processflowComponent._getAnimationDirection(0)).toBe('previous');
      expect(processflowComponent._getAnimationDirection(2)).toBe('next');
      expect(processflowComponent._getAnimationDirection(1)).toBe('current');

      processflowComponent.selectedIndex = 2;
      fixture.detectChanges();

      expect(processflowComponent._getAnimationDirection(0)).toBe('previous');
      expect(processflowComponent._getAnimationDirection(1)).toBe('previous');
      expect(processflowComponent._getAnimationDirection(2)).toBe('current');
    });

    it('should not set focus on header of selected step if header is not clicked', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;
      const stepHeaderEl = fixture.debugElement.queryAll(By.css('sbb-step-header'))[1]
        .nativeElement;
      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;
      spyOn(stepHeaderEl, 'focus');
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);
      expect(stepHeaderEl.focus).not.toHaveBeenCalled();
    });

    it('should focus next step header if focus is inside the processflow', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;
      const stepHeaderEl = fixture.debugElement.queryAll(By.css('sbb-step-header'))[1]
        .nativeElement;
      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;
      spyOn(stepHeaderEl, 'focus');
      nextButtonNativeEl.focus();
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);
      expect(stepHeaderEl.focus).toHaveBeenCalled();
    });

    it('should only be able to return to a previous step if it is editable', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;

      processflowComponent.selectedIndex = 1;
      processflowComponent.steps.toArray()[0].editable = false;
      const previousButtonNativeEl = fixture.debugElement.queryAll(
        By.directive(SbbProcessflowPrevious),
      )[1].nativeElement;
      previousButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);

      processflowComponent.steps.toArray()[0].editable = true;
      previousButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(0);
    });

    it('should set create icon if step is editable and completed', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;
      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;
      expect(processflowComponent._getIndicatorType(0)).toBe('number');
      processflowComponent.steps.toArray()[0].editable = true;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent._getIndicatorType(0)).toBe('edit');
    });

    it('should set done icon if step is not editable and is completed', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;
      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;
      expect(processflowComponent._getIndicatorType(0)).toBe('number');
      processflowComponent.steps.toArray()[0].editable = false;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent._getIndicatorType(0)).toBe('done');
    });

    it('should emit an event when the enter animation is done', fakeAsync(() => {
      const processflow: SbbProcessflow = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;
      const selectionChangeSpy = jasmine.createSpy('selectionChange spy');
      const animationDoneSpy = jasmine.createSpy('animationDone spy');
      const selectionChangeSubscription = processflow.selectionChange.subscribe(selectionChangeSpy);
      const animationDoneSubscription = processflow.animationDone.subscribe(animationDoneSpy);

      processflow.selectedIndex = 1;
      fixture.detectChanges();

      expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
      expect(animationDoneSpy).not.toHaveBeenCalled();

      flush();

      expect(selectionChangeSpy).toHaveBeenCalledTimes(1);
      expect(animationDoneSpy).toHaveBeenCalledTimes(2);

      selectionChangeSubscription.unsubscribe();
      animationDoneSubscription.unsubscribe();
    }));

    it('should set the correct aria-posinset and aria-setsize', () => {
      const headers = Array.from<HTMLElement>(
        fixture.nativeElement.querySelectorAll('.sbb-step-header'),
      );

      expect(headers.map((header) => header.getAttribute('aria-posinset'))).toEqual([
        '1',
        '2',
        '3',
      ]);
      expect(headers.every((header) => header.getAttribute('aria-setsize') === '3')).toBe(true);
    });

    it('should adjust the index when removing a step before the current one', () => {
      const processflowComponent: SbbProcessflow = fixture.debugElement.query(
        By.css('sbb-processflow'),
      )!.componentInstance;

      processflowComponent.selectedIndex = 2;
      fixture.detectChanges();

      // Re-assert since the setter has some extra logic.
      expect(processflowComponent.selectedIndex).toBe(2);

      expect(() => {
        fixture.componentInstance.showStepTwo = false;
        fixture.detectChanges();
      }).not.toThrow();

      expect(processflowComponent.selectedIndex).toBe(1);
    });

    it('should not do anything when pressing the ENTER key with a modifier', () => {
      const stepHeaders = fixture.debugElement.queryAll(By.css('.sbb-processflow-header'));
      assertSelectKeyWithModifierInteraction(fixture, stepHeaders, ENTER);
    });

    it('should not do anything when pressing the SPACE key with a modifier', () => {
      const stepHeaders = fixture.debugElement.queryAll(By.css('.sbb-processflow-header'));
      assertSelectKeyWithModifierInteraction(fixture, stepHeaders, SPACE);
    });
  });

  describe('basic processflow when attempting to set the selected step too early', () => {
    it('should not throw', () => {
      const fixture = createComponent(SimpleSbbVerticalStepperApp);
      const processflowComponent: SbbProcessflow = fixture.debugElement.query(
        By.css('sbb-processflow'),
      )!.componentInstance;

      expect(() => processflowComponent.selected).not.toThrow();
    });
  });

  describe('basic processflow when attempting to set the selected step too early', () => {
    it('should not throw', () => {
      const fixture = createComponent(SimpleSbbVerticalStepperApp);
      const processflowComponent: SbbProcessflow = fixture.debugElement.query(
        By.css('sbb-processflow'),
      )!.componentInstance;

      expect(() => (processflowComponent.selected = null!)).not.toThrow();
      expect(processflowComponent.selectedIndex).toBe(-1);
    });
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<SimpleSbbVerticalStepperApp>;

    beforeEach(() => {
      dir.value = 'rtl';
      fixture = createComponent(SimpleSbbVerticalStepperApp);
      fixture.detectChanges();
    });

    it('should reverse animation in RTL mode', () => {
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;

      expect(processflowComponent._getAnimationDirection(0)).toBe('current');
      expect(processflowComponent._getAnimationDirection(1)).toBe('previous');
      expect(processflowComponent._getAnimationDirection(2)).toBe('previous');

      processflowComponent.selectedIndex = 1;
      fixture.detectChanges();

      expect(processflowComponent._getAnimationDirection(0)).toBe('next');
      expect(processflowComponent._getAnimationDirection(2)).toBe('previous');
      expect(processflowComponent._getAnimationDirection(1)).toBe('current');

      processflowComponent.selectedIndex = 2;
      fixture.detectChanges();

      expect(processflowComponent._getAnimationDirection(0)).toBe('next');
      expect(processflowComponent._getAnimationDirection(1)).toBe('next');
      expect(processflowComponent._getAnimationDirection(2)).toBe('current');
    });
  });

  describe('linear processflow', () => {
    let fixture: ComponentFixture<LinearSbbVerticalStepperApp>;
    let testComponent: LinearSbbVerticalStepperApp;
    let processflowComponent: SbbProcessflow;

    beforeEach(() => {
      fixture = createComponent(LinearSbbVerticalStepperApp);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
      processflowComponent = fixture.debugElement.query(
        By.css('sbb-processflow'),
      )!.componentInstance;
    });

    it('should have true linear attribute', () => {
      expect(processflowComponent.linear).toBe(true);
    });

    it('should not move to next step if current step is invalid', () => {
      expect(testComponent.oneGroup.get('oneCtrl')!.value).toBe('');
      expect(testComponent.oneGroup.get('oneCtrl')!.valid).toBe(false);
      expect(testComponent.oneGroup.valid).toBe(false);
      expect(testComponent.oneGroup.invalid).toBe(true);
      expect(processflowComponent.selectedIndex).toBe(0);

      const stepHeaderEl = fixture.debugElement.queryAll(By.css('.sbb-processflow-header'))[1]
        .nativeElement;

      stepHeaderEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(0);

      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(0);

      testComponent.oneGroup.get('oneCtrl')!.setValue('answer');
      stepHeaderEl.click();
      fixture.detectChanges();

      expect(testComponent.oneGroup.valid).toBe(true);
      expect(processflowComponent.selectedIndex).toBe(1);
    });

    it('should not move to next step if current step is pending', () => {
      const stepHeaderEl = fixture.debugElement.queryAll(By.css('.sbb-processflow-header'))[2]
        .nativeElement;

      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[1]
        .nativeElement;

      testComponent.oneGroup.get('oneCtrl')!.setValue('input');
      testComponent.twoGroup.get('twoCtrl')!.setValue('input');
      processflowComponent.selectedIndex = 1;
      fixture.detectChanges();
      expect(processflowComponent.selectedIndex).toBe(1);

      // Step status = PENDING
      // Assert that linear processflow does not allow step selection change
      expect(testComponent.twoGroup.pending).toBe(true);

      stepHeaderEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);

      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);

      // Trigger asynchronous validation
      testComponent.validationTrigger.next();
      // Asynchronous validation completed:
      // Step status = VALID
      expect(testComponent.twoGroup.pending).toBe(false);
      expect(testComponent.twoGroup.valid).toBe(true);

      stepHeaderEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(2);

      processflowComponent.selectedIndex = 1;
      fixture.detectChanges();
      expect(processflowComponent.selectedIndex).toBe(1);

      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(2);
    });

    it('should be able to focus step header upon click if it is unable to be selected', () => {
      const stepHeaderEl = fixture.debugElement.queryAll(By.css('sbb-step-header'))[1]
        .nativeElement;

      fixture.detectChanges();

      expect(stepHeaderEl.getAttribute('tabindex')).toBe('-1');
    });

    it('should be able to move to next step even when invalid if current step is optional', () => {
      testComponent.oneGroup.get('oneCtrl')!.setValue('input');
      testComponent.twoGroup.get('twoCtrl')!.setValue('input');
      testComponent.validationTrigger.next();
      processflowComponent.selectedIndex = 1;
      fixture.detectChanges();
      processflowComponent.selectedIndex = 2;
      fixture.detectChanges();

      expect(processflowComponent.steps.toArray()[2].optional).toBe(true);
      expect(processflowComponent.selectedIndex).toBe(2);
      expect(testComponent.threeGroup.get('threeCtrl')!.valid).toBe(true);

      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[2]
        .nativeElement;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex)
        .withContext('Expected selectedIndex to change when optional step input is empty.')
        .toBe(3);

      processflowComponent.selectedIndex = 2;
      testComponent.threeGroup.get('threeCtrl')!.setValue('input');
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(testComponent.threeGroup.get('threeCtrl')!.valid).toBe(false);
      expect(processflowComponent.selectedIndex)
        .withContext('Expected selectedIndex to change when optional step input is invalid.')
        .toBe(3);
    });

    it('should be able to reset the processflow to its initial state', () => {
      const steps = processflowComponent.steps.toArray();

      testComponent.oneGroup.get('oneCtrl')!.setValue('value');
      fixture.detectChanges();

      processflowComponent.next();
      fixture.detectChanges();

      processflowComponent.next();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);
      expect(steps[0].interacted).toBe(true);
      expect(steps[0].completed).toBe(true);
      expect(testComponent.oneGroup.get('oneCtrl')!.valid).toBe(true);
      expect(testComponent.oneGroup.get('oneCtrl')!.value).toBe('value');

      expect(steps[1].interacted).toBe(true);
      expect(steps[1].completed).toBe(false);
      expect(testComponent.twoGroup.get('twoCtrl')!.valid).toBe(false);

      processflowComponent.reset();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(0);
      expect(steps[0].interacted).toBe(false);
      expect(steps[0].completed).toBe(false);
      expect(testComponent.oneGroup.get('oneCtrl')!.valid).toBe(false);
      expect(testComponent.oneGroup.get('oneCtrl')!.value).toBeFalsy();

      expect(steps[1].interacted).toBe(false);
      expect(steps[1].completed).toBe(false);
      expect(testComponent.twoGroup.get('twoCtrl')!.valid).toBe(false);
    });

    it('should reset back to the first step when some of the steps are not editable', () => {
      const steps = processflowComponent.steps.toArray();

      steps[0].editable = false;

      testComponent.oneGroup.get('oneCtrl')!.setValue('value');
      fixture.detectChanges();

      processflowComponent.next();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);

      processflowComponent.reset();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(0);
    });

    it('should not clobber the `complete` binding when resetting', () => {
      const steps: CdkStep[] = processflowComponent.steps.toArray();
      const fillOutStepper = () => {
        testComponent.oneGroup.get('oneCtrl')!.setValue('input');
        testComponent.twoGroup.get('twoCtrl')!.setValue('input');
        testComponent.threeGroup.get('threeCtrl')!.setValue('valid');
        testComponent.validationTrigger.next();
        processflowComponent.selectedIndex = 1;
        fixture.detectChanges();
        processflowComponent.selectedIndex = 2;
        fixture.detectChanges();
        processflowComponent.selectedIndex = 3;
        fixture.detectChanges();
      };

      fillOutStepper();

      expect(steps[2].completed)
        .withContext('Expected third step to be considered complete after the first run through.')
        .toBe(true);

      processflowComponent.reset();
      fixture.detectChanges();
      fillOutStepper();

      expect(steps[2].completed)
        .withContext(
          'Expected third step to be considered complete when doing a run after a reset.',
        )
        .toBe(true);
    });

    it('should be able to skip past the current step if a custom `completed` value is set', () => {
      expect(testComponent.oneGroup.get('oneCtrl')!.value).toBe('');
      expect(testComponent.oneGroup.get('oneCtrl')!.valid).toBe(false);
      expect(testComponent.oneGroup.valid).toBe(false);
      expect(processflowComponent.selectedIndex).toBe(0);

      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(0);

      processflowComponent.steps.first.completed = true;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(testComponent.oneGroup.valid).toBe(false);
      expect(processflowComponent.selectedIndex).toBe(1);
    });
  });

  describe('linear processflow with a pre-defined selectedIndex', () => {
    let preselectedFixture: ComponentFixture<SimplePreselectedSbbHorizontalStepperApp>;
    let processflow: SbbProcessflow;

    beforeEach(() => {
      preselectedFixture = createComponent(SimplePreselectedSbbHorizontalStepperApp);
      preselectedFixture.detectChanges();
      processflow = preselectedFixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;
    });

    it('should not throw', () => {
      expect(() => preselectedFixture.detectChanges()).not.toThrow();
    });

    it('selectedIndex should be typeof number', () => {
      expect(typeof processflow.selectedIndex).toBe('number');
    });

    it('value of selectedIndex should be the pre-defined value', () => {
      expect(processflow.selectedIndex).toBe(0);
    });
  });

  describe('linear processflow with no `stepControl`', () => {
    let noStepControlFixture: ComponentFixture<SimpleStepperWithoutStepControl>;
    beforeEach(() => {
      noStepControlFixture = createComponent(SimpleStepperWithoutStepControl);
      noStepControlFixture.detectChanges();
    });
    it('should not move to the next step if the current one is not completed ', () => {
      const processflow: SbbProcessflow = noStepControlFixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;

      const headers = noStepControlFixture.debugElement.queryAll(By.css('.sbb-processflow-header'));

      expect(processflow.selectedIndex).toBe(0);

      headers[1].nativeElement.click();
      noStepControlFixture.detectChanges();

      expect(processflow.selectedIndex).toBe(0);
    });
  });

  describe('linear processflow with `stepControl`', () => {
    let controlAndBindingFixture: ComponentFixture<SimpleStepperWithStepControlAndCompletedBinding>;
    beforeEach(() => {
      controlAndBindingFixture = createComponent(SimpleStepperWithStepControlAndCompletedBinding);
      controlAndBindingFixture.detectChanges();
    });

    it('should have the `stepControl` take precedence when `completed` is set', () => {
      expect(controlAndBindingFixture.componentInstance.steps[0].control.valid).toBe(true);
      expect(controlAndBindingFixture.componentInstance.steps[0].completed).toBe(false);

      const processflow: SbbProcessflow = controlAndBindingFixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;

      const headers = controlAndBindingFixture.debugElement.queryAll(
        By.css('.sbb-processflow-header'),
      );

      expect(processflow.selectedIndex).toBe(0);

      headers[1].nativeElement.click();
      controlAndBindingFixture.detectChanges();

      expect(processflow.selectedIndex).toBe(1);
    });
  });

  describe('horizontal processflow', () => {
    it('should set the aria-orientation to "horizontal"', () => {
      const fixture = createComponent(SimpleSbbHorizontalStepperApp);
      fixture.detectChanges();

      const processflowEl = fixture.debugElement.query(By.css('sbb-processflow'))!.nativeElement;
      expect(processflowEl.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should support using the left/right arrows to move focus', () => {
      const fixture = createComponent(SimpleSbbHorizontalStepperApp);
      fixture.detectChanges();

      const stepHeaders = fixture.debugElement.queryAll(By.css('.sbb-processflow-header'));
      assertCorrectKeyboardInteraction(fixture, stepHeaders);
    });

    it('should reverse arrow key focus in RTL mode', () => {
      dir.value = 'rtl';
      const fixture = createComponent(SimpleSbbHorizontalStepperApp);
      fixture.detectChanges();

      const stepHeaders = fixture.debugElement.queryAll(By.css('.sbb-processflow-header'));
      assertArrowKeyInteractionInRtl(fixture, stepHeaders);
    });

    it('should reverse arrow key focus when switching into RTL after init', () => {
      const fixture = createComponent(SimpleSbbHorizontalStepperApp);
      fixture.detectChanges();

      const stepHeaders = fixture.debugElement.queryAll(By.css('.sbb-processflow-header'));
      assertCorrectKeyboardInteraction(fixture, stepHeaders);

      dir.value = 'rtl';
      dir.change.emit('rtl');
      fixture.detectChanges();

      assertArrowKeyInteractionInRtl(fixture, stepHeaders);
    });

    it('should be able to mark all steps as interacted', () => {
      const fixture = createComponent(SimpleSbbHorizontalStepperApp);
      fixture.detectChanges();

      const processflow: SbbProcessflow = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      ).componentInstance;

      expect(processflow.steps.map((step) => step.interacted)).toEqual([false, false, false]);

      processflow.next();
      fixture.detectChanges();
      expect(processflow.steps.map((step) => step.interacted)).toEqual([true, false, false]);

      processflow.next();
      fixture.detectChanges();
      expect(processflow.steps.map((step) => step.interacted)).toEqual([true, true, false]);

      processflow.next();
      fixture.detectChanges();
      expect(processflow.steps.map((step) => step.interacted)).toEqual([true, true, true]);
    });

    it('should emit when the user has interacted with a step', () => {
      const fixture = createComponent(SimpleSbbHorizontalStepperApp);
      fixture.detectChanges();

      const processflow: SbbProcessflow = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      ).componentInstance;
      const interactedSteps: number[] = [];
      const subscription = merge(
        ...processflow.steps.map((step) => step.interactedStream),
      ).subscribe((step) =>
        interactedSteps.push(processflow.steps.toArray().indexOf(step as SbbStep)),
      );

      expect(interactedSteps).toEqual([]);

      processflow.next();
      fixture.detectChanges();
      expect(interactedSteps).toEqual([0]);

      processflow.next();
      fixture.detectChanges();
      expect(interactedSteps).toEqual([0, 1]);

      processflow.next();
      fixture.detectChanges();
      expect(interactedSteps).toEqual([0, 1, 2]);
      subscription.unsubscribe();
    });
  });

  describe('linear processflow with valid step', () => {
    let fixture: ComponentFixture<LinearStepperWithValidOptionalStep>;
    let testComponent: LinearStepperWithValidOptionalStep;
    let processflow: SbbProcessflow;

    beforeEach(() => {
      fixture = createComponent(LinearStepperWithValidOptionalStep);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
      processflow = fixture.debugElement.query(By.css('sbb-processflow'))!.componentInstance;
    });

    it('must be visited if not optional', () => {
      processflow.selectedIndex = 2;
      fixture.detectChanges();
      expect(processflow.selectedIndex).toBe(0);

      processflow.selectedIndex = 1;
      fixture.detectChanges();
      expect(processflow.selectedIndex).toBe(1);

      processflow.selectedIndex = 2;
      fixture.detectChanges();
      expect(processflow.selectedIndex).toBe(2);
    });

    it('can be skipped entirely if optional', () => {
      testComponent.step2Optional = true;
      fixture.detectChanges();
      processflow.selectedIndex = 2;
      fixture.detectChanges();
      expect(processflow.selectedIndex).toBe(2);
    });
  });

  describe('aria labelling', () => {
    let fixture: ComponentFixture<StepperWithAriaInputs>;
    let stepHeader: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(StepperWithAriaInputs);
      fixture.detectChanges();
      stepHeader = fixture.nativeElement.querySelector('.sbb-step-header');
    });

    it('should not set aria-label or aria-labelledby attributes if they are not passed in', () => {
      expect(stepHeader.hasAttribute('aria-label')).toBe(false);
      expect(stepHeader.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('should set the aria-label attribute', () => {
      fixture.componentInstance.ariaLabel = 'First step';
      fixture.detectChanges();

      expect(stepHeader.getAttribute('aria-label')).toBe('First step');
    });

    it('should set the aria-labelledby attribute', () => {
      fixture.componentInstance.ariaLabelledby = 'first-step-label';
      fixture.detectChanges();

      expect(stepHeader.getAttribute('aria-labelledby')).toBe('first-step-label');
    });

    it('should not be able to set both an aria-label and aria-labelledby', () => {
      fixture.componentInstance.ariaLabel = 'First step';
      fixture.componentInstance.ariaLabelledby = 'first-step-label';
      fixture.detectChanges();

      expect(stepHeader.getAttribute('aria-label')).toBe('First step');
      expect(stepHeader.hasAttribute('aria-labelledby')).toBe(false);
    });
  });

  describe('processflow with error state', () => {
    let fixture: ComponentFixture<SbbHorizontalStepperWithErrorsApp>;
    let processflow: SbbProcessflow;

    function createFixture(showErrorByDefault: boolean | undefined) {
      fixture = createComponent(
        SbbHorizontalStepperWithErrorsApp,
        [
          {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: showErrorByDefault },
          },
        ],
        [SbbInputModule],
      );
      fixture.detectChanges();
      processflow = fixture.debugElement.query(By.css('sbb-processflow'))!.componentInstance;
    }

    it('should show error state', () => {
      createFixture(true);
      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;

      processflow.selectedIndex = 1;
      processflow.steps.first.hasError = true;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflow._getIndicatorType(0)).toBe(STEP_STATE.ERROR);
    });

    it('should respect a custom falsy hasError value', () => {
      createFixture(true);
      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;

      processflow.selectedIndex = 1;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflow._getIndicatorType(0)).toBe(STEP_STATE.ERROR);

      processflow.steps.first.hasError = false;
      fixture.detectChanges();

      expect(processflow._getIndicatorType(0)).not.toBe(STEP_STATE.ERROR);
    });

    it('should show error state if explicitly enabled, even when disabled globally', () => {
      createFixture(undefined);
      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;

      processflow.selectedIndex = 1;
      processflow.steps.first.hasError = true;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflow._getIndicatorType(0)).toBe(STEP_STATE.ERROR);
    });
  });

  describe('processflow using defined logic', () => {
    let fixture: ComponentFixture<SbbHorizontalStepperWithErrorsApp>;
    let processflow: SbbProcessflow;

    beforeEach(() => {
      fixture = createComponent(
        SbbHorizontalStepperWithErrorsApp,
        [
          {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
          },
        ],
        [SbbInputModule],
      );
      fixture.detectChanges();
      processflow = fixture.debugElement.query(By.css('sbb-processflow'))!.componentInstance;
    });

    it('should show done state when step is completed and its not the current step', () => {
      const nextButtonNativeEl = fixture.debugElement.queryAll(By.directive(SbbProcessflowNext))[0]
        .nativeElement;

      processflow.selectedIndex = 1;
      processflow.steps.first.completed = true;
      nextButtonNativeEl.click();
      fixture.detectChanges();

      expect(processflow._getIndicatorType(0)).toBe(STEP_STATE.DONE);
    });

    it('should show edit state when step is editable and its the current step', () => {
      processflow.selectedIndex = 1;
      processflow.steps.toArray()[1].editable = true;
      fixture.detectChanges();

      expect(processflow._getIndicatorType(1)).toBe(STEP_STATE.EDIT);
    });
  });

  describe('indirect descendants', () => {
    it('should be able to change steps when steps are indirect descendants', () => {
      const fixture = createComponent(StepperWithIndirectDescendantSteps);
      fixture.detectChanges();

      const stepHeaders = fixture.debugElement.queryAll(By.css('.sbb-processflow-header'));
      const processflowComponent = fixture.debugElement.query(
        By.directive(SbbProcessflow),
      )!.componentInstance;

      expect(processflowComponent.selectedIndex).toBe(0);
      expect(processflowComponent.selected instanceof SbbStep).toBe(true);

      // select the second step
      let stepHeaderEl = stepHeaders[1].nativeElement;
      stepHeaderEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(1);
      expect(processflowComponent.selected instanceof SbbStep).toBe(true);

      // select the third step
      stepHeaderEl = stepHeaders[2].nativeElement;
      stepHeaderEl.click();
      fixture.detectChanges();

      expect(processflowComponent.selectedIndex).toBe(2);
      expect(processflowComponent.selected instanceof SbbStep).toBe(true);
    });
  });

  it('should be able to toggle steps via ngIf', () => {
    const fixture = createComponent(StepperWithNgIf);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.sbb-step-header').length).toBe(1);

    fixture.componentInstance.showStep2 = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.sbb-step-header').length).toBe(2);
  });

  it('should not pick up the steps from descendant processflows', () => {
    const fixture = createComponent(NestedSteppers);
    fixture.detectChanges();
    const processflows = fixture.componentInstance.processflows.toArray();

    expect(processflows[0].steps.length).toBe(3);
    expect(processflows[1].steps.length).toBe(2);
  });

  it('should not throw when trying to change steps after initializing to an out-of-bounds index', () => {
    const fixture = createComponent(StepperWithStaticOutOfBoundsIndex);
    fixture.detectChanges();
    const processflow = fixture.componentInstance.processflow;

    expect(processflow.selectedIndex).toBe(0);
    expect(processflow.selected).toBeTruthy();

    expect(() => {
      processflow.selectedIndex = 1;
      fixture.detectChanges();
    }).not.toThrow();

    expect(processflow.selectedIndex).toBe(1);
    expect(processflow.selected).toBeTruthy();
  });

  describe('processflow with lazy content', () => {
    it('should render the content of the selected step on init', () => {
      const fixture = createComponent(StepperWithLazyContent);
      const element = fixture.nativeElement;
      fixture.componentInstance.selectedIndex = 1;
      fixture.detectChanges();

      expect(element.textContent).not.toContain('Step 1 content');
      expect(element.textContent).toContain('Step 2 content');
      expect(element.textContent).not.toContain('Step 3 content');
    });

    it('should render the content of steps when the user navigates to them', () => {
      const fixture = createComponent(StepperWithLazyContent);
      const element = fixture.nativeElement;
      fixture.componentInstance.selectedIndex = 0;
      fixture.detectChanges();

      expect(element.textContent).toContain('Step 1 content');
      expect(element.textContent).not.toContain('Step 2 content');
      expect(element.textContent).not.toContain('Step 3 content');

      fixture.componentInstance.selectedIndex = 1;
      fixture.detectChanges();

      expect(element.textContent).toContain('Step 1 content');
      expect(element.textContent).toContain('Step 2 content');
      expect(element.textContent).not.toContain('Step 3 content');

      fixture.componentInstance.selectedIndex = 2;
      fixture.detectChanges();

      expect(element.textContent).toContain('Step 1 content');
      expect(element.textContent).toContain('Step 2 content');
      expect(element.textContent).toContain('Step 3 content');
    });
  });
});

/** Asserts that keyboard interaction works correctly. */
function assertCorrectKeyboardInteraction(
  fixture: ComponentFixture<any>,
  stepHeaders: DebugElement[],
) {
  const processflowComponent = fixture.debugElement.query(
    By.directive(SbbProcessflow),
  )!.componentInstance;
  const nextKey = RIGHT_ARROW;
  const prevKey = LEFT_ARROW;

  expect(processflowComponent._getFocusIndex()).toBe(0);
  expect(processflowComponent.selectedIndex).toBe(0);

  let stepHeaderEl = stepHeaders[0].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', nextKey);
  fixture.detectChanges();

  expect(processflowComponent._getFocusIndex())
    .withContext('Expected index of focused step to increase by 1 after pressing the next key.')
    .toBe(1);
  expect(processflowComponent.selectedIndex)
    .withContext('Expected index of selected step to remain unchanged after pressing the next key.')
    .toBe(0);

  stepHeaderEl = stepHeaders[1].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', ENTER);
  fixture.detectChanges();

  expect(processflowComponent._getFocusIndex())
    .withContext('Expected index of focused step to remain unchanged after ENTER event.')
    .toBe(1);
  expect(processflowComponent.selectedIndex)
    .withContext(
      'Expected index of selected step to change to index of focused step after ENTER event.',
    )
    .toBe(1);

  stepHeaderEl = stepHeaders[1].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', prevKey);
  fixture.detectChanges();

  expect(processflowComponent._getFocusIndex())
    .withContext('Expected index of focused step to decrease by 1 after pressing the previous key.')
    .toBe(0);
  expect(processflowComponent.selectedIndex)
    .withContext(
      'Expected index of selected step to remain unchanged after pressing the previous key.',
    )
    .toBe(1);

  // When the focus is on the last step and right arrow key is pressed, the focus should cycle
  // through to the first step.
  processflowComponent._keyManager.updateActiveItem(2);
  stepHeaderEl = stepHeaders[2].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', nextKey);
  fixture.detectChanges();

  expect(processflowComponent._getFocusIndex())
    .withContext(
      'Expected index of focused step to cycle through to index 0 after pressing the next key.',
    )
    .toBe(0);
  expect(processflowComponent.selectedIndex)
    .withContext('Expected index of selected step to remain unchanged after pressing the next key.')
    .toBe(1);

  stepHeaderEl = stepHeaders[0].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', SPACE);
  fixture.detectChanges();

  expect(processflowComponent._getFocusIndex())
    .withContext('Expected index of focused to remain unchanged after SPACE event.')
    .toBe(0);
  expect(processflowComponent.selectedIndex)
    .withContext(
      'Expected index of selected step to change to index of focused step after SPACE event.',
    )
    .toBe(0);

  const endEvent = dispatchKeyboardEvent(stepHeaderEl, 'keydown', END);
  expect(processflowComponent._getFocusIndex())
    .withContext('Expected last step to be focused when pressing END.')
    .toBe(stepHeaders.length - 1);
  expect(endEvent.defaultPrevented)
    .withContext('Expected default END action to be prevented.')
    .toBe(true);

  const homeEvent = dispatchKeyboardEvent(stepHeaderEl, 'keydown', HOME);
  expect(processflowComponent._getFocusIndex())
    .withContext('Expected first step to be focused when pressing HOME.')
    .toBe(0);
  expect(homeEvent.defaultPrevented)
    .withContext('Expected default HOME action to be prevented.')
    .toBe(true);
}

/** Asserts that arrow key direction works correctly in RTL mode. */
function assertArrowKeyInteractionInRtl(
  fixture: ComponentFixture<any>,
  stepHeaders: DebugElement[],
) {
  const processflowComponent = fixture.debugElement.query(
    By.directive(SbbProcessflow),
  )!.componentInstance;

  expect(processflowComponent._getFocusIndex()).toBe(0);

  let stepHeaderEl = stepHeaders[0].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', LEFT_ARROW);
  fixture.detectChanges();

  expect(processflowComponent._getFocusIndex()).toBe(1);

  stepHeaderEl = stepHeaders[1].nativeElement;
  dispatchKeyboardEvent(stepHeaderEl, 'keydown', RIGHT_ARROW);
  fixture.detectChanges();

  expect(processflowComponent._getFocusIndex()).toBe(0);
}

/** Asserts that keyboard interaction works correctly when the user is pressing a modifier key. */
function assertSelectKeyWithModifierInteraction(
  fixture: ComponentFixture<any>,
  stepHeaders: DebugElement[],
  selectionKey: number,
) {
  const processflowComponent = fixture.debugElement.query(
    By.directive(SbbProcessflow),
  )!.componentInstance;
  const modifiers = ['altKey', 'shiftKey', 'ctrlKey', 'metaKey'];

  expect(processflowComponent._getFocusIndex()).toBe(0);
  expect(processflowComponent.selectedIndex).toBe(0);

  dispatchKeyboardEvent(stepHeaders[0].nativeElement, 'keydown', RIGHT_ARROW);
  fixture.detectChanges();

  expect(processflowComponent._getFocusIndex())
    .withContext('Expected index of focused step to increase by 1 after pressing the next key.')
    .toBe(1);
  expect(processflowComponent.selectedIndex)
    .withContext('Expected index of selected step to remain unchanged after pressing the next key.')
    .toBe(0);

  modifiers.forEach((modifier) => {
    const event = createKeyboardEvent('keydown', selectionKey);
    Object.defineProperty(event, modifier, { get: () => true });
    dispatchEvent(stepHeaders[1].nativeElement, event);
    fixture.detectChanges();

    expect(processflowComponent.selectedIndex).toBe(
      0,
      `Expected selected index to remain unchanged ` +
        `when pressing the selection key with ${modifier} modifier.`,
    );
    expect(event.defaultPrevented).toBe(false);
  });
}

function asyncValidator(minLength: number, validationTrigger: Subject<void>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return validationTrigger.pipe(
      map(() =>
        control.value && control.value.length >= minLength ? null : { asyncValidation: {} },
      ),
      take(1),
    );
  };
}

function createComponent<T>(
  component: Type<T>,
  providers: Provider[] = [],
  imports: any[] = [],
): ComponentFixture<T> {
  TestBed.configureTestingModule({
    imports: [
      SbbProcessflowModule,
      SbbButtonModule,
      SbbIconTestingModule,
      NoopAnimationsModule,
      ReactiveFormsModule,
      ...imports,
      component,
    ],
    providers: [{ provide: Directionality, useFactory: () => dir }, ...providers],
  }).compileComponents();

  return TestBed.createComponent<T>(component);
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <sbb-processflow>
        <sbb-step [stepControl]="formGroup.get('firstNameCtrl')">
          <ng-template sbbStepLabel>Step 1</ng-template>
          <sbb-form-field>
            <sbb-label>First name</sbb-label>
            <input sbbInput formControlName="firstNameCtrl" required />
            <sbb-error>This field is required</sbb-error>
          </sbb-form-field>
          <div>
            <button sbb-button sbbProcessflowPrevious>Back</button>
            <button sbb-button sbbProcessflowNext>Next</button>
          </div>
        </sbb-step>
        <sbb-step>
          <ng-template sbbStepLabel>Step 2</ng-template>
          Content 2
          <div>
            <button sbb-button sbbProcessflowPrevious>Back</button>
            <button sbb-button sbbProcessflowNext>Next</button>
          </div>
        </sbb-step>
      </sbb-processflow>
    </form>
  `,
  imports: [SbbProcessflowModule, SbbButtonModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class SbbHorizontalStepperWithErrorsApp implements OnInit {
  formGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      firstNameCtrl: ['', Validators.required],
      lastNameCtrl: ['', Validators.required],
    });
  }
}

@Component({
  template: `
    <sbb-processflow>
      <sbb-step>
        <ng-template sbbStepLabel>Step 1</ng-template>
        Content 1
        <div>
          <button sbb-button sbbProcessflowPrevious>Back</button>
          <button sbb-button sbbProcessflowNext>Next</button>
        </div>
      </sbb-step>
      <sbb-step>
        <ng-template sbbStepLabel>Step 2</ng-template>
        Content 2
        <div>
          <button sbb-button sbbProcessflowPrevious>Back</button>
          <button sbb-button sbbProcessflowNext>Next</button>
        </div>
      </sbb-step>
      <sbb-step [label]="inputLabel" optional>
        Content 3
        <div>
          <button sbb-button sbbProcessflowPrevious>Back</button>
          <button sbb-button sbbProcessflowNext>Next</button>
        </div>
      </sbb-step>
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule, SbbButtonModule],
  standalone: true,
})
class SimpleSbbHorizontalStepperApp {
  inputLabel = 'Step 3';
}

@Component({
  template: `
    <sbb-processflow>
      <sbb-step>
        <ng-template sbbStepLabel>Step 1</ng-template>
        Content 1
        <div>
          <button sbb-button sbbProcessflowPrevious>Back</button>
          <button sbb-button sbbProcessflowNext>Next</button>
        </div>
      </sbb-step>
      @if (showStepTwo) {
        <sbb-step>
          <ng-template sbbStepLabel>Step 2</ng-template>
          Content 2
          <div>
            <button sbb-button sbbProcessflowPrevious>Back</button>
            <button sbb-button sbbProcessflowNext>Next</button>
          </div>
        </sbb-step>
      }
      <sbb-step [label]="inputLabel">
        Content 3
        <div>
          <button sbb-button sbbProcessflowPrevious>Back</button>
          <button sbb-button sbbProcessflowNext>Next</button>
        </div>
      </sbb-step>
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule, SbbButtonModule],
  standalone: true,
})
class SimpleSbbVerticalStepperApp {
  inputLabel = 'Step 3';
  showStepTwo = true;
}

@Component({
  template: `
    <sbb-processflow linear>
      <sbb-step [stepControl]="oneGroup">
        <form [formGroup]="oneGroup">
          <ng-template sbbStepLabel>Step one</ng-template>
          <input formControlName="oneCtrl" required />
          <div>
            <button sbb-button sbbProcessflowPrevious>Back</button>
            <button sbb-button sbbProcessflowNext>Next</button>
          </div>
        </form>
      </sbb-step>
      <sbb-step [stepControl]="twoGroup">
        <form [formGroup]="twoGroup">
          <ng-template sbbStepLabel>Step two</ng-template>
          <input formControlName="twoCtrl" required />
          <div>
            <button sbb-button sbbProcessflowPrevious>Back</button>
            <button sbb-button sbbProcessflowNext>Next</button>
          </div>
        </form>
      </sbb-step>
      <sbb-step [stepControl]="threeGroup" optional>
        <form [formGroup]="threeGroup">
          <ng-template sbbStepLabel>Step two</ng-template>
          <input formControlName="threeCtrl" />
          <div>
            <button sbb-button sbbProcessflowPrevious>Back</button>
            <button sbb-button sbbProcessflowNext>Next</button>
          </div>
        </form>
      </sbb-step>
      <sbb-step> Done </sbb-step>
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule, SbbButtonModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class LinearSbbVerticalStepperApp implements OnInit {
  oneGroup: FormGroup;
  twoGroup: FormGroup;
  threeGroup: FormGroup;

  validationTrigger = new Subject<void>();

  ngOnInit() {
    this.oneGroup = new FormGroup({
      oneCtrl: new FormControl('', Validators.required),
    });
    this.twoGroup = new FormGroup({
      twoCtrl: new FormControl('', Validators.required, asyncValidator(3, this.validationTrigger)),
    });
    this.threeGroup = new FormGroup({
      threeCtrl: new FormControl('', Validators.pattern(VALID_REGEX)),
    });
  }
}

@Component({
  template: `
    <sbb-processflow [linear]="true" [selectedIndex]="index">
      <sbb-step label="One"></sbb-step>
      <sbb-step label="Two"></sbb-step>
      <sbb-step label="Three"></sbb-step>
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule],
  standalone: true,
})
class SimplePreselectedSbbHorizontalStepperApp {
  index = 0;
}

@Component({
  template: `
    <sbb-processflow linear>
      @for (step of steps; track step) {
        <sbb-step [label]="step.label" [completed]="step.completed"></sbb-step>
      }
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule],
  standalone: true,
})
class SimpleStepperWithoutStepControl {
  steps = [
    { label: 'One', completed: false },
    { label: 'Two', completed: false },
    { label: 'Three', completed: false },
  ];
}

@Component({
  template: `
    <sbb-processflow linear>
      @for (step of steps; track step) {
        <sbb-step
          [label]="step.label"
          [stepControl]="step.control"
          [completed]="step.completed"
        ></sbb-step>
      }
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class SimpleStepperWithStepControlAndCompletedBinding {
  steps = [
    { label: 'One', completed: false, control: new FormControl('') },
    { label: 'Two', completed: false, control: new FormControl('') },
    { label: 'Three', completed: false, control: new FormControl('') },
  ];
}

@Component({
  template: `
    <sbb-processflow linear>
      <sbb-step label="Step 1" [stepControl]="controls[0]"></sbb-step>
      <sbb-step label="Step 2" [stepControl]="controls[1]" [optional]="step2Optional"></sbb-step>
      <sbb-step label="Step 3" [stepControl]="controls[2]"></sbb-step>
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule, SbbButtonModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class LinearStepperWithValidOptionalStep {
  controls = [0, 0, 0].map(() => new FormControl(''));
  step2Optional = false;
}

@Component({
  template: `
    <sbb-processflow>
      <sbb-step [aria-label]="ariaLabel" [aria-labelledby]="ariaLabelledby" label="One"></sbb-step>
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule],
  standalone: true,
})
class StepperWithAriaInputs {
  ariaLabel: string;
  ariaLabelledby: string;
}

@Component({
  template: `
    <sbb-processflow>
      @if (true) {
        <sbb-step label="Step 1">Content 1</sbb-step>
        <sbb-step label="Step 2">Content 2</sbb-step>
        <sbb-step label="Step 3">Content 3</sbb-step>
      }
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule],
  standalone: true,
})
class StepperWithIndirectDescendantSteps {}

@Component({
  template: `
    <sbb-processflow>
      <sbb-step>
        <ng-template sbbStepLabel>Step 1</ng-template>
      </sbb-step>

      @if (showStep2) {
        <sbb-step>
          <ng-template sbbStepLabel>Step 2</ng-template>
        </sbb-step>
      }
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule],
  standalone: true,
})
class StepperWithNgIf {
  showStep2 = false;
}

@Component({
  template: `
    <sbb-processflow>
      <sbb-step label="Step 1">Content 1</sbb-step>
      <sbb-step label="Step 2">Content 2</sbb-step>
      <sbb-step label="Step 3">
        <sbb-processflow>
          <sbb-step label="Sub-Step 1">Sub-Content 1</sbb-step>
          <sbb-step label="Sub-Step 2">Sub-Content 2</sbb-step>
        </sbb-processflow>
      </sbb-step>
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule],
  standalone: true,
})
class NestedSteppers {
  @ViewChildren(SbbProcessflow) processflows: QueryList<SbbProcessflow>;
}

@Component({
  template: `
    <sbb-processflow selectedIndex="1337">
      <sbb-step label="Step 1">Content 1</sbb-step>
      <sbb-step label="Step 2">Content 2</sbb-step>
      <sbb-step label="Step 3">Content 3</sbb-step>
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule],
  standalone: true,
})
class StepperWithStaticOutOfBoundsIndex {
  @ViewChild(SbbProcessflow) processflow: SbbProcessflow;
}

@Component({
  template: `
    <sbb-processflow [selectedIndex]="selectedIndex">
      <sbb-step>
        <ng-template sbbStepLabel>Step 1</ng-template>
        <ng-template sbbStepContent>Step 1 content</ng-template>
      </sbb-step>
      <sbb-step>
        <ng-template sbbStepLabel>Step 2</ng-template>
        <ng-template sbbStepContent>Step 2 content</ng-template>
      </sbb-step>
      <sbb-step>
        <ng-template sbbStepLabel>Step 3</ng-template>
        <ng-template sbbStepContent>Step 3 content</ng-template>
      </sbb-step>
    </sbb-processflow>
  `,
  imports: [SbbProcessflowModule],
  standalone: true,
})
class StepperWithLazyContent {
  selectedIndex = 0;
}
