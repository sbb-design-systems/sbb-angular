import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css']
})
export class RadioButtonComponent implements OnInit {

  @HostBinding('id') id: string;
  @HostBinding('value') value: string;
  @HostBinding('name') name: string;
  @HostBinding('disabled') disabled: boolean;
  @HostBinding('checked') checked: boolean;
  @HostBinding('unchecked') unchecked: boolean;

  constructor() { }

  ngOnInit() {
  }

}
