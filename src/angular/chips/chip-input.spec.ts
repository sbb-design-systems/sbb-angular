import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchKeyboardEvent } from '@sbb-esta/angular/core/testing';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';

import { SbbChipsDefaultOptions, SBB_CHIPS_DEFAULT_OPTIONS } from './chip-default-options';
import { SbbChipInput, SbbChipInputEvent } from './chip-input';
import { SbbChipList } from './chip-list';
import { SbbChipsModule } from './chips.module';

describe('SbbChipInput', () => {
  let fixture: ComponentFixture<any>;
  let testChipInput: TestChipInput;
  let inputDebugElement: DebugElement;
  let inputNativeElement: HTMLElement;
  let chipInputDirective: SbbChipInput;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    });
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestChipInput);
    testChipInput = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    inputDebugElement = fixture.debugElement.query(By.directive(SbbChipInput))!;
    chipInputDirective = inputDebugElement.injector.get<SbbChipInput>(SbbChipInput);
    inputNativeElement = inputDebugElement.nativeElement;
  }));

  describe('basic behavior', () => {
    it('emits the (chipEnd) on enter keyup', () => {
      spyOn(testChipInput, 'add');

      dispatchKeyboardEvent(inputNativeElement, 'keydown', ENTER);
      expect(testChipInput.add).toHaveBeenCalled();
    });

    it('should have a default id', () => {
      expect(inputNativeElement.getAttribute('id')).toBeTruthy();
    });

    it('should allow binding to the `placeholder` input', () => {
      expect(inputNativeElement.hasAttribute('placeholder')).toBe(false);

      testChipInput.placeholder = 'bound placeholder';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(inputNativeElement.getAttribute('placeholder')).toBe('bound placeholder');
    });

    it('should propagate the dynamic `placeholder` value to the form field', () => {
      fixture.componentInstance.placeholder = 'add a chip';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const input: HTMLElement = fixture.nativeElement.querySelector('input');

      expect(input).toBeTruthy();
      expect(input.getAttribute('placeholder')).toContain('add a chip');

      fixture.componentInstance.placeholder = "or don't";
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(input.getAttribute('placeholder')).toContain("or don't");
    });

    it('should become disabled if the list is disabled', () => {
      expect(inputNativeElement.hasAttribute('disabled')).toBe(false);
      expect(chipInputDirective.disabled).toBe(false);

      fixture.componentInstance.chipListInstance.disabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(inputNativeElement.getAttribute('disabled')).toBe('true');
      expect(chipInputDirective.disabled).toBe(true);
    });

    it('should allow focus to escape when tabbing forwards', fakeAsync(() => {
      const listElement: HTMLElement = fixture.nativeElement.querySelector('.sbb-chip-list');

      expect(listElement.getAttribute('tabindex')).toBe('0');

      dispatchKeyboardEvent(inputNativeElement, 'keydown', TAB);
      fixture.detectChanges();

      expect(listElement.getAttribute('tabindex'))
        .withContext('Expected tabIndex to be set to -1 temporarily.')
        .toBe('-1');

      tick();
      fixture.detectChanges();

      expect(listElement.getAttribute('tabindex'))
        .withContext('Expected tabIndex to be reset back to 0')
        .toBe('0');
    }));

    it('should not allow focus to escape when tabbing backwards', fakeAsync(() => {
      const listElement: HTMLElement = fixture.nativeElement.querySelector('.sbb-chip-list');

      expect(listElement.getAttribute('tabindex')).toBe('0');

      dispatchKeyboardEvent(inputNativeElement, 'keydown', TAB, undefined, { shift: true });
      fixture.detectChanges();

      expect(listElement.getAttribute('tabindex'))
        .withContext('Expected tabindex to remain 0')
        .toBe('0');

      tick();
      fixture.detectChanges();

      expect(listElement.getAttribute('tabindex'))
        .withContext('Expected tabindex to remain 0')
        .toBe('0');
    }));

    it('should be aria-required if the list is required', () => {
      expect(inputNativeElement.hasAttribute('aria-required')).toBe(false);

      fixture.componentInstance.required = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(inputNativeElement.getAttribute('aria-required')).toBe('true');
    });

    it('should set input styling classes', () => {
      expect(inputNativeElement.classList).toContain('sbb-chip-input');
    });
  });

  describe('[addOnBlur]', () => {
    it('allows (chipEnd) when true', () => {
      spyOn(testChipInput, 'add');

      testChipInput.addOnBlur = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      chipInputDirective._blur();
      expect(testChipInput.add).toHaveBeenCalled();
    });

    it('disallows (chipEnd) when false', () => {
      spyOn(testChipInput, 'add');

      testChipInput.addOnBlur = false;
      fixture.detectChanges();

      chipInputDirective._blur();
      expect(testChipInput.add).not.toHaveBeenCalled();
    });
  });

  describe('[separatorKeyCodes]', () => {
    it('does not emit (chipEnd) when a non-separator key is pressed', () => {
      spyOn(testChipInput, 'add');

      chipInputDirective.separatorKeyCodes = [COMMA];
      fixture.detectChanges();

      dispatchKeyboardEvent(inputNativeElement, 'keydown', ENTER);
      expect(testChipInput.add).not.toHaveBeenCalled();
    });

    it('emits (chipEnd) when a custom separator keys is pressed', () => {
      spyOn(testChipInput, 'add');

      chipInputDirective.separatorKeyCodes = [COMMA];
      fixture.detectChanges();

      dispatchKeyboardEvent(inputNativeElement, 'keydown', COMMA);
      expect(testChipInput.add).toHaveBeenCalled();
    });

    it('emits accepts the custom separator keys in a Set', () => {
      spyOn(testChipInput, 'add');

      chipInputDirective.separatorKeyCodes = new Set([COMMA]);
      fixture.detectChanges();

      dispatchKeyboardEvent(inputNativeElement, 'keydown', COMMA);
      expect(testChipInput.add).toHaveBeenCalled();
    });

    it('emits (chipEnd) when the separator keys are configured globally', () => {
      fixture.destroy();

      TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [NoopAnimationsModule],
          providers: [
            {
              provide: SBB_CHIPS_DEFAULT_OPTIONS,
              useValue: { separatorKeyCodes: [COMMA] } as SbbChipsDefaultOptions,
            },
          ],
        })
        .compileComponents();

      fixture = TestBed.createComponent(TestChipInput);
      testChipInput = fixture.debugElement.componentInstance;
      fixture.detectChanges();

      inputDebugElement = fixture.debugElement.query(By.directive(SbbChipInput))!;
      chipInputDirective = inputDebugElement.injector.get<SbbChipInput>(SbbChipInput);
      inputNativeElement = inputDebugElement.nativeElement;

      spyOn(testChipInput, 'add');
      fixture.detectChanges();

      dispatchKeyboardEvent(inputNativeElement, 'keydown', COMMA);
      expect(testChipInput.add).toHaveBeenCalled();
    });

    it('should not emit the chipEnd event if a separator is pressed with a modifier key', () => {
      spyOn(testChipInput, 'add');

      chipInputDirective.separatorKeyCodes = [ENTER];
      fixture.detectChanges();

      dispatchKeyboardEvent(inputNativeElement, 'keydown', ENTER, undefined, { shift: true });
      expect(testChipInput.add).not.toHaveBeenCalled();
    });
  });
});

@Component({
  template: `
    <sbb-form-field>
      <sbb-chip-list #chipList [required]="required">
        <sbb-chip>Hello</sbb-chip>
        <input
          [sbbChipInputFor]="chipList"
          [sbbChipInputAddOnBlur]="addOnBlur"
          (sbbChipInputTokenEnd)="add($event)"
          [placeholder]="placeholder"
        />
      </sbb-chip-list>
    </sbb-form-field>
  `,
  imports: [SbbFormFieldModule, SbbChipsModule],
})
class TestChipInput {
  @ViewChild(SbbChipList) chipListInstance: SbbChipList;
  addOnBlur = false;
  required = false;
  placeholder = '';

  add(_: SbbChipInputEvent) {}
}
