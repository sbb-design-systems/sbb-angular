import { DOWN_ARROW, ENTER, ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, FactoryProvider, Type, ValueProvider, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SBB_DATEPICKER_PREVENT_OVERFLOW } from '@sbb-esta/angular/core';
import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  FEB,
  JAN,
} from '@sbb-esta/angular/core/testing';
import { SbbFormField, SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbInputModule } from '@sbb-esta/angular/input';

import { SbbDateInput } from '../date-input/date-input.directive';
import { SbbDatepickerModule } from '../datepicker.module';

import { SbbDatepicker } from './datepicker';

describe('SbbDatepicker', () => {
  // Creates a test component fixture.
  function createComponent<T>(
    component: Type<T>,
    imports: Type<any>[] = [],
    providers: (FactoryProvider | ValueProvider)[] = [],
  ): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbIconTestingModule, ...imports, component],
      providers,
    });

    return TestBed.createComponent(component);
  }

  afterEach(inject([OverlayContainer], (container: OverlayContainer) => {
    container.ngOnDestroy();
  }));

  describe('with NativeDateModule', () => {
    describe('standard datepicker', () => {
      let fixture: ComponentFixture<StandardDatepickerComponent>;
      let testComponent: StandardDatepickerComponent;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(StandardDatepickerComponent);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
      }));

      it('open non-touch should open popup', () => {
        expect(document.querySelector('.cdk-overlay-pane.sbb-datepicker-panel')).toBeNull();

        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('.cdk-overlay-pane.sbb-datepicker-panel')).not.toBeNull();
      });

      it('should open datepicker if opened input is set to true', fakeAsync(() => {
        testComponent.opened = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        flush();

        expect(document.querySelector('.sbb-datepicker-content')).not.toBeNull();

        testComponent.opened = false;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        flush();

        expect(document.querySelector('.sbb-datepicker-content')).toBeNull();
      }));

      it('disabled datepicker input should open the calendar if datepicker is enabled', () => {
        testComponent.datepicker.disabled = false;
        testComponent.datepickerInput.disabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(document.querySelector('.cdk-overlay-pane')).toBeNull();

        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('.cdk-overlay-pane')).not.toBeNull();
      });

      it('close should close popup', fakeAsync(() => {
        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const popup = document.querySelector('.cdk-overlay-pane')!;
        expect(popup).not.toBeNull();
        // tslint:disable-next-line:radix
        expect(parseInt(getComputedStyle(popup).height as string)).not.toBe(0);

        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:radix
        expect(parseInt(getComputedStyle(popup).height as string)).toBeNaN();
      }));

      it('should close the popup when pressing ESCAPE', fakeAsync(() => {
        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(testComponent.datepicker.opened)
          .withContext('Expected datepicker to be open.')
          .toBe(true);

        dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
        fixture.detectChanges();
        flush();

        expect(testComponent.datepicker.opened)
          .withContext('Expected datepicker to be closed.')
          .toBe(false);
      }));

      it('should set the proper role on the popup', fakeAsync(() => {
        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        // tslint:disable-next-line:no-non-null-assertion
        const popup = document.querySelector('.sbb-datepicker-content-container')!;
        expect(popup).toBeTruthy();
        expect(popup.getAttribute('role')).toBe('dialog');
      }));

      it('should set aria-labelledby to the one from the input, if not placed inside a sbb-form-field', fakeAsync(() => {
        expect(fixture.nativeElement.querySelector('.sbb-form-field')).toBeFalsy();

        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.setAttribute('aria-labelledby', 'test-label');

        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        const popup = document.querySelector(
          '.cdk-overlay-pane .sbb-datepicker-content-container',
        )!;
        expect(popup).toBeTruthy();
        expect(popup.getAttribute('aria-labelledby')).toBe('test-label');
      }));

      it(
        'clicking the currently selected date should close the calendar ' +
          'without firing selectedChanged',
        fakeAsync(() => {
          const selectedChangedSpy = spyOn(
            testComponent.datepicker.selectedChanged,
            'next',
          ).and.callThrough();

          for (let changeCount = 1; changeCount < 3; changeCount++) {
            const currentDay = changeCount;
            testComponent.datepicker.open();
            fixture.detectChanges();

            expect(document.querySelector('sbb-datepicker-content')).not.toBeNull();
            expect(testComponent.datepickerInput.value).toEqual(new Date(2020, JAN, currentDay));

            const cells = document.querySelectorAll('.sbb-calendar-body-cell');
            dispatchMouseEvent(cells[1], 'click');
            fixture.detectChanges();
            flush();
          }

          expect(selectedChangedSpy.calls.count()).toEqual(1);
          expect(document.querySelector('sbb-dialog-container')).toBeNull();
          expect(testComponent.datepickerInput.value).toEqual(new Date(2020, JAN, 2));
        }),
      );

      it(
        'pressing enter on the currently selected date should close the calendar without ' +
          'firing selectedChanged',
        fakeAsync(() => {
          const selectedChangedSpy = spyOn(
            testComponent.datepicker.selectedChanged,
            'next',
          ).and.callThrough();

          for (let changeCount = 1; changeCount <= 3; changeCount++) {
            testComponent.datepicker.open();
            fixture.detectChanges();

            const calendarBodyEl = document.querySelector('.sbb-calendar-body') as HTMLElement;
            expect(calendarBodyEl).not.toBeNull();
            expect(testComponent.datepickerInput.value).toEqual(new Date(2020, JAN, 1));

            dispatchKeyboardEvent(calendarBodyEl, 'keydown', ENTER);
            fixture.detectChanges();
            flush();
          }

          expect(selectedChangedSpy.calls.count()).toEqual(1);
          expect(document.querySelector('sbb-dialog-container')).toBeNull();
          expect(testComponent.datepickerInput.value).toEqual(new Date(2020, JAN, 1));
        }),
      );

      it('startAt should fallback to input value', () => {
        expect(testComponent.datepicker.startAt).toEqual(new Date(2020, JAN, 1));
      });

      it('should attach popup to native input', () => {
        const attachToRef = testComponent.datepickerInput.getConnectedOverlayOrigin();
        expect(attachToRef.nativeElement.tagName.toLowerCase())
          .withContext('popup should be attached to native input')
          .toBe('input');
      });

      it('input should aria-owns calendar after opened in non-touch mode', fakeAsync(() => {
        const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(inputEl.getAttribute('aria-owns')).toBeNull();

        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        const ownedElementId = inputEl.getAttribute('aria-owns');
        expect(ownedElementId).not.toBeNull();

        const ownedElement = document.getElementById(ownedElementId);
        expect(ownedElement).not.toBeNull();
        expect((ownedElement as Element).tagName.toLowerCase()).toBe('sbb-calendar');
      }));

      it('should not throw when given wrong data type', () => {
        testComponent.date = '1/1/2017' as any;
        fixture.changeDetectorRef.markForCheck();

        expect(() => fixture.detectChanges()).not.toThrow();
      });

      it('should clear out the backdrop subscriptions on close', fakeAsync(() => {
        for (let i = 0; i < 3; i++) {
          testComponent.datepicker.open();
          fixture.detectChanges();
          flush();

          testComponent.datepicker.close();
          fixture.detectChanges();
          flush();
        }

        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        const spy = jasmine.createSpy('close event spy');
        const subscription = testComponent.datepicker.closedStream.subscribe(spy);
        const backdrop = document.querySelector('.cdk-overlay-backdrop')! as HTMLElement;

        backdrop.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(testComponent.datepicker.opened).toBe(false);
        subscription.unsubscribe();
      }));

      it('should close the datepicker using ALT + UP_ARROW', fakeAsync(() => {
        testComponent.datepicker.open();
        fixture.detectChanges();
        flush();

        expect(testComponent.datepicker.opened).toBe(true);

        dispatchKeyboardEvent(document.body, 'keydown', UP_ARROW, undefined, { alt: true });

        fixture.detectChanges();
        flush();

        expect(testComponent.datepicker.opened).toBe(false);
      }));

      it('should open the datpeicker using ALT + DOWN_ARROW', fakeAsync(() => {
        expect(testComponent.datepicker.opened).toBe(false);

        const event = dispatchKeyboardEvent(
          fixture.nativeElement.querySelector('input'),
          'keydown',
          DOWN_ARROW,
          undefined,
          { alt: true },
        );

        fixture.detectChanges();
        flush();

        expect(testComponent.datepicker.opened).toBe(true);
        expect(event.defaultPrevented).toBe(true);
      }));
    });

    describe('datepicker with too many inputs', () => {
      it('should throw when multiple inputs registered', fakeAsync(() => {
        const fixture = createComponent(MultiInputDatepickerComponent);
        expect(() => fixture.detectChanges()).toThrow();
      }));
    });

    describe('datepicker with no inputs', () => {
      let fixture: ComponentFixture<NoInputDatepickerComponent>;
      let testComponent: NoInputDatepickerComponent;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(NoInputDatepickerComponent);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('should not throw when accessing disabled property', () => {
        expect(() => testComponent.datepicker.disabled).not.toThrow();
      });

      it('should throw when opened with no registered inputs', fakeAsync(() => {
        expect(() => testComponent.datepicker.open()).toThrow();
      }));
    });

    describe('datepicker with startAt', () => {
      let fixture: ComponentFixture<DatepickerWithStartAtComponent>;
      let testComponent: DatepickerWithStartAtComponent;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithStartAtComponent);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('explicit startAt should override input value', () => {
        expect(testComponent.datepicker.startAt).toEqual(new Date(2010, JAN, 1));
      });
    });

    describe('datepicker with ngModel', () => {
      let fixture: ComponentFixture<DatepickerWithNgModelComponent>;
      let testComponent: DatepickerWithNgModelComponent;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithNgModelComponent);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          testComponent = fixture.componentInstance;
        });
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('should mark input dirty after input event', () => {
        const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(inputEl.classList).toContain('ng-pristine');

        inputEl.value = '01.01.2001';
        dispatchFakeEvent(inputEl, 'input');
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-dirty');
      });

      it('should not mark dirty after model change', fakeAsync(() => {
        const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(inputEl.classList).toContain('ng-pristine');

        testComponent.selected = new Date(2017, JAN, 1);
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-pristine');
      }));

      it('should mark input touched on blur', () => {
        const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(inputEl.classList).toContain('ng-untouched');

        dispatchFakeEvent(inputEl, 'focus');
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-untouched');

        dispatchFakeEvent(inputEl, 'blur');
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-touched');
      });

      it('should not reformat invalid dates on blur', () => {
        const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        inputEl.value = 'very-valid-date';
        dispatchFakeEvent(inputEl, 'input');
        fixture.detectChanges();

        dispatchFakeEvent(inputEl, 'blur');
        fixture.detectChanges();

        expect(inputEl.value).toBe('very-valid-date');
      });
    });

    describe('datepicker with sbb-datepicker-toggle', () => {
      let fixture: ComponentFixture<DatepickerWithToggleComponent>;
      let testComponent: DatepickerWithToggleComponent;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithToggleComponent);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
      }));

      it('should not open calendar when toggle clicked if datepicker is disabled', () => {
        testComponent.datepicker.disabled = true;
        fixture.detectChanges();
        const toggle = fixture.debugElement.query(By.css('button')).nativeElement;

        expect(toggle.hasAttribute('disabled')).toBe(true);
        expect(document.querySelector('sbb-dialog-container')).toBeNull();

        dispatchMouseEvent(toggle, 'click');
        fixture.detectChanges();

        expect(document.querySelector('sbb-dialog-container')).toBeNull();
      });

      it('should not open calendar when toggle clicked if input is disabled', () => {
        expect(testComponent.datepicker.disabled).toBe(false);

        testComponent.input.disabled = true;
        fixture.detectChanges();
        const toggle = fixture.debugElement.query(By.css('button')).nativeElement;

        expect(toggle.hasAttribute('disabled')).toBe(true);
        expect(document.querySelector('sbb-dialog-container')).toBeNull();

        dispatchMouseEvent(toggle, 'click');
        fixture.detectChanges();

        expect(document.querySelector('sbb-dialog-container')).toBeNull();
      });

      it('should set the `button` type on the trigger to prevent form submissions', () => {
        const toggle = fixture.debugElement.query(By.css('button')).nativeElement;
        expect(toggle.getAttribute('type')).toBe('button');
      });

      it('should restore focus to the toggle after the calendar is closed', fakeAsync(() => {
        const toggle = fixture.debugElement.query(By.css('button')).nativeElement;

        fixture.detectChanges();

        toggle.focus();
        expect(document.activeElement).withContext('Expected toggle to be focused.').toBe(toggle);

        fixture.componentInstance.datepicker.open();
        fixture.detectChanges();
        tick();

        // tslint:disable-next-line:no-non-null-assertion
        const pane = document.querySelector('.cdk-overlay-pane')!;

        expect(pane).withContext('Expected calendar to be open.').toBeTruthy();
        expect(pane.contains(document.activeElement))
          .withContext('Expected focus to be inside the calendar.')
          .toBe(true);

        fixture.componentInstance.datepicker.close();
        fixture.detectChanges();
        flush();

        expect(document.activeElement)
          .withContext('Expected focus to be restored to toggle.')
          .toBe(toggle);
      }));

      it('should toggle the active state of the datepicker toggle', fakeAsync(() => {
        const toggle = fixture.debugElement.query(By.css('sbb-datepicker-toggle')).nativeElement;

        expect(toggle.classList).not.toContain('sbb-datepicker-toggle-active');

        fixture.componentInstance.datepicker.open();
        fixture.detectChanges();
        flush();

        expect(toggle.classList).toContain('sbb-datepicker-toggle-active');

        fixture.componentInstance.datepicker.close();
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        expect(toggle.classList).not.toContain('sbb-datepicker-toggle-active');
      }));
    });

    describe('datepicker inside sbb-form-field', () => {
      let fixture: ComponentFixture<FormFieldDatepicker>;
      let testComponent: FormFieldDatepicker;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(FormFieldDatepicker, []);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
        flush();
      }));

      it('should set aria-labelledby of the overlay to the form field label', fakeAsync(() => {
        const label: HTMLElement = fixture.nativeElement.querySelector('.sbb-form-field-label');

        expect(label).toBeTruthy();
        expect(label.getAttribute('id')).toBeTruthy();

        // When clicking toggle
        fixture.debugElement.query(By.css('.sbb-datepicker-toggle-button')).nativeElement.click();
        fixture.detectChanges();

        flush();

        const popup = document.querySelector(
          '.cdk-overlay-pane .sbb-datepicker-content-container',
        )!;
        expect(popup).toBeTruthy();
        expect(popup.getAttribute('aria-labelledby')).toBe(label.getAttribute('id'));
      }));
    });

    describe('datepicker with min and max dates and validation', () => {
      let fixture: ComponentFixture<DatepickerWithMinAndMaxValidationComponent>;
      let testComponent: DatepickerWithMinAndMaxValidationComponent;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithMinAndMaxValidationComponent);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(fakeAsync(() => {
        testComponent.datepicker.close();
        fixture.detectChanges();
      }));

      it('should use min and max dates specified by the input', () => {
        expect(testComponent.datepicker.minDate).toEqual(new Date(2010, JAN, 1));
        expect(testComponent.datepicker.maxDate).toEqual(new Date(2020, JAN, 1));
      });
    });

    describe('with events', () => {
      let fixture: ComponentFixture<DatepickerWithEventsComponent>;
      let testComponent: DatepickerWithEventsComponent;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerWithEventsComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('should dispatch an event when a datepicker is opened', () => {
        testComponent.datepicker.open();
        fixture.detectChanges();

        expect(testComponent.openedSpy).toHaveBeenCalled();
      });

      it('should dispatch an event when a datepicker is closed', fakeAsync(() => {
        testComponent.datepicker.open();
        fixture.detectChanges();

        testComponent.datepicker.close();
        flush();
        fixture.detectChanges();

        expect(testComponent.closedSpy).toHaveBeenCalled();
      }));
    });

    describe('datepicker that opens on focus', () => {
      let fixture: ComponentFixture<DatepickerOpeningOnFocusComponent>;
      let testComponent: DatepickerOpeningOnFocusComponent;
      let input: HTMLInputElement;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerOpeningOnFocusComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
        input = fixture.debugElement.query(By.css('input')).nativeElement;
      }));

      it('should not reopen if the browser fires the focus event asynchronously', fakeAsync(() => {
        // Stub out the real focus method so we can call it reliably.
        spyOn(input, 'focus').and.callFake(() => {
          // Dispatch the event handler async to simulate the IE11 behavior.
          Promise.resolve().then(() => dispatchFakeEvent(input, 'focus'));
        });

        // Open initially by focusing.
        input.focus();
        fixture.detectChanges();
        flush();

        // Due to some browser limitations we can't install a stub on `document.activeElement`
        // so instead we have to override the previously-focused element manually.
        (fixture.componentInstance.datepicker as any)._focusedElementBeforeOpen = input;

        // Ensure that the datepicker is actually open.
        expect(testComponent.datepicker.opened)
          .withContext('Expected datepicker to be open.')
          .toBe(true);

        // Close the datepicker.
        testComponent.datepicker.close();
        fixture.detectChanges();

        // Schedule the input to be focused asynchronously.
        input.focus();
        fixture.detectChanges();

        // Flush out the scheduled tasks.
        flush();

        expect(testComponent.datepicker.opened)
          .withContext('Expected datepicker to be closed.')
          .toBe(false);
      }));
    });

    describe('datepicker connected with second datepicker', () => {
      let fixture: ComponentFixture<DatepickerConnectedComponent>;
      let testComponent: DatepickerConnectedComponent;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerConnectedComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('should step from first to second datepicker', fakeAsync(() => {
        expect(document.querySelector('.cdk-overlay-pane.sbb-datepicker-panel')).toBeNull();
        expect(testComponent.firstDatepicker.value).toBeNull();
        expect(testComponent.secondDatepicker.value).toBeNull();

        // When clicking toggle
        fixture.debugElement.query(By.css('.sbb-datepicker-toggle-button')).nativeElement.click();
        fixture.detectChanges();

        // Then panel should be open
        expect(document.querySelector('.cdk-overlay-pane.sbb-datepicker-panel')).not.toBeNull();

        // When clicking first date
        fixture.debugElement.query(By.css('.sbb-calendar-body-cell-content')).nativeElement.click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        // Then second panel should be opened
        expect(document.querySelector('.cdk-overlay-pane.sbb-datepicker-panel')).not.toBeNull();

        // When clicking other date
        fixture.debugElement
          .queryAll(By.css('.sbb-calendar-body-cell-content'))[3]
          .nativeElement.click();
        fixture.detectChanges();

        // Then panel should be closed and dates should be set
        expect(document.querySelector('.cdk-overlay-pane.sbb-datepicker-panel')).toBeNull();
        expect(testComponent.firstDatepicker.value).not.toBeNull();
        expect(testComponent.secondDatepicker.value).not.toBeNull();

        flush();
      }));

      it('should clear model if selecting a date in first datepicker which is after date of second datepicker', fakeAsync(() => {
        testComponent.firstDatepicker.setValue(new Date(2022, JAN, 1));
        testComponent.secondDatepicker.setValue(new Date(2022, JAN, 3));
        fixture.detectChanges();

        // When clicking toggle
        fixture.debugElement.query(By.css('.sbb-datepicker-toggle-button')).nativeElement.click();
        fixture.detectChanges();

        // When choosing date
        fixture.debugElement
          .queryAll(By.css('.sbb-calendar-body-cell-content'))[4]
          .nativeElement.click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        // Then model of second datepicker should be reset
        expect(testComponent.firstDatepicker.value).toEqual(new Date(2022, JAN, 5));
        expect(testComponent.secondDatepicker.value).toBeNull();

        // Then datepicker input values should be set correctly
        const dateInputs = fixture.debugElement.queryAll(By.css('.sbb-date-input'));
        expect(dateInputs[0].nativeElement.value).toBe('We, 05.01.2022');
        expect(dateInputs[1].nativeElement.value).toBe('');

        flush();
      }));

      it('should update the arrow keys of the connected datepicker', () => {
        testComponent.firstDatepicker.setValue(new Date(2023, JAN, 15));
        testComponent.secondDatepicker.setValue(new Date(2023, JAN, 15));
        fixture.detectChanges();
        expect(
          fixture.nativeElement.querySelectorAll('.sbb-datepicker-arrow-button-left').length,
        ).toBe(1);
        testComponent.firstDatepicker.setValue(new Date(2023, JAN, 13));
        fixture.detectChanges();

        expect(
          fixture.nativeElement.querySelectorAll('.sbb-datepicker-arrow-button-left').length,
        ).toBe(2);
      });
    });

    describe('datepicker in readonly mode', () => {
      let fixture: ComponentFixture<DatepickerReadonlyComponent>;
      let testComponent: DatepickerReadonlyComponent;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(DatepickerReadonlyComponent);
        fixture.detectChanges();
        testComponent = fixture.componentInstance;
      }));

      it('should hide toggle and arrows', fakeAsync(() => {
        const fixtureNativeElement = fixture.debugElement.nativeElement;
        const datepicker = fixtureNativeElement.querySelector('.sbb-datepicker');

        // When setting a date
        testComponent.date.setValue(new Date());
        fixture.detectChanges();

        // Then arrows and toggle should be shown
        expect(datepicker.classList).toContain('sbb-datepicker-arrows-enabled');
        expect(datepicker.classList).toContain('sbb-datepicker-toggle-enabled');
        expect(fixtureNativeElement.querySelector('.sbb-datepicker-arrow-button')).toBeTruthy();
        expect(fixtureNativeElement.querySelector('.sbb-datepicker-toggle-button')).toBeTruthy();

        // When activating readonly mode
        testComponent.readonly = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        // Then arrows and toggle should be hidden
        expect(datepicker.classList).not.toContain('sbb-datepicker-arrows-enabled');
        expect(datepicker.classList).not.toContain('sbb-datepicker-toggle-enabled');
        expect(fixtureNativeElement.querySelector('.sbb-datepicker-arrow-button')).toBeFalsy();
        expect(fixtureNativeElement.querySelector('.sbb-datepicker-toggle-button')).toBeFalsy();
      }));

      it(`should show '-' if no date is set`, fakeAsync(() => {
        // When activating readonly mode
        testComponent.readonly = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        // Then '-' should be shown as placeholder
        expect(
          fixture.debugElement.nativeElement.querySelector('input').getAttribute('placeholder'),
        ).toBe('-');
      }));
    });
  });

  describe('datepicker with arrows', () => {
    let fixture: ComponentFixture<DatepickerWithArrows>;
    let testComponent: DatepickerWithArrows;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(DatepickerWithArrows);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
    }));

    afterEach(fakeAsync(() => {
      testComponent.datepicker.close();
      fixture.detectChanges();
      flush();
    }));

    it('should display default aria-labels for arrows', () => {
      const nextButton = document.querySelector(
        '.default-arrow-labels button.sbb-datepicker-arrow-button-right',
      );
      const prevButton = document.querySelector(
        '.default-arrow-labels button.sbb-datepicker-arrow-button-left',
      );
      expect(nextButton!.getAttribute('aria-label')).toEqual('Next day');
      expect(prevButton!.getAttribute('aria-label')).toEqual('Previous day');
    });

    it('should display custom aria-labels for arrows', () => {
      const nextButton = document.querySelector(
        '.custom-arrow-labels button.sbb-datepicker-arrow-button-right',
      );
      const prevButton = document.querySelector(
        '.custom-arrow-labels button.sbb-datepicker-arrow-button-left',
      );
      expect(nextButton!.getAttribute('aria-label')).toEqual('Select next day');
      expect(prevButton!.getAttribute('aria-label')).toEqual('Select previous day');
    });

    it('should have an input with full width', () => {
      const wrapper = document.querySelector('.default-arrow-labels');
      const input = document.querySelector('.default-arrow-labels input');
      expect(wrapper!.clientWidth).toEqual(input!.getBoundingClientRect().width);
    });
  });

  describe('datepicker with hidden toggle', () => {
    let fixture: ComponentFixture<DatepickerWithNoToggleComponent>;
    let testComponent: DatepickerWithNoToggleComponent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(DatepickerWithNoToggleComponent);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
    }));

    afterEach(fakeAsync(() => {
      testComponent.datepicker.close();
      fixture.detectChanges();
      flush();
    }));

    it('should not display toggle', () => {
      const toggle = fixture.debugElement.query(By.css('.sbb-datepicker-toggle-button'));
      expect(toggle).toBeFalsy();
    });

    it('should display toggle', () => {
      testComponent.notoggle = false;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(By.css('.sbb-datepicker-toggle-button'));
      expect(toggle).toBeTruthy();
    });
  });

  describe('standalone date input', () => {
    let fixture: ComponentFixture<StandaloneDateInputComponent>;
    let testComponent: StandaloneDateInputComponent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(StandaloneDateInputComponent);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
    }));

    it('should show the date without the name of the week day', () => {
      testComponent.date.setValue(new Date(2022, JAN, 1));
      fixture.detectChanges();

      const dateInput = fixture.debugElement.query(By.css('.sbb-date-input'));
      expect(dateInput.nativeElement.value).toBe('01.01.2022');
    });
  });

  describe('standalone date input without overflow', () => {
    let fixture: ComponentFixture<StandaloneDateInputWithoutOverflowComponent>;
    let testComponent: StandaloneDateInputWithoutOverflowComponent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(
        StandaloneDateInputWithoutOverflowComponent,
        [],
        [{ provide: SBB_DATEPICKER_PREVENT_OVERFLOW, useValue: true }],
      );

      fixture.detectChanges();

      testComponent = fixture.componentInstance;
    }));

    it('should not accept overflowing dates', () => {
      const dateInput = fixture.debugElement.query(By.css('.sbb-date-input')).nativeElement;
      dateInput.value = '30.02.2023';
      dispatchFakeEvent(dateInput, 'input');
      fixture.detectChanges();
      expect(Object.keys(testComponent.date.errors!)).toContain('sbbDateParse');
      expect(testComponent.date.value).toBeNull();
    });

    it('should accept non overflowing dates', () => {
      const dateInput = fixture.debugElement.query(By.css('.sbb-date-input')).nativeElement;
      dateInput.value = '28.02.2023';
      dispatchFakeEvent(dateInput, 'input');
      fixture.detectChanges();
      expect(testComponent.date.errors).toBeNull();
      expect(testComponent.date.value).toEqual(new Date(2023, FEB, 28));
    });
  });
});

