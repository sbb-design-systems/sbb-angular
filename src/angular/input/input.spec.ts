import { getSupportedInputTypes } from '@angular/cdk/platform';
import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Provider,
  Type,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SbbErrorStateMatcher, SbbShowOnDirtyErrorStateMatcher } from '@sbb-esta/angular/core';
import {
  dispatchFakeEvent,
  switchToLean,
  wrappedErrorMessage,
} from '@sbb-esta/angular/core/testing';
import {
  getSbbFormFieldMissingControlError,
  SbbFormFieldModule,
} from '@sbb-esta/angular/form-field';

import { SbbInput } from './input';
import { SBB_INPUT_VALUE_ACCESSOR } from './input-value-accessor';
import { SbbInputModule } from './input.module';

/** Custom component that never has a value. Used for testing the `SBB_INPUT_VALUE_ACCESSOR`. */
@Directive({
  selector: 'input[customInputAccessor]',
  providers: [
    {
      provide: SBB_INPUT_VALUE_ACCESSOR,
      useExisting: CustomSbbInputAccessor,
    },
  ],
  standalone: true,
})
class CustomSbbInputAccessor {
  get value() {
    return this._value;
  }
  set value(_value: any) {}
  private _value = null;
}

describe('SbbInput without forms', () => {
  it('should not be treated as empty if type is date', fakeAsync(() => {
    const fixture = createComponent(SbbInputDateTestController);
    fixture.detectChanges();

    if (getSupportedInputTypes().has('date')) {
      const el = fixture.debugElement.query(By.css('label'))!.nativeElement;
      expect(el).not.toBeNull();
      expect(el.classList.contains('sbb-form-field-empty')).toBe(false);
    }
  }));

  it('should be treated as empty if type is date on unsupported browser', fakeAsync(() => {
    const fixture = createComponent(SbbInputDateTestController);
    fixture.detectChanges();

    if (!getSupportedInputTypes().has('date')) {
      const el = fixture.debugElement.query(By.css('label'))!.nativeElement;
      expect(el).not.toBeNull();
      expect(el.classList.contains('sbb-form-field-empty')).toBe(true);
    }
  }));

  it('should treat text input type as empty at init', fakeAsync(() => {
    const fixture = createComponent(SbbInputTextTestController);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('label'))!.nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('sbb-form-field-empty')).toBe(true);
  }));

  it('should treat password input type as empty at init', fakeAsync(() => {
    const fixture = createComponent(SbbInputPasswordTestController);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('label'))!.nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('sbb-form-field-empty')).toBe(true);
  }));

  it('should treat number input type as empty at init', fakeAsync(() => {
    const fixture = createComponent(SbbInputNumberTestController);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('label'))!.nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('sbb-form-field-empty')).toBe(true);
  }));

  it('should not be empty after input entered', fakeAsync(() => {
    const fixture = createComponent(SbbInputTextTestController);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input'))!;
    let el = fixture.debugElement.query(By.css('label'))!.nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('sbb-form-field-empty')).withContext('should be empty').toBe(true);

    inputEl.nativeElement.value = 'hello';
    // Simulate input event.
    inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });
    fixture.detectChanges();

    el = fixture.debugElement.query(By.css('label'))!.nativeElement;
    expect(el.classList.contains('sbb-form-field-empty'))
      .withContext('should not be empty')
      .toBe(false);
  }));

  it('should not be empty when the value set before view init', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithValueBinding);
    fixture.detectChanges();
    const labelEl = fixture.debugElement.query(By.css('.sbb-form-field-label'))!.nativeElement;

    expect(labelEl.classList).not.toContain('sbb-form-field-empty');

    fixture.componentInstance.value = '';
    fixture.detectChanges();

    expect(labelEl.classList).toContain('sbb-form-field-empty');
  }));

  it('should add id', fakeAsync(() => {
    const fixture = createComponent(SbbInputTextTestController);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    )!.nativeElement;
    const labelElement: HTMLInputElement = fixture.debugElement.query(
      By.css('label'),
    )!.nativeElement;

    expect(inputElement.id).toBeTruthy();
    expect(inputElement.id).toEqual(labelElement.getAttribute('for')!);
  }));

  it('should add aria-owns to the label for the associated control', fakeAsync(() => {
    const fixture = createComponent(SbbInputTextTestController);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    )!.nativeElement;
    const labelElement: HTMLInputElement = fixture.debugElement.query(
      By.css('label'),
    )!.nativeElement;

    expect(labelElement.getAttribute('aria-owns')).toBe(inputElement.id);
  }));

  it('should add aria-required reflecting the required state', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithRequired);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    )!.nativeElement;

    expect(inputElement.getAttribute('aria-required'))
      .withContext('Expected aria-required to reflect required state of false')
      .toBe('false');

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(inputElement.getAttribute('aria-required'))
      .withContext('Expected aria-required to reflect required state of true')
      .toBe('true');
  }));

  it('should not overwrite existing id', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithId);
    fixture.detectChanges();

    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    )!.nativeElement;
    const labelElement: HTMLInputElement = fixture.debugElement.query(
      By.css('label'),
    )!.nativeElement;

    expect(inputElement.id).toBe('test-id');
    expect(labelElement.getAttribute('for')).toBe('test-id');
  }));

  it('validates that sbbInput child is present', fakeAsync(() => {
    const fixture = createComponent(SbbInputMissingSbbInputTestController);

    expect(() => fixture.detectChanges()).toThrowError(
      wrappedErrorMessage(getSbbFormFieldMissingControlError()),
    );
  }));

  it('validates that sbbInput child is present after initialization', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithNgIf);

    expect(() => fixture.detectChanges()).not.toThrowError(
      wrappedErrorMessage(getSbbFormFieldMissingControlError()),
    );

    fixture.componentInstance.renderInput = false;

    expect(() => fixture.detectChanges()).toThrowError(
      wrappedErrorMessage(getSbbFormFieldMissingControlError()),
    );
  }));

  it('validates the type', fakeAsync(() => {
    const fixture = createComponent(SbbInputInvalidTypeTestController);

    // Technically this throws during the OnChanges detection phase,
    // so the error is really a ChangeDetectionError and it becomes
    // hard to build a full exception to compare with.
    // We just check for any exception in this case.
    expect(() => fixture.detectChanges())
      .toThrow
      /* new SbbInputUnsupportedTypeError('file') */
      ();
  }));

  it('supports the disabled attribute as binding', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithDisabled);
    fixture.detectChanges();

    const formFieldEl = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input'))!.nativeElement;

    expect(formFieldEl.classList.contains('sbb-form-field-disabled'))
      .withContext(`Expected form field not to start out disabled.`)
      .toBe(false);
    expect(inputEl.disabled).toBe(false);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(formFieldEl.classList.contains('sbb-form-field-disabled'))
      .withContext(`Expected form field to look disabled after property is set.`)
      .toBe(true);
    expect(inputEl.disabled).toBe(true);
  }));

  it('supports the disabled attribute as binding for select', fakeAsync(() => {
    const fixture = createComponent(SbbInputSelect);
    fixture.detectChanges();

    const formFieldEl = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;
    const selectEl = fixture.debugElement.query(By.css('select'))!.nativeElement;

    expect(formFieldEl.classList.contains('sbb-form-field-disabled'))
      .withContext(`Expected form field not to start out disabled.`)
      .toBe(false);
    expect(selectEl.disabled).toBe(false);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    expect(formFieldEl.classList.contains('sbb-form-field-disabled'))
      .withContext(`Expected form field to look disabled after property is set.`)
      .toBe(true);
    expect(selectEl.disabled).toBe(true);
  }));

  it('should add a class to the form field if it has a native select', fakeAsync(() => {
    const fixture = createComponent(SbbInputSelect);
    fixture.detectChanges();

    const formField = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;

    expect(formField.classList).toContain('sbb-form-field-type-sbb-native-select');
  }));

  it('supports the required attribute as binding', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithRequired);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input'))!.nativeElement;

    expect(inputEl.required).toBe(false);

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(inputEl.required).toBe(true);
  }));

  it('supports the required attribute as binding for select', fakeAsync(() => {
    const fixture = createComponent(SbbInputSelect);
    fixture.detectChanges();

    const selectEl = fixture.debugElement.query(By.css('select'))!.nativeElement;

    expect(selectEl.required).toBe(false);

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(selectEl.required).toBe(true);
  }));

  it('supports the type attribute as binding', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithType);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input'))!.nativeElement;

    expect(inputEl.type).toBe('text');

    fixture.componentInstance.type = 'password';
    fixture.detectChanges();

    expect(inputEl.type).toBe('password');
  }));

  it('supports textarea', fakeAsync(() => {
    const fixture = createComponent(SbbInputTextareaWithBindings);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea).not.toBeNull();
  }));

  it('supports select', fakeAsync(() => {
    const fixture = createComponent(SbbInputSelect);
    fixture.detectChanges();

    const nativeSelect: HTMLTextAreaElement = fixture.nativeElement.querySelector('select');
    expect(nativeSelect).not.toBeNull();
  }));

  it('supports user binding to aria-describedby', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithSubscriptAndAriaDescribedBy);

    fixture.componentInstance.label = 'label';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

    fixture.componentInstance.userDescribedByValue = 'custom-error custom-error-two';
    fixture.detectChanges();
    expect(input.getAttribute('aria-describedby')).toBe(`custom-error custom-error-two`);

    fixture.componentInstance.userDescribedByValue = 'custom-error';
    fixture.detectChanges();
    expect(input.getAttribute('aria-describedby')).toBe(`custom-error`);

    fixture.componentInstance.showError = true;
    fixture.componentInstance.formControl.markAsTouched();
    fixture.componentInstance.formControl.setErrors({ invalid: true });
    fixture.detectChanges();
    expect(input.getAttribute('aria-describedby')).toMatch(/^custom-error sbb-error-\d+$/);

    fixture.componentInstance.label = '';
    fixture.componentInstance.userDescribedByValue = '';
    fixture.componentInstance.showError = false;
    fixture.detectChanges();
    expect(input.hasAttribute('aria-describedby')).toBe(false);
  }));

  it('should not throw if a native select does not have options', fakeAsync(() => {
    const fixture = createComponent(SbbInputSelectWithoutOptions);
    expect(() => fixture.detectChanges()).not.toThrow();
  }));

  it('should not have prefix and suffix elements when none are specified', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithId);
    fixture.detectChanges();

    const prefixEl = fixture.debugElement.query(By.css('.sbb-form-field-prefix'));
    const suffixEl = fixture.debugElement.query(By.css('.sbb-form-field-suffix'));

    expect(prefixEl).toBeNull();
    expect(suffixEl).toBeNull();
  }));

  it('should update empty class when value changes programmatically and OnPush', fakeAsync(() => {
    const fixture = createComponent(SbbInputOnPush);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const label = fixture.debugElement.query(By.css('.sbb-form-field-label'))!.nativeElement;

    expect(label.classList).withContext('Input initially empty').toContain('sbb-form-field-empty');

    component.formControl.setValue('something');
    fixture.detectChanges();

    expect(label.classList).not.toContain('sbb-form-field-empty', 'Input no longer empty');
  }));

  it('should set the focused class when the input is focused', fakeAsync(() => {
    const fixture = createComponent(SbbInputTextTestController);
    fixture.detectChanges();

    const input = fixture.debugElement
      .query(By.directive(SbbInput))!
      .injector.get<SbbInput>(SbbInput);
    const container = fixture.debugElement.query(By.css('sbb-form-field'))!.nativeElement;

    // Call the focus handler directly to avoid flakyness where
    // browsers don't focus elements if the window is minimized.
    input._focusChanged(true);
    fixture.detectChanges();

    expect(container.classList).toContain('sbb-focused');
  }));

  it('should remove the focused class if the input becomes disabled while focused', fakeAsync(() => {
    const fixture = createComponent(SbbInputTextTestController);
    fixture.detectChanges();

    const input = fixture.debugElement
      .query(By.directive(SbbInput))!
      .injector.get<SbbInput>(SbbInput);
    const container = fixture.debugElement.query(By.css('sbb-form-field'))!.nativeElement;

    // Call the focus handler directly to avoid flakyness where
    // browsers don't focus elements if the window is minimized.
    input._focusChanged(true);
    fixture.detectChanges();

    expect(container.classList).toContain('sbb-focused');

    input.disabled = true;
    fixture.detectChanges();

    expect(container.classList).not.toContain('sbb-focused');
  }));

  it('should not add the `placeholder` attribute if there is no placeholder', () => {
    const fixture = createComponent(SbbInputWithoutPlaceholder);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

    expect(input.hasAttribute('placeholder')).toBe(false);
  });

  it('should display string evaluated `placeholder` attribute', () => {
    const fixture = createComponent(SbbInputWithPlaceholder);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

    expect(input.getAttribute('placeholder')).toBe('"placeholder"');
  });

  it('should evaluate `placeholder` variable', () => {
    const fixture = createComponent(SbbInputWithVariablePlaceholder);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'))!.nativeElement;
    expect(input.getAttribute('placeholder')).toBe(null);

    fixture.componentInstance.placeholder = '';
    fixture.detectChanges();
    expect(input.getAttribute('placeholder')).toBe(null);

    fixture.componentInstance.placeholder = 'placeholder';
    fixture.detectChanges();
    expect(input.getAttribute('placeholder')).toBe('placeholder');
  });

  it('should display non angular placeholder', () => {
    const fixture = createComponent(SbbInputWithAnotherNgIf);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'))!.nativeElement;

    expect(input.getAttribute('placeholder')).toBe('My placeholder');
  });

  it('should not add the native select class if the control is not a native select', () => {
    const fixture = createComponent(SbbInputWithId);
    fixture.detectChanges();
    const formField = fixture.debugElement.query(By.css('sbb-form-field'))!.nativeElement;

    expect(formField.classList).not.toContain('sbb-form-field-type-sbb-native-select');
  });

  it(
    'should use the native input value when determining whether ' +
      'the element is empty with a custom accessor',
    fakeAsync(() => {
      const fixture = createComponent(SbbInputWithCustomAccessor, [], [], [CustomSbbInputAccessor]);
      fixture.detectChanges();
      const label = fixture.debugElement.query(By.css('label'))!.nativeElement;

      expect(label.classList).toContain('sbb-form-field-empty');

      fixture.nativeElement.querySelector('input').value = 'abc';
      fixture.detectChanges();

      expect(label.classList).not.toContain('sbb-form-field-empty');
    }),
  );

  it('should not throw when there is a default ngIf on the label element', fakeAsync(() => {
    expect(() => {
      createComponent(SbbInputWithDefaultNgIf).detectChanges();
    }).not.toThrow();
  }));

  it('should not throw when there is a default ngIf on the input element', fakeAsync(() => {
    expect(() => {
      createComponent(SbbInputWithAnotherNgIf).detectChanges();
    }).not.toThrow();
  }));
});

