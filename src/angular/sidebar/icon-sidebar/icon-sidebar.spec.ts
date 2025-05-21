import { A11yModule } from '@angular/cdk/a11y';
import { MediaMatcher } from '@angular/cdk/layout';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  Component,
  DebugElement,
  ElementRef,
  provideCheckNoChangesConfig,
  ViewChild,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Breakpoints } from '@sbb-esta/angular/core';
import { FakeMediaMatcher } from '@sbb-esta/angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbSidebarModule } from '../sidebar.module';

import { SbbIconSidebar, SbbIconSidebarContainer } from './icon-sidebar';

const PROVIDE_FAKE_MEDIA_MATCHER = {
  provide: MediaMatcher,
  useFactory: () => {
    const mediaMatcher = new FakeMediaMatcher();
    mediaMatcher.defaultMatches = false; // enforce desktop view
    return mediaMatcher;
  },
};

describe('SbbIconSidebar', () => {
  let mediaMatcher: FakeMediaMatcher;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [A11yModule, NoopAnimationsModule, SbbIconTestingModule],
      providers: [PROVIDE_FAKE_MEDIA_MATCHER, provideCheckNoChangesConfig({ exhaustive: false })],
    });

    inject([MediaMatcher], (fm: FakeMediaMatcher) => {
      mediaMatcher = fm;
    })();
  }));

  afterEach(() => mediaMatcher.clear());

  describe('methods', () => {
    it('does not throw when created without a sidebar content', fakeAsync(() => {
      expect(() => {
        const fixture = TestBed.createComponent(BasicTestComponent);
        fixture.detectChanges();
        tick();
      }).not.toThrow();
    }));

    it('should pick up sidebars that are not direct descendants', fakeAsync(() => {
      const fixture = TestBed.createComponent(IndirectDescendantSidebarTestComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.sidebar.expanded).toBe(false);

      fixture.componentInstance.sidebar.expanded = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.sidebar.expanded).toBe(true);
    }));

    it('should not pick up sidebars from nested containers', fakeAsync(() => {
      const fixture = TestBed.createComponent(NestedSidebarContainersTestComponent);
      const instance = fixture.componentInstance;
      fixture.detectChanges();

      expect(instance.outerSidebar.expanded).toBe(false);
      expect(instance.innerSidebar.expanded).toBe(false);

      instance.outerSidebar.expanded = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(instance.outerSidebar.expanded).toBe(true);
      expect(instance.innerSidebar.expanded).toBe(false);

      instance.innerSidebar.expanded = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(instance.outerSidebar.expanded).toBe(true);
      expect(instance.innerSidebar.expanded).toBe(true);
    }));
  });

  describe('attributes', () => {
    it('should correctly parse expanded="false"', () => {
      const fixture = TestBed.createComponent(SidebarSetToExpandedFalseTestComponent);

      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;

      expect((sidebar as SbbIconSidebar).expanded).toBe(false);
    });

    it('should correctly parse expanded="true"', () => {
      const fixture = TestBed.createComponent(SidebarSetToExpandedTrueTestComponent);

      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;

      expect((sidebar as SbbIconSidebar).expanded).toBe(true);
    });

    it('should remove align attr from DOM', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const sidebarEl = fixture.debugElement.query(By.css('sbb-icon-sidebar'))!.nativeElement;
      expect(sidebarEl.hasAttribute('align'))
        .withContext('Expected sidebar not to have a native align attribute.')
        .toBe(false);
    });

    it('should throw when multiple sidebars are included', fakeAsync(() => {
      expect(() => {
        const fixture = TestBed.createComponent(TwoSidebarsTestComponent);
        fixture.detectChanges();
        tick(0);
      }).toThrowError(/A sidebar was already declared/);
    }));

    it('should bind 2-way bind on expanded property', fakeAsync(() => {
      const fixture = TestBed.createComponent(SidebarExpandedBindingTestComponent);
      fixture.detectChanges();

      const sidebar: SbbIconSidebar = fixture.debugElement.query(
        By.directive(SbbIconSidebar),
      )!.componentInstance;

      sidebar.expanded = false;
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.isExpanded).toBe(false);
    }));

    it('should not throw when a two-way binding is toggled quickly while animating', fakeAsync(() => {
      TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [BrowserAnimationsModule, SbbIconTestingModule],
          providers: [provideCheckNoChangesConfig({ exhaustive: false })],
        })
        .compileComponents();

      const fixture = TestBed.createComponent(SidebarExpandedBindingTestComponent);
      fixture.detectChanges();

      // Note that we need actual timeouts and the `BrowserAnimationsModule`
      // in order to test it correctly.
      setTimeout(() => {
        fixture.componentInstance.isExpanded = !fixture.componentInstance.isExpanded;
        fixture.changeDetectorRef.markForCheck();
        expect(() => fixture.detectChanges()).not.toThrow();

        setTimeout(() => {
          fixture.componentInstance.isExpanded = !fixture.componentInstance.isExpanded;
          fixture.changeDetectorRef.markForCheck();
          expect(() => fixture.detectChanges()).not.toThrow();
        }, 1);

        tick(1);
      }, 1);

      tick(1);
      flush();
    }));
  });

  describe('link usage', () => {
    let fixture: ComponentFixture<IconSidebarWithLinksTestComponent>;
    let sidebar: DebugElement;
    let sidebarComponent: SbbIconSidebar;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(IconSidebarWithLinksTestComponent);

      fixture.detectChanges();

      sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar));
      sidebarComponent = sidebar!.componentInstance;
    }));

    it('should collapse icon sidebar by default', () => {
      expect(sidebarComponent.expanded).toBe(false);
    });

    it('should not include any other elements than links with sbbIconSidebarItem directive and hr', () => {
      expect(sidebar.nativeElement.textContent).not.toContain('SHOULD BE IGNORED');
    });

    it('should include links with sbbIconSidebarItem directive and hr', () => {
      expect(sidebar.queryAll(By.css('hr')).length).toBe(1);
      expect(sidebar.queryAll(By.css('a[sbbIconSidebarItem]')).length).toBe(3);
    });

    it('should display link label properly', () => {
      expect(
        sidebar.queryAll(By.css('a[sbbIconSidebarItem]'))[0].nativeElement.textContent,
      ).toContain('Link1');
    });

    it('should collapse and expand', fakeAsync(() => {
      const collapseButton = sidebar.query(By.css('.sbb-icon-sidebar-collapse-expand-button'));

      expect(sidebarComponent.expanded).toBe(false);
      expect(fixture.componentInstance.expandedCount).toBe(0);
      expect(fixture.componentInstance.collapsedCount).toBe(0);
      expect(sidebar.nativeElement.classList).not.toContain('sbb-icon-sidebar-expanded');
      expect(sidebar.nativeElement.classList).toContain('sbb-icon-sidebar-collapsed');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[0]
          .getAttribute('aria-hidden'),
      ).toEqual('true');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[1]
          .getAttribute('aria-hidden'),
      ).toEqual('false');

      collapseButton.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(sidebarComponent.expanded).toBe(true);
      expect(fixture.componentInstance.expandedCount).toBe(1);
      expect(fixture.componentInstance.collapsedCount).toBe(0);
      expect(sidebar.nativeElement.classList).toContain('sbb-icon-sidebar-expanded');
      expect(sidebar.nativeElement.classList).not.toContain('sbb-icon-sidebar-collapsed');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[0]
          .getAttribute('aria-hidden'),
      ).toEqual('false');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[1]
          .getAttribute('aria-hidden'),
      ).toEqual('true');

      collapseButton.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(sidebarComponent.expanded).toBe(false);
      expect(fixture.componentInstance.expandedCount).toBe(1);
      expect(fixture.componentInstance.collapsedCount).toBe(1);
      expect(sidebar.nativeElement.classList).not.toContain('sbb-icon-sidebar-expanded');
      expect(sidebar.nativeElement.classList).toContain('sbb-icon-sidebar-collapsed');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[0]
          .getAttribute('aria-hidden'),
      ).toEqual('true');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[1]
          .getAttribute('aria-hidden'),
      ).toEqual('false');
    }));

    it('should scroll to left when changing from mobile to desktop view to show all icons correctly aligned', fakeAsync(() => {
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const sbbIcon = fixture.debugElement.query(By.css('sbb-icon'));
      const scrollContainer = fixture.nativeElement.querySelector(
        '.sbb-icon-sidebar-inner-container',
      );

      sbbIcon.nativeElement.style.width = '10000px';
      scrollContainer.scrollLeft = 200;

      fixture.detectChanges();

      expect(scrollContainer.scrollLeft).toBeGreaterThan(0);

      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, false);
      tick();

      expect(scrollContainer.scrollLeft).toBe(0);
    }));
  });

  it('should mark the icon sidebar content as scrollable', () => {
    const fixture = TestBed.createComponent(BasicTestComponent);
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.sbb-icon-sidebar-inner-container'));
    const scrollable = content.injector.get(CdkScrollable);
    expect(scrollable).toBeTruthy();
    expect(scrollable.getElementRef().nativeElement).toBe(content.nativeElement);
  });

  describe('DOM position', () => {
    it('should project start icon sidebar before the content', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const allNodes = getSidebarNodesArray(fixture);
      const sidebarIndex = allNodes.indexOf(
        fixture.nativeElement.querySelector('.sbb-icon-sidebar'),
      );
      const contentIndex = allNodes.indexOf(
        fixture.nativeElement.querySelector('.sbb-icon-sidebar-content'),
      );

      expect(sidebarIndex)
        .withContext('Expected icon sidebar to be inside the container')
        .toBeGreaterThan(-1);
      expect(contentIndex)
        .withContext('Expected content to be inside the container')
        .toBeGreaterThan(-1);
      expect(sidebarIndex)
        .withContext('Expected icon sidebar to be before the content')
        .toBeLessThan(contentIndex);
    });

    it('should project end icon sidebar after the content', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.componentInstance.position = 'end';
      fixture.detectChanges();

      const allNodes = getSidebarNodesArray(fixture);
      const sidebarIndex = allNodes.indexOf(
        fixture.nativeElement.querySelector('.sbb-icon-sidebar'),
      );
      const contentIndex = allNodes.indexOf(
        fixture.nativeElement.querySelector('.sbb-icon-sidebar-content'),
      );

      expect(sidebarIndex)
        .withContext('Expected sidebar to be inside the container')
        .toBeGreaterThan(-1);
      expect(contentIndex)
        .withContext('Expected content to be inside the container')
        .toBeGreaterThan(-1);
      expect(sidebarIndex)
        .withContext('Expected sidebar to be after the content')
        .toBeGreaterThan(contentIndex);
    });

    it('should display the mobile icon sidebar on the bottom of the screen', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();
      fixture.detectChanges();

      let sidebarTop = fixture.nativeElement.querySelector('.sbb-icon-sidebar').offsetTop;
      let contentTop = fixture.nativeElement.querySelector('.sbb-icon-sidebar-content').offsetTop;

      expect(sidebarTop)
        .withContext('Expected start sidebar to be below the content')
        .toBeGreaterThan(contentTop);

      fixture.componentInstance.position = 'end';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      sidebarTop = fixture.nativeElement.querySelector('.sbb-icon-sidebar').offsetTop;
      contentTop = fixture.nativeElement.querySelector('.sbb-icon-sidebar-content').offsetTop;

      expect(sidebarTop)
        .withContext('Expected end sidebar to be below the content')
        .toBeGreaterThan(contentTop);
    }));

    function getSidebarNodesArray(fixture: ComponentFixture<any>): HTMLElement[] {
      return Array.from(
        fixture.nativeElement.querySelector('.sbb-icon-sidebar-container').childNodes,
      );
    }
  });
});

