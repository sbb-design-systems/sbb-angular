# Input Field Overview

Import field module into your application

```ts
import { FieldModule } from 'sbb-angular';
```

and then you can use the input field component as seen below

```html

  <h4>Example Input Field</h4>
  <sbb-field>
    <sbb-label for="name1">Name</sbb-label>
    <input type="text" formControlName="name1" [placeholder]="placeholder" id="name1">
    <sbb-form-error *ngIf="form.get('name1').errors.required">This field is required!</sbb-form-error>
  </sbb-field>
   
```  