import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-textarea-showcase',
  templateUrl: './textarea-showcase.component.html',
  styleUrls: ['./textarea-showcase.component.scss']
})
export class TextareaShowcaseComponent implements OnInit {


  textArea1 = 'SBB';
  textArea2 = 'SBB';
  textArea3 = 'SBB';

  minlength: number;
  maxlength: number;
  required: boolean;

  ngOnInit() {
  }

}
