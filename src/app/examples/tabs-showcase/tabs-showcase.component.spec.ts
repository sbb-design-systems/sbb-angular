import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsShowcaseComponent } from './tabs-showcase.component';
import { PersonEditComponent } from './person/person-edit/person-edit.component';
import { PersonListComponent } from './person/person-list/person-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule, FieldModule } from 'sbb-angular';

describe('TabsShowcaseComponent', () => {

  let component: TabsShowcaseComponent;
  let fixture: ComponentFixture<TabsShowcaseComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
                ReactiveFormsModule,
                TabsModule,
                FieldModule],
      declarations: [TabsShowcaseComponent, PersonEditComponent, PersonListComponent]
    })
    .overrideComponent(TabsShowcaseComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsShowcaseComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('tab module should have 3 tabs inside, at least 2', () => {
     // first round of change detection ...
     fixture.detectChanges();
     expect(component.tabsComponent.tabs.length).toBe(3);
  });

  it('tab module should have 2 tabs and 1 dynamic tab inside', () => {
     // first round of change detection ...
     fixture.detectChanges();
     const counter = component.tabsComponent.tabs.length + component.tabsComponent.dynamicTabs.length;
     expect(counter).toBe(3);
  });

  it('tab module should have no more tab modules inside', () => {
    // first round of change detection ...
    fixture.detectChanges();
    expect(component.tabsComponent.tabModules.length).toBe(1);
  });

  it('tab 1 should have title "Tab 1", tab id "1" and also should be "active" per default', () => {
     // first round of change detection ...
     fixture.detectChanges();
     expect(component.tabsComponent.tabs.first.tabTitle).toBe('Tab 1');
     expect(component.tabsComponent.tabs.first.tabId).toBe(1);
     expect(component.tabsComponent.tabs.first.active).toBe(true);
  });

  it('tab 3 should have title "Persons", tab id "3" and should not be "active" per default', () => {
    // first round of change detection ...
    fixture.detectChanges();
    expect(component.tabsComponent.tabs.last.tabTitle).toBe('Persons');
    expect(component.tabsComponent.tabs.last.tabId).toBe(3);
    expect(component.tabsComponent.tabs.last.active).toBe(false);
  });
});
