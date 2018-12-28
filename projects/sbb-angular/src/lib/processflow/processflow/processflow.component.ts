import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

export interface ProcessflowState {
  route: string;
  title: string;
  active: boolean;
}


@Component({
  selector: 'sbb-processflow',
  templateUrl: './processflow.component.html',
  styleUrls: ['./processflow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessflowComponent {

}
