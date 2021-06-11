import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';

@Component({
  template: `
    <span sbbBadge="1"></span>
    <span [sbbBadge]="meta | async" *ngIf="meta"></span>
    <span [sbbBadge]="typeCounter.value" [matBadgeDisabled]="!isRejectType(typeCounter.key)"></span>
    <span sbbBadge="1" sbbBadgeDescription="Test" [matBadgeDisabled]="!value"></span>
  `,
})
export class BadgeTestComponent {}

@NgModule({
  declarations: [BadgeTestComponent],
  imports: [SbbBadgeModule, RouterModule],
})
export class BadgeTestModule {}
