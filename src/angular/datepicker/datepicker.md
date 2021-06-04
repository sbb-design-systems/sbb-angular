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
<sbb-datepicker [toggle]="toggleEnabled" [arrows]="arrowsEnabled">
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

#### Date Adapter

A Date Adapter defines how to deal with dates and converts user inputs in to date objets.
The `Datepicker` uses the `DateAdapter` internally, respectively the `NativeDateAdapter`,
which uses the JavaScript `Date` object.

##### LeanDateAdapter

For lean applications you have the ability to use `LeanDateAdapter` which extends `NativeDateAdapter`
and additionally allows parsing dates like '01012020'.

```ts
import { SBB_LEAN_DATE_ADAPTER } from '@sbb-esta/angular/core';
@NgModule({
  providers: [SBB_LEAN_DATE_ADAPTER],
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
