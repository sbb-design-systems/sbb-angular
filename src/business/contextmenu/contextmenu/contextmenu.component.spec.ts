import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';
import { IconContextMenuModule } from '@sbb-esta/angular-icons';

import { ContextmenuComponent } from './contextmenu.component';

@Component({
  selector: 'sbb-test-contextmenu',
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
}

describe('ContextmenuComponent', () => {
  let component: ContextmenuTest1Component;
  let fixture: ComponentFixture<ContextmenuTest1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContextmenuComponent, ContextmenuTest1Component],
      imports: [CommonModule, DropdownModule, IconContextMenuModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextmenuTest1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('before click on the sbb-icon-context-menu icon the dropdown should not be visible', () => {
    const contextmenuComponent = fixture.debugElement.query(By.directive(ContextmenuComponent));
    const unexpandedButton = contextmenuComponent.queryAll(
      By.css('button.sbb-dropdown-trigger[aria-expanded="false"]')
    );
    expect(unexpandedButton.length).toBe(1);
  });

  it('after click on the sbb-icon-context-menu icon the dropdown should be visible', () => {
    const contextmenuComponent = fixture.debugElement.query(By.directive(ContextmenuComponent));
    const triggerButton = contextmenuComponent.queryAll(By.css('button.sbb-dropdown-trigger'))[0]
      .nativeElement;
    triggerButton.click();
    fixture.detectChanges();

    const expandedButton = contextmenuComponent.queryAll(
      By.css('button.sbb-dropdown-trigger[aria-expanded="true"]')
    );
    expect(expandedButton.length).toBe(1);
  });
});
