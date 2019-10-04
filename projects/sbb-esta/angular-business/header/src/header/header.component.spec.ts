import { PortalModule } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DropdownTriggerDirective } from '@sbb-esta/angular-business/dropdown';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';
import { UserMenuModule } from '@sbb-esta/angular-business/usermenu';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { configureTestSuite } from 'ng-bullet';

import { HeaderComponent } from './header.component';

@Component({
  selector: 'sbb-header-all-test',
  template: `
    <sbb-header
      [environment]="'dev'"
      [environmentColor]="'red'"
      [label]="'test'"
      [subtitle]="'test subtitle'"
    >
      <a>link 1</a>
      <button [sbbDropdown]="dropdown">button 1</button>
      <sbb-dropdown #dropdown="sbbDropdown">
        <button sbbDropdownItem>dropdown button 1</button>
      </sbb-dropdown>

      <sbb-usermenu>
        <sbb-dropdown></sbb-dropdown>
      </sbb-usermenu>
      <svg brand></svg>
    </sbb-header>
  `
})
class HeaderTemplateAllSetTestComponent {}

describe('HeaderComponent with everything set', () => {
  let component: HeaderTemplateAllSetTestComponent;
  let fixture: ComponentFixture<HeaderTemplateAllSetTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        IconCollectionModule,
        DropdownModule,
        UserMenuModule,
        PortalModule,
        ScrollingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [HeaderComponent, HeaderTemplateAllSetTestComponent]
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
    const label = fixture.debugElement.queryAll(By.css('.sbb-header-titlebox span:first-child'))[0];
    const subtitle = fixture.debugElement.queryAll(
      By.css('.sbb-header-titlebox span:nth-child(2)')
    )[0];
    expect(label).toBeTruthy();
    expect(label.nativeElement.innerHTML.trim()).toBe('test');

    expect(subtitle).toBeTruthy();
    expect(subtitle.nativeElement.innerHTML.trim()).toBe('test subtitle');
  });

  it('should have a nav element', () => {
    const mainnavigation = fixture.debugElement.queryAll(By.css('nav'))[0];
    expect(mainnavigation).toBeTruthy();
  });

  it('should have one button and one link', () => {
    const navbuttons = fixture.debugElement.queryAll(By.css('nav button'));
    expect(navbuttons).toBeTruthy();
    expect(navbuttons.length).toBe(1);

    const links = fixture.debugElement.queryAll(By.css('nav a'));
    expect(links).toBeTruthy();
    expect(links.length).toBe(1);
  });

  it('should have button with working dropdown', () => {
    const dropdownButton = fixture.debugElement.queryAll(By.directive(DropdownTriggerDirective))[0];
    expect(dropdownButton.componentInstance).toBeTruthy();
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
  `
})
class HeaderTemplateMinimalTestComponent {}

describe('HeaderComponent minimal', () => {
  let component: HeaderTemplateMinimalTestComponent;
  let fixture: ComponentFixture<HeaderTemplateMinimalTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        IconCollectionModule,
        PortalModule,
        ScrollingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [HeaderComponent, HeaderTemplateMinimalTestComponent]
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
    const label = fixture.debugElement.queryAll(By.css('.sbb-header-titlebox span:first-child'))[0];
    const subtitle = fixture.debugElement.queryAll(
      By.css('.sbb-header-titlebox span:nth-child(2)')
    )[0];
    expect(label).toBeTruthy();
    expect(label.nativeElement.innerHTML.trim()).toBe('test');

    expect(subtitle).toBeFalsy();
  });

  // Mainnavigation is present regardless
  it('should have a nav element', () => {
    const mainnavigation = fixture.debugElement.queryAll(By.css('nav'));
    expect(mainnavigation).toBeTruthy();
    expect(mainnavigation.length).toBe(1);
  });

  it('should have no navbuttons', () => {
    const navbuttons = fixture.debugElement.queryAll(By.css('nav a, nav button'));
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
  `
})
class HeaderTemplateNoLabelTestComponent {}

describe('HeaderComponent without label', () => {
  let fixture: ComponentFixture<HeaderTemplateNoLabelTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        IconCollectionModule,
        PortalModule,
        ScrollingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [HeaderComponent, HeaderTemplateNoLabelTestComponent]
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
