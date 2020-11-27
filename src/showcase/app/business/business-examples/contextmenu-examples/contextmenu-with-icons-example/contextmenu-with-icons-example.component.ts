import { Component } from '@angular/core';

@Component({
  selector: 'sbb-contextmenu-with-icons-example',
  templateUrl: './contextmenu-with-icons-example.component.html',
  styleUrls: ['./contextmenu-with-icons-example.component.css'],
})
export class ContextmenuWithIconsExampleComponent {
  lastAction = '-';

  assignLastAction(event: Event) {
    this.lastAction = (event.target as HTMLElement).textContent.trim();
  }
}
