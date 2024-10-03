import { animate, style, transition, trigger } from '@angular/animations';
import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  BACKSPACE,
  DELETE,
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
} from '@angular/cdk/keycodes';
import {
  ChangeDetectorRef,
  Component,
  DebugElement,
  inject,
  Provider,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import {
  SbbAutocompleteModule,
  SbbAutocompleteSelectedEvent,
  SbbAutocompleteTrigger,
} from '@sbb-esta/angular/autocomplete';
import { SbbOption, SbbOptionModule } from '@sbb-esta/angular/core';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  typeInElement,
} from '@sbb-esta/angular/core/testing';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbInputModule } from '@sbb-esta/angular/input';

import { SbbChip, SbbChipEvent, SbbChipRemove } from './chip';
import { SbbChipInputEvent } from './chip-input';
import { SbbChipList } from './chip-list';
import { SbbChipsModule } from './chips.module';

describe('SbbChipList', () => {
  let fixture: ComponentFixture<any>;
  let chipListDebugElement: DebugElement;
  let chipListNativeElement: HTMLElement;
  let chipListInstance: SbbChipList;
  let testComponent: StandardChipList;
  let chips: QueryList<SbbChip>;
  let manager: FocusKeyManager<SbbChip>;

  describe('StandardChipList', () => {
    describe('basic behaviors', () => {
      beforeEach(() => {
        setupStandardList();
      });

      it('should add the `sbb-chip-list` class', () => {
        expect(chipListNativeElement.classList).toContain('sbb-chip-list');
      });

      it('should toggle the chips disabled state based on whether it is disabled', () => {
        expect(chips.toArray().every((chip) => chip.disabled)).toBe(false);

        chipListInstance.disabled = true;
        fixture.detectChanges();

        expect(chips.toArray().every((chip) => chip.disabled)).toBe(true);

        chipListInstance.disabled = false;
        fixture.detectChanges();

        expect(chips.toArray().every((chip) => chip.disabled)).toBe(false);
      });

      it('should disable a chip that is added after the list became disabled', fakeAsync(() => {
        expect(chips.toArray().every((chip) => chip.disabled)).toBe(false);

        chipListInstance.disabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chips.toArray().every((chip) => chip.disabled)).toBe(true);

        fixture.componentInstance.chips.push(5, 6);
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(chips.toArray().every((chip) => chip.disabled)).toBe(true);
      }));

      it('should preserve the disabled state of a chip if the list gets re-enabled', () => {
        const chipArray = chips.toArray();

        chipArray[2].disabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chips.toArray().map((chip) => chip.disabled)).toEqual([
          false,
          false,
          true,
          false,
          false,
        ]);

        chipListInstance.disabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chips.toArray().map((chip) => chip.disabled)).toEqual([
          true,
          true,
          true,
          true,
          true,
        ]);

        chipListInstance.disabled = false;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chips.toArray().map((chip) => chip.disabled)).toEqual([
          false,
          false,
          true,
          false,
          false,
        ]);
      });

      it('should be able to set a custom role', () => {
        fixture.componentInstance.chipList.role = 'grid';
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chipListNativeElement.getAttribute('role')).toBe('grid');
      });
    });

    describe('focus behaviors', () => {
      beforeEach(() => {
        setupStandardList();
        manager = chipListInstance._keyManager;
      });

      it('should focus the first chip on focus', () => {
        chipListInstance.focus();
        fixture.detectChanges();

        expect(manager.activeItemIndex).toBe(0);
      });

      it('should watch for chip focus', () => {
        const array = chips.toArray();
        const lastIndex = array.length - 1;
        const lastItem = array[lastIndex];

        lastItem.focus();
        fixture.detectChanges();

        expect(manager.activeItemIndex).toBe(lastIndex);
      });

      it('should be able to become focused when disabled', () => {
        expect(chipListInstance.focused)
          .withContext('Expected list to not be focused.')
          .toBe(false);

        chipListInstance.disabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        chipListInstance.focus();
        fixture.detectChanges();

        expect(chipListInstance.focused)
          .withContext('Expected list to continue not to be focused')
          .toBe(false);
      });

      it('should remove the tabindex from the list if it is disabled', () => {
        expect(chipListNativeElement.getAttribute('tabindex')).toBeTruthy();

        chipListInstance.disabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chipListNativeElement.hasAttribute('tabindex')).toBeFalsy();
      });

      describe('on chip destroy', () => {
        it('should focus the next item', () => {
          const array = chips.toArray();
          const midItem = array[2];

          // Focus the middle item
          midItem.focus();

          // Destroy the middle item
          testComponent.chips.splice(2, 1);
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          // It focuses the 4th item (now at index 2)
          expect(manager.activeItemIndex).toEqual(2);
        });

        it('should focus the previous item', () => {
          const array = chips.toArray();
          const lastIndex = array.length - 1;
          const lastItem = array[lastIndex];

          // Focus the last item
          lastItem.focus();

          // Destroy the last item
          testComponent.chips.pop();
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();

          // It focuses the next-to-last item
          expect(manager.activeItemIndex).toEqual(lastIndex - 1);
        });

        it('should not focus if chip list is not focused', fakeAsync(() => {
          const array = chips.toArray();
          const midItem = array[2];

          // Focus and blur the middle item
          midItem.focus();
          (document.activeElement as HTMLElement).blur();
          tick();
          fixture.detectChanges();

          // Destroy the middle item
          testComponent.chips.splice(2, 1);
          fixture.detectChanges();
          tick();

          // Should not have focus
          expect(chipListInstance._keyManager.activeItemIndex).toEqual(-1);
        }));

        it('should focus the list if the last focused item is removed', () => {
          testComponent.chips = [0];

          spyOn(chipListInstance, 'focus');
          chips.last.focus();

          testComponent.chips.pop();
          fixture.detectChanges();

          expect(chipListInstance.focus).toHaveBeenCalled();
        });

        it(
          'should move focus to the last chip when the focused chip was deleted inside a' +
            'component with animations',
          fakeAsync(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
            fixture = createComponent(StandardChipListWithAnimations, [], BrowserAnimationsModule);
            fixture.detectChanges();

            chipListDebugElement = fixture.debugElement.query(By.directive(SbbChipList))!;
            chipListNativeElement = chipListDebugElement.nativeElement;
            chipListInstance = chipListDebugElement.componentInstance;
            testComponent = fixture.debugElement.componentInstance;
            chips = chipListInstance.chips;

            chips.last.focus();
            fixture.detectChanges();

            expect(chipListInstance._keyManager.activeItemIndex).toBe(chips.length - 1);

            dispatchKeyboardEvent(chips.last._elementRef.nativeElement, 'keydown', BACKSPACE);
            fixture.detectChanges();
            tick(500);

            expect(chipListInstance._keyManager.activeItemIndex).toBe(chips.length - 1);
          }),
        );
      });
    });

    describe('keyboard behavior', () => {
      describe('LTR (default)', () => {
        beforeEach(() => {
          setupStandardList();
          manager = chipListInstance._keyManager;
        });

        it('should focus previous item when press LEFT ARROW', () => {
          const nativeChips = chipListNativeElement.querySelectorAll('sbb-chip');
          const lastNativeChip = nativeChips[nativeChips.length - 1] as HTMLElement;

          const array = chips.toArray();
          const lastIndex = array.length - 1;
          const lastItem = array[lastIndex];

          // Focus the last item in the array
          lastItem.focus();
          expect(manager.activeItemIndex).toEqual(lastIndex);

          // Press the LEFT arrow
          dispatchKeyboardEvent(lastNativeChip, 'keydown', LEFT_ARROW);
          chipListInstance._blur(); // Simulate focus leaving the list and going to the chip.
          fixture.detectChanges();

          // It focuses the next-to-last item
          expect(manager.activeItemIndex).toEqual(lastIndex - 1);
        });

        it('should focus next item when press RIGHT ARROW', () => {
          const nativeChips = chipListNativeElement.querySelectorAll('sbb-chip');
          const firstNativeChip = nativeChips[0] as HTMLElement;

          const array = chips.toArray();
          const firstItem = array[0];

          // Focus the last item in the array
          firstItem.focus();
          expect(manager.activeItemIndex).toEqual(0);

          // Press the RIGHT arrow
          dispatchKeyboardEvent(firstNativeChip, 'keydown', RIGHT_ARROW);
          chipListInstance._blur(); // Simulate focus leaving the list and going to the chip.
          fixture.detectChanges();

          // It focuses the next-to-last item
          expect(manager.activeItemIndex).toEqual(1);
        });

        it('should not handle arrow key events from non-chip elements', () => {
          const initialActiveIndex = manager.activeItemIndex;

          dispatchKeyboardEvent(chipListNativeElement, 'keydown', RIGHT_ARROW);
          fixture.detectChanges();

          expect(manager.activeItemIndex)
            .withContext('Expected focused item not to have changed.')
            .toBe(initialActiveIndex);
        });

        it('should focus the first item when pressing HOME', () => {
          const nativeChips = chipListNativeElement.querySelectorAll('sbb-chip');
          const lastNativeChip = nativeChips[nativeChips.length - 1] as HTMLElement;
          const homeEvent = createKeyboardEvent('keydown', HOME);
          const array = chips.toArray();
          const lastItem = array[array.length - 1];

          lastItem.focus();
          expect(manager.activeItemIndex).toBe(array.length - 1);

          dispatchEvent(lastNativeChip, homeEvent);
          fixture.detectChanges();

          expect(manager.activeItemIndex).toBe(0);
          expect(homeEvent.defaultPrevented).toBe(true);
        });

        it('should focus the last item when pressing END', () => {
          const nativeChips = chipListNativeElement.querySelectorAll('sbb-chip');
          const endEvent = createKeyboardEvent('keydown', END);

          expect(manager.activeItemIndex).toBe(-1);

          dispatchEvent(nativeChips[0], endEvent);
          fixture.detectChanges();

          expect(manager.activeItemIndex).toBe(chips.length - 1);
          expect(endEvent.defaultPrevented).toBe(true);
        });
      });
    });
  });

  describe('FormFieldChipList', () => {
    beforeEach(() => {
      setupInputList();
    });

    describe('keyboard behavior', () => {
      beforeEach(() => {
        manager = chipListInstance._keyManager;
      });

      it('should maintain focus if the active chip is deleted', () => {
        const secondChip = fixture.nativeElement.querySelectorAll('.sbb-chip')[1];

        secondChip.focus();
        fixture.detectChanges();

        expect(chipListInstance.chips.toArray().findIndex((chip) => chip._hasFocus)).toBe(1);

        dispatchKeyboardEvent(secondChip, 'keydown', DELETE);
        fixture.detectChanges();

        expect(chipListInstance.chips.toArray().findIndex((chip) => chip._hasFocus)).toBe(1);
      });

      describe('when the input has focus', () => {
        it('should not focus the last chip when press DELETE', () => {
          const nativeInput = fixture.nativeElement.querySelector('input');

          // Focus the input
          nativeInput.focus();
          expect(manager.activeItemIndex).toBe(-1);

          // Press the DELETE key
          dispatchKeyboardEvent(nativeInput, 'keydown', DELETE);
          fixture.detectChanges();

          // It doesn't focus the last chip
          expect(manager.activeItemIndex).toEqual(-1);
        });

        it('should focus the last chip when press BACKSPACE', () => {
          const nativeInput = fixture.nativeElement.querySelector('input');

          // Focus the input
          nativeInput.focus();
          expect(manager.activeItemIndex).toBe(-1);

          // Press the BACKSPACE key
          dispatchKeyboardEvent(nativeInput, 'keydown', BACKSPACE);
          fixture.detectChanges();

          // It focuses the last chip
          expect(manager.activeItemIndex).toEqual(chips.length - 1);
        });
      });
    });

    it('should complete the stateChanges stream on destroy', () => {
      const spy = jasmine.createSpy('stateChanges complete');
      const subscription = chipListInstance.stateChanges.subscribe({ complete: spy });

      fixture.destroy();
      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should point the label id to the chip input', () => {
      const label = fixture.nativeElement.querySelector('label');
      const input = fixture.nativeElement.querySelector('input');

      fixture.detectChanges();

      expect(label.getAttribute('for')).toBeTruthy();
      expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
    });
  });

  describe('with chip remove', () => {
    let chipList: SbbChipList;
    let chipRemoveDebugElements: DebugElement[];

    beforeEach(() => {
      fixture = createComponent(ChipListWithRemove);
      fixture.detectChanges();

      chipList = fixture.debugElement.query(By.directive(SbbChipList))!.componentInstance;
      chipRemoveDebugElements = fixture.debugElement.queryAll(By.directive(SbbChipRemove));
      chips = chipList.chips;
    });

    it('should properly focus next item if chip is removed through click', () => {
      chips.toArray()[2].focus();

      // Destroy the third focused chip by dispatching a bubbling click event on the
      // associated chip remove element.
      dispatchMouseEvent(chipRemoveDebugElements[2].nativeElement, 'click');
      fixture.detectChanges();

      expect(chips.toArray()[2].value).not.toBe(2, 'Expected the third chip to be removed.');
      expect(chipList._keyManager.activeItemIndex).toBe(2);
    });
  });

  describe('forms integration', () => {
    it(
      'should keep the disabled state in sync if the form group is swapped and ' +
        'disabled at the same time',
      fakeAsync(() => {
        fixture = createComponent(ChipListInsideDynamicFormGroup);
        fixture.detectChanges();
        const instance = fixture.componentInstance;
        const list: SbbChipList = instance.chipList;

        expect(list.disabled).toBe(false);
        expect(list.chips.toArray().every((chip) => chip.disabled)).toBe(false);

        instance.assignGroup(true);
        fixture.detectChanges();

        expect(list.disabled).toBe(true);
        expect(list.chips.toArray().every((chip) => chip.disabled)).toBe(true);
      }),
    );
  });

  describe('chip list with chip input', () => {
    beforeEach(() => {
      fixture = createComponent(InputChipList);
      fixture.detectChanges();
    });

    it('should set the control to touched when the chip list is touched', fakeAsync(() => {
      expect(fixture.componentInstance.control.touched)
        .withContext('Expected the control to start off as untouched.')
        .toBe(false);

      const nativeChipList = fixture.debugElement.query(By.css('.sbb-chip-list'))!.nativeElement;

      dispatchFakeEvent(nativeChipList, 'blur');
      tick();

      expect(fixture.componentInstance.control.touched)
        .withContext('Expected the control to be touched.')
        .toBe(true);
    }));

    it('should not set touched when a disabled chip list is touched', () => {
      expect(fixture.componentInstance.control.touched)
        .withContext('Expected the control to start off as untouched.')
        .toBe(false);

      fixture.componentInstance.control.disable();
      const nativeChipList = fixture.debugElement.query(By.css('.sbb-chip-list'))!.nativeElement;
      dispatchFakeEvent(nativeChipList, 'blur');

      expect(fixture.componentInstance.control.touched)
        .withContext('Expected the control to stay untouched.')
        .toBe(false);
    });

    it('should not set the control to dirty when the value changes programmatically', () => {
      expect(fixture.componentInstance.control.dirty)
        .withContext(`Expected control to start out pristine.`)
        .toEqual(false);

      fixture.componentInstance.control.setValue(['pizza-1']);

      expect(fixture.componentInstance.control.dirty)
        .withContext(`Expected control to stay pristine after programmatic change.`)
        .toEqual(false);
    });

    it('should keep focus on the input after adding the first chip', fakeAsync(() => {
      const nativeInput = fixture.nativeElement.querySelector('input');
      const chipEls = Array.from<HTMLElement>(
        fixture.nativeElement.querySelectorAll('.sbb-chip'),
      ).reverse();

      // Remove the chips via backspace to simulate the user removing them.
      chipEls.forEach((chip) => {
        chip.focus();
        dispatchKeyboardEvent(chip, 'keydown', BACKSPACE);
        fixture.detectChanges();
        tick();
      });

      nativeInput.focus();
      expect(fixture.componentInstance.foods)
        .withContext('Expected all chips to be removed.')
        .toEqual([]);
      expect(document.activeElement).withContext('Expected input to be focused.').toBe(nativeInput);

      typeInElement(nativeInput, '123');
      fixture.detectChanges();
      dispatchKeyboardEvent(nativeInput, 'keydown', ENTER);
      fixture.detectChanges();
      tick();

      expect(document.activeElement)
        .withContext('Expected input to remain focused.')
        .toBe(nativeInput);
    }));

    describe('keyboard behavior', () => {
      let nativeInput: HTMLInputElement;

      const expectNoItemFocused = () => expect(manager.activeItemIndex).toBe(-1);
      const expectLastItemFocused = () => expect(manager.activeItemIndex).toEqual(chips.length - 1);

      beforeEach(() => {
        chipListDebugElement = fixture.debugElement.query(By.directive(SbbChipList))!;
        chipListInstance = chipListDebugElement.componentInstance;
        chips = chipListInstance.chips;
        manager = fixture.componentInstance.chipList._keyManager;
        nativeInput = fixture.nativeElement.querySelector('input');
        nativeInput.focus();
        expectNoItemFocused();
      });

      describe('when the input has focus', () => {
        it('should not focus the last chip when pressing DELETE', () => {
          dispatchKeyboardEvent(nativeInput, 'keydown', DELETE);
          expectNoItemFocused();
        });

        it('should focus the last chip when pressing BACKSPACE when input is empty', () => {
          dispatchKeyboardEvent(nativeInput, 'keydown', BACKSPACE);
          expectLastItemFocused();
        });

        it('should not focus the last chip when the BACKSPACE key is being repeated', () => {
          // Only now should it focus the last element
          const event = createKeyboardEvent('keydown', BACKSPACE);
          Object.defineProperty(event, 'repeat', {
            get: () => true,
          });
          dispatchEvent(nativeInput, event);
          expectNoItemFocused();
        });

        it('should focus last chip after pressing BACKSPACE after creating a chip', () => {
          // Create a chip
          typeInElement(nativeInput, '123');
          dispatchKeyboardEvent(nativeInput, 'keydown', ENTER);

          expectNoItemFocused();

          dispatchKeyboardEvent(nativeInput, 'keydown', BACKSPACE);
          expectLastItemFocused();
        });
      });
    });
  });

  describe('error messages', () => {
    let errorTestComponent: ChipListWithFormErrorMessages;
    let containerEl: HTMLElement;
    let chipListEl: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(ChipListWithFormErrorMessages);
      fixture.detectChanges();
      errorTestComponent = fixture.componentInstance;
      containerEl = fixture.debugElement.query(By.css('sbb-form-field'))!.nativeElement;
      chipListEl = fixture.debugElement.query(By.css('sbb-chip-list'))!.nativeElement;
    });

    it('should not show any errors if the user has not interacted', () => {
      expect(errorTestComponent.formControl.untouched)
        .withContext('Expected untouched form control')
        .toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error message')
        .toBe(0);
      expect(chipListEl.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to "false".')
        .toBe('false');
    });

    it('should display an error message when the list is touched and invalid', fakeAsync(() => {
      expect(errorTestComponent.formControl.invalid)
        .withContext('Expected form control to be invalid')
        .toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error message')
        .toBe(0);

      errorTestComponent.formControl.markAsTouched();
      fixture.detectChanges();
      tick();

      expect(containerEl.classList)
        .withContext('Expected container to have the invalid CSS class.')
        .toContain('sbb-form-field-invalid');
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected one error message to have been rendered.')
        .toBe(1);
      expect(chipListEl.getAttribute('aria-invalid'))
        .withContext('Expected aria-invalid to be set to "true".')
        .toBe('true');
    }));

    it('should display an error message when the parent form is submitted', fakeAsync(() => {
      expect(errorTestComponent.form.submitted)
        .withContext('Expected form not to have been submitted')
        .toBe(false);
      expect(errorTestComponent.formControl.invalid)
        .withContext('Expected form control to be invalid')
        .toBe(true);
      expect(containerEl.querySelectorAll('sbb-error').length)
        .withContext('Expected no error message')
        .toBe(0);

      dispatchFakeEvent(fixture.debugElement.query(By.css('form'))!.nativeElement, 'submit');
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(errorTestComponent.form.submitted)
          .withContext('Expected form to have been submitted')
          .toBe(true);
        expect(containerEl.classList)
          .withContext('Expected container to have the invalid CSS class.')
          .toContain('sbb-form-field-invalid');
        expect(containerEl.querySelectorAll('sbb-error').length)
          .withContext('Expected one error message to have been rendered.')
          .toBe(1);
        expect(chipListEl.getAttribute('aria-invalid'))
          .withContext('Expected aria-invalid to be set to "true".')
          .toBe('true');
      });
    }));

    it('should hide the errors and show the hints once the chip list becomes valid', fakeAsync(() => {
      errorTestComponent.formControl.markAsTouched();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(containerEl.classList)
          .withContext('Expected container to have the invalid CSS class.')
          .toContain('sbb-form-field-invalid');
        expect(containerEl.querySelectorAll('sbb-error').length)
          .withContext('Expected one error message to have been rendered.')
          .toBe(1);

        errorTestComponent.formControl.setValue('something');
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(containerEl.classList).not.toContain(
            'sbb-form-field-invalid',
            'Expected container not to have the invalid class when valid.',
          );
          expect(containerEl.querySelectorAll('sbb-error').length)
            .withContext('Expected no error messages when the input is valid.')
            .toBe(0);
        });
      });
    }));

    it('should set the proper aria-live attribute on the error messages', () => {
      errorTestComponent.formControl.markAsTouched();
      fixture.detectChanges();
      expect(containerEl.querySelector('sbb-error')!.getAttribute('aria-live')).toBe('polite');
    });

    it('sets the aria-describedby to reference errors when in error state', () => {
      fixture.componentInstance.formControl.markAsTouched();
      fixture.detectChanges();

      const errorIds = fixture.debugElement
        .queryAll(By.css('.sbb-error'))
        .map((el) => el.nativeElement.getAttribute('id'))
        .join(' ');
      const describedBy = chipListEl.getAttribute('aria-describedby');

      expect(errorIds).withContext('errors should be shown').toBeTruthy();
      expect(describedBy).toBe(errorIds);
    });
  });

  describe('autocomplete', () => {
    let testChipsAutocomplete: ChipsAutocomplete;

    beforeEach(() => {
      fixture = createComponent(ChipsAutocomplete);
      fixture.detectChanges();

      testChipsAutocomplete = fixture.debugElement.componentInstance;
    });

    it('should reposition autocomplete when chip list changes', async () => {
      spyOn(testChipsAutocomplete.trigger, 'updatePosition').and.callThrough();

      const input = fixture.nativeElement.querySelector('input');

      input.focus();
      await new Promise((r) => setTimeout(r));
      fixture.detectChanges();

      (testChipsAutocomplete!.selectedFruits!.value! as string[]).push('Pineapple');

      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(testChipsAutocomplete.trigger.updatePosition).toHaveBeenCalled();
    });

    it('should skip repositioning autocomplete if autocomplete is closed', async () => {
      spyOn(testChipsAutocomplete.trigger, 'updatePosition').and.callThrough();

      (testChipsAutocomplete!.selectedFruits!.value! as string[]).push('Pineapple');

      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(testChipsAutocomplete.trigger.updatePosition).not.toHaveBeenCalled();
    });
  });

  describe('convenience', () => {
    let input: HTMLInputElement;

    describe('without custom handlers', () => {
      let testChipsAutocomplete: ChipsAutocomplete;

      beforeEach(() => {
        fixture = createComponent(ChipsAutocomplete);
        fixture.detectChanges();

        chipListDebugElement = fixture.debugElement.query(By.directive(SbbChipList))!;
        chipListInstance = chipListDebugElement.componentInstance;
        testChipsAutocomplete = fixture.debugElement.componentInstance;
        chips = chipListInstance.chips;
        input = fixture.nativeElement.querySelector('input');
      });

      it('should add value to form control Array', fakeAsync(() => {
        expect(testChipsAutocomplete.selectedFruits.dirty).toBeFalse();
        expect(testChipsAutocomplete.selectedFruits.touched).toBeFalse();

        input.focus();
        typeInElement(input, '123');
        dispatchKeyboardEvent(input, 'keydown', ENTER);
        input.blur();
        tick();

        expect(testChipsAutocomplete.selectedFruits.value).toEqual(['Lemon', '123']);
        expect(input.value).toEqual('');
        expect(testChipsAutocomplete.selectedFruits.dirty).toBeTrue();
        expect(testChipsAutocomplete.selectedFruits.touched).toBeTrue();
      }));

      it('should remove value from form control Array', async () => {
        expect(testChipsAutocomplete.selectedFruits.value).toEqual(['Lemon']);
        expect(testChipsAutocomplete.selectedFruits.dirty).toBeFalse();

        chips.last.remove();
        await fixture.whenStable();

        expect(testChipsAutocomplete.selectedFruits.value).toEqual([]);
        expect(testChipsAutocomplete.selectedFruits.dirty).toBeTrue();
      });

      it('should remove correct value from form control array if there are several entries of the same value', async () => {
        testChipsAutocomplete.selectedFruits.patchValue(['Lemon', 'Apple', 'Lemon', 'Orange']);
        fixture.detectChanges();

        chips.get(2)!.remove();
        await fixture.whenStable();

        expect(testChipsAutocomplete.selectedFruits.value).toEqual(['Lemon', 'Apple', 'Orange']);
      });

      it('should return a new array on update', async () => {
        expect(testChipsAutocomplete.selectedFruits.value).toEqual(['Lemon']);
        const before = testChipsAutocomplete.selectedFruits.value;

        input.focus();
        typeInElement(input, 'Apple');
        dispatchKeyboardEvent(input, 'keydown', ENTER);
        await fixture.whenStable();

        const afterAdd = testChipsAutocomplete.selectedFruits.value;
        expect(afterAdd === before).toBeFalse();

        chips.last.remove();
        await fixture.whenStable();

        const afterRemove = testChipsAutocomplete.selectedFruits.value;
        expect(afterRemove === afterAdd).toBeFalse();
      });

      it('should return a new Set on update', async () => {
        testChipsAutocomplete.selectedFruits = new FormControl(new Set(['Lemon']));
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        const before = testChipsAutocomplete.selectedFruits.value;

        input.focus();
        typeInElement(input, 'Banana');
        dispatchKeyboardEvent(input, 'keydown', ENTER);
        await fixture.whenStable();

        const afterAdd = testChipsAutocomplete.selectedFruits.value;
        expect(afterAdd === before).toBeFalse();

        chips.last.remove();
        await fixture.whenStable();

        const afterRemove = testChipsAutocomplete.selectedFruits.value;
        expect(afterRemove === afterAdd).toBeFalse();
      });

      it('should add value to form control Set', async () => {
        testChipsAutocomplete.selectedFruits = new FormControl(new Set(['Lemon']));
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        expect(testChipsAutocomplete.selectedFruits.dirty).toBeFalse();

        input.focus();
        typeInElement(input, '123');
        dispatchKeyboardEvent(input, 'keydown', ENTER);
        await fixture.whenStable();

        expect([...(testChipsAutocomplete!.selectedFruits!.value as Set<string>)]).toEqual([
          'Lemon',
          '123',
        ]);
        expect(input.value).toEqual('');
        expect(testChipsAutocomplete.selectedFruits.dirty).toBeTrue();
      });

      it('should remove value from form control Set', async () => {
        testChipsAutocomplete.selectedFruits = new FormControl(new Set(['Lemon']));
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        expect(testChipsAutocomplete.selectedFruits.dirty).toBeFalse();

        chips.last.remove();
        await fixture.whenStable();

        expect([...(testChipsAutocomplete.selectedFruits.value as Set<string>)]).toEqual([]);
        expect(testChipsAutocomplete.selectedFruits.dirty).toBeTrue();
      });

      it('should not add empty value to form control', async () => {
        input.focus();
        dispatchKeyboardEvent(input, 'keydown', ENTER);
        await fixture.whenStable();

        expect(testChipsAutocomplete.selectedFruits.value).toEqual(['Lemon']);
      });

      it('should add value to form control from autocomplete by click', waitForAsync(async () => {
        input.focus();
        typeInElement(input, 'L');

        await new Promise((r) => setTimeout(r));
        fixture.detectChanges();
        await fixture.whenStable();

        const options = fixture.debugElement.queryAll(By.directive(SbbOption));
        const option: SbbOption = options[2].componentInstance;

        option.select();

        expect(testChipsAutocomplete.selectedFruits.value).toEqual(['Lemon', 'Lime']);
        expect(input.value).toEqual('');
      }));

      it('should add value to form control from autocomplete by hitting Enter', async () => {
        input.focus();
        typeInElement(input, 'A');
        await new Promise((r) => setTimeout(r));
        fixture.detectChanges();
        await fixture.whenStable();
        const componentInstance: ChipsAutocomplete = fixture.componentInstance;
        expect(input.value).toEqual('A');
        expect(componentInstance.fruitInput.value).toBe('A');

        dispatchKeyboardEvent(input, 'keydown', DOWN_ARROW); // Select first entry (Apple)
        dispatchKeyboardEvent(input, 'keydown', ENTER);

        expect(testChipsAutocomplete.selectedFruits.value).toEqual(['Lemon', 'Apple']);
        expect(input.value).toEqual('');
        expect(componentInstance.fruitInput.value).toBe(null);
      });
    });

    describe('with custom handlers', () => {
      let testChipsAutocompleteCustomHandlers: ChipsAutocompleteCustomHandlers;

      beforeEach(() => {
        fixture = createComponent(ChipsAutocompleteCustomHandlers);
        fixture.detectChanges();

        chipListDebugElement = fixture.debugElement.query(By.directive(SbbChipList))!;
        chipListInstance = chipListDebugElement.componentInstance;
        testChipsAutocompleteCustomHandlers = fixture.debugElement.componentInstance;
        chips = chipListInstance.chips;
        input = fixture.nativeElement.querySelector('input');
      });

      it('should not add value to form control if there is already a listener to (sbbChipInputTokenEnd)', async () => {
        input.focus();
        typeInElement(input, '123');
        dispatchKeyboardEvent(input, 'keydown', ENTER);
        await fixture.whenStable();

        expect(testChipsAutocompleteCustomHandlers.selectedFruits.value).toEqual(['Lemon']);
        expect(input.value).toEqual('123'); // Input value should be left in input element
      });

      it('should not remove value from form control if there is already a listener to (removed)', async () => {
        expect(testChipsAutocompleteCustomHandlers.selectedFruits.value).toEqual(['Lemon']);

        chips.last.remove();
        await fixture.whenStable();

        expect(testChipsAutocompleteCustomHandlers.selectedFruits.value).toEqual(['Lemon']);
      });

      it('should not add value to form control from autocomplete', async () => {
        input.focus();
        typeInElement(input, 'L');
        await new Promise((r) => setTimeout(r));
        fixture.detectChanges();
        await fixture.whenStable();

        const options = fixture.debugElement.queryAll(By.directive(SbbOption));
        const option: SbbOption = options[2].componentInstance;

        option.select();

        expect(testChipsAutocompleteCustomHandlers.selectedFruits.value).toEqual(['Lemon']);
        expect(input.value).toEqual('L'); // Input value should be left in input element
      });
    });
  });

  function createComponent<T>(
    component: Type<T>,
    providers: Provider[] = [],
    animationsModule:
      | Type<NoopAnimationsModule>
      | Type<BrowserAnimationsModule> = NoopAnimationsModule,
  ): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [
        SbbChipsModule,
        SbbInputModule,
        animationsModule,
        SbbIconModule,
        SbbIconTestingModule,
        SbbAutocompleteModule,
        component,
      ],
      providers: [...providers],
    });

    return TestBed.createComponent<T>(component);
  }

  function setupStandardList() {
    fixture = createComponent(StandardChipList, []);
    fixture.detectChanges();

    chipListDebugElement = fixture.debugElement.query(By.directive(SbbChipList))!;
    chipListNativeElement = chipListDebugElement.nativeElement;
    chipListInstance = chipListDebugElement.componentInstance;
    testComponent = fixture.debugElement.componentInstance;
    chips = chipListInstance.chips;
  }

  function setupInputList() {
    fixture = createComponent(FormFieldChipList);
    fixture.detectChanges();

    chipListDebugElement = fixture.debugElement.query(By.directive(SbbChipList))!;
    chipListNativeElement = chipListDebugElement.nativeElement;
    chipListInstance = chipListDebugElement.componentInstance;
    testComponent = fixture.debugElement.componentInstance;
    chips = chipListInstance.chips;
  }
});

