import { Component, OnInit, HostBinding, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent implements OnInit {

  @HostBinding('class') cssClass = 'sbb-tooltip';

  @Output() change = new EventEmitter();

  visible = false;

  constructor() { }

  ngOnInit() {
  }

  onClick() {

    this.visible = !this.visible;
    this.change.emit(this.visible);
  }

}