@Component({
  template: `
    <sbb-datepicker #d [disabled]="disabled" [opened]="opened">
      <input sbbDateInput [value]="date" />
    </sbb-datepicker>
  `,
  imports: [FormsModule, SbbDatepickerModule],
  standalone: true,
})
class StandardDatepickerComponent {
  opened = false;
  touch = false;
  disabled = false;
  date: Date | null = new Date(2020, JAN, 1);
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
  @ViewChild(SbbDateInput) datepickerInput: SbbDateInput<Date>;
}

@Component({
  template: `
    <sbb-datepicker>
      <input sbbDateInput />
      <input sbbDateInput />
    </sbb-datepicker>
  `,
  imports: [SbbInputModule, SbbDatepickerModule],
  standalone: true,
})
class MultiInputDatepickerComponent {}

@Component({
  template: ` <sbb-datepicker #d></sbb-datepicker> `,
  imports: [SbbDatepickerModule],
  standalone: true,
})
class NoInputDatepickerComponent {
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
}

@Component({
  template: `
    <sbb-datepicker #d [startAt]="startDate">
      <input sbbDateInput [value]="date" />
    </sbb-datepicker>
  `,
  imports: [SbbDatepickerModule],
  standalone: true,
})
class DatepickerWithStartAtComponent {
  date = new Date(2020, JAN, 1);
  startDate = new Date(2010, JAN, 1);
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
}

