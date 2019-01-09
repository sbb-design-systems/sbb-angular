# Option Selection Overview

Import option selection module into your application

```ts
import { OptionSelectionModule } from 'sbb-angular';
```


   * Simple radio button panel

        ```html
        <h4>Basic example</h4>
        <ng-container *ngFor="let option of radioOptions; index as i">
            <div class="sbbsc-block">
                <sbb-radio-button-panel [(ngModel)]="modelValue" name="model-option-selection" [value]="option.value" [label]="option.name"></sbb-radio-button-panel>
            </div>
        </ng-container>
        ```

   * Option selection with a subtitle
  
        ```html
        <h4>Option selection with subtitle</h4>
        <sbb-radio-button-panel name="single-option" value="single-option" [checked]="checked" label="SBB - Finanzen" subtitle="Armin Burgermeister"></sbb-radio-button-panel>
        ```

   * Option selection with an image using *sbbOptionSelectionImage directive
  
        ```html
        <h4>Option selection with subtitle and an image</h4>
        <sbb-radio-button-panel name="single-option" value="single-option" [checked]="checked" label="SBB - Finanzen" subtitle="Armin Burgermeister">
            <sbb-icon-comfort *sbbOptionSelectionImage></sbb-icon-comfort>
        </sbb-radio-button-panel>
        ```
