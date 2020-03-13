import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbb-button-showcase',
  templateUrl: './button-showcase.component.html',
  styleUrls: ['./button-showcase.component.css']
})
export class ButtonShowcaseComponent implements OnInit, OnDestroy {
  buttonMode = 'primary';
  buttonIcon = 'arrow';
  buttonDisabled = false;

  buttonForm: FormGroup;
  onModeChange: Subscription;
  onIconChange: Subscription;
  onDisabledChange: Subscription;

  showButton = true;

  icons = ['arrow', 'plus', 'download'];

  modes = ['primary', 'secondary', 'ghost', 'frameless'];

  constructor() {}

  ngOnInit() {
    this.buttonForm = new FormGroup({
      mode: new FormControl(this.buttonMode),
      icon: new FormControl(this.buttonIcon),
      disabled: new FormControl(this.buttonDisabled)
    });

    this.onModeChange = this.buttonForm.get('mode').valueChanges.subscribe(value => {
      this.buttonMode = value;
      this.reRender();
    });

    this.onIconChange = this.buttonForm.get('icon').valueChanges.subscribe(value => {
      this.buttonIcon = value;
      this.reRender();
    });

    this.onDisabledChange = this.buttonForm.get('disabled').valueChanges.subscribe(value => {
      this.buttonDisabled = value;
      this.reRender();
    });
  }

  ngOnDestroy() {
    this.onModeChange.unsubscribe();
    this.onIconChange.unsubscribe();
    this.onDisabledChange.unsubscribe();
  }

  reRender() {
    this.showButton = false;
    setTimeout(() => (this.showButton = true));
  }
}
