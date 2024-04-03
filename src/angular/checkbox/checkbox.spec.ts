import { ChangeDetectionStrategy, Component, DebugElement, Type, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
} from '@angular/core/testing';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { dispatchFakeEvent } from '@sbb-esta/angular/core/testing';

import {
  SbbCheckbox,
  SbbCheckboxChange,
  SbbCheckboxModule,
  SBB_CHECKBOX_DEFAULT_OPTIONS,
} from './index';

describe('SbbCheckbox', () => {
  let fixture: ComponentFixture<any>;

  function createComponent<T>(componentType: Type<T>) {
    TestBed.configureTestingModule({
      imports: [componentType],
    }).compileComponents();

    return TestBed.createComponent<T>(componentType);
  }

  describe('basic behaviors', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: SbbCheckbox;
    let testComponent: SingleCheckbox;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      fixture = createComponent(SingleCheckbox);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
      labelElement = <HTMLLabelElement>checkboxNativeElement.querySelector('label');
    });

    it('should add and remove the checked state', () => {
      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-checked');
      expect(inputElement.checked).toBe(false);
      expect(inputElement.hasAttribute('aria-checked'))
        .withContext('Expect aria-checked attribute to not be used')
        .toBe(false);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxNativeElement.classList).toContain('sbb-selection-checked');
      expect(inputElement.checked).toBe(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-checked');
      expect(inputElement.checked).toBe(false);
    });

    it('should add and remove indeterminate state', () => {
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-checked');
      expect(inputElement.checked).toBe(false);
      expect(inputElement.indeterminate).toBe(false);

      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).toContain('sbb-selection-indeterminate');
      expect(inputElement.checked).toBe(false);
      expect(inputElement.indeterminate).toBe(true);

      testComponent.isIndeterminate = false;
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-indeterminate');
      expect(inputElement.checked).toBe(false);
      expect(inputElement.indeterminate).toBe(false);
    });

    it('should set indeterminate to false when input clicked', fakeAsync(() => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.indeterminate).toBe(true);
      expect(inputElement.indeterminate).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      // Flush the microtasks because the forms module updates the model state asynchronously.
      flush();

      // The checked property has been updated from the model and now the view needs
      // to reflect the state change.
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(inputElement.indeterminate).toBe(false);
      expect(inputElement.checked).toBe(true);
      expect(testComponent.isIndeterminate).toBe(false);

      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.indeterminate).toBe(true);
      expect(inputElement.indeterminate).toBe(true);
      expect(inputElement.checked).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      // Flush the microtasks because the forms module updates the model state asynchronously.
      flush();

      // The checked property has been updated from the model and now the view needs
      // to reflect the state change.
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(inputElement.indeterminate).toBe(false);
      expect(inputElement.checked).toBe(false);
      expect(testComponent.isIndeterminate).toBe(false);
    }));

    it('should not set indeterminate to false when checked is set programmatically', () => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.indeterminate).toBe(true);
      expect(inputElement.indeterminate).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(inputElement.indeterminate).toBe(true);
      expect(inputElement.checked).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(inputElement.indeterminate).toBe(true);
      expect(inputElement.checked).toBe(false);
      expect(testComponent.isIndeterminate).toBe(true);
    });

    it('should change native element checked when check programmatically', () => {
      expect(inputElement.checked).toBe(false);

      checkboxInstance.checked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
    });

    it('should toggle checked state on click', () => {
      expect(checkboxInstance.checked).toBe(false);

      labelElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);

      labelElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
    });

    it('should change from indeterminate to checked on click', fakeAsync(() => {
      testComponent.isChecked = false;
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxInstance.indeterminate).toBe(true);

      checkboxInstance._onInputClick(<Event>{ stopPropagation: () => {} });

      // Flush the microtasks because the indeterminate state will be updated in the next tick.
      flush();

      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxInstance.indeterminate).toBe(false);

      checkboxInstance._onInputClick(<Event>{ stopPropagation: () => {} });
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxInstance.indeterminate).toBe(false);

      flush();
    }));

    it('should add and remove disabled state', () => {
      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-disabled');
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(checkboxNativeElement.classList).toContain('sbb-selection-disabled');
      expect(inputElement.disabled).toBe(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-disabled');
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);
    });

    it('should not toggle `checked` state upon interation while disabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      checkboxNativeElement.click();
      expect(checkboxInstance.checked).toBe(false);
    });

    it('should overwrite indeterminate state when clicked', fakeAsync(() => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      inputElement.click();
      fixture.detectChanges();

      // Flush the microtasks because the indeterminate state will be updated in the next tick.
      flush();

      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxInstance.indeterminate).toBe(false);
    }));

    it('should preserve the user-provided id', () => {
      expect(checkboxNativeElement.id).toBe('simple-check');
      expect(inputElement.id).toBe('simple-check-input');
    });

    it('should generate a unique id for the checkbox input if no id is set', () => {
      testComponent.checkboxId = null;
      fixture.detectChanges();

      expect(checkboxInstance.inputId).toMatch(/sbb-checkbox-\d+/);
      expect(inputElement.id).toBe(checkboxInstance.inputId);
    });

    it('should project the checkbox content into the label element', () => {
      const label = <HTMLLabelElement>checkboxNativeElement.querySelector('.sbb-selection-content');
      expect(label.textContent!.trim()).toBe('Simple checkbox');
    });

    it('should make the host element a tab stop', () => {
      expect(inputElement.tabIndex).toBe(0);
    });

    it('should trigger the click event once when clicking on the label', () => {
      spyOn(testComponent, 'onCheckboxClick');

      expect(inputElement.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-checked');

      labelElement.click();
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).toContain('sbb-selection-checked');
      expect(inputElement.checked).toBe(true);

      expect(testComponent.onCheckboxClick).toHaveBeenCalledTimes(1);
    });

    it('should trigger a change event when the native input does', fakeAsync(() => {
      spyOn(testComponent, 'onCheckboxChange');

      expect(inputElement.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-checked');

      labelElement.click();
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(checkboxNativeElement.classList).toContain('sbb-selection-checked');

      fixture.detectChanges();
      flush();

      // The change event shouldn't fire, because the value change was not caused
      // by any interaction.
      expect(testComponent.onCheckboxChange).toHaveBeenCalledTimes(1);
    }));

    it('should not trigger the change event by changing the native value', fakeAsync(() => {
      spyOn(testComponent, 'onCheckboxChange');

      expect(inputElement.checked).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-checked');

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(inputElement.checked).toBe(true);
      expect(checkboxNativeElement.classList).toContain('sbb-selection-checked');

      fixture.detectChanges();
      flush();

      // The change event shouldn't fire, because the value change was not caused
      // by any interaction.
      expect(testComponent.onCheckboxChange).not.toHaveBeenCalled();
    }));

    it('should forward the required attribute', () => {
      testComponent.isRequired = true;
      fixture.detectChanges();

      expect(inputElement.required).toBe(true);

      testComponent.isRequired = false;
      fixture.detectChanges();

      expect(inputElement.required).toBe(false);
    });

    it('should focus on underlying input element when focus() is called', () => {
      expect(document.activeElement).not.toBe(inputElement);

      checkboxInstance.focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputElement);
    });

    it('should forward the value to input element', () => {
      testComponent.checkboxValue = 'basic_checkbox';
      fixture.detectChanges();

      expect(inputElement.value).toBe('basic_checkbox');
    });

    it('should remove the SVG checkmark from the tab order', () => {
      expect(checkboxNativeElement.querySelector('svg')!.getAttribute('focusable')).toBe('false');
    });

    describe(`when SBB_CHECKBOX_CLICK_ACTION is 'check'`, () => {
      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          imports: [SingleCheckbox],
          providers: [
            { provide: SBB_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check' } },
          ],
        });

        fixture = createComponent(SingleCheckbox);
        fixture.detectChanges();

        checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
        checkboxNativeElement = checkboxDebugElement.nativeElement;
        checkboxInstance = checkboxDebugElement.componentInstance;
        testComponent = fixture.debugElement.componentInstance;

        inputElement = checkboxNativeElement.querySelector('input') as HTMLInputElement;
        labelElement = checkboxNativeElement.querySelector('label') as HTMLLabelElement;
      });

      it('should not set `indeterminate` to false on click if check is set', fakeAsync(() => {
        testComponent.isIndeterminate = true;
        inputElement.click();

        fixture.detectChanges();
        flush();
        fixture.detectChanges();
        expect(inputElement.checked).toBe(true);
        expect(checkboxNativeElement.classList).toContain('sbb-selection-checked');
        expect(inputElement.indeterminate).toBe(true);
        expect(checkboxNativeElement.classList).toContain('sbb-selection-indeterminate');
      }));
    });

    describe(`when SBB_CHECKBOX_CLICK_ACTION is 'noop'`, () => {
      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          imports: [SingleCheckbox],
          providers: [{ provide: SBB_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }],
        });

        fixture = createComponent(SingleCheckbox);
        fixture.detectChanges();

        checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
        checkboxNativeElement = checkboxDebugElement.nativeElement;
        checkboxInstance = checkboxDebugElement.componentInstance;
        testComponent = fixture.debugElement.componentInstance;
        inputElement = checkboxNativeElement.querySelector('input') as HTMLInputElement;
        labelElement = checkboxNativeElement.querySelector('label') as HTMLLabelElement;
      });

      it('should not change `indeterminate` on click if noop is set', fakeAsync(() => {
        testComponent.isIndeterminate = true;
        inputElement.click();

        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(inputElement.checked).toBe(false);
        expect(checkboxNativeElement.classList).not.toContain('sbb-selection-checked');
        expect(inputElement.indeterminate).toBe(true);
        expect(checkboxNativeElement.classList).toContain('sbb-selection-indeterminate');
      }));

      it(`should not change 'checked' or 'indeterminate' on click if noop is set`, fakeAsync(() => {
        testComponent.isChecked = true;
        testComponent.isIndeterminate = true;
        inputElement.click();

        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(inputElement.checked).toBe(true);
        expect(checkboxNativeElement.classList).toContain('sbb-selection-checked');
        expect(inputElement.indeterminate).toBe(true);
        expect(checkboxNativeElement.classList).toContain('sbb-selection-indeterminate');

        testComponent.isChecked = false;
        inputElement.click();

        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(inputElement.checked).toBe(false);
        expect(checkboxNativeElement.classList).not.toContain('sbb-selection-checked');
        expect(inputElement.indeterminate)
          .withContext('indeterminate should not change')
          .toBe(true);
        expect(checkboxNativeElement.classList).toContain('sbb-selection-indeterminate');
      }));
    });
  });

  describe('with change event and no initial value', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: SbbCheckbox;
    let testComponent: CheckboxWithChangeEvent;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithChangeEvent);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
      labelElement = <HTMLLabelElement>checkboxNativeElement.querySelector('label');
    });

    it('should emit the event to the change observable', () => {
      const changeSpy = jasmine.createSpy('onChangeObservable');

      checkboxInstance.change.subscribe(changeSpy);

      fixture.detectChanges();
      expect(changeSpy).not.toHaveBeenCalled();

      // When changing the native `checked` property the checkbox will not fire a change event,
      // because the element is not focused and it's not the native behavior of the input element.
      labelElement.click();
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit a DOM event to the change output', fakeAsync(() => {
      fixture.detectChanges();
      expect(testComponent.lastEvent).toBeUndefined();

      // Trigger the click on the inputElement, because the input will probably
      // emit a DOM event to the change output.
      inputElement.click();
      fixture.detectChanges();
      flush();

      // We're checking the arguments type / emitted value to be a boolean, because sometimes the
      // emitted value can be a DOM Event, which is not valid.
      // See angular/angular#4059
      expect(testComponent.lastEvent.checked).toBe(true);
    }));
  });

  describe('aria handling', () => {
    it('should use the provided aria-label', () => {
      fixture = createComponent(CheckboxWithAriaLabel);
      const checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      const checkboxNativeElement = checkboxDebugElement.nativeElement;
      const inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-label')).toBe('Super effective');
    });

    it('should not set the aria-label attribute if no value is provided', () => {
      fixture = createComponent(SingleCheckbox);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('input').hasAttribute('aria-label')).toBe(false);
    });

    it('should use the provided aria-labelledby', () => {
      fixture = createComponent(CheckboxWithAriaLabelledby);
      const checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      const checkboxNativeElement = checkboxDebugElement.nativeElement;
      const inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-labelledby')).toBe('some-id');
    });

    it('should not assign aria-labelledby if none is provided', () => {
      fixture = createComponent(SingleCheckbox);
      const checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      const checkboxNativeElement = checkboxDebugElement.nativeElement;
      const inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-labelledby')).toBe(null);
    });

    it('should clear the static aria attributes from the host node', () => {
      fixture = createComponent(CheckboxWithStaticAriaAttributes);
      const checkbox = fixture.debugElement.query(By.directive(SbbCheckbox))!.nativeElement;
      fixture.detectChanges();

      expect(checkbox.hasAttribute('aria')).toBe(false);
      expect(checkbox.hasAttribute('aria-labelledby')).toBe(false);
    });
  });

  describe('with provided aria-describedby ', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let inputElement: HTMLInputElement;

    it('should use the provided aria-describedby', () => {
      fixture = createComponent(CheckboxWithAriaDescribedby);
      checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-describedby')).toBe('some-id');
    });

    it('should not assign aria-describedby if none is provided', () => {
      fixture = createComponent(SingleCheckbox);
      checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');

      fixture.detectChanges();
      expect(inputElement.getAttribute('aria-describedby')).toBe(null);
    });
  });

  describe('with provided tabIndex', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let testComponent: CheckboxWithTabIndex;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithTabIndex);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;
      checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
    });

    it('should preserve any given tabIndex', () => {
      expect(inputElement.tabIndex).toBe(7);
    });

    it('should preserve given tabIndex when the checkbox is disabled then enabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      testComponent.customTabIndex = 13;
      fixture.detectChanges();

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(inputElement.tabIndex).toBe(13);
    });
  });

  describe('with native tabindex attribute', () => {
    it('should properly detect native tabindex attribute', fakeAsync(() => {
      fixture = createComponent(CheckboxWithTabindexAttr);
      fixture.detectChanges();

      const checkbox = fixture.debugElement.query(By.directive(SbbCheckbox))!
        .componentInstance as SbbCheckbox;

      expect(checkbox.tabIndex)
        .withContext('Expected tabIndex property to have been set based on the native attribute')
        .toBe(5);
    }));

    it('should clear the tabindex attribute from the host element', () => {
      fixture = createComponent(CheckboxWithTabindexAttr);
      fixture.detectChanges();

      const checkbox = fixture.debugElement.query(By.directive(SbbCheckbox))!.nativeElement;
      expect(checkbox.getAttribute('tabindex')).toBeFalsy();
    });
  });

  describe('using ViewChild', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let testComponent: CheckboxUsingViewChild;

    beforeEach(() => {
      fixture = createComponent(CheckboxUsingViewChild);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      testComponent = fixture.debugElement.componentInstance;
    });

    it('should toggle checkbox disabledness correctly', () => {
      const checkboxInstance = checkboxDebugElement.componentInstance;
      const inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-disabled');
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(checkboxNativeElement.classList).toContain('sbb-selection-disabled');
      expect(inputElement.disabled).toBe(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
      expect(checkboxNativeElement.classList).not.toContain('sbb-selection-disabled');
      expect(inputElement.tabIndex).toBe(0);
      expect(inputElement.disabled).toBe(false);
    });
  });

  describe('with multiple checkboxes', () => {
    beforeEach(() => {
      fixture = createComponent(MultipleCheckboxes);
      fixture.detectChanges();
    });

    it('should assign a unique id to each checkbox', () => {
      const [firstId, secondId] = fixture.debugElement
        .queryAll(By.directive(SbbCheckbox))
        .map((debugElement) => debugElement.nativeElement.querySelector('input').id);

      expect(firstId).toMatch(/sbb-checkbox-\d+-input/);
      expect(secondId).toMatch(/sbb-checkbox-\d+-input/);
      expect(firstId).not.toEqual(secondId);
    });

    it('should not change focus origin if origin not specified', () => {
      const [firstCheckboxDebugEl, secondCheckboxDebugEl] = fixture.debugElement.queryAll(
        By.directive(SbbCheckbox),
      );
      fixture.detectChanges();

      const firstCheckboxInstance = firstCheckboxDebugEl.componentInstance as SbbCheckbox;
      const secondCheckboxInstance = secondCheckboxDebugEl.componentInstance as SbbCheckbox;

      firstCheckboxInstance.focus('mouse');
      secondCheckboxInstance.focus();

      expect(secondCheckboxDebugEl.nativeElement.classList).toContain('cdk-focused');
      expect(secondCheckboxDebugEl.nativeElement.classList).toContain('cdk-mouse-focused');
    });
  });

  describe('with ngModel', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: SbbCheckbox;
    let inputElement: HTMLInputElement;
    let ngModel: NgModel;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(CheckboxWithNgModel);

      fixture.componentInstance.isRequired = false;
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
      ngModel = checkboxDebugElement.injector.get<NgModel>(NgModel);
    }));

    it('should be pristine, untouched, and valid initially', () => {
      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.touched).toBe(false);
    });

    it('should have correct control states after interaction', fakeAsync(() => {
      inputElement.click();
      fixture.detectChanges();

      // Flush the timeout that is being created whenever a `click` event has been fired by
      // the underlying input.
      flush();

      // After the value change through interaction, the control should be dirty, but remain
      // untouched as long as the focus is still on the underlying input.
      expect(ngModel.pristine).toBe(false);
      expect(ngModel.touched).toBe(false);

      // If the input element loses focus, the control should remain dirty but should
      // also turn touched.
      dispatchFakeEvent(inputElement, 'blur');
      fixture.detectChanges();
      flushMicrotasks();

      expect(ngModel.pristine).toBe(false);
      expect(ngModel.touched).toBe(true);
    }));

    it('should mark the element as touched on blur when inside an OnPush parent', fakeAsync(() => {
      fixture.destroy();
      TestBed.resetTestingModule();
      fixture = createComponent(CheckboxWithNgModelAndOnPush);
      checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      inputElement = <HTMLInputElement>checkboxNativeElement.querySelector('input');
      ngModel = checkboxDebugElement.injector.get<NgModel>(NgModel);

      inputElement.click();
      fixture.detectChanges();
      flush();

      expect(checkboxNativeElement.classList).not.toContain('ng-touched');

      dispatchFakeEvent(inputElement, 'blur');
      fixture.detectChanges();
      flushMicrotasks();
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).toContain('ng-touched');
    }));

    it('should not throw an error when disabling while focused', fakeAsync(() => {
      expect(() => {
        // Focus the input element because after disabling, the `blur` event should automatically
        // fire and not result in a changed after checked exception. Related: #12323
        inputElement.focus();

        // Flush the two nested timeouts from the FocusMonitor that are being created on `focus`.
        flush();

        checkboxInstance.disabled = true;
        fixture.detectChanges();
        flushMicrotasks();
      }).not.toThrow();
    }));

    it('should toggle checked state on click', () => {
      expect(checkboxInstance.checked).toBe(false);

      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
    });

    it('should validate with RequiredTrue validator', () => {
      fixture.componentInstance.isRequired = true;
      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(ngModel.valid).toBe(true);

      inputElement.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(ngModel.valid).toBe(false);
    });

    it('should update the ngModel value when using the `toggle` method', fakeAsync(() => {
      const checkbox = fixture.debugElement.query(By.directive(SbbCheckbox)).componentInstance;

      expect(fixture.componentInstance.isGood).toBe(false);

      checkbox.toggle();
      fixture.detectChanges();

      expect(fixture.componentInstance.isGood).toBe(true);
    }));
  });

  describe('with name attribute', () => {
    beforeEach(() => {
      fixture = createComponent(CheckboxWithNameAttribute);
      fixture.detectChanges();
    });

    it('should forward name value to input element', () => {
      const checkboxElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      const inputElement = <HTMLInputElement>checkboxElement.nativeElement.querySelector('input');

      expect(inputElement.getAttribute('name')).toBe('test-name');
    });
  });

  describe('with form control', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxInstance: SbbCheckbox;
    let testComponent: CheckboxWithFormControl;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithFormControl);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(SbbCheckbox))!;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
      inputElement = <HTMLInputElement>checkboxDebugElement.nativeElement.querySelector('input');
    });

    it('should toggle the disabled state', () => {
      expect(checkboxInstance.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);
      expect(inputElement.disabled).toBe(true);

      testComponent.formControl.enable();
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
      expect(inputElement.disabled).toBe(false);
    });
  });
});