@Component({
  template: `
    <sbb-datepicker #d>
      <input [(ngModel)]="selected" sbbDateInput />
    </sbb-datepicker>
  `,
  imports: [FormsModule, SbbDatepickerModule],
  standalone: true,
})
class DatepickerWithNgModelComponent {
  selected: Date | null = null;
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
  @ViewChild(SbbDateInput) datepickerInput: SbbDateInput<Date>;
}

@Component({
  template: `
    <sbb-datepicker #d>
      <input sbbDateInput />
    </sbb-datepicker>
  `,
  imports: [SbbDatepickerModule],
  standalone: true,
})
class DatepickerWithToggleComponent {
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
  @ViewChild(SbbDateInput) input: SbbDateInput<Date>;
}

@Component({
  template: `
    <sbb-form-field>
      <sbb-label>Pick a date</sbb-label>
      <sbb-datepicker #d>
        <input sbbInput sbbDateInput />
      </sbb-datepicker>
    </sbb-form-field>
  `,
  imports: [SbbDatepickerModule, SbbInputModule, SbbFormFieldModule],
  standalone: true,
})
class FormFieldDatepicker {
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
  @ViewChild(SbbDateInput) datepickerInput: SbbDateInput<Date>;
  @ViewChild(SbbFormField) formField: SbbFormField;
}

