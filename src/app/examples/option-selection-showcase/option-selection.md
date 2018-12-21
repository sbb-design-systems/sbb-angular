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
        <ng-container *ngFor="let option of radioOptions; index as i">
            <div class="sbbsc-block">
                <sbb-option-selection [(ngModel)]="modelValue" name="model-option-selection" [value]="option.value" [label]="option.name"></sbb-option-selection>
            </div>
        </ng-container>
        ```

   * Option selection with a subtitle
  
        ```html
        <h4>Option selection with subtitle</h4>
        <sbb-option-selection name="single-option" value="single-option" [checked]="checked" label="SBB - Finanzen" subtitle="Armin Burgermeister"></sbb-option-selection>
        ```

   * Option selection with an image using *sbbOptionSelectionImage directive
  
        ```html
        <h4>Option selection with subtitle and an image</h4>
        <sbb-option-selection name="single-option" value="single-option" [checked]="checked" label="SBB - Finanzen" subtitle="Armin Burgermeister">
            <sbb-icon-comfort *sbbOptionSelectionImage></sbb-icon-comfort>
        </sbb-option-selection>
        ```

2. Multiple mode

    * Simple option selection multiple

        ```html
        <h4>Basic Example</h4>
        <ng-container *ngFor="let option of checkboxOptions; index as i">
            <div class="sbbsc-block">
                <sbb-option-selection-multiple [(ngModel)]="option.selected" [value]="option.value" [label]="option.name"></sbb-option-selection-multiple>
            </div>
        </ng-container>
        ```

    * Option selection multiple with subtitle

        ```html
        <h4>Option selection multiple with a subtitle</h4>
        <sbb-option-selection-multiple name="single-option" value="single-option" [checked]="checked2" label="SBB - Finanzen" subtitle="Armin Burgermeister"></sbb-option-selection-multiple>
        ```

    * Option selection multiple with an image using *sbbOptionSelectionImage directive

        ```html
        <h4>Option Selection multiple with a subtitle and an image</h4>
        <sbb-option-selection-multiple name="single-option" value="single-option" [checked]="checked2" label="SBB - Finanzen" subtitle="Armin Burgermeister">
            <sbb-icon-comfort *sbbOptionSelectionImage></sbb-icon-comfort>
        </sbb-option-selection-multiple>
        ```