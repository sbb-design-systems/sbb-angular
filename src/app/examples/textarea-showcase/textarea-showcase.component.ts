import { Component } from '@angular/core';

@Component({
  selector: 'sbb-textarea-showcase',
  templateUrl: './textarea-showcase.component.html',
  styleUrls: ['./textarea-showcase.component.scss']
})
export class TextareaShowcaseComponent {

  textArea1 = 'SBB';
  disabled: boolean;
  minHeight = 400;

  minlength: number;
  maxlength: number;
  required: boolean;
  isVisible = true;

  reRender() {
    this.isVisible = false;
    this.textArea1 = '';
    setTimeout(() => {
      this.isVisible = true;
    });

  }

}
