import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ProcessflowStepBase } from '@sbb-esta/angular-core/base';

@Component({
  selector: 'sbb-processflow-step',
  templateUrl:
    '../../../../angular-public/processflow/src/processflow-step/processflow-step.component.html',
  styleUrls: [
    '../../../../angular-public/processflow/src/processflow-step/processflow-step.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessflowStepComponent extends ProcessflowStepBase {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
}
