import { Component, NgModule } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';

@Component({
  template: `
    <span sbbBadge="1"></span>
    <span [sbbBadge]="meta | async" *ngIf="meta"></span>
    <span [sbbBadge]="typeCounter.value" [sbbBadgeDisabled]="!isRejectType(typeCounter.key)"></span>
    <span sbbBadge="1" sbbBadgeDescription="Test" [sbbBadgeDisabled]="!value"></span>
  `,
})
export class BadgeTestComponent {}

@NgModule({
  declarations: [BadgeTestComponent],
  imports: [SbbBadgeModule],
})
export class BadgeTestModule {}
