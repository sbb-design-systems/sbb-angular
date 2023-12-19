import { Component, ViewChild } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { wrappedErrorMessage } from '@sbb-esta/angular/core/testing';

import { SbbTextexpand } from './textexpand';
import { getSbbTextexpandInvalidError } from './textexpand-errors';
import { SbbTextexpandModule } from './textexpand.module';

@Component({
  template: `<sbb-textexpand (expandEvent)="expandEvent($event)">
    <sbb-textexpand-collapsed>I am a</sbb-textexpand-collapsed>
    <sbb-textexpand-expanded>I am a long text</sbb-textexpand-expanded>
  </sbb-textexpand> `,
})
class BasicTextexpand {
  expandEvent = jasmine.createSpy('expandEvent');

  @ViewChild(SbbTextexpand)
  textexpand: SbbTextexpand;
}

@Component({
  template: `<sbb-textexpand>
    <sbb-textexpand-collapsed>Lorem ipsum dolor</sbb-textexpand-collapsed></sbb-textexpand
  >`,
})
class InvalidTextexpand {}

describe('SbbTextexpand', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BasicTextexpand, InvalidTextexpand],
      imports: [SbbTextexpandModule],
    }).compileComponents();
  }));

  it('should expand and collapse text', () => {
    const fixture = TestBed.createComponent(BasicTextexpand);
    fixture.detectChanges();
    const toggleButton = fixture.debugElement.query(By.css('.sbb-textexpand-button')).nativeElement;
    const expanded = fixture.debugElement.query(By.css('.sbb-textexpand-expanded')).nativeElement;
    const collapsed = fixture.debugElement.query(By.css('.sbb-textexpand-collapsed')).nativeElement;

    assertCollapsed();

    toggleButton.click();
    fixture.detectChanges();

    assertExpanded();
    expect(fixture.componentInstance.expandEvent).toHaveBeenCalledWith(true);

    toggleButton.click();
    fixture.detectChanges();

    assertCollapsed();
    expect(fixture.componentInstance.expandEvent).toHaveBeenCalledWith(false);

    function assertCollapsed() {
      expect(toggleButton.textContent).toBe('Show more');
      expect(toggleButton.attributes['aria-expanded'].value).toBe('false');
      expect(collapsed.getAttribute('hidden')).toBeFalsy();
      expect(expanded.getAttribute('hidden')).toBe('true');
      expect(fixture.componentInstance.textexpand.isExpanded).toBe(false);
    }

    function assertExpanded() {
      expect(toggleButton.textContent).toBe('Show less');
      expect(toggleButton.attributes['aria-expanded'].value).toBe('true');
      expect(collapsed.getAttribute('hidden')).toBe('true');
      expect(expanded.getAttribute('hidden')).toBeFalsy();
      expect(fixture.componentInstance.textexpand.isExpanded).toBe(true);
    }
  });

  it('should throw if component is not used like specified', () => {
    const fixture = TestBed.createComponent(InvalidTextexpand);
    expect(() => fixture.detectChanges()).toThrowError(
      wrappedErrorMessage(getSbbTextexpandInvalidError()),
    );
  });
});