@Component({
  template: `
    <sbb-datepicker #d>
      <input sbbDateInput [(ngModel)]="date" [min]="minDate" [max]="maxDate" />
    </sbb-datepicker>
  `,
  imports: [FormsModule, SbbDatepickerModule],
  standalone: true,
})
class DatepickerWithMinAndMaxValidationComponent {
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
  date: Date | null;
  minDate = new Date(2010, JAN, 1);
  maxDate = new Date(2020, JAN, 1);
}

@Component({
  template: `
    <sbb-datepicker (opened)="openedSpy()" (closed)="closedSpy()" #d>
      <input [(ngModel)]="selected" sbbDateInput />
    </sbb-datepicker>
  `,
  imports: [FormsModule, SbbDatepickerModule],
  standalone: true,
})
class DatepickerWithEventsComponent {
  selected: Date | null = null;
  openedSpy = jasmine.createSpy('opened spy');
  closedSpy = jasmine.createSpy('closed spy');
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
}

@Component({
  template: `
    <sbb-datepicker #d>
      <input (focus)="d.open()" sbbDateInput />
    </sbb-datepicker>
  `,
  imports: [SbbDatepickerModule],
  standalone: true,
})
class DatepickerOpeningOnFocusComponent {
  @ViewChild(SbbDatepicker) datepicker: SbbDatepicker<Date>;
}

