import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { wrappedErrorMessage } from '@sbb-esta/angular-core/testing';

import { getSbbTextexpandInvalidError } from './textexpand-errors';
import { SbbTextexpandModule } from './textexpand.module';
import { SbbTextexpand } from './textexpand/textexpand.component';

@Component({
  template: `<sbb-textexpand (expandEvent)="expandEvent($event)">
    <sbb-textexpand-collapsed
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
      invidunt ut labore et dolore magna aliquyam erat,&nbsp;</sbb-textexpand-collapsed
    >
    <sbb-textexpand-expanded
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
      invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
      justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
      ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos
      et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
      sanctus est.&nbsp;</sbb-textexpand-expanded
    >
  </sbb-textexpand> `,
})
class BasicTextexpand {
  expandEvent = jasmine.createSpy('expandEvent');

  @ViewChild(SbbTextexpand)
  textexpand: SbbTextexpand;
}

@Component({
  template: `<sbb-textexpand>
    <sbb-textexpand-collapsed
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
      invidunt ut labore et dolore magna aliquyam erat,&nbsp;</sbb-textexpand-collapsed
    ></sbb-textexpand
  >`,
})
class InvalidTextexpand {}

describe('SbbTextexpand', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BasicTextexpand, InvalidTextexpand],
        imports: [CommonModule, SbbTextexpandModule],
      }).compileComponents();
    })
  );

  it('should expand and collapse text', () => {
    const fixture = TestBed.createComponent(BasicTextexpand);
    fixture.detectChanges();
    const toggleButton = fixture.debugElement.query(By.css('.sbb-textexpand-button')).nativeElement;
    const expanded = fixture.debugElement.query(By.css('.sbb-textexpand-expanded')).nativeElement;
    const collapsed = fixture.debugElement.query(By.css('.sbb-textexpand-collapsed')).nativeElement;

    expect(toggleButton.textContent).toBe('Show more');
    expect(collapsed.getAttribute('hidden')).toBeFalsy();
    expect(expanded.getAttribute('hidden')).toBe('true');
    expect(fixture.componentInstance.textexpand.isExpanded).toBe(false);

    toggleButton.click();
    fixture.detectChanges();

    expect(toggleButton.textContent).toBe('Show less');
    expect(collapsed.getAttribute('hidden')).toBe('true');
    expect(expanded.getAttribute('hidden')).toBeFalsy();
    expect(fixture.componentInstance.textexpand.isExpanded).toBe(true);
    expect(fixture.componentInstance.expandEvent).toHaveBeenCalledWith(true);

    toggleButton.click();
    fixture.detectChanges();

    expect(toggleButton.textContent).toBe('Show more');
    expect(collapsed.getAttribute('hidden')).toBeFalsy();
    expect(expanded.getAttribute('hidden')).toBe('true');
    expect(fixture.componentInstance.textexpand.isExpanded).toBe(false);
    expect(fixture.componentInstance.expandEvent).toHaveBeenCalledWith(false);
  });

  it('should throw if component is not used like specified', () => {
    const fixture = TestBed.createComponent(InvalidTextexpand);
    expect(() => fixture.detectChanges()).toThrowError(
      wrappedErrorMessage(getSbbTextexpandInvalidError())
    );
  });
});
