# RadioButton Overview

Import RadioButton module into your application

```ts
import { RadioButtonModule } from '@sbb-esta/angular-public';
```
and then you can use the radioButton component as seen below

```html
 <h4>Single Radio Button</h4>
 <sbb-radio-button name="single-radio" 
                   value="single-radio" 
                   [disabled]="disabled"
                   [required]="required" 
                   [checked]="checked">Radio 1</sbb-radio-button>
 
```
