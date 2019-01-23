import { Component, OnInit, HostBinding, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
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
