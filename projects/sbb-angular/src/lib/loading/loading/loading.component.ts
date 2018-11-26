import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

  @HostBinding('attr.role') role = 'alert';
  @HostBinding('attr.aria-live') ariaLive = 'assertive';
  @Input() mode: string;
  @Input() srOnlyLabel?: string;

}
