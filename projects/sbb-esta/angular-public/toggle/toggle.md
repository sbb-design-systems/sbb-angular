You can use the toggle component as seen below

```html
<sbb-toggle>
  <sbb-toggle-option label="Option 1" value="dog"></sbb-toggle-option>
  <sbb-toggle-option label]="Option 2" value="cat"></sbb-toggle-option>
</sbb-toggle>
```

### What does the module do?

It offers the user a choice of exactly two options.

### Characteristics

The toggle button has two states:

- First (first option chosen)
- Second (second option selected)

By default, the first option is always preselected.

First simple example

```html
<sbb-toggle formControlName="test">
  <sbb-toggle-option [label]="option1.label" [value]="option1.value"></sbb-toggle-option>
  <sbb-toggle-option [label]="option2.label" [value]="option2.value"></sbb-toggle-option>
</sbb-toggle>
```

Toggle button is shown in three modes:

- with icon

```html
<h4>Toggle buttons used as Reactive forms</h4>
<form [formGroup]="form" novalidate>
  <sbb-toggle formControlName="test">
    <sbb-toggle-option [label]="option1.label" [value]="option1.value">
      <sbb-icon-arrow-right *sbbToggleOptionIcon></sbb-icon-arrow-right>
      <sbb-toggle-option [label]="option2.label" [value]="option2.value"> </sbb-toggle-option>
      <sbb-icon-arrows-right-left *sbbToggleOptionIcon></sbb-icon-arrows-right-left>
    </sbb-toggle-option>
  </sbb-toggle>
</form>
```

- with info text

```html
<h4>Toggle buttons used without forms</h4>
<sbb-toggle aria-labelledby="group_label_3" (toggleChange)="toggleChange($event)">
  <sbb-toggle-option label="2. Klasse" infoText="- CHF 5.60" [value]="{ myObjectValue: true }">
  </sbb-toggle-option>
  <sbb-toggle-option label="1. Klasse" infoText="+ CHF 39.00" [value]="{ myObjectValue: false }">
  </sbb-toggle-option>
</sbb-toggle>
```

- with additional input context

```html
<h4>Toggle buttons simple example with info content</h4>
<sbb-toggle aria-labelledby="group_label_1" [(ngModel)]="modelValue" name="test-toggle-2">
  <sbb-toggle-option
    *ngFor="let option of toggleOptions | async; let i = index;"
    [label]="option.label"
    [value]="option.value"
  >
    <ng-container *ngIf="i === 0">
      <sbb-icon-arrow-right *sbbToggleOptionIcon></sbb-icon-arrow-right>
    </ng-container>
    <ng-container *ngIf="i === 1">
      <sbb-icon-arrows-right-left *sbbToggleOptionIcon></sbb-icon-arrows-right-left>
    </ng-container>
    <sbb-field mode="long" *ngIf="i === 0">
      <sbb-label for="name1">Select date</sbb-label>
      <sbb-datepicker>
        <input sbbDateInput type="text" />
      </sbb-datepicker>
    </sbb-field>
    <p *ngIf="i === 1">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </p>
  </sbb-toggle-option>
</sbb-toggle>
```