@Component({
  template: `<sbb-datepicker arrows [connected]="second">
      <input sbbDateInput sbbInput [formControl]="firstDatepicker" />
    </sbb-datepicker>
    <sbb-datepicker #second arrows>
      <input sbbDateInput sbbInput [formControl]="secondDatepicker" />
    </sbb-datepicker>`,
  imports: [ReactiveFormsModule, SbbInputModule, SbbDatepickerModule],
  standalone: true,
})
class DatepickerConnectedComponent {
  firstDatepicker = new FormControl<Date | null>(null);
  secondDatepicker = new FormControl<Date | null>(null);
}

@Component({
  template: `
    <sbb-datepicker arrows #d class="default-arrow-labels" style="width: 300px">
      <input sbbDateInput [value]="date" />
    </sbb-datepicker>

    <sbb-datepicker
      arrows
      #d
      prevDayAriaLabel="Select previous day"
      nextDayAriaLabel="Select next day"
      class="custom-arrow-labels"
    >
      <input sbbDateInput [value]="date" />
    </sbb-datepicker>
  `,
  imports: [SbbDatepickerModule],
  standalone: true,
})
class DatepickerWithArrows {
  date: Date | null = new Date();
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
  @ViewChild(SbbDateInput) datepickerInput: SbbDateInput<Date>;
}

