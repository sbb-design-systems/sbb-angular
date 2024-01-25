import { MediaMatcher } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Breakpoints } from '@sbb-esta/angular/core';
import { FakeMediaMatcher } from '@sbb-esta/angular/core/testing';
import { SbbIcon, SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbHeaderLeanModule } from './index';

describe('SbbHeaderLean', () => {
  let mediaMatcher: FakeMediaMatcher;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SbbIconTestingModule,
        SimpleHeaderLean,
        HeaderLeanWithAppChooser,
      ],
      providers: [
        {
          provide: MediaMatcher,
          useFactory: () => {
            mediaMatcher = new FakeMediaMatcher();
            mediaMatcher.defaultMatches = false; // enforce desktop view
            return mediaMatcher;
          },
        },
      ],
    });

    TestBed.compileComponents();
  }));

  describe('without app chooser', () => {
    let fixture: ComponentFixture<SimpleHeaderLean>;
    let component: SimpleHeaderLean;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleHeaderLean);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display label and subtitle', () => {
      const labelElement = fixture.debugElement.nativeElement.querySelector(
        '.sbb-header-lean-label',
      ) as HTMLElement;
      expect(labelElement.textContent).toEqual(component.label);
      const subtitleElement = fixture.debugElement.nativeElement.querySelector(
        '.sbb-header-lean-subtitle',
      ) as HTMLElement;
      expect(subtitleElement.textContent).toEqual(component.subtitle);
    });

    it('should hide the menu toggle per default', () => {
      const labelElement = fixture.debugElement.nativeElement.querySelector(
        '.sbb-header-lean-open-menu',
      ) as HTMLElement;
      expect(getComputedStyle(labelElement).visibility).toEqual('hidden');
    });

    it('should display the menu toggle on tablet dimension', fakeAsync(() => {
      mediaMatcher.setMatchesQuery(Breakpoints.Tablet, true);
      tick();
      fixture.detectChanges();

      const labelElement = fixture.debugElement.nativeElement.querySelector(
        '.sbb-header-lean-open-menu',
      ) as HTMLElement;
      expect(getComputedStyle(labelElement).visibility).toEqual('visible');
    }));

    it('should display the link in the appropriate position with collapsed/not collapsed', fakeAsync(() => {
      let homeElementInMain = fixture.debugElement.nativeElement.querySelector(
        '.sbb-header-lean-main-menu .home-link',
      ) as HTMLElement;
      expect(homeElementInMain).toBeDefined();
      let homeElementInSide = fixture.debugElement.nativeElement.querySelector(
        '.sbb-header-lean-side-menu .home-link',
      ) as HTMLElement;
      expect(homeElementInSide).toBeNull();

      mediaMatcher.setMatchesQuery(Breakpoints.Tablet, true);
      tick();
      fixture.detectChanges();

      homeElementInMain = fixture.debugElement.nativeElement.querySelector(
        '.sbb-header-lean-main-menu .home-link',
      ) as HTMLElement;
      expect(homeElementInMain).toBeNull();
      homeElementInSide = fixture.debugElement.nativeElement.querySelector(
        '.sbb-header-lean-side-menu .home-link',
      ) as HTMLElement;
      expect(homeElementInSide).toBeDefined();
    }));

    it('should display `<sbb-header-icon-actions />`', () => {
      const button = fixture.debugElement.nativeElement.querySelectorAll('.sbb-frameless-button');
      expect(button).toBeDefined();
    });
  });

  describe('with app chooser', () => {
    let fixture: ComponentFixture<HeaderLeanWithAppChooser>;

    beforeEach(() => {
      fixture = TestBed.createComponent(HeaderLeanWithAppChooser);
      fixture.detectChanges();
    });

    it('should display app chooser button', () => {
      const labelElement = fixture.debugElement.nativeElement.querySelector(
        '.sbb-header-lean-open-menu',
      ) as HTMLElement;
      expect(labelElement.classList.contains('sbb-header-lean-app-chooser-available')).toBeTrue();

      const iconComponent = fixture.debugElement.query(
        By.css('.sbb-header-lean-open-menu sbb-icon'),
      ).componentInstance as SbbIcon;
      expect(iconComponent.svgIcon).toEqual('nine-squares-small');
    });
  });
});

@Component({
  template: `
    <sbb-header-lean [label]="label" [subtitle]="subtitle">
      <sbb-header-environment>dev</sbb-header-environment>
      <sbb-header-icon-actions>
        <button sbb-frameless-button><sbb-icon svgIcon="magnifying-glass-small"></sbb-icon></button>
      </sbb-header-icon-actions>
      <a routerLink="/" class="home-link">Home</a>
    </sbb-header-lean>
  `,
  standalone: true,
  imports: [SbbHeaderLeanModule, SbbIconModule],
})
class SimpleHeaderLean {
  label = 'Simple Label';
  subtitle = 'Some subtitle';
}

@Component({
  template: `
    <sbb-header-lean label="label">
      <sbb-header-environment>dev</sbb-header-environment>
      <a routerLink="/">Home</a>
      <sbb-app-chooser-section label="Apps">
        <a href="https://other-app.app.sbb.ch">Other App</a>
        <a href="https://alternative-app.app.sbb.ch">Alternative App</a>
      </sbb-app-chooser-section>
      <sbb-app-chooser-section label="Angular">
        <a href="https://angular.io">Angular</a>
      </sbb-app-chooser-section>
    </sbb-header-lean>
  `,
  standalone: true,
  imports: [SbbHeaderLeanModule],
})
class HeaderLeanWithAppChooser {}
