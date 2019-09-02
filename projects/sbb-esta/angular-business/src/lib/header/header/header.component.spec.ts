import { configureTestSuite } from 'ng-bullet';

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { DropdownModule, UserMenuModule } from '@sbb-esta/angular-public';

import { HeaderComponent } from '../../../public-api';
import { NavbuttonComponent } from '../navbutton/navbutton.component';

@Component({
  selector: 'sbb-header-all-test',
  template: `
    <sbb-header
      [environment]="'dev'"
      [environmentColor]="'red'"
      [label]="'test'"
      [subtitle]="'test subtitle'"
    >
      <a sbbNavbutton>link 1</a>
      <button sbbNavbutton [sbbDropdown]="dropdown">button 1</button>
      <sbb-dropdown #dropdown="sbbDropdown">
        <button sbbDropdownItem>dropdown button 1</button>
      </sbb-dropdown>

      <sbb-usermenu>
        <sbb-dropdown></sbb-dropdown>
      </sbb-usermenu>
      <svg brand></svg>
    </sbb-header>
  `,
  entryComponents: [NavbuttonComponent]
})
class HeaderTemplateAllSetTestComponent {}

describe('HeaderComponent with everything set', () => {
  let component: HeaderTemplateAllSetTestComponent;
  let fixture: ComponentFixture<HeaderTemplateAllSetTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, DropdownModule, UserMenuModule],
      declarations: [HeaderComponent, HeaderTemplateAllSetTestComponent, NavbuttonComponent]
    });
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(HeaderTemplateAllSetTestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have ribbon', () => {
    const ribbon = fixture.debugElement.queryAll(By.css('.sbb-header-ribbon'))[0];
    expect(ribbon).toBeTruthy();
  });

  it('should have ribbon text and color match properties', () => {
    const ribbon = fixture.debugElement.queryAll(By.css('.sbb-header-ribbon'))[0];
    expect(ribbon.nativeElement.style.backgroundColor).toBe('red');
    expect(ribbon.nativeElement.innerHTML.trim()).toBe('dev');
  });

  it('should have titlebox', () => {
    const titlebox = fixture.debugElement.queryAll(By.css('.sbb-header-titlebox'))[0];
    expect(titlebox).toBeTruthy();
  });

  it('should have titlebox label and subtitle match properties', () => {
    const label = fixture.debugElement.queryAll(By.css('.sbb-header-titlebox-label'))[0];
    const subtitle = fixture.debugElement.queryAll(By.css('.sbb-header-titlebox-subtitle'))[0];
    expect(label).toBeTruthy();
    expect(label.nativeElement.innerHTML.trim()).toBe('test');

    expect(subtitle).toBeTruthy();
    expect(subtitle.nativeElement.innerHTML.trim()).toBe('test subtitle');
  });

  it('should have mainnavigation', () => {
    const mainnavigation = fixture.debugElement.queryAll(By.css('.sbb-header-mainnavigation'))[0];
    expect(mainnavigation).toBeTruthy();
  });

  it('should have 2 navbuttons', () => {
    const navbuttons = fixture.debugElement.queryAll(By.css('.sbb-navbutton'));
    expect(navbuttons).toBeTruthy();
    expect(navbuttons.length).toBe(2);
  });

  it('should have second button with working dropdown', () => {
    const dropdownButton = fixture.debugElement.queryAll(By.directive(NavbuttonComponent))[1];
    expect(dropdownButton.componentInstance.isDropdown).toBeTruthy();
  });

  it('should have usermenu', () => {
    const usermenu = fixture.debugElement.queryAll(By.css('.sbb-header-usermenu'))[0];
    expect(usermenu).toBeTruthy();
    expect(usermenu.children.length).toBe(1);
  });

  it('should have logo', () => {
    const logo = fixture.debugElement.queryAll(By.css('.sbb-header-logo'))[0];
    expect(logo).toBeTruthy();
  });
});

@Component({
  selector: 'sbb-header-minimal-test',
  template: `
    <sbb-header [label]="'test'"> </sbb-header>
  `,
  entryComponents: [NavbuttonComponent]
})
class HeaderTemplateMinimalTestComponent {}

describe('HeaderComponent minimal', () => {
  let component: HeaderTemplateMinimalTestComponent;
  let fixture: ComponentFixture<HeaderTemplateMinimalTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule],
      declarations: [HeaderComponent, HeaderTemplateMinimalTestComponent, NavbuttonComponent]
    });
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(HeaderTemplateMinimalTestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no ribbon', () => {
    const ribbon = fixture.debugElement.queryAll(By.css('.sbb-header-ribbon'))[0];
    expect(ribbon).toBeFalsy();
  });

  it('should have titlebox', () => {
    const titlebox = fixture.debugElement.queryAll(By.css('.sbb-header-titlebox'))[0];
    expect(titlebox).toBeTruthy();
  });

  it('should have titlebox label and subtitle match properties', () => {
    const label = fixture.debugElement.queryAll(By.css('.sbb-header-titlebox-label'))[0];
    const subtitle = fixture.debugElement.queryAll(By.css('.sbb-header-titlebox-subtitle'))[0];
    expect(label).toBeTruthy();
    expect(label.nativeElement.innerHTML.trim()).toBe('test');

    expect(subtitle).toBeFalsy();
  });

  // Mainnavigation is present regardless
  it('should have mainnavigation', () => {
    const mainnavigation = fixture.debugElement.queryAll(By.css('.sbb-header-mainnavigation'));
    expect(mainnavigation).toBeTruthy();
    expect(mainnavigation.length).toBe(1);
  });

  it('should have no navbuttons', () => {
    const navbuttons = fixture.debugElement.queryAll(By.css('.sbb-navbutton'));
    expect(navbuttons).toBeTruthy();
    expect(navbuttons.length).toBe(0);
  });

  it('should have no usermenu', () => {
    const usermenu = fixture.debugElement.queryAll(By.css('.sbb-header-usermenu'))[0];
    expect(usermenu).toBeTruthy();
    expect(usermenu.children.length).toBe(0);
  });

  it('should have logo', () => {
    const logo = fixture.debugElement.queryAll(By.css('.sbb-header-logo'))[0];
    expect(logo).toBeTruthy();
  });
});

@Component({
  selector: 'sbb-header-no-label-test',
  template: `
    <sbb-header> </sbb-header>
  `,
  entryComponents: [NavbuttonComponent]
})
class HeaderTemplateNoLabelTestComponent {}

describe('HeaderComponent without label', () => {
  let fixture: ComponentFixture<HeaderTemplateNoLabelTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule],
      declarations: [HeaderComponent, HeaderTemplateNoLabelTestComponent, NavbuttonComponent]
    });
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(HeaderTemplateNoLabelTestComponent);
  });

  it('should not create', () => {
    expect(() => fixture.detectChanges()).toThrow();
  });
});
