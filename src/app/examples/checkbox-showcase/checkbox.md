# Checkbox Overview

Import checkbox module in your application

```ts
import {
  IconCommonModule,
  CheckboxModule
} from 'sbb-angular';
```
and then you can use the checkbox component as seen below

```html
   <h4>Example Checkbox</h4>
      <sbb-checkbox inputId="single-checkbox" value="single-checkbox" [disabled]="disabled" [required]="required"
        [checked]="checked"></sbb-checkbox>
      <label for="single-checkbox"> Checkbox 1</label>
    </div>

```