/** Simple component for testing a single checkbox. */
@Component({
  template: ` <div (click)="parentElementClicked = true" (keyup)="parentElementKeyedUp = true">
    <sbb-checkbox
      [id]="checkboxId"
      [required]="isRequired"
      [checked]="isChecked"
      [(indeterminate)]="isIndeterminate"
      [disabled]="isDisabled"
      [value]="checkboxValue"
      (click)="onCheckboxClick($event)"
      (change)="onCheckboxChange($event)"
    >
      Simple checkbox
    </sbb-checkbox>
  </div>`,
  standalone: true,
  imports: [SbbCheckboxModule],
})
class SingleCheckbox {
  isChecked: boolean = false;
  isRequired: boolean = false;
  isIndeterminate: boolean = false;
  isDisabled: boolean = false;
  parentElementClicked: boolean = false;
  parentElementKeyedUp: boolean = false;
  checkboxId: string | null = 'simple-check';
  checkboxValue: string = 'single_checkbox';

  onCheckboxClick: (event?: Event) => void = () => {};
  onCheckboxChange: (event?: SbbCheckboxChange) => void = () => {};
}

/** Simple component for testing an SbbCheckbox with required ngModel. */
@Component({
  template: `<sbb-checkbox [required]="isRequired" [(ngModel)]="isGood">Be good</sbb-checkbox>`,
  imports: [SbbCheckboxModule, FormsModule],
  standalone: true,
})
class CheckboxWithNgModel {
  isGood: boolean = false;
  isRequired: boolean = true;
}

