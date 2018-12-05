# Time Input Overview

Import time input module into your application

```ts
import { TimeInputModule } from 'sbb-angular';
```
and then you can use the time input component as seen below

```html
<h4 class="sbbsc-block">Example</h4>
<form>
   <input sbbTimeInput />
</form>
```
<br/>
<h2> A brief description </h2>

The time input field accepts any numeric values and one character (for example a "." or "," or "-") but automatically formatted them in the correct format "hh:mm". <br/>

<b>Attention, the time input doesn't apply any validation. This task is leaved to consumer who can use the time input for different purposes.</b>

To understand as the time input works, we consider the following cases:

| Input  | Output  |
|---|---|
|  16:30  |  16:30   |
| 1  | 01:00  |
| 12  |  12:00 |
| 123  | 12:30  |
| 1234  | 12:34  |
| 13567 | 13:56 |





 




