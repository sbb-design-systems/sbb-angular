import { Component, ContentChild, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SbbTextexpandCollapsed } from '../textexpand-collapsed/textexpand-collapsed.component';
import { SbbTextexpandExpanded } from '../textexpand-expanded/textexpand-expanded.component';
import { SbbTextexpandModule } from '../textexpand.module';

import { SbbTextexpand } from './textexpand.component';

@Component({
  selector: 'sbb-textexpand-test',
  template: `
    <sbb-textexpand #textexpand>
      <sbb-textexpand-collapsed>Hello Davide! &nbsp;</sbb-textexpand-collapsed>
      <sbb-textexpand-expanded>Hello Marco! &nbsp;</sbb-textexpand-expanded>
    </sbb-textexpand>
  `,
})
class TextexpandTestComponent {
  @ViewChild('textexpand', { static: true }) textexpand: SbbTextexpand;

  @ContentChild(SbbTextexpandCollapsed, { static: true })
  collapsedComponent: SbbTextexpandCollapsed;

  @ContentChild(SbbTextexpandExpanded, { static: true })
  expandedComponent: SbbTextexpandExpanded;
}

describe('SbbTextexpand', () => {
  let componentTest: TextexpandTestComponent;
  let fixtureTest: ComponentFixture<TextexpandTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbTextexpandModule],
        declarations: [TextexpandTestComponent],
      }).compileComponents();
    })
  );

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
    expect(componentTest.textexpand.collapsedComponent._hidden).toBe(false);
    expect(componentTest.textexpand.expandedComponent._hidden).toBe(true);
  });

  it('text expanded and textexpand-collapsed is hidden ', async () => {
    const buttonClicked = fixtureTest.debugElement.query(By.css('.sbb-textexpand-button'))
      .nativeElement;
    buttonClicked.click();
    fixtureTest.detectChanges();

    expect(componentTest.textexpand.isExpanded).toBe(true);
    expect(componentTest.textexpand.collapsedComponent._hidden).toBe(true);
    expect(componentTest.textexpand.expandedComponent._hidden).toBe(false);
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
    expect(componentTest.textexpand.collapsedComponent._hidden).toBe(false);

    const textContent = fixtureTest.nativeElement;
    expect(textContent.textContent).toContain('Hello Davide!');
  });

  it('verify text content expanded to a click on the button', async () => {
    const buttonClicked = fixtureTest.debugElement.query(By.css('.sbb-textexpand-button'))
      .nativeElement;
    buttonClicked.click();
    fixtureTest.detectChanges();

    expect(componentTest.textexpand.isExpanded).toBe(true);
    expect(componentTest.textexpand.collapsedComponent._hidden).toBe(true);

    const textContent = fixtureTest.nativeElement;
    expect(textContent.textContent).toContain('Hello Marco!');
  });

  it('verify button label when text is collapsed', async () => {
    const buttonClicked = fixtureTest.debugElement.query(By.css('.sbb-textexpand-button'))
      .nativeElement;

    expect(buttonClicked.textContent).toContain('Show more');
  });

  it('verify button label when text is expanded', async () => {
    const buttonClicked = fixtureTest.debugElement.query(By.css('.sbb-textexpand-button'))
      .nativeElement;
    buttonClicked.click();
    fixtureTest.detectChanges();

    expect(buttonClicked.textContent).toContain('Show less');
  });
});
