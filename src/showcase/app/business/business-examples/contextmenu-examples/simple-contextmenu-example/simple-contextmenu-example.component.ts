import { Component } from '@angular/core';

@Component({
  selector: 'sbb-simple-contextmenu-example',
  templateUrl: './simple-contextmenu-example.component.html',
  styleUrls: ['./simple-contextmenu-example.component.css'],
})
export class SimpleContextmenuExampleComponent {
  action1() {
    console.log('action1');
  }
  action2() {
    console.log('action2');
  }
  action3() {
    console.log('action3');
  }
}
