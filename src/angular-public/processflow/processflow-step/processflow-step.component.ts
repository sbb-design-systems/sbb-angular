import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SbbProcessflowStepBase } from '@sbb-esta/angular-core/base/processflow';

@Component({
  selector: 'sbb-processflow-step',
  template: '<ng-content *ngIf="active && !disabled"></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbProcessflowStep extends SbbProcessflowStepBase {}
