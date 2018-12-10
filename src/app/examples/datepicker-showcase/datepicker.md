# DatePicker Overview

Import datepicker module in your application 

```ts
import { DatepickerModule } from 'sbb-angular';
```
The datepicker field accepts dates in the format of dd.MM.yyyy as see below

| Input              | Output         |
| ------------------ | -------------- |
| 08.12.2018         | Sa, 08.12.2018 |

You can use datepicker in three different modes:

1. You can choose any date and also to set a min and max date. The initial focus is the current date value.
```html
<h4>Simple Datepicker</h4>
<sbb-field mode="long">
    <sbb-label for="Datum">Datum</sbb-label> 
    <sbb-datepicker [formControl]="laData" [withoutToggle]="withoutToggle" [min]="minDate" [max]="maxDate" (closed)="closedEvent()" (opened)="openedEvent()" (dateChange)="dateChangeEvent($event)" (dateInput)="dateInputEvent($event)"></sbb-datepicker>
</sbb-field>
```

2. To set a range of dates
```html
<h4>2 Datepickers</h4>
<form [formGroup]="twoDatepickersForm">
   <sbb-field mode="medium" class="sbbsc-medium-field">
      <sbb-label for="Datum">Datumsbereich innerhalb eines Monats</sbb-label>
      <sbb-datepicker formControlName="firstDatepicker" [attachDatepicker]="datepickerTheSecond" withArrows></sbb-datepicker>
   </sbb-field>
   <sbb-field mode="medium" class="sbbsc-medium-field">
      <sbb-datepicker formControlName="secondDatepicker" #datepickerTheSecond withArrows></sbb-datepicker>
   </sbb-field>
</form>
```

3. You can create a function to get only the date of the first day of the month as see below
```html
<h4>Date filter</h4>
<sbb-field>
  <sbb-label for="Datum">Datum</sbb-label>  
  <sbb-datepicker [formControl]="dateWithFilter" [sbbDatepickerFilter]="filterDates" withArrows></sbb-datepicker>
</sbb-field>
```
    ```ts
    filterDates(date: Date): boolean {
        return date.getDate() === 1;
    }
    ```

4. You can choose a date with only input property (without arrows)
```html
<h4>Simple Datepicker</h4>
<sbb-field>
  <sbb-label for="Datum">Datum</sbb-label> 
  <sbb-datepicker withoutToggle></sbb-datepicker>
</sbb-field>
```