describe('SbbInput with forms', () => {
  describe('error messages', () => {
    let fixture: ComponentFixture<SbbInputWithFormErrorMessages>;
    let testComponent: SbbInputWithFormErrorMessages;
    let containerEl: HTMLElement;
    let inputEl: HTMLInputElement;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SbbInputWithFormErrorMessages);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      containerEl = fixture.debugElement.query(By.css('sbb-form-field'))!.nativeElement;
      inputEl = fixture.debugElement.query(By.css('input'))!.nativeElement;
    }));

    it('should not show any errors if the user has not interacted', fakeAsync(() => {
      expect(testComponent.formControl.untouched)
        .withContext('Expected untouched form control')
        .toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error message')
        .toBe(0);
      expect(inputEl.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to "false".')
        .toBe('false');
    }));

    it('should display an error message when the input is touched and invalid', fakeAsync(() => {
      expect(testComponent.formControl.invalid)
        .withContext('Expected form control to be invalid')
        .toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error message')
        .toBe(0);

      inputEl.value = 'not valid';
      testComponent.formControl.markAsTouched();
      fixture.detectChanges();
      flush();

      expect(containerEl.classList)
        .withContext('Expected container to have the invalid CSS class.')
        .toContain('sbb-form-field-invalid');
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected one error message to have been rendered.')
        .toBe(1);
      expect(inputEl.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to "true".')
        .toBe('true');
    }));

    it('should display an error message when the parent form is submitted', fakeAsync(() => {
      expect(testComponent.form.submitted)
        .withContext('Expected form not to have been submitted')
        .toBe(false);
      expect(testComponent.formControl.invalid)
        .withContext('Expected form control to be invalid')
        .toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error message')
        .toBe(0);

      inputEl.value = 'not valid';
      dispatchFakeEvent(fixture.debugElement.query(By.css('form'))!.nativeElement, 'submit');
      fixture.detectChanges();
      flush();

      expect(testComponent.form.submitted)
        .withContext('Expected form to have been submitted')
        .toBe(true);
      expect(containerEl.classList)
        .withContext('Expected container to have the invalid CSS class.')
        .toContain('sbb-form-field-invalid');
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected one error message to have been rendered.')
        .toBe(1);
      expect(inputEl.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to "true".')
        .toBe('true');
    }));

    it('should display an error message when the parent form group is submitted', fakeAsync(() => {
      fixture.destroy();
      TestBed.resetTestingModule();

      const groupFixture = createComponent(SbbInputWithFormGroupErrorMessages);
      let component: SbbInputWithFormGroupErrorMessages;

      groupFixture.detectChanges();
      component = groupFixture.componentInstance;
      containerEl = groupFixture.debugElement.query(By.css('sbb-form-field'))!.nativeElement;
      inputEl = groupFixture.debugElement.query(By.css('input'))!.nativeElement;

      expect(component.formGroup.invalid)
        .withContext('Expected form control to be invalid')
        .toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error message')
        .toBe(0);
      expect(inputEl.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to "false".')
        .toBe('false');
      expect(component.formGroupDirective.submitted)
        .withContext('Expected form not to have been submitted')
        .toBe(false);

      inputEl.value = 'not valid';
      dispatchFakeEvent(groupFixture.debugElement.query(By.css('form'))!.nativeElement, 'submit');
      groupFixture.detectChanges();
      flush();

      expect(component.formGroupDirective.submitted)
        .withContext('Expected form to have been submitted')
        .toBe(true);
      expect(containerEl.classList)
        .withContext('Expected container to have the invalid CSS class.')
        .toContain('sbb-form-field-invalid');
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected one error message to have been rendered.')
        .toBe(1);
      expect(inputEl.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to "true".')
        .toBe('true');
    }));

    it('should set the proper aria-live attribute on the error messages', fakeAsync(() => {
      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(containerEl.querySelector('sbb-error')!.getAttribute('aria-live')).toBe('polite');
    }));

    it('sets the aria-describedby to reference errors when in error state', fakeAsync(() => {
      fixture.componentInstance.formControl.markAsTouched();
      fixture.detectChanges();

      const errorIds = fixture.debugElement
        .queryAll(By.css('.sbb-error'))
        .map((el) => el.nativeElement.getAttribute('id'))
        .join(' ');
      const describedBy = inputEl.getAttribute('aria-describedby');

      expect(errorIds).withContext('errors should be shown').toBeTruthy();
      expect(describedBy).toBe(errorIds);
    }));

    it('should set `aria-invalid` to true if the input is empty', fakeAsync(() => {
      // Submit the form since it's the one that triggers the default error state matcher.
      dispatchFakeEvent(fixture.nativeElement.querySelector('form'), 'submit');
      fixture.detectChanges();
      flush();

      expect(testComponent.formControl.invalid)
        .withContext('Expected form control to be invalid')
        .toBe(true);
      expect(inputEl.value).toBeFalsy();
      expect(inputEl.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to "true".')
        .toBe('true');

      inputEl.value = 'not valid';
      fixture.detectChanges();

      expect(testComponent.formControl.invalid)
        .withContext('Expected form control to be invalid')
        .toBe(true);
      expect(inputEl.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to "true".')
        .toBe('true');
    }));
  });

  describe('custom error behavior', () => {
    it('should display an error message when a custom error matcher returns true', fakeAsync(() => {
      const fixture = createComponent(SbbInputWithCustomErrorStateMatcher);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      const containerEl = fixture.debugElement.query(By.css('sbb-form-field'))!.nativeElement;

      const control = component.formGroup.get('name')!;

      expect(control.invalid).withContext('Expected form control to be invalid').toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error messages')
        .toBe(0);

      control.markAsTouched();
      fixture.detectChanges();

      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error messages after being touched.')
        .toBe(0);

      component.errorState = true;
      fixture.detectChanges();

      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected one error messages to have been rendered.')
        .toBe(1);
    }));

    it('should display an error message when global error matcher returns true', fakeAsync(() => {
      const fixture = createComponent(SbbInputWithFormErrorMessages, [
        {
          provide: SbbErrorStateMatcher,
          useValue: { isErrorState: () => true },
        },
      ]);

      fixture.detectChanges();

      const containerEl = fixture.debugElement.query(By.css('sbb-form-field'))!.nativeElement;
      const testComponent = fixture.componentInstance;

      // Expect the control to still be untouched but the error to show due to the global setting
      expect(testComponent.formControl.untouched)
        .withContext('Expected untouched form control')
        .toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected an error message')
        .toBe(1);
    }));

    it('should display an error message when using SbbShowOnDirtyErrorStateMatcher', fakeAsync(() => {
      const fixture = createComponent(SbbInputWithFormErrorMessages, [
        {
          provide: SbbErrorStateMatcher,
          useClass: SbbShowOnDirtyErrorStateMatcher,
        },
      ]);
      fixture.detectChanges();

      const containerEl = fixture.debugElement.query(By.css('sbb-form-field'))!.nativeElement;
      const testComponent = fixture.componentInstance;

      expect(testComponent.formControl.invalid)
        .withContext('Expected form control to be invalid')
        .toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error message')
        .toBe(0);

      testComponent.formControl.markAsTouched();
      fixture.detectChanges();

      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error messages when touched')
        .toBe(0);

      testComponent.formControl.markAsDirty();
      fixture.detectChanges();

      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected one error message when dirty')
        .toBe(1);
    }));
  });

  it('should update the value when using FormControl.setValue', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithFormControl);
    fixture.detectChanges();

    const input = fixture.debugElement
      .query(By.directive(SbbInput))!
      .injector.get<SbbInput>(SbbInput);

    expect(input.value).toBeFalsy();

    fixture.componentInstance.formControl.setValue('something');

    expect(input.value).toBe('something');
  }));

  it('should display disabled styles when using FormControl.disable()', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithFormControl);
    fixture.detectChanges();

    const formFieldEl = fixture.debugElement.query(By.css('.sbb-form-field'))!.nativeElement;
    const inputEl = fixture.debugElement.query(By.css('input'))!.nativeElement;

    expect(formFieldEl.classList).not.toContain(
      'sbb-form-field-disabled',
      `Expected form field not to start out disabled.`,
    );
    expect(inputEl.disabled).toBe(false);

    fixture.componentInstance.formControl.disable();
    fixture.detectChanges();

    expect(formFieldEl.classList)
      .withContext(`Expected form field to look disabled after disable() is called.`)
      .toContain('sbb-form-field-disabled');
    expect(inputEl.disabled).toBe(true);
  }));

  it('should not treat the number 0 as empty', fakeAsync(() => {
    const fixture = createComponent(SbbInputZeroTestController);
    fixture.detectChanges();
    flush();

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('label'))!.nativeElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('sbb-form-field-empty')).toBe(false);
  }));

  it('should update when the form field value is patched without emitting', fakeAsync(() => {
    const fixture = createComponent(SbbInputWithFormControl);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('label'))!.nativeElement;

    expect(el.classList).toContain('sbb-form-field-empty');

    fixture.componentInstance.formControl.patchValue('value', { emitEvent: false });
    fixture.detectChanges();

    expect(el.classList).not.toContain('sbb-form-field-empty');
  }));

  describe('readonly mode', () => {
    let fixture: ComponentFixture<SbbInputReadonly>;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SbbInputReadonly);
      fixture.detectChanges();
    }));

    it(`should show '-' if no date is set`, fakeAsync(() => {
      expect(
        fixture.debugElement.nativeElement.querySelector('input').getAttribute('placeholder'),
      ).toBe('-');
    }));

    it(`should remove focusability if empty`, fakeAsync(() => {
      expect(
        fixture.debugElement.nativeElement.querySelector('input').getAttribute('tabindex'),
      ).toBe('-1');
    }));

    it(`should not remove focusability if not empty`, fakeAsync(() => {
      fixture.componentInstance.formControl.setValue('value');
      fixture.detectChanges();

      expect(
        fixture.debugElement.nativeElement.querySelector('input').getAttribute('tabindex'),
      ).toBeFalsy();
    }));

    describe(`styles`, () => {
      let inputElementStyles: CSSStyleDeclaration;
      beforeEach(() => {
        inputElementStyles = getComputedStyle(
          fixture.debugElement.nativeElement.querySelector('input'),
        );
      });

      describe(`standard design`, () => {
        it(`should apply correct styles`, fakeAsync(() => {
          expect(inputElementStyles.color).toBe('rgb(33, 33, 33)');
          expect(inputElementStyles.webkitTextFillColor).toBe(inputElementStyles.color);
          expect(inputElementStyles.backgroundColor).toBe('rgb(246, 246, 246)');
          expect(inputElementStyles.borderTopColor).toBe('rgb(210, 210, 210)');
        }));
      });
      describe(`lean design`, () => {
        switchToLean(fixture);

        it(`should apply correct styles`, fakeAsync(() => {
          expect(inputElementStyles.color).toBe('rgb(33, 33, 33)');
          expect(inputElementStyles.webkitTextFillColor).toBe(inputElementStyles.color);
          expect(inputElementStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)'); // transparent
          expect(inputElementStyles.borderTopColor).toBe('rgba(0, 0, 0, 0)'); // transparent
        }));
      });
    });
  });
});

