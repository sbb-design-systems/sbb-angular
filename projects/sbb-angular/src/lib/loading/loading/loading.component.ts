import { Component, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {

  @HostBinding('attr.aria-busy') isBusy = 'true';
  @HostBinding('attr.role') role = 'progressbar';
  @Input() @HostBinding('attr.aria-valuetext') srAltText?: string;
  @Input() mode: string;

}
