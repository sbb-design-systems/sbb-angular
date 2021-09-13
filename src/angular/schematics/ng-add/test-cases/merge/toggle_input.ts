import { Component, NgModule, QueryList, ViewChildren } from '@angular/core';
import { SbbToggle, SbbToggleModule, SbbToggleOption } from '@sbb-esta/angular-public';

@Component({
  selector: 'sbb-toggle-test',
  template: `
    <sbb-toggle>
      <sbb-toggle-option label="Option 1" infoText="Detail 1" value="dog"></sbb-toggle-option>
      <sbb-toggle-option label="Option 2" infoText="Detail 2" value="cat"></sbb-toggle-option>
    </sbb-toggle>

    <sbb-toggle>
      <sbb-toggle-option label="Option 1" value="dog">
        <sbb-icon svgIcon="kom:arrow-right-small" *sbbIcon></sbb-icon>
        Test
      </sbb-toggle-option>
      <sbb-toggle-option label="Option 2" value="cat">
        <sbb-icon svgIcon="kom:arrows-right-left-small" *sbbIcon></sbb-icon>
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
