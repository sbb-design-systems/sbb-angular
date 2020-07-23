import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ProcessflowStepBase } from '@sbb-esta/angular-core/base/processflow';

// TODO: Find solution for template and style
@Component({
  selector: 'sbb-processflow-step',
  template: '<ng-content *ngIf="active && !disabled"></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessflowStepComponent extends ProcessflowStepBase {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
}
