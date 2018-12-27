import { Component, OnInit } from '@angular/core';
import { JumpMark } from 'projects/sbb-angular/src/public_api';

@Component({
  selector: 'sbb-notification-showcase',
  templateUrl: './notification-showcase.component.html',
  styleUrls: ['./notification-showcase.component.scss']
})
export class NotificationShowcaseComponent {

  jumpMarks: JumpMark[] = [{ elementId:'#', title:'Hello'}, { elementId:'#', title:'Suchen'}];
  constructor() { }

}