describe('SbbIconSidebarContainer', () => {
  let mediaMatcher: FakeMediaMatcher;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbIconTestingModule],
      providers: [PROVIDE_FAKE_MEDIA_MATCHER],
    });

    inject([MediaMatcher], (fm: FakeMediaMatcher) => {
      mediaMatcher = fm;
    })();
  }));

  afterEach(() => mediaMatcher.clear());

  it('should expose a scrollable when the consumer has not specified sidebar content', () => {
    const fixture = TestBed.createComponent(SidebarContainerEmptyTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.sidebarContainer.scrollable instanceof CdkScrollable).toBe(
      true,
    );
  });

  it('should expose a scrollable when the consumer has specified sidebar content', () => {
    const fixture = TestBed.createComponent(SidebarContainerWithContentTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.sidebarContainer.scrollable instanceof CdkScrollable).toBe(
      true,
    );
  });

  it('should clean up the sidebars stream on destroy', () => {
    const fixture = TestBed.createComponent(SidebarContainerEmptyTestComponent);
    fixture.detectChanges();

    const spy = jasmine.createSpy('complete spy');
    const subscription = fixture.componentInstance.sidebarContainer._sidebars.changes.subscribe({
      complete: spy,
    });

    fixture.destroy();

    expect(spy).toHaveBeenCalled();
    subscription.unsubscribe();
  });
});

