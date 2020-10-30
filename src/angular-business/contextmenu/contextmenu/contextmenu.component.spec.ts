import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbbDropdownModule } from '@sbb-esta/angular-business/dropdown';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';

import { SbbContextmenu } from './contextmenu.component';

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
  `,
})
class ContextmenuTest1Component {
  action1() {}
  action2() {}
  action3() {}
}

describe('SbbContextmenu', () => {
  let component: ContextmenuTest1Component;
  let fixture: ComponentFixture<ContextmenuTest1Component>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbContextmenu, ContextmenuTest1Component],
        imports: [CommonModule, SbbDropdownModule, SbbIconModule, SbbIconTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextmenuTest1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('before click on the .sbb-icon[svgIcon="kom:context-menu"] icon the dropdown should not be visible', () => {
    const contextmenuComponent = fixture.debugElement.query(By.directive(SbbContextmenu));
    const unexpandedButton = contextmenuComponent.queryAll(
      By.css('button.sbb-dropdown-trigger[aria-expanded="false"]')
    );
    expect(unexpandedButton.length).toBe(1);
  });

  it('after click on the .sbb-icon[svgIcon="kom:context-menu"] icon the dropdown should be visible', () => {
    const contextmenuComponent = fixture.debugElement.query(By.directive(SbbContextmenu));
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
