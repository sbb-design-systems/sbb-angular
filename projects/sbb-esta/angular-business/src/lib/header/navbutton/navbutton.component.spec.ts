import { configureTestSuite } from 'ng-bullet';

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { DropdownModule } from '@sbb-esta/angular-public';

import { NavbuttonComponent } from '../navbutton/navbutton.component';

@Component({
  selector: 'sbb-navbutton-a-test',
  template: `
    <button sbbNavbutton>
      <a>only child</a>
    </button>
  `,
  entryComponents: [NavbuttonComponent]
})
export class NavbuttonTemplateATagTestComponent {}

describe('Navbutton with <a> child', () => {
  let component: NavbuttonTemplateATagTestComponent;
  let fixture: ComponentFixture<NavbuttonTemplateATagTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, DropdownModule],
      declarations: [NavbuttonTemplateATagTestComponent, NavbuttonComponent]
    });
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(NavbuttonTemplateATagTestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should recognize it has no dropdown', () => {
    const navbutton = fixture.debugElement.queryAll(By.directive(NavbuttonComponent))[0];
    expect(navbutton.componentInstance.isDropdown).toBeFalsy();
    expect(navbutton.componentInstance.isDropdownExpanded).toBeFalsy();
  });

  it('should have no icons', () => {
    const icons = fixture.debugElement.queryAll(By.css('.sbb-svgsprite-icon'));
    expect(icons.length).toBe(0);
  });
});

@Component({
  selector: 'sbb-navbutton-button-test',
  template: `
    <button sbbNavbutton>
      <button>only child</button>
    </button>
  `,
  entryComponents: [NavbuttonComponent]
})
class NavbuttonTemplateButtonTagTestComponent {}

describe('Navbutton with <button> child', () => {
  let component: NavbuttonTemplateButtonTagTestComponent;
  let fixture: ComponentFixture<NavbuttonTemplateButtonTagTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, DropdownModule],
      declarations: [NavbuttonTemplateButtonTagTestComponent, NavbuttonComponent]
    });
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(NavbuttonTemplateButtonTagTestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should recognize it has no dropdown', () => {
    const navbutton = fixture.debugElement.queryAll(By.directive(NavbuttonComponent))[0];
    expect(navbutton.componentInstance.isDropdown).toBeFalsy();
    expect(navbutton.componentInstance.isDropdownExpanded).toBeFalsy();
  });

  it('should have no icons', () => {
    const icons = fixture.debugElement.queryAll(By.css('.sbb-svgsprite-icon'));
    expect(icons.length).toBe(0);
  });
});

@Component({
  selector: 'sbb-navbutton-dropdown-test',
  template: `
    <button sbbNavbutton [sbbDropdown]="dropdown">
      only child
    </button>
    <sbb-dropdown #dropdown="sbbDropdown">
      <button sbbDropdownItem>something</button>
    </sbb-dropdown>
  `,
  entryComponents: [NavbuttonComponent]
})
class NavbuttonTemplateButtonDropdownTagTestComponent {}

describe('Navbutton with <button> child and dropdown', () => {
  let component: NavbuttonTemplateButtonDropdownTagTestComponent;
  let fixture: ComponentFixture<NavbuttonTemplateButtonDropdownTagTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, DropdownModule],
      declarations: [NavbuttonTemplateButtonDropdownTagTestComponent, NavbuttonComponent]
    });
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(NavbuttonTemplateButtonDropdownTagTestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should recognize the dropdown', () => {
    const navbutton = fixture.debugElement.queryAll(By.directive(NavbuttonComponent))[0];
    expect(navbutton.componentInstance.isDropdown).toBeTruthy();
    expect(navbutton.componentInstance.isDropdownExpanded).toBeFalsy();
  });

  it('should recognize the dropdown is expanded after clicking', () => {
    const navbutton = fixture.debugElement.queryAll(By.directive(NavbuttonComponent))[0];
    navbutton.nativeElement.click();

    fixture.detectChanges();
    expect(navbutton.componentInstance.isDropdownExpanded).toBeTruthy();
  });

  it('should have exactly 1 icon', () => {
    const icons = fixture.debugElement.queryAll(By.css('.sbb-svgsprite-icon'));
    expect(icons.length).toBe(1);
  });
});
