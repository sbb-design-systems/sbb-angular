# Checkbox panel Overview

Import checkbox panel module into your application

```ts
import { CheckboxPanelModule } from 'sbb-angular';
```

* Multiple checkbox panel 

```html
<h4>Basic Example</h4>
<div class="sbbsc-block" *ngFor="let option of checkboxOptions; index as i">
    <sbb-checkbox-panel [(ngModel)]="option.selected" [value]="option.value" [label]="option.name"></sbb-checkbox-panel>
</div>
```

* Multiple checkbox panel with subtitle

```html
<h4>Multiple checkbox panel with a subtitle</h4>
<sbb-checkbox-panel name="single-option" value="single-option" [checked]="checked2" label="SBB - Finanzen" subtitle="Armin Burgermeister"></sbb-checkbox-panel>
```

* Multiple checkbox panel with an icon

```html
<h4>Multiple checkbox panel with a subtitle and an icon</h4>
<sbb-checkbox-panel name="single-option" value="single-option" [checked]="checked2" label="SBB - Finanzen" subtitle="Armin Burgermeister">
    <sbb-icon-heart icon></sbb-icon-heart>
</sbb-checkbox-panel>
```