import { Component, DebugElement, ViewChild, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SbbBadge, SbbBadgeModule, SbbBadgePosition } from './index';

describe('SbbBadge', () => {
  let fixture: ComponentFixture<any>;
  let testComponent: BadgeTestApp;
  let badgeHostNativeElement: HTMLElement;
  let badgeHostDebugElement: DebugElement;

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(BadgeTestApp);
    testComponent = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    badgeHostDebugElement = fixture.debugElement.query(By.directive(SbbBadge))!;
    badgeHostNativeElement = badgeHostDebugElement.nativeElement;
  }));

  it('should update the badge based on attribute', () => {
    const badgeElement = badgeHostNativeElement.querySelector('.sbb-badge-content')!;
    expect(badgeElement.textContent).toContain('1');

    testComponent.badgeContent = '22';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(badgeElement.textContent).toContain('22');
  });

  it('should be able to pass in falsy values to the badge content', () => {
    const badgeElement = badgeHostNativeElement.querySelector('.sbb-badge-content')!;
    expect(badgeElement.textContent).toContain('1');

    testComponent.badgeContent = 0;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(badgeElement.textContent).toContain('0');
  });

  it('should treat null and undefined as empty strings in the badge content', () => {
    const badgeElement = badgeHostNativeElement.querySelector('.sbb-badge-content')!;
    expect(badgeElement.textContent).toContain('1');

    testComponent.badgeContent = null;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(badgeElement.textContent?.trim()).toBe('');

    testComponent.badgeContent = undefined;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(badgeElement.textContent?.trim()).toBe('');
  });

  it('should update the badge position on direction change', () => {
    expect(badgeHostNativeElement.classList.contains('sbb-badge-above')).toBe(true);

    testComponent.badgeDirection = 'after';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(badgeHostNativeElement.classList.contains('sbb-badge-after')).toBe(true);
  });

  it('should change visibility to hidden', () => {
    expect(badgeHostNativeElement.classList.contains('sbb-badge-hidden')).toBe(false);

    testComponent.badgeHidden = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(badgeHostNativeElement.classList.contains('sbb-badge-hidden')).toBe(true);
  });

  it('should toggle `aria-describedby` depending on whether the badge has a description', () => {
    expect(badgeHostNativeElement.hasAttribute('aria-describedby')).toBeFalse();

    testComponent.badgeDescription = 'Describing a badge';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const describedById = badgeHostNativeElement.getAttribute('aria-describedby') || '';
    const description = document.getElementById(describedById)?.textContent;
    expect(description).toBe('Describing a badge');

    testComponent.badgeDescription = '';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(badgeHostNativeElement.hasAttribute('aria-describedby')).toBeFalse();
  });

  it('should toggle visibility based on whether the badge has content', () => {
    const classList = badgeHostNativeElement.classList;

    expect(classList.contains('sbb-badge-hidden')).toBe(false);

    testComponent.badgeContent = '';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(classList.contains('sbb-badge-hidden')).toBe(true);

    testComponent.badgeContent = 'hello';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(classList.contains('sbb-badge-hidden')).toBe(false);

    testComponent.badgeContent = ' ';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(classList.contains('sbb-badge-hidden')).toBe(true);

    testComponent.badgeContent = 0;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(classList.contains('sbb-badge-hidden')).toBe(false);
  });

  it('should apply view encapsulation on create badge content', () => {
    const badge = badgeHostNativeElement.querySelector('.sbb-badge-content')!;
    let encapsulationAttr: Attr | undefined;

    for (let i = 0; i < badge.attributes.length; i++) {
      if (badge.attributes[i].name.startsWith('_ngcontent-')) {
        encapsulationAttr = badge.attributes[i];
        break;
      }
    }

    expect(encapsulationAttr).toBeTruthy();
  });

  it('should toggle a class depending on the badge disabled state', () => {
    const element: HTMLElement = badgeHostDebugElement.nativeElement;

    expect(element.classList).not.toContain('sbb-badge-disabled');

    testComponent.badgeDisabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(element.classList).toContain('sbb-badge-disabled');
  });

  it('should clear any pre-existing badges', () => {
    const preExistingFixture = TestBed.createComponent(PreExistingBadge);
    preExistingFixture.detectChanges();

    expect(preExistingFixture.nativeElement.querySelectorAll('.sbb-badge-content').length).toBe(1);
  });

  it('should not clear badge content from child elements', () => {
    const preExistingFixture = TestBed.createComponent(NestedBadge);
    preExistingFixture.detectChanges();

    expect(preExistingFixture.nativeElement.querySelectorAll('.sbb-badge-content').length).toBe(2);
  });

  it('should expose the badge element', () => {
    const badgeElement = badgeHostNativeElement.querySelector('.sbb-badge-content')!;
    expect(fixture.componentInstance.badgeInstance.getBadgeElement()).toBe(badgeElement);
  });

  it('should throw if badge is not attached to an element node', () => {
    expect(() => {
      TestBed.createComponent(BadgeOnTemplate);
    }).toThrowError(/sbbBadge must be attached to an element node/);
  });
});

/** Test component that contains a SbbBadge. */
@Component({
  // Explicitly set the view encapsulation since we have a test that checks for it.
  encapsulation: ViewEncapsulation.Emulated,
  styles: ['span { color: hotpink; }'],
  template: `
    <span
      [sbbBadge]="badgeContent"
      [sbbBadgePosition]="badgeDirection"
      [sbbBadgeHidden]="badgeHidden"
      [sbbBadgeDescription]="badgeDescription"
      [sbbBadgeDisabled]="badgeDisabled"
    >
      home
    </span>
  `,
  standalone: true,
  imports: [SbbBadgeModule],
})
class BadgeTestApp {
  @ViewChild(SbbBadge) badgeInstance: SbbBadge;
  badgeContent: string | number | undefined | null = '1';
  badgeDirection: SbbBadgePosition = 'above';
  badgeHidden = false;
  badgeDescription: string;
  badgeDisabled = false;
}

@Component({
  template: `
    <span sbbBadge="Hello">
      home
      <div class="sbb-badge-content">Pre-existing badge</div>
    </span>
  `,
  standalone: true,
  imports: [SbbBadgeModule],
})
class PreExistingBadge {}

@Component({
  template: `
    <span sbbBadge="Hello">
      home
      <span sbbBadge="Hi">Something</span>
    </span>
  `,
  standalone: true,
  imports: [SbbBadgeModule],
})
class NestedBadge {}

@Component({
  template: ` <ng-template sbbBadge="1">Notifications</ng-template> `,
  standalone: true,
  imports: [SbbBadgeModule],
})
class BadgeOnTemplate {}