@Component({
  template: `
    <sbb-datepicker arrows>
      <input
        sbbDateInput
        sbbInput
        [formControl]="date"
        [readonly]="readonly"
        [placeholder]="placeholder"
      />
    </sbb-datepicker>
  `,
  imports: [ReactiveFormsModule, SbbInputModule, SbbDatepickerModule],
  standalone: true,
})
class DatepickerReadonlyComponent {
  date = new FormControl<Date | null>(null);
  readonly: boolean = false;
  placeholder?: string = undefined;
}

@Component({
  template: `
    <sbb-datepicker #d [notoggle]="notoggle">
      <input sbbDateInput />
    </sbb-datepicker>
  `,
  imports: [SbbDatepickerModule],
  standalone: true,
})
class DatepickerWithNoToggleComponent {
  @ViewChild('d') datepicker: SbbDatepicker<Date>;
  @ViewChild(SbbDateInput) input: SbbDateInput<Date>;
  notoggle: boolean = true;
}

@Component({
  template: ` <input sbbDateInput sbbInput [formControl]="date" /> `,
  imports: [ReactiveFormsModule, SbbInputModule, SbbDatepickerModule],
  standalone: true,
})
class StandaloneDateInputComponent {
  date = new FormControl<Date | null>(null);
}

@Component({
  template: ` <input sbbDateInput sbbInput [formControl]="date" /> `,
  imports: [ReactiveFormsModule, SbbInputModule, SbbDatepickerModule],
  standalone: true,
})
class StandaloneDateInputWithoutOverflowComponent {
  date = new FormControl<Date | null>(null);
}
