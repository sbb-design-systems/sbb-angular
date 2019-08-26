import { CommonModule } from '@angular/common';
import { Component, ContentChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconContextMenuModule } from '@sbb-esta/angular-icons';
import { DropdownComponent, DropdownModule } from '@sbb-esta/angular-public';
import { configureTestSuite } from 'ng-bullet';

import { ContextmenuComponent } from './contextmenu.component';

@Component({
  selector: 'sbb-contextmenu',
  template: `
    <sbb-contextmenu>
      <sbb-dropdown>
        <button sbbDropdownItem type="button" (click)="action1()">Action 1</button>
        <button sbbDropdownItem type="button" (click)="action2()">Action 2</button>
        <button sbbDropdownItem type="button" (click)="action3()">Action 2</button>
      </sbb-dropdown>
    </sbb-contextmenu>
  `
})
class ContextmenuTest1Component {
  action1() {}
  action2() {}
  action3() {}
  // @ContentChild(DropdownComponent, { static: false }) dropdown: DropdownComponent;
}

describe('ContextmenuComponent', () => {
  let component: ContextmenuComponent;
  let fixture: ComponentFixture<ContextmenuComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ContextmenuComponent],
      imports: [CommonModule, DropdownModule, IconContextMenuModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextmenuComponent);
    console.log('fixture', fixture);
    component = fixture.componentInstance;
    console.log('component', component);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
