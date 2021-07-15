import { Component, NgModule } from '@angular/core';
import { SbbTagChange, SbbTagModule, SbbTag } from '@sbb-esta/angular/tag';

@Component({
  template: ` <sbb-tags>
    <sbb-tag amount="5" i18n="description@@id">Trains</sbb-tag>
    <sbb-tag amount="5">{{ label }}</sbb-tag>
    <sbb-tag amount="5">{{ label + ' Cars' }}</sbb-tag>
    <sbb-tag amount="5" i18n>{{ label }}</sbb-tag>
  </sbb-tags>`,
})
export class TagTestComponent {
  label: string;
}

@NgModule({
  declarations: [TagTestComponent],
  imports: [SbbTagModule],
})
export class TagTestModule {}