@Component({
  template: ` <sbb-chip-list [tabIndex]="tabIndex">
    @for (i of chips; track i) {
      <sbb-chip> {{ name }} {{ i + 1 }} </sbb-chip>
    }
  </sbb-chip-list>`,
  imports: [SbbChipsModule],
  standalone: true,
})
class StandardChipList {
  name: string = 'Test';
  tabIndex: number = 0;
  chips = [0, 1, 2, 3, 4];
  @ViewChild(SbbChipList) chipList: SbbChipList;
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-label>Add a chip</sbb-label>
      <sbb-chip-list #chipList>
        @for (chip of chips; track chip) {
          <sbb-chip (removed)="remove(chip)">{{ chip }}</sbb-chip>
        }
      </sbb-chip-list>
      <input name="test" [sbbChipInputFor]="chipList" />
    </sbb-form-field>
  `,
  imports: [SbbChipsModule, SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class FormFieldChipList {
  chips = ['Chip 0', 'Chip 1', 'Chip 2'];

  remove(chip: string) {
    const index = this.chips.indexOf(chip);

    if (index > -1) {
      this.chips.splice(index, 1);
    }
  }
}

@Component({
  selector: 'input-chip-list',
  template: `
    <sbb-form-field>
      <sbb-chip-list placeholder="Food" [formControl]="control" [required]="isRequired" #chipList1>
        @for (food of foods; track food) {
          <sbb-chip [value]="food.value" (removed)="remove(food)">
            {{ food.viewValue }}
          </sbb-chip>
        }
      </sbb-chip-list>