/** Test component that contains an SbbIconSidebarContainer and an empty sbb-icon-sidebar-content. */
@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar></sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
  imports: [SbbSidebarModule, SbbIconModule],
})
class SidebarContainerEmptyTestComponent {
  @ViewChild(SbbIconSidebarContainer) sidebarContainer: SbbIconSidebarContainer;
}

/** Test component that contains an SbbIconSidebarContainer and a SbbIconSidebar. */
@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar="sbbIconSidebar" [position]="position">
      <button #sidebarButton>Content</button>
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
  imports: [SbbSidebarModule],
})
class BasicTestComponent {
  @ViewChild('sidebar') sidebar: SbbIconSidebar;
  @ViewChild('sidebarButton') sidebarButton: ElementRef<HTMLButtonElement>;
  @ViewChild('expandedButton') expandedButton: ElementRef<HTMLButtonElement>;
  @ViewChild('collapseButton') collapseButton: ElementRef<HTMLButtonElement>;
  position = 'start';
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar expanded="false"> collapsed Sidebar. </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
  imports: [SbbSidebarModule],
})
class SidebarSetToExpandedFalseTestComponent {}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar expanded="true" (expanded)="expandedCallback()">
      Collapsed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
  imports: [SbbSidebarModule],
})
class SidebarSetToExpandedTrueTestComponent {
  expandedCallback = jasmine.createSpy('expanded callback');
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar [(expanded)]="isExpanded"> Collapsed Sidebar. </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
  imports: [SbbSidebarModule],
})
class SidebarExpandedBindingTestComponent {
  isExpanded = false;
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar1></sbb-icon-sidebar>
    <sbb-icon-sidebar #sidebar2></sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
  imports: [SbbSidebarModule],
})
class TwoSidebarsTestComponent {}

