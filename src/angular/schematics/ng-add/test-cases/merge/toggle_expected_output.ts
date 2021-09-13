import { Component, NgModule, QueryList, ViewChildren } from '@angular/core';
import { SbbToggle, SbbToggleModule, SbbToggleOption } from '@sbb-esta/angular/toggle';

@Component({
  selector: 'sbb-toggle-test',
  template: `
    <sbb-toggle>
      <sbb-toggle-option label="Option 1" subtitle="Detail 1" value="dog"></sbb-toggle-option>
      <sbb-toggle-option label="Option 2" subtitle="Detail 2" value="cat"></sbb-toggle-option>
    </sbb-toggle>

    <sbb-toggle>
      <sbb-toggle-option label="Option 1" value="dog">
<sbb-toggle-icon>
  <sbb-icon svgIcon="kom:arrow-right-small"></sbb-icon>
</sbb-toggle-icon>
<sbb-toggle-details>
        
        Test
      </sbb-toggle-details></sbb-toggle-option>
      <sbb-toggle-option label="Option 2" value="cat">
<sbb-toggle-icon>
  <sbb-icon svgIcon="kom:arrows-right-left-small"></sbb-icon>
</sbb-toggle-icon>
        
      </sbb-toggle-option>
    </sbb-toggle>
  `,
})
export class ToggleTestComponent {
  @ViewChildren(SbbToggle) toggles: QueryList<SbbToggle>;
  @ViewChildren(SbbToggleOption) options: QueryList<SbbToggleOption>;
}

@NgModule({
  declarations: [ToggleTestComponent],
  imports: [SbbToggleModule],
})
export class ToggleTestModule {}
