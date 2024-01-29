The datepicker helps to enter and display dates in a form field.

```html
<sbb-datepicker>
  <input sbbDateInput />
</sbb-datepicker>
```

### Calendar Toggle And Navigation Arrows

The datepicker form field can have a toggle to show a calendar to pick dates from (enabled by default)
and arrows which by clicking increase or decrease dates.

```html
<sbb-datepicker notoggle arrows>
  <input sbbDateInput />
</sbb-datepicker>
```

### Min and Max Date

The date input supports min and max dates.

```html
<sbb-datepicker>
  <input sbbDateInput [min]="minDate" [max]="maxDate" />
</sbb-datepicker>
```

### `sbb-form-field` usage

To use a datepicker within a `sbb-form-field`, simply add `sbbInput` directive beside `sbbDateInput` directive.

```html
<sbb-form-field label="Date">
  <sbb-datepicker>
    <input sbbDateInput sbbInput formControlName="date" />
  </sbb-datepicker>
</sbb-form-field>
```

### Connected Datepickers

Datepickers can be connected. On selecting a date in the first/main datepicker, the second/connected
datepicker will have its datepicker opened if it was empty, or the value of the connected datepicker is before the
newly selected date. Also, the value of the main datepicker is set to be the min value of the connected datepicker, if no
manual min has been set.

```html
<sbb-form-field label="Select date range">
  <sbb-datepicker [connected]="second">
    <input sbbDateInput sbbInput formControlName="firstDatepicker" />
  </sbb-datepicker>
</sbb-form-field>
<sbb-form-field>
  <sbb-datepicker #second>
    <input sbbDateInput sbbInput formControlName="secondDatepicker" />
  </sbb-datepicker>
</sbb-form-field>
```

### Date Filter

You can create a function to only enable certain dates. For example only enabling the first date
of each month as seen below.

```html
<sbb-datepicker>
  <input sbbDateInput sbbInput [dateFilter]="filterDates" />
</sbb-datepicker>
```

```ts
filterDates = (date: Date): boolean => {
  return date.getDate() === 1;
};
```

### Standalone Date Input

The `sbbDateInput` can be used without a `sbb-datepicker`.

```html
<sbb-form-field label="Date">
  <input sbbDateInput sbbInput />
</sbb-form-field>
```

### Standalone Calendar

The `SbbCalendar` can be used without a `sbb-datepicker`.
For defining custom CSS classes for dates, you can use the property `dateClass`.
This property can be either a function or an observable of a function.

**Using a function**

```html
<sbb-calendar [dateClass]="dateClassFunction"></sbb-calendar>
```

```js
@Component(...)
class Component {
  dateClass: SbbCalendarCellClassFunction<Date> = (date) => {
    // Add custom class to every Sunday
    return date.getDay() === 0 ? 'example-custom-date-class' : '';
  };
}
```

Note: Angular's change detection would not recognice any change inside the function body.
To update the function you have to assign a new functon to `this.dateClass`.

**Using an observable**

```html
<sbb-calendar [dateClass]="dateClassObservable$"></sbb-calendar>

<input [formControl]="weekSelectControl" />
```

```js
@Component(...)
class Component {
  dateClassObservable$ = this.weekSelectControl.valueChanges.pipe(
    startWith(this.weekSelectControl.value),
    map((value) => (date: Date) => date.getDay() === value ? 'example-custom-date-class' : '')
  );

  weekSelectControl = new FormConrol(0);
}
```

### Date Handling

`SbbDatepicker` by default uses the native [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
object (see below for the `SbbDateAdapter`). This ensures consistency in the way dates are
handled in your application. However, `Date` has a few unexpected behaviors, as described
below (not complete):

**Month is zero indexed**

When creating or reading a date, the month is zero indexed. This does not apply when using
ISO dates.

| Usage                                | Result          |
| ------------------------------------ | --------------- |
| new Date(2020, 0, 1)                 | 1. January 2020 |
| new Date(2020, 0, 1).getMonth()      | 0               |
| new Date('2020-01-01T12:00:00.000Z') | 1. January 2020 |

**Dates are local by default, but UTC when converting to JSON**

This can be especially surprising when using the datepicker for selecting a date and sending
the date to a backend, since it will be converted to UTC, which might change the effective date
due to the timezone conversion.

| CET: UTC+01:00                | UTC                      |
| ----------------------------- | ------------------------ |
| new Date(2020, 0, 1, 0, 0, 0) | 2019-12-31T23:00:00.000Z |

We recommend converting the `Date` object to a string representation of only the date part.

| Usage examples | Format `yyyy-mm-dd`                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `native`       | `` `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}` `` |
| `date-fns`     | `formatISO(date, { representation: 'date' })`                                                                                    |

### Converting User Inputs

#### Year Pivot

The date input will convert 2 digit years into 4 digit years. The pivot year can be configured
with `SBB_DATEPICKER_2DIGIT_YEAR_PIVOT`. The default is the current year subtracted by 1975
(e.g. 2019 - 1975 = 44). Years from 0 and to the pivot year (inclusive) to the pivot year will
have 2000 added to it, years from pivot year + 1 to 100 (exclusive) will have 1900 added to it.

```typescript
  providers: [
     ...
     { provide: SBB_DATEPICKER_2DIGIT_YEAR_PIVOT, useValue: 50 },
     ...
  ]
```

| Input    | Output     |
| -------- | ---------- |
| 08.12.50 | 08.12.1950 |
| 08.12.00 | 08.12.2000 |
| 08.12.18 | 08.12.2018 |

#### Overflowing dates

By default, the date input accepts overflowing dates. For example, the input string '30.02.2022'
is converted to '02.03.2022'. Overflowing dates can be prevented with 'SBB_DATEPICKER_PREVENT_OVERFLOW'.
If this option is set to `true`, overflowing date strings are not converted to a date.

```typescript
  providers: [
     ...
     { provide: SBB_DATEPICKER_PREVENT_OVERFLOW, useValue: true },
     ...
  ]
```

#### Date Adapter

A Date Adapter defines how to deal with dates and converts user inputs in to date objets.
The `SbbDatepicker` uses the `SbbDateAdapter` internally, respectively the `SbbNativeDateAdapter`,
which uses the JavaScript `Date` object.

For providing the `SbbDateAdapter` globally, you either can use the `SBB_DATE_ADAPTER` injection token or the
`provideNativeDateAdapter` function. This is e.g. necessary if you want to use the `SbbDatePicker` or `SbbCalendar`
inside an `SbbDialog` having an isolated scope.

```ts
import { provideNativeDateAdapter } from '@sbb-esta/angular/core';

bootstrapApplication(MyApp, {
  providers: [provideNativeDateAdapter()],
});
```

##### LeanDateAdapter

For lean applications you have the ability to use `LeanDateAdapter` which extends `NativeDateAdapter`
and additionally allows parsing dates like '01012020'.

```ts
import { provideLeanDateAdapter } from '@sbb-esta/angular/core';
@NgModule({
  providers: [provideLeanDateAdapter()],
})
export class AppModule {}
```

##### Custom DateAdapter

It is possible to implement your own `DateAdapter` and register it globally:

```ts
@NgModule({
  providers: [{ provide: DateAdapter, useClass: MyDateAdapter }],
})
export class AppModule {}
```

### Accessibility

Add a custom `aria-label` to the next- and previous day buttons by setting `nextDayAriaLabel` and `prevDayAriaLabel`.