@Component({
  template: `
    <sbb-icon-sidebar-container>
      <sbb-icon-sidebar>Sidebar</sbb-icon-sidebar>
      <sbb-icon-sidebar-content>Content</sbb-icon-sidebar-content>
    </sbb-icon-sidebar-container>
  `,
  imports: [SbbSidebarModule],
})
class SidebarContainerWithContentTestComponent {
  @ViewChild(SbbIconSidebarContainer) sidebarContainer: SbbIconSidebarContainer;
}

@Component({
  // Note that we need the `ng-container` with the `ngSwitch` so that
  // there's a directive between the container and the sidebar.
  template: ` <sbb-icon-sidebar-container #container>
    @if (true) {
      <sbb-icon-sidebar #sidebar>Sidebar</sbb-icon-sidebar>
    }
  </sbb-icon-sidebar-container>`,
  imports: [SbbSidebarModule],
})
class IndirectDescendantSidebarTestComponent {
  @ViewChild('container') container: SbbIconSidebarContainer;
  @ViewChild('sidebar') sidebar: SbbIconSidebar;
}

@Component({
  template: `
    <sbb-icon-sidebar-container #outerContainer>
      <sbb-icon-sidebar #outerSidebar>Sidebar</sbb-icon-sidebar>
      <sbb-icon-sidebar-content>
        <sbb-icon-sidebar-container #innerContainer>
          <sbb-icon-sidebar #innerSidebar>Sidebar</sbb-icon-sidebar>
        </sbb-icon-sidebar-container>
      </sbb-icon-sidebar-content>
    </sbb-icon-sidebar-container>
  `,
  imports: [SbbSidebarModule],
})
class NestedSidebarContainersTestComponent {
  @ViewChild('outerContainer') outerContainer: SbbIconSidebarContainer;
  @ViewChild('outerSidebar') outerSidebar: SbbIconSidebar;
  @ViewChild('innerContainer') innerContainer: SbbIconSidebarContainer;
  @ViewChild('innerSidebar') innerSidebar: SbbIconSidebar;
}

@Component({
  template: `
    <sbb-icon-sidebar-container>
      <sbb-icon-sidebar (expandedChange)="expandedChange($event)">
        <a sbbIconSidebarItem [routerLink]="['/link1']" label="Link1">
          <sbb-icon svgIcon="station-small"></sbb-icon>
        </a>
        <hr />
        <a
          sbbIconSidebarItem
          [routerLink]="['/link2']"
          label="Link 2"
          routerLinkActive="sbb-active"
        >
          <sbb-icon svgIcon="station-small"></sbb-icon>
        </a>
        <a>SHOULD BE IGNORED</a>
        <a sbbIconSidebarItem [routerLink]="['/link3']" label="Link3">
          <sbb-icon svgIcon="station-small"></sbb-icon>
        </a>
      </sbb-icon-sidebar>
      <sbb-icon-sidebar-content> Content </sbb-icon-sidebar-content>
    </sbb-icon-sidebar-container>
  `,
  imports: [SbbSidebarModule, SbbIconModule, RouterTestingModule],
})
class IconSidebarWithLinksTestComponent {
  expandedCount = 0;
  collapsedCount = 0;
  expandedChange(expanded: boolean) {
    if (expanded) {
      this.expandedCount++;
    } else {
      this.collapsedCount++;
    }
  }
}