      <input
        placeholder="New food..."
        [sbbChipInputFor]="chipList1"
        [sbbChipInputSeparatorKeyCodes]="separatorKeyCodes"
        [sbbChipInputAddOnBlur]="addOnBlur"
        (sbbChipInputTokenEnd)="add($event)"
      />
    </sbb-form-field>
  `,
  imports: [ReactiveFormsModule, SbbChipsModule, SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class InputChipList {
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

  separatorKeyCodes = [ENTER, SPACE];
  addOnBlur: boolean = true;
  isRequired: boolean;

  add(event: SbbChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our foods
    if (value) {
      this.foods.push({
        value: `${value.toLowerCase()}-${this.foods.length}`,
        viewValue: value,
      });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(food: any): void {
    const index = this.foods.indexOf(food);

    if (index > -1) {
      this.foods.splice(index, 1);
    }
  }

  @ViewChild(SbbChipList) chipList: SbbChipList;
  @ViewChildren(SbbChip) chips: QueryList<SbbChip>;
}

@Component({
  template: `
    <form #form="ngForm" novalidate>
      <sbb-form-field>
        <sbb-chip-list [formControl]="formControl">
          @for (food of foods; track food) {
            <sbb-chip [value]="food.value">
              {{ food.viewValue }}
            </sbb-chip>
          }
        </sbb-chip-list>
        <sbb-error>Should have value</sbb-error>
      </sbb-form-field>
    </form>
  `,
  imports: [SbbChipsModule, SbbFormFieldModule, SbbInputModule, ReactiveFormsModule, FormsModule],
  standalone: true,
})
class ChipListWithFormErrorMessages {
  foods: any[] = [
    { value: 0, viewValue: 'Steak' },
    { value: 1, viewValue: 'Pizza' },
    { value: 2, viewValue: 'Pasta' },
  ];
  @ViewChildren(SbbChip) chips: QueryList<SbbChip>;

  @ViewChild('form') form: NgForm;
  formControl = new FormControl('', Validators.required);
}

@Component({
  template: ` <sbb-chip-list>
    @for (i of numbers; track i) {
      <sbb-chip (removed)="remove(i)">{{ i }}</sbb-chip>
    }
  </sbb-chip-list>`,
  animations: [
    // For the case we're testing this animation doesn't
    // have to be used anywhere, it just has to be defined.
    trigger('dummyAnimation', [
      transition(':leave', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]),
    ]),
  ],
  imports: [SbbChipsModule],
  standalone: true,
})
class StandardChipListWithAnimations {
  numbers = [0, 1, 2, 3, 4];

  remove(item: number): void {
    const index = this.numbers.indexOf(item);

    if (index > -1) {
      this.numbers.splice(index, 1);
    }
  }
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-chip-list>
        @for (i of chips; track i) {
          <sbb-chip [value]="i" (removed)="removeChip($event)">
            Chip {{ i + 1 }}
            <span sbbChipRemove>Remove</span>
          </sbb-chip>
        }
      </sbb-chip-list>
    </sbb-form-field>
  `,
  imports: [SbbChipsModule, SbbFormFieldModule, SbbInputModule],
  standalone: true,
})
class ChipListWithRemove {
  chips = [0, 1, 2, 3, 4];

