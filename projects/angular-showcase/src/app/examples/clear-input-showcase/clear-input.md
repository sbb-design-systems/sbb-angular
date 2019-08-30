# Clear Input Overview

Import checkbox module in your application

```ts
import { ClearInputModule } from '@sbb-esta/angular-public';
```

You can attach the clear-input component to any input or sbb-search component.
It can be attached both to Template and Reactive form controls.

```html
<input type="text" [(ngModel)]="variable" sbbClearTarget #clearTarget="sbbClearTarget" />
<sbb-clear-input [target]="clearTarget"></sbb-clear-input>
```

This means it can be used with components such as sbb-datepicker

```html
<sbb-datepicker>
  <input type="text" [(ngModel)]="variable" sbbClearTarget #clearTarget="sbbClearTarget" />
</sbb-datepicker>
<sbb-clear-input [target]="clearTarget"></sbb-clear-input>
```

For sbb-search, it will work without the input tag.

```html
<sbb-search [(ngModel)]="variable" sbbClearTarget #clearTarget="sbbClearTarget"></sbb-search>
<sbb-clear-input [target]="clearTarget"></sbb-clear-input>
```
