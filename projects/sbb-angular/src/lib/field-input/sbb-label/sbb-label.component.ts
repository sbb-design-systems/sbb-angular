import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-label',
  templateUrl: './sbb-label.component.html',
  styleUrls: ['./sbb-label.component.scss']
})
export class SbbLabelComponent implements OnInit {

  @Input() label?: string;
  @Input() for?: string;
  @Input() optional?: string;

  constructor() { }

  ngOnInit() {
    if(this.optional) {
       this.optional = '"' + this.optional + '"';
    }
  }
}
