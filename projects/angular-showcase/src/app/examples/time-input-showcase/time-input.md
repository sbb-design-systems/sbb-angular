# Time Input Overview

Import time input module into your application

```ts
import { TimeInputModule } from '@sbb-esta/angular-public';
```
and then you can use the time input directive as seen below

```html
<h4 class="sbbsc-block">Example</h4>
<form>
   <input sbbTimeInput />
</form>
```
The time input field accepts any numeric values and one character (for example a "." or "," or "-") but automatically formats them in the correct format "hh:mm". <br/>

<b>Attention, the time input doesn't apply any validation. This is up to the consumer.</b>

To understand how the time input works, see the following cases:

| Input  | Output  |
|---|---|
|  16:30  |  16:30   |
| 1  | 01:00  |
| 12  |  12:00 |
| 123  | 12:30  |
| 1234  | 12:34  |
| 13567 | 13:56 |
| 3.56  | 03:56 |
| 23,40 | 23:40 |



 




