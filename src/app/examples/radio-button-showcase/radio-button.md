# RadioButton Overview

Import RadioButton module into your application

```ts
import {
  RadioButtonModule
} from 'sbb-angular';
```
and then you can use the radioButton component as seen below

```html
 <h4>Single Radio Button</h4>
 <sbb-radio-button inputId="single-radio" 
                   name="single-radio" 
                   value="single-radio" 
                   [disabled]="disabled"
                   [required]="required" 
                   [checked]="checked"></sbb-radio-button>
 <label for="single-radio">Radio 1</label>
 
```