function createComponent<T>(
  component: Type<T>,
  providers: Provider[] = [],
  imports: any[] = [],
  declarations: any[] = [],
): ComponentFixture<T> {
  TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule, ...imports, component, ...declarations],
    providers,
  }).compileComponents();

  return TestBed.createComponent<T>(component);
}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput id="test-id" placeholder="test" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithId {}

@Component({
  template: `<sbb-form-field><input sbbInput [disabled]="disabled" /></sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithDisabled {
  disabled: boolean;
}

@Component({
  template: `<sbb-form-field><input sbbInput [required]="required" /></sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithRequired {
  required: boolean;
}

@Component({
  template: `<sbb-form-field><input sbbInput [type]="type" /></sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithType {
  type: string;
}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput placeholder="Hello" [formControl]="formControl" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class SbbInputWithFormControl {
  formControl = new FormControl('');
}

@Component({
  template: ` <sbb-form-field [label]="label">
    <input sbbInput [formControl]="formControl" [aria-describedby]="userDescribedByValue" />
    @if (showError) {
      <sbb-error>Some error</sbb-error>
    }
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class SbbInputWithSubscriptAndAriaDescribedBy {
  label: string = '';
  userDescribedByValue: string = '';
  showError = false;
  formControl = new FormControl('');
}

@Component({
  template: `<sbb-form-field><input sbbInput [type]="t" /></sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputInvalidTypeTestController {
  t = 'file';
}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput type="date" placeholder="Placeholder" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputDateTestController {}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput type="text" placeholder="Placeholder" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputTextTestController {}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput type="password" placeholder="Placeholder" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputPasswordTestController {}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput type="number" placeholder="Placeholder" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputNumberTestController {}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput type="number" placeholder="Placeholder" [(ngModel)]="value" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule, FormsModule],
  standalone: true,
})
class SbbInputZeroTestController {
  value = 0;
}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput placeholder="Label" [value]="value" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithValueBinding {
  value: string = 'Initial';
}

@Component({
  template: ` <sbb-form-field>
    <textarea sbbInput [rows]="rows" [cols]="cols" [wrap]="wrap" placeholder="Snacks"> </textarea>
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputTextareaWithBindings {
  rows: number = 4;
  cols: number = 8;
  wrap: string = 'hard';
}

@Component({
  template: `<sbb-form-field><input /></sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputMissingSbbInputTestController {}

@Component({
  template: `
    <form #form="ngForm" novalidate>
      <sbb-form-field>
        <input sbbInput [formControl]="formControl" />
        @if (renderError) {
          <sbb-error>This field is required</sbb-error>
        }
      </sbb-form-field>
    </form>
  `,
  imports: [SbbFormFieldModule, SbbInputModule, FormsModule, ReactiveFormsModule],
  standalone: true,
})
class SbbInputWithFormErrorMessages {
  @ViewChild('form') form: NgForm;
  formControl = new FormControl('', [Validators.required, Validators.pattern(/valid value/)]);
  renderError = true;
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <sbb-form-field>
        <input sbbInput formControlName="name" [errorStateMatcher]="customErrorStateMatcher" />
        <sbb-error>This field is required</sbb-error>
      </sbb-form-field>
    </form>
  `,
  imports: [SbbFormFieldModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class SbbInputWithCustomErrorStateMatcher {
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/valid value/)]),
  });

  errorState = false;

  customErrorStateMatcher = {
    isErrorState: () => this.errorState,
  };
}

@Component({
  template: `
    <form [formGroup]="formGroup" novalidate>
      <sbb-form-field>
        <input sbbInput formControlName="name" />
        <sbb-error>This field is required</sbb-error>
      </sbb-form-field>
    </form>
  `,
  imports: [SbbFormFieldModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class SbbInputWithFormGroupErrorMessages {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/valid value/)]),
  });
}

@Component({
  template: `
    <sbb-form-field>
      @if (renderInput) {
        <input sbbInput />
      }
    </sbb-form-field>
  `,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithNgIf {
  renderInput = true;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sbb-form-field>
      <input sbbInput placeholder="Label" [formControl]="formControl" />
    </sbb-form-field>
  `,
  imports: [SbbFormFieldModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class SbbInputOnPush {
  formControl = new FormControl('');
}

@Component({
  template: `
    <sbb-form-field>
      <input sbbInput />
    </sbb-form-field>
  `,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithoutPlaceholder {}

// Styles to reset padding and border to make measurement comparisons easier.

@Component({
  template: ` <sbb-form-field>
    <select sbbInput id="test-id" [disabled]="disabled" [required]="required">
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="mercedes">Mercedes</option>
      <option value="audi">Audi</option>
    </select>
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputSelect {
  disabled: boolean;
  required: boolean;
}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput customInputAccessor placeholder="Placeholder" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule, CustomSbbInputAccessor],
  standalone: true,
})
class SbbInputWithCustomAccessor {}

@Component({
  template: ` <sbb-form-field>
    <select sbbInput></select>
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputSelectWithoutOptions {}

// Note that the DOM structure is slightly weird, but it's
// testing a specific g3 issue. See the discussion on #10466.
@Component({
  template: `
    <sbb-form-field>
      @if (true) {
        <sbb-label>My Label</sbb-label>
      }
      @if (true) {
        <input sbbInput />
      }
    </sbb-form-field>
  `,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithDefaultNgIf {}

// Note that the DOM structure is slightly weird, but it's
// testing a specific g3 issue. See the discussion on #10466.
@Component({
  template: `
    <sbb-form-field>
      <sbb-label>App name</sbb-label>
      @if (true) {
        <input sbbInput placeholder="My placeholder" [value]="inputValue" />
      }
    </sbb-form-field>
  `,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithAnotherNgIf {
  inputValue = 'test';
}

@Component({
  template: `<input sbbInput placeholder="{{ 'placeholder' | json }}" value="test" />`,
  imports: [JsonPipe, SbbInputModule],
  standalone: true,
})
class SbbInputWithPlaceholder {}

@Component({
  template: ` <sbb-form-field>
    <input sbbInput [placeholder]="placeholder" value="test" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class SbbInputWithVariablePlaceholder {
  placeholder: string;
}

@Component({
  template: `<sbb-form-field>
    <input sbbInput [readonly]="readonly" [formControl]="formControl" />
  </sbb-form-field>`,
  imports: [SbbFormFieldModule, SbbInputModule, ReactiveFormsModule],
  standalone: true,
})
class SbbInputReadonly {
  readonly = true;
  formControl = new FormControl('');
}
