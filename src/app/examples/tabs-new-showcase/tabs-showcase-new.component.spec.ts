import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabsShowcaseNewComponent } from './tabs-showcase-new.component';
import { PersonEditNewComponent } from './person-new/person-edit-new/person-edit-new.component';
import { PersonListNewComponent } from './person-new/person-list-new/person-list-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsNewModule, FieldModule } from 'sbb-angular';

describe('TabsShowcaseComponent', () => {

  let component: TabsShowcaseNewComponent;
  let fixture: ComponentFixture<TabsShowcaseNewComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
                ReactiveFormsModule,
                TabsNewModule,
                FieldModule],
      declarations: [TabsShowcaseNewComponent, PersonEditNewComponent, PersonListNewComponent]
    })
    .overrideComponent(TabsShowcaseNewComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsShowcaseNewComponent);
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
     expect(component.tabsComponent.tabs.first.title).toBe('Tab 1');
     expect(component.tabsComponent.tabs.first.id).toBe('content1-tab');
     expect(component.tabsComponent.tabs.first.active).toBe(true);
  });

  it('tab 3 should have title "Persons", tab id "3" and should not be "active" per default', () => {
    // first round of change detection ...
    fixture.detectChanges();
    expect(component.tabsComponent.tabs.last.title).toBe('Persons');
    expect(component.tabsComponent.tabs.last.id).toBe('persons-tab');
    expect(component.tabsComponent.tabs.last.active).toBe(false);
  });

  it('person tab should have 1 edit button', () => {
     // first round of change detection ...
     fixture.detectChanges();
     // switch over to our dynamic tab ...
     component.tabsComponent.selectTab(component.tabsComponent.tabs.last);
     expect(component.tabsComponent.tabs.last.active).toBe(true);
     // get edit button ...
     const editButton = debugElement.query(By.css('#sbb-edit-button-0')).nativeElement;
     expect(editButton).toBeTruthy();
     expect(editButton.textContent).toBe('Edit');
  });

  it('person tab should have 1 add new person button', () => {
     // first round of change detection ...
     fixture.detectChanges();
     // switch over to our dynamic tab ...
     component.tabsComponent.selectTab(component.tabsComponent.tabs.last);
     expect(component.tabsComponent.tabs.last.active).toBe(true);
     // get add new person button ...
     const addNewPersonButton = debugElement.query(By.css('#addNewPersonButton')).nativeElement;
     expect(addNewPersonButton).toBeTruthy();
     expect(addNewPersonButton.textContent).toBe('Add new person');
  });

  it('person tab should have 1 tag pill / quantity indicator with the value 1', () => {
    // first round of change detection ...
    fixture.detectChanges();
    // switch over to our dynamic tab ...
    component.tabsComponent.selectTab(component.tabsComponent.tabs.last);
    expect(component.tabsComponent.tabs.last.active).toBe(true);
    // get add new person button ...
    const tabBadgePill = debugElement.query(By.css('sbb-tab-badge-pill-new')).nativeElement;
    expect(tabBadgePill).toBeTruthy();
    expect(tabBadgePill.textContent).toBe('1');
 });

});
