import { Component } from '@angular/core';

@Component({
  selector: 'sbb-simple-contextmenu-example',
  templateUrl: './simple-contextmenu-example.component.html',
  styleUrls: ['./simple-contextmenu-example.component.css'],
})
export class SimpleContextmenuExampleComponent {
  lastAction = '-';

  assignLastAction(event: Event) {
    this.lastAction = (event.target as HTMLElement).textContent.trim();
  }
}
