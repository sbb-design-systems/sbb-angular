import { dispatchFakeEvent, dispatchMouseEvent } from '../../_common/testing/dispatch-events';
import { flush, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Type, FactoryProvider, ValueProvider, inject, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { DatepickerModule } from '..';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { JAN, DEC } from '../../_common/testing/dates-constants';
import { By } from '@angular/platform-browser';
import { DatepickerComponent } from './datepicker.component';

@Component({
  template: `<sbb-datepicker [formControl]="formControl"></sbb-datepicker>`,
})
class ReactiveDatepickerComponent {
  @ViewChild(DatepickerComponent) datepicker: DatepickerComponent;
  formControl = new FormControl();
}

@Component({
  template: `<sbb-datepicker [(ngModel)]="selected"></sbb-datepicker>`,
})
class ModelDatepickerComponent {
  @ViewChild(DatepickerComponent) datepicker: DatepickerComponent;
  selected = null;

}

@Component({
  template: `<sbb-datepicker [(ngModel)]="date"
                             [min]="minDate"
                             [max]="maxDate"></sbb-datepicker>`,
})
class MinMaxDatepickerComponent {
  @ViewChild(DatepickerComponent) datepicker: DatepickerComponent;

  minDate = new Date('2018-06-20');
  maxDate = new Date('2018-12-28');
  date = null;
}


@Component({
  template: `<sbb-datepicker [(ngModel)]="date" [sbbDatepickerFilter]="filterDates"></sbb-datepicker>`,
})
class DatepickerWithFilterAndValidationComponent {
  @ViewChild(DatepickerComponent) datepicker: DatepickerComponent;

  date = null;
  filterDates(date: Date): boolean {
    return (date.getTime() !== new Date(2017, JAN, 1).getTime());
  }
}

describe('DatepickerComponent', () => {


  // Creates a test component fixture.
  function createComponent(
    component: Type<any>,
    imports: Type<any>[] = [],
    providers: (FactoryProvider | ValueProvider)[] = [],
    entryComponents: Type<any>[] = []): ComponentFixture<any> {

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        DatepickerModule,
        ReactiveFormsModule,
        ...imports
      ],
      providers,
      declarations: [component, ...entryComponents],
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [entryComponents]
      }
    }).compileComponents();

    return TestBed.createComponent(component);
  }

  describe('in Reactive Forms', () => {

    let fixture: ComponentFixture<ReactiveDatepickerComponent>;
    let testComponent: ReactiveDatepickerComponent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(ReactiveDatepickerComponent);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
    }));


    it('should update datepicker when formControl changes', () => {
      expect(testComponent.datepicker.datepickerInput.value).toBeNull();
      expect(testComponent.datepicker.embeddedDatepicker.selected).toBeNull();

      const selected = new Date(2017, JAN, 1);
      testComponent.formControl.setValue(selected);
      fixture.detectChanges();

      expect(testComponent.datepicker.datepickerInput.value).toEqual(selected);
      expect(testComponent.datepicker.embeddedDatepicker.selected).toEqual(selected);
    });

    it('should update formControl when date is selected', () => {
      expect(testComponent.formControl.value).toBeNull();
      expect(testComponent.datepicker.datepickerInput.value).toBeNull();

      const selected = new Date(2017, JAN, 1);
      testComponent.datepicker.embeddedDatepicker.select(selected);
      fixture.detectChanges();

      expect(testComponent.formControl.value).toEqual(selected);
      expect(testComponent.datepicker.datepickerInput.value).toEqual(selected);
    });

    it('should disable input when form control disabled', () => {
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

      expect(inputEl.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(inputEl.disabled).toBe(true);
    });

    it('should mark input touched on calendar selection', fakeAsync(() => {
      const el = fixture.debugElement.query(By.css('sbb-datepicker')).nativeElement;
      expect(el.classList).toContain('ng-untouched');

      testComponent.datepicker.embeddedDatepicker.select(new Date(2017, JAN, 1));
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(el.classList).toContain('ng-touched');
    }));

    it('should mark input dirty after date selected', fakeAsync(() => {
      const el = fixture.debugElement.query(By.css('sbb-datepicker')).nativeElement;

      expect(el.classList).toContain('ng-pristine');

      testComponent.datepicker.embeddedDatepicker.select(new Date(2017, JAN, 1));
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(el.classList).toContain('ng-dirty');
    }));

    it('should disable toggle when form control disabled', () => {
      expect(testComponent.datepicker.datepickerToggle.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(testComponent.datepicker.datepickerToggle.disabled).toBe(true);
    });

    it('should set `aria-haspopup` on the toggle button', () => {
      const button = fixture.debugElement.query(By.css('button'));

      expect(button).toBeTruthy();
      expect(button.nativeElement.getAttribute('aria-haspopup')).toBe('true');
    });

  });

  describe('with NgModel', () => {


    let fixture: ComponentFixture<ModelDatepickerComponent>;
    let testComponent: ModelDatepickerComponent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(ModelDatepickerComponent);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
    }));

    it('should update datepicker when model changes', fakeAsync(() => {
      expect(testComponent.datepicker.datepickerInput.value).toBeNull();
      expect(testComponent.datepicker.embeddedDatepicker.selected).toBeNull();

      const selected = new Date(2017, JAN, 1);
      testComponent.selected = selected;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(testComponent.datepicker.datepickerInput.value).toEqual(selected);
      expect(testComponent.datepicker.embeddedDatepicker.selected).toEqual(selected);
    }));



    it('should update model when date is selected', fakeAsync(() => {
      expect(testComponent.selected).toBeNull();
      expect(testComponent.datepicker.datepickerInput.value).toBeNull();

      const selected = new Date(2017, JAN, 1);
      testComponent.datepicker.embeddedDatepicker.select(selected);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(testComponent.selected).toEqual(selected);
      expect(testComponent.datepicker.datepickerInput.value).toEqual(selected);
    }));
  });

  describe('with min and max', () => {


    let fixture: ComponentFixture<MinMaxDatepickerComponent>;
    let testComponent: MinMaxDatepickerComponent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(MinMaxDatepickerComponent);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
    }));

    it('should mark invalid when value is before min', fakeAsync(() => {
      testComponent.date = new Date(2009, DEC, 31);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('sbb-datepicker')).nativeElement.classList)
        .toContain('ng-invalid');
    }));

    it('should mark invalid when value is after max', fakeAsync(() => {
      testComponent.date = new Date(2020, JAN, 2);
      fixture.detectChanges();
      flush();

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('sbb-datepicker')).nativeElement.classList)
        .toContain('ng-invalid');
    }));


    it('should not mark invalid when value equals min', fakeAsync(() => {
      testComponent.date = testComponent.datepicker.min;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('sbb-datepicker')).nativeElement.classList)
        .not.toContain('ng-invalid');
    }));

    it('should not mark invalid when value equals max', fakeAsync(() => {
      testComponent.date = testComponent.datepicker.max;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('sbb-datepicker')).nativeElement.classList)
        .not.toContain('ng-invalid');
    }));

    it('should not mark invalid when value is between min and max', fakeAsync(() => {
      testComponent.date = new Date('2018-06-25');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('sbb-datepicker')).nativeElement.classList)
        .not.toContain('ng-invalid');
    }));


  });
  describe('datepicker with filter and validation', () => {
    let fixture: ComponentFixture<DatepickerWithFilterAndValidationComponent>;
    let testComponent: DatepickerWithFilterAndValidationComponent;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(DatepickerWithFilterAndValidationComponent);
      fixture.detectChanges();

      testComponent = fixture.componentInstance;
    }));

    afterEach(fakeAsync(() => {
      testComponent.datepicker.embeddedDatepicker.close();
      fixture.detectChanges();
      flush();
    }));

    it('should mark input invalid', fakeAsync(() => {
      testComponent.date = new Date(2017, JAN, 1);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('sbb-datepicker')).nativeElement.classList)
        .toContain('ng-invalid');

      testComponent.date = new Date(2017, JAN, 2);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('sbb-datepicker')).nativeElement.classList)
        .not.toContain('ng-invalid');
    }));

  });

});
