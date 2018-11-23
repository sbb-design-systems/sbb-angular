import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { dispatchEvent } from '../../_common/testing/dispatch-events';
import { createMouseEvent } from '../../_common/testing/event-objects';

import { TabsComponent } from './tabs.component';
import { TabComponent } from '../tab/tab.component';
import { TabBadgePillComponent } from '../tab-badge-pill/tab-badge-pill.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@Component({
  template: `<sbb-tabs>
              <sbb-tab label="TAB 1">
                <h4>Content 1</h4>
                <p>Here comes the content for tab 1 ...</p>
              </sbb-tab>
              <sbb-tab label="TAB 2">
                <h4>Content 2</h4>
                <p>Here comes the content for tab 2 ...</p>
              </sbb-tab>
              <sbb-tab label="TAB 2">
                <h4>Content 3</h4>
                <p>Here comes the content for tab 3 ...</p>
              </sbb-tab>
            </sbb-tabs>`
})
class TabsTestComponent {
}

describe('TabsComponent', () => {
  let component: TabsTestComponent;
  let fixture: ComponentFixture<TabsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsTestComponent, TabsComponent, TabComponent, TabBadgePillComponent],
      imports: [PerfectScrollbarModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });


});