  removeChip(event: SbbChipEvent) {
    this.chips.splice(event.chip.value, 1);
  }
}

@Component({
  template: `
    <form [formGroup]="form">
      <sbb-form-field>
        <sbb-chip-list formControlName="control">
          <sbb-chip>Pizza</sbb-chip>
          <sbb-chip>Pasta</sbb-chip>
        </sbb-chip-list>
      </sbb-form-field>
    </form>
  `,
  imports: [SbbChipsModule, SbbFormFieldModule, ReactiveFormsModule],
  standalone: true,
})
class ChipListInsideDynamicFormGroup {
  @ViewChild(SbbChipList) chipList: SbbChipList;
  form: FormGroup;
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  private _formBuilder = inject(FormBuilder);

  constructor() {
    this.assignGroup(false);
  }

  assignGroup(isDisabled: boolean) {
    this.form = this._formBuilder.group({
      control: { value: [], disabled: isDisabled },
    });
    this._changeDetectorRef.markForCheck();
  }
}

@Component({
  template: `
    <sbb-form-field label="Favorite Fruits">
      <sbb-chip-list aria-label="Fruit selection" [formControl]="selectedFruits">
        @for (fruit of selectedFruits.value; track fruit) {
          <sbb-chip [value]="fruit">
            {{ fruit }}
          </sbb-chip>
        }
        <input
          placeholder="New fruit..."
          sbbChipInput
          [sbbAutocomplete]="auto"
          #trigger="sbbAutocompleteTrigger"
          [formControl]="fruitInput"
        />
      </sbb-chip-list>
      <sbb-autocomplete #auto="sbbAutocomplete">
        @for (fruit of allFruits; track fruit) {
          <sbb-option [value]="fruit">
            {{ fruit }}
          </sbb-option>
        }
      </sbb-autocomplete>
    </sbb-form-field>
  `,
  imports: [
    SbbAutocompleteModule,
    SbbChipsModule,
    SbbOptionModule,
    SbbFormFieldModule,
    SbbInputModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
class ChipsAutocomplete {
  fruitInput = new FormControl('');
  selectedFruits = new FormControl<string[] | Set<string> | null>(['Lemon']);
  allFruits = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  @ViewChild('trigger') trigger: SbbAutocompleteTrigger;
}

@Component({
  template: `
    <sbb-form-field label="Favorite Fruits">
      <sbb-chip-list aria-label="Fruit selection" [formControl]="selectedFruits">
        @for (fruit of selectedFruits.value; track fruit) {
          <sbb-chip [value]="fruit" (removed)="remove($event)">
            {{ fruit }}
          </sbb-chip>
        }
        <input
          placeholder="New fruit..."
          sbbChipInput
          [sbbAutocomplete]="auto"
          (sbbChipInputTokenEnd)="add($event)"
        />
      </sbb-chip-list>
      <sbb-autocomplete #auto="sbbAutocomplete" (optionSelected)="optionSelected($event)">
        @for (fruit of allFruits; track fruit) {
          <sbb-option [value]="fruit">
            {{ fruit }}
          </sbb-option>
        }
      </sbb-autocomplete>
    </sbb-form-field>
  `,
  imports: [
    SbbAutocompleteModule,
    SbbChipsModule,
    SbbOptionModule,
    SbbFormFieldModule,
    SbbInputModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
class ChipsAutocompleteCustomHandlers {
  selectedFruits = new FormControl(['Lemon']);
  allFruits = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  add($event: SbbChipInputEvent) {}

  remove($event: SbbChipEvent) {}

  optionSelected($event: SbbAutocompleteSelectedEvent) {}
}
