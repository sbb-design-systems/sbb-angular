import { Component, NgModule } from '@angular/core';
import { SbbTagChange, SbbTagModule, SbbTag } from '@sbb-esta/angular-public';

@Component({
  template: ` <sbb-tags>
    <sbb-tag amount="5" label="Trains" i18n-label="description@@id"></sbb-tag>
    <sbb-tag amount="5" [label]="label"></sbb-tag>
    <sbb-tag amount="5" [label]="label + ' Cars'"></sbb-tag>
    <sbb-tag amount="5" i18n-label label="{{ label }}"></sbb-tag>
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
