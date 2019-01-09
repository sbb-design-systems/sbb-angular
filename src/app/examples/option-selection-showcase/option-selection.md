# Option Selection Overview

Import option selection module into your application

```ts
import { OptionSelectionModule } from 'sbb-angular';
```
You can use the option selection in two modes:
1. Single mode

   * Simple option selection

        ```html
        <h4>Basic example</h4>
        <div class="sbbsc-block" *ngFor="let option of radioOptions; index as i">
            <sbb-option-selection [(ngModel)]="modelValue" name="model-option-selection" [value]="option.value" [label]="option.name"></sbb-option-selection>
        </div>
        ```

   * Option selection with a subtitle
  
        ```html
        <h4>Option selection with subtitle</h4>
        <sbb-option-selection name="single-option" value="single-option" [checked]="checked" label="SBB - Finanzen" subtitle="Armin Burgermeister"></sbb-option-selection>
        ```

   * Option selection with an icon
  
        ```html
        <h4>Option selection with subtitle and an icon</h4>
        <sbb-option-selection name="single-option" value="single-option" [checked]="checked" label="SBB - Finanzen" subtitle="Armin Burgermeister">
            <sbb-icon-comfort icon></sbb-icon-comfort>
        </sbb-option-selection>
        ```

2. Multiple mode

    * Multiple simple option selection

        ```html
        <h4>Basic Example</h4>
        <div class="sbbsc-block" *ngFor="let option of checkboxOptions; index as i">
            <sbb-option-selection-multiple [(ngModel)]="option.selected" [value]="option.value" [label]="option.name"></sbb-option-selection-multiple>
        </div>
        ```

    * Multiple option selection with subtitle

        ```html
        <h4>Option selection multiple with a subtitle</h4>
        <sbb-option-selection-multiple name="single-option" value="single-option" [checked]="checked2" label="SBB - Finanzen" subtitle="Armin Burgermeister"></sbb-option-selection-multiple>
        ```

    * Multiple option selection with an icon

        ```html
        <h4>Option Selection multiple with a subtitle and an icon</h4>
        <sbb-option-selection-multiple name="single-option" value="single-option" [checked]="checked2" label="SBB - Finanzen" subtitle="Armin Burgermeister">
            <sbb-icon-comfort icon></sbb-icon-comfort>
        </sbb-option-selection-multiple>
        ```