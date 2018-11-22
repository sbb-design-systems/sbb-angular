# Input Field Overview

Import field module into your application

```ts
import {
  FieldModule
} from 'sbb-angular';
```

and then you can use the input field component as seen below

```html

  <h4>Example Input Field</h4>
  <sbb-field>
  <sbb-label for="name1">Name</sbb-label>
  <span *ngIf="disabled">{{ myForm1.get('name1').value ? myForm1.get('name1').value : placeholder }}</span>
  <input *ngIf="!disabled" type="text" 
                           formControlName="name1" 
                           autocomplete="off" 
                           [placeholder]="placeholder"
                           id="name1" 
                           spellcheck="false"></sbb-field>
   
```