import { Component, ContentChild, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TextexpandCollapsedComponent } from '../textexpand-collapsed/textexpand-collapsed.component';
import { TextexpandExpandedComponent } from '../textexpand-expanded/textexpand-expanded.component';
import { TextexpandModule } from '../textexpand.module';

import { TextexpandComponent } from './textexpand.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-textexpand-test',
  template: `
    <sbb-textexpand #textexpand>
      <sbb-textexpand-collapsed>Hello Davide! &nbsp;</sbb-textexpand-collapsed>
      <sbb-textexpand-expanded>Hello Marco! &nbsp;</sbb-textexpand-expanded>
    </sbb-textexpand>
  `
})
class TextexpandTestComponent {
  @ViewChild('textexpand', { static: true }) textexpand: TextexpandComponent;

  @ContentChild(TextexpandCollapsedComponent, { static: true })
  collapsedComponent: TextexpandCollapsedComponent;

  @ContentChild(TextexpandExpandedComponent, { static: true })
  expandedComponent: TextexpandExpandedComponent;
}

describe('TextexpandComponent', () => {
  let componentTextexpand: TextexpandComponent;
  let fixtureTextexpand: ComponentFixture<TextexpandComponent>;

  let componentCollapsed: TextexpandCollapsedComponent;
  let fixtureCollapsed: ComponentFixture<TextexpandCollapsedComponent>;

  let componentExpanded: TextexpandExpandedComponent;
  let fixtureExpanded: ComponentFixture<TextexpandExpandedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextexpandComponent, TextexpandCollapsedComponent, TextexpandExpandedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureCollapsed = TestBed.createComponent(TextexpandCollapsedComponent);
    componentCollapsed = fixtureCollapsed.componentInstance;
    fixtureCollapsed.detectChanges();

    fixtureExpanded = TestBed.createComponent(TextexpandExpandedComponent);
    componentExpanded = fixtureExpanded.componentInstance;
    fixtureExpanded.detectChanges();

    fixtureTextexpand = TestBed.createComponent(TextexpandComponent);
    componentTextexpand = fixtureTextexpand.componentInstance;
    componentTextexpand.collapsedComponent = componentCollapsed;
    componentTextexpand.expandedComponent = componentExpanded;
    fixtureTextexpand.detectChanges();
  });

  it('textexpand should create', () => {
    expect(componentTextexpand).toBeTruthy();
  });

  it('textexpand-collapsed should create', () => {
    expect(componentCollapsed).toBeTruthy();
  });

  it('textexpand-expanded should create', () => {
    expect(componentExpanded).toBeTruthy();
  });

  it('should have a generated id if not provided', () => {
    expect(componentTextexpand.id).toContain('sbb-textexpand-');
  });

  it('textexpand class must exist', () => {
    expect(componentTextexpand.cssClass).toBe(true);
  });

  it('textexpand-collapsed class must exist', () => {
    expect(componentCollapsed.cssClass).toBe(true);
  });

  it('textexpand-expanded class must exist', () => {
    expect(componentExpanded.cssClass).toBe(true);
  });
});

describe('TextexpandComponent using mock component', () => {
  let componentTest: TextexpandTestComponent;
  let fixtureTest: ComponentFixture<TextexpandTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TextexpandModule],
      declarations: [TextexpandTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(TextexpandTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('component test is created', async () => {
    expect(componentTest).toBeTruthy();
  });

  it('text collapsed and textexpand-expanded component is hidden', async () => {
    expect(componentTest.textexpand.isExpanded).toBe(false);
    expect(componentTest.textexpand.collapsedComponent.isHidden).toBe(false);
    expect(componentTest.textexpand.expandedComponent.isHidden).toBe(true);
  });

  it('text expanded and textexpand-collapsed is hidden ', async () => {
    const buttonClicked = fixtureTest.debugElement.query(By.css('.sbb-textexpand-button'))
      .nativeElement;
    buttonClicked.click();
    fixtureTest.detectChanges();

    expect(componentTest.textexpand.isExpanded).toBe(true);
    expect(componentTest.textexpand.collapsedComponent.isHidden).toBe(true);
    expect(componentTest.textexpand.expandedComponent.isHidden).toBe(false);
  });

  it('aria-expanded button property is true to a click on the button', async () => {
    const buttonClicked = fixtureTest.debugElement.query(By.css('.sbb-textexpand-button'))
      .nativeElement;
    buttonClicked.click();
    fixtureTest.detectChanges();

    expect(buttonClicked.attributes['aria-expanded']).toBeTruthy();
    expect(buttonClicked.attributes['aria-expanded'].value).toBe('true');
  });

  it('verify text content collapsed', async () => {
    expect(componentTest.textexpand.isExpanded).toBe(false);
    expect(componentTest.textexpand.collapsedComponent.isHidden).toBe(false);

    const textContent = fixtureTest.nativeElement;
    expect(textContent.textContent).toContain('Hello Davide!');
  });

  it('verify text content expanded to a click on the button', async () => {
    const buttonClicked = fixtureTest.debugElement.query(By.css('.sbb-textexpand-button'))
      .nativeElement;
    buttonClicked.click();
    fixtureTest.detectChanges();

    expect(componentTest.textexpand.isExpanded).toBe(true);
    expect(componentTest.textexpand.collapsedComponent.isHidden).toBe(true);

    const textContent = fixtureTest.nativeElement;
    expect(textContent.textContent).toContain('Hello Marco!');
  });

  it('verify button label when text is collapsed', async () => {
    const buttonClicked = fixtureTest.debugElement.query(By.css('.sbb-textexpand-button'))
      .nativeElement;

    expect(buttonClicked.textContent).toContain('Mehr anzeigen');
  });

  it('verify button label when text is expanded', async () => {
    const buttonClicked = fixtureTest.debugElement.query(By.css('.sbb-textexpand-button'))
      .nativeElement;
    buttonClicked.click();
    fixtureTest.detectChanges();

    expect(buttonClicked.textContent).toContain('Weniger anzeigen');
  });
});
