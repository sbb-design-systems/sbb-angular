import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ProcessflowStep as ProcessflowStepPublic,
  ProcessflowStepComponent as ProcessflowStepComponentPublic
} from '@sbb-esta/angular-public';

export class ProcessflowStep extends ProcessflowStepPublic {}

@Component({
  selector: 'sbb-processflow-step',
  templateUrl:
    '../../../../../angular-public/src/lib/processflow/processflow-step/processflow-step.component.html',
  styleUrls: [
    '../../../../../angular-public/src/lib/processflow/processflow-step/processflow-step.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessflowStepComponent extends ProcessflowStepComponentPublic {}
