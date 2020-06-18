import { Component } from '@angular/core';

@Component({
  selector: 'sbb-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css'],
})
export class CoreComponent {
  modules = {
    breakpoints: 'Breakpoints',
    datetime: 'Datetime',
    icon: 'Icon',
    oauth: 'OAuth',
    scrolling: 'Scrolling',
  };
}
