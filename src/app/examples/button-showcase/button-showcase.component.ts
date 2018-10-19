import { Component, OnInit, Type, ChangeDetectorRef   } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { IconPlusComponent, IconArrowDownComponent, IconDownloadComponent, ButtonComponent } from 'sbb-angular';

@Component({
  selector: 'sbb-button-showcase',
  templateUrl: './button-showcase.component.html',
  styleUrls: ['./button-showcase.component.scss']
})
export class ButtonShowcaseComponent implements OnInit {
  icoPlus: Type<{}> = IconPlusComponent;
  icoArrowDown: Type<{}> = IconArrowDownComponent;
  icoDownload: Type<{}> = IconDownloadComponent;

  buttonMode = 'primary';
  buttonIcon = IconArrowDownComponent;

  buttonForm: FormGroup;
  showButton = true;

  modes = [
    'primary',
    'secondary',
    'ghost',
    'frameless'
  ];

  icons = [
    IconArrowDownComponent,
    IconPlusComponent,
    IconDownloadComponent
  ];

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.buttonForm = new FormGroup({
      mode: new FormControl(this.buttonMode),
      icon: new FormControl(this.buttonIcon),
    });

    this.buttonForm.get('mode').valueChanges.subscribe(
      (value) => {
        this.buttonMode = value;
        this.showButton = false;
        setTimeout(() => this.showButton = true);
      }
    );

    this.buttonForm.get('icon').valueChanges.subscribe(
      (value) => {
        this.buttonIcon = value;
        this.showButton = false;
        setTimeout(() => this.showButton = true);
      }
    );
  }

}
