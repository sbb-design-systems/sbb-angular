// import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { TabsShowcaseComponent } from './tabs-showcase.component';
// import { PersonListComponent } from './person/person-list/person-list.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { TabsModule, FieldModule } from 'sbb-angular';

// describe('TabsShowcaseComponent', () => {

//   let component: TabsShowcaseComponent;
//   let fixture: ComponentFixture<TabsShowcaseComponent>;
//   let debugElement: DebugElement;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [FormsModule,
//                 ReactiveFormsModule,
//                 TabsModule,
//                 FieldModule],
//       declarations: [TabsShowcaseComponent, PersonListComponent]
//     })
//     .overrideComponent(TabsShowcaseComponent, {
//       set: { changeDetection: ChangeDetectionStrategy.Default }
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(TabsShowcaseComponent);
//     component = fixture.componentInstance;
//     debugElement = fixture.debugElement;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('tab module should have 3 tabs inside, at least 2', () => {
//      // first round of change detection ...
//      fixture.detectChanges();
//      expect(component.tabsComponent.tabs.length).toBe(3);
//   });

//   it('tab module should have no more tab modules inside', () => {
//     // first round of change detection ...
//     fixture.detectChanges();
//     expect(component.tabsComponent.tabModules.length).toBe(1);
//   });

//   it('tab 1 should have label "Tab 1", tab id "1" and also should be "active" per default', () => {
//      // first round of change detection ...
//      fixture.detectChanges();
//      expect(component.tabsComponent.tabs.first.label).toBe('Tab 1');
//      expect(component.tabsComponent.tabs.first.id).toBe('content1-tab');
//      expect(component.tabsComponent.tabs.first.active).toBe(true);
//   });

//   it('tab 3 should have label "Persons", tab id "3" and should not be "active" per default', () => {
//     // first round of change detection ...
//     fixture.detectChanges();
//     expect(component.tabsComponent.tabs.last.label).toBe('Persons');
//     expect(component.tabsComponent.tabs.last.id).toBe('persons-tab');
//     expect(component.tabsComponent.tabs.last.active).toBe(false);
//   });

//   it('person tab should have 1 tag pill / quantity indicator with the value 1', () => {
//     // first round of change detection ...
//     fixture.detectChanges();
//     // switch over to our dynamic tab ...
//     component.tabsComponent.selectTab(component.tabsComponent.tabs.last);
//     expect(component.tabsComponent.tabs.last.active).toBe(true);
//     // get add new person button ...
//     const tabBadgePill = debugElement.query(By.css('sbb-tab-badge-pill')).nativeElement;
//     expect(tabBadgePill).toBeTruthy();
//     expect(tabBadgePill.textContent).toBe('1');
//  });

// });
