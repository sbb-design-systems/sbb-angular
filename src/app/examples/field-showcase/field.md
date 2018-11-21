# SBB Field Overview

Import sbb field module into your application

```ts
import {
  FieldModule
} from 'sbb-angular';
```
and then you can use the sbb field component as seen below

```html

   <h4>Example SBB Field</h4>
   <sbb-label for="name1">Name</sbb-label>
    <input type="text" 
           formControlName="name1" 
           autocomplete="off" 
           [placeholder]="placeholder"
           id="name1" 
           spellcheck="false">

```