@Component({
  template: `<sbb-checkbox [required]="isRequired" [(ngModel)]="isGood">Be good</sbb-checkbox>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SbbCheckboxModule, FormsModule],
  standalone: true,
})
class CheckboxWithNgModelAndOnPush extends CheckboxWithNgModel {}

/** Simple test component with multiple checkboxes. */
@Component({
  template: `
    <sbb-checkbox>Option 1</sbb-checkbox>
    <sbb-checkbox>Option 2</sbb-checkbox>
  `,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class MultipleCheckboxes {}

/** Simple test component with tabIndex */
@Component({
  template: ` <sbb-checkbox [tabIndex]="customTabIndex" [disabled]="isDisabled"> </sbb-checkbox>`,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class CheckboxWithTabIndex {
  customTabIndex: number = 7;
  isDisabled: boolean = false;
}

/** Simple test component that accesses SbbCheckbox using ViewChild. */
@Component({
  template: ` <sbb-checkbox></sbb-checkbox>`,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class CheckboxUsingViewChild {
  @ViewChild(SbbCheckbox) checkbox: SbbCheckbox;

  set isDisabled(value: boolean) {
    this.checkbox.disabled = value;
  }
}

/** Simple test component with an aria-label set. */
@Component({
  template: `<sbb-checkbox aria-label="Super effective"></sbb-checkbox>`,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class CheckboxWithAriaLabel {}

/** Simple test component with an aria-label set. */
@Component({
  template: `<sbb-checkbox aria-labelledby="some-id"></sbb-checkbox>`,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class CheckboxWithAriaLabelledby {}

/** Simple test component with an aria-describedby set. */
@Component({
  template: `<sbb-checkbox aria-describedby="some-id"></sbb-checkbox>`,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class CheckboxWithAriaDescribedby {}

/** Simple test component with name attribute */
@Component({
  template: `<sbb-checkbox name="test-name"></sbb-checkbox>`,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class CheckboxWithNameAttribute {}

/** Simple test component with change event */
@Component({
  template: `<sbb-checkbox (change)="lastEvent = $event"></sbb-checkbox>`,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class CheckboxWithChangeEvent {
  lastEvent: SbbCheckboxChange;
}

/** Test component with reactive forms */
@Component({
  template: `<sbb-checkbox [formControl]="formControl"></sbb-checkbox>`,
  imports: [SbbCheckboxModule, ReactiveFormsModule],
  standalone: true,
})
class CheckboxWithFormControl {
  formControl = new FormControl(false);
}

/** Test component with the native tabindex attribute. */
@Component({
  template: `<sbb-checkbox tabindex="5"></sbb-checkbox>`,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class CheckboxWithTabindexAttr {}

@Component({
  template: `<sbb-checkbox aria-label="Checkbox" aria-labelledby="something"></sbb-checkbox>`,
  imports: [SbbCheckboxModule],
  standalone: true,
})
class CheckboxWithStaticAriaAttributes {}
