import { Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-examples-icon-doc',
  templateUrl: './examples-icon-doc.component.html',
  styleUrls: ['./examples-icon-doc.component.scss']
})
export class ExamplesIconDocComponent {
  @Input() uiIcon: any;

  getSelector(selector: string) {
    return '<' + selector + '></' + selector + '>';
  }
}
