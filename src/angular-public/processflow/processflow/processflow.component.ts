import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { SbbProcessflowBase } from '@sbb-esta/angular-core/base/processflow';

import { SbbProcessflowStep } from '../processflow-step/processflow-step.component';

@Component({
  selector: 'sbb-processflow',
  templateUrl: './processflow.component.html',
  styleUrls: ['./processflow.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-processflow',
  },
})
export class SbbProcessflow extends SbbProcessflowBase<SbbProcessflowStep> {
  /** @docs-private */
  @ContentChildren(SbbProcessflowStep)
  steps: QueryList<SbbProcessflowStep>;
}
