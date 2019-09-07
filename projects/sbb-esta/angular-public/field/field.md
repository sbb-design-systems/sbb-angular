`<sbb-field>` works with `<input sbbInput>`, `<select sbbInput>`, `<sbb-select>` and `<input sbbInput sbbDateInput>`.

```html
<h4>Example Form Field</h4>
<sbb-field>
  <sbb-label>Name</sbb-label>
  <input type="text" sbbInput formControlName="name1" placeholder="Name" />
  <sbb-form-error *ngIf="form.get('name1').errors?.required"
    >This field is required.</sbb-form-error
  >
</sbb-field>

<sbb-field label="Email">
  <input type="text" sbbInput formControlName="email" placeholder="Email" />
  <sbb-form-error *ngIf="form.get('email').errors?.required"
    >This field is required.</sbb-form-error
  >
  <sbb-form-error *ngIf="form.get('email').errors?.email"
    >You must provide a valid email address.</sbb-form-error
  >
</sbb-field>
```

Ideally you should only show one error message at a time.
If you need to display multiple error messages at the same time, it is better for accessibility
if the messages are contained in one sbb-form-error element.

sbb-form-error is only rendered when the input field is in an error state.

```html
<h4>Example Form Field</h4>
<sbb-field>
  <sbb-label for="name1">Name</sbb-label>
  <input type="text" formControlName="name1" [placeholder]="placeholder" id="name1" />
  <sbb-form-error>
    <ng-container *ngIf="form.get('name1').errors.required">
      This field is required!<br />
    </ng-container>
    <ng-container *ngIf="form.get('name1').errors.required">
      This field is required!<br />
    </ng-container>
  </sbb-form-error>
</sbb-field>
```

sbb-form-error can also be used as [sbbFormError], since it is a directive.
This enables the use case of having an error message component, which contains common error messages.

```html
<h4>Example Form Field</h4>
<sbb-field>
  <sbb-label for="name1">Name</sbb-label>
  <input type="text" formControlName="name1" [placeholder]="placeholder" id="name1" />
  <app-error-message sbbFormError [errors]="form.get('name1').errors"></app-error-message>
</sbb-field>
```
