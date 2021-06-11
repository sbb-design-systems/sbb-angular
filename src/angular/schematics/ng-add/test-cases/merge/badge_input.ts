import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbBadgeModule } from '@sbb-esta/angular-public';

@Component({
  template: `
    <sbb-badge>1</sbb-badge>
    <sbb-badge *ngIf="meta">{{ meta | async }}</sbb-badge>
    <sbb-badge [active]="isRejectType(typeCounter.key)">
      {{typeCounter.value}}
    </sbb-badge>
    <sbb-badge aria-label="Test" [active]="value">1</sbb-badge>
  `,
})
export class BadgeTestComponent {}

@NgModule({
  declarations: [BadgeTestComponent],
  imports: [SbbBadgeModule, RouterModule],
})
export class BadgeTestModule {}
