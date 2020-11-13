The datepicker field accepts dates in the format of dd.MM.yyyy as seen below

| Input      | Output         |
| ---------- | -------------- |
| 08.12.2018 | Sa, 08.12.2018 |

### Basic Usage

```html
<sbb-datepicker>
  <input sbbDateInput />
</sbb-datepicker>
```

By default the datepicker has the toggle enabled and the arrows disabled. Toggle and arrows can
be enabled/disabled via attributes or property:

```html
<sbb-datepicker toggle="false" arrows>
  <input sbbDateInput />
</sbb-datepicker>

<sbb-datepicker [toggle]="toggleEnabled" [arrows]="arrowsEnabled">
  <input sbbDateInput />
</sbb-datepicker>
```

### Full Field Example

The date input supports min and max dates. The datepicker emits events for opening and closing the datepicker.
The initial focus for the datepicker is the current date value.

```html
<sbb-form-field>
  <sbb-label>Datum</sbb-label>
  <sbb-datepicker (closed)="closedEvent()" (opened)="openedEvent()">
    <input
      sbbDateInput
      sbbInput
      formControlName="date"
      [min]="minDate"
      [max]="maxDate"
      (dateChange)="dateChangeEvent($event)"
      (dateInput)="dateInputEvent($event)"
    />
  </sbb-datepicker>
</sbb-form-field>
```

### Connected Datepickers

Datepickers can be connected. On selecting a date in the first/main datepicker, the second/connected
datepicker will have its datepicker opened if it was empty or the value of the connected datepicker is before the
newly selected date. Also the value of the main datepicker is set to be the min value of the connected datepicker, if no
manual min has been set.

```html
<form [formGroup]="twoDatepickersForm">
  <sbb-form-field>
    <sbb-label for="Datum">Datumsbereich innerhalb eines Monats</sbb-label>
    <sbb-datepicker [connected]="second" arrows>
      <input sbbDateInput sbbInput formControlName="firstDatepicker" />
    </sbb-datepicker>
  </sbb-form-field>
  <sbb-form-field>
    <sbb-datepicker #second arrows>
      <input sbbDateInput sbbInput formControlName="secondDatepicker" />
    </sbb-datepicker>
  </sbb-form-field>
</form>
```

### Date Filter

You can create a function to only enable certain dates. For example only enabling the first date
of each month as seen below.

```html
<h4>Date filter</h4>
<sbb-form-field>
  <sbb-label for="Datum">Datum</sbb-label>
  <sbb-datepicker arrows>
    <input sbbDateInput sbbInput [formControl]="dateWithFilter" [dateFilter]="filterDates" />
  </sbb-datepicker>
</sbb-form-field>
```

```ts
filterDates = (date: Date): boolean => {
  return date.getDate() === 1;
};
```

### Standalone Date Input

The sbbDateInput can be used without a datepicker.

```html
<sbb-form-field>
  <sbb-label for="Datum">Datum</sbb-label>
  <input sbbDateInput sbbInput [formControl]="standaloneDate" />
</sbb-form-field>
```

### Year Pivot

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

### Date Adapter

For business applications we optionally provide an alternative date adapter (e.g. for parsing a manually entered date string).
See [Datetime documentation](/core/components/datetime) for more information.
