import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ProcessflowStepBase } from '@sbb-esta/angular-core/base';

// TODO: Find solution for template and style
@Component({
  selector: 'sbb-processflow-step',
  templateUrl: './processflow-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessflowStepComponent extends ProcessflowStepBase {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
}
