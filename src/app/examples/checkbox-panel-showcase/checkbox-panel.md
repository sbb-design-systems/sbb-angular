# Option Selection Overview

Import option selection module into your application

```ts
import { OptionSelectionModule } from 'sbb-angular';
```

* Simple option selection multiple

        ```html
        <h4>Basic Example</h4>
        <ng-container *ngFor="let option of checkboxOptions; index as i">
            <div class="sbbsc-block">
                <sbb-checkbox-panel [(ngModel)]="option.selected" [value]="option.value" [label]="option.name"></sbb-checkbox-panel>
            </div>
        </ng-container>
        ```

    * Option selection multiple with subtitle

        ```html
        <h4>Option selection multiple with a subtitle</h4>
        <sbb-checkbox-panel name="single-option" value="single-option" [checked]="checked2" label="SBB - Finanzen" subtitle="Armin Burgermeister"></sbb-checkbox-panel>
        ```

    * Option selection multiple with an image using *sbbOptionSelectionImage directive

        ```html
        <h4>Option Selection multiple with a subtitle and an image</h4>
        <sbb-checkbox-panel name="single-option" value="single-option" [checked]="checked2" label="SBB - Finanzen" subtitle="Armin Burgermeister">
            <sbb-icon-comfort *sbbOptionSelectionImage></sbb-icon-comfort>
        </sbb-checkbox-panel>
        ```