import { A11yModule } from '@angular/cdk/a11y';
import { Direction } from '@angular/cdk/bidi';
import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { IconStationModule } from '@sbb-esta/angular-icons/station';

import { SbbSidebarModule } from '../sidebar-module';

import { SbbIconSidebar, SbbIconSidebarContainer } from './icon-sidebar';

describe('SbbIconSidebar', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SbbSidebarModule,
        A11yModule,
        PlatformModule,
        NoopAnimationsModule,
        CommonModule,
        IconStationModule,
        RouterTestingModule,
      ],
      declarations: [
        BasicTestComponent,
        SidebarContainerNoSidebarTestComponent,
        SidebarSetToExpandedFalseTestComponent,
        SidebarSetToExpandedTrueTestComponent,
        TwoSidebarsTestComponent,
        SidebarWithFocusableElementsTestComponent,
        SidebarExpandedBindingTestComponent,
        IndirectDescendantSidebarTestComponent,
        NestedSidebarContainersTestComponent,
        IconSidebarWithLinksTestComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('methods', () => {
    it('does not throw when created without a sidebar container', fakeAsync(() => {
      expect(() => {
        const fixture = TestBed.createComponent(BasicTestComponent);
        fixture.detectChanges();
        tick();
      }).not.toThrow();
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
      expect(sidebarEl.hasAttribute('align')).toBe(
        false,
        'Expected sidebar not to have a native align attribute.'
      );
    });

    it('should throw when multiple sidebars are included', fakeAsync(() => {
      const fixture = TestBed.createComponent(TwoSidebarsTestComponent);

      expect(() => {
        try {
          fixture.detectChanges();
          tick(0);
        } catch {
          tick(0);
        }
      }).toThrow();
    }));

    it('should bind 2-way bind on expanded property', fakeAsync(() => {
      const fixture = TestBed.createComponent(SidebarExpandedBindingTestComponent);
      fixture.detectChanges();

      const sidebar: SbbIconSidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!
        .componentInstance;

      sidebar.expanded = true;
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.isExpanded).toBe(true);
    }));

    it('should not throw when a two-way binding is toggled quickly while animating', fakeAsync(() => {
      TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [SbbSidebarModule, BrowserAnimationsModule],
          declarations: [SidebarExpandedBindingTestComponent],
        })
        .compileComponents();

      const fixture = TestBed.createComponent(SidebarExpandedBindingTestComponent);
      fixture.detectChanges();

      // Note that we need actual timeouts and the `BrowserAnimationsModule`
      // in order to test it correctly.
      setTimeout(() => {
        fixture.componentInstance.isExpanded = !fixture.componentInstance.isExpanded;
        expect(() => fixture.detectChanges()).not.toThrow();

        setTimeout(() => {
          fixture.componentInstance.isExpanded = !fixture.componentInstance.isExpanded;
          expect(() => fixture.detectChanges()).not.toThrow();
        }, 1);

        tick(1);
      }, 1);

      tick(1);
    }));
  });

  describe('link usage', () => {
    let fixture: ComponentFixture<IconSidebarWithLinksTestComponent>;
    let sidebar: DebugElement;
    let sidebarComponent: SbbIconSidebar;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(IconSidebarWithLinksTestComponent);

      fixture.detectChanges();

      sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar));
      sidebarComponent = sidebar!.componentInstance;
    }));

    it('should expand sidebar by default', () => {
      expect(sidebarComponent.expanded).toBe(true);
    });

    it('should not include any other elements than links with sbbIconSidebarItem directive and hr', () => {
      expect(sidebar.nativeElement.textContent).not.toContain('SHOULD BE IGNORED');
    });

    it('should include links with sbbIconSidebarItem directive and hr', () => {
      expect(sidebar.queryAll(By.css('hr')).length).toBe(1);
      expect(sidebar.queryAll(By.css('a[sbbIconSidebarItem]')).length).toBe(3);
    });

    it('should collapse and expand', () => {
      const collapseButton = sidebar.query(By.css('.sbb-icon-sidebar-collapse-expand-button'));

      expect(sidebarComponent.expanded).toBe(true);
      expect(sidebar.nativeElement.classList).toContain('sbb-icon-sidebar-expanded');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[0]
          .getAttribute('aria-hidden')
      ).toEqual('false');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[1]
          .getAttribute('aria-hidden')
      ).toEqual('true');

      collapseButton.nativeElement.click();
      fixture.detectChanges();

      expect(sidebarComponent.expanded).toBe(false);
      expect(sidebar.nativeElement.classList).not.toContain('sbb-icon-sidebar-expanded');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[0]
          .getAttribute('aria-hidden')
      ).toEqual('true');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[1]
          .getAttribute('aria-hidden')
      ).toEqual('false');

      collapseButton.nativeElement.click();
      fixture.detectChanges();

      expect(sidebarComponent.expanded).toBe(true);
      expect(sidebar.nativeElement.classList).toContain('sbb-icon-sidebar-expanded');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[0]
          .getAttribute('aria-hidden')
      ).toEqual('false');
      expect(
        collapseButton.nativeElement
          .querySelectorAll('.sbb-icon-sidebar-item-label')[1]
          .getAttribute('aria-hidden')
      ).toEqual('true');
    });
  });
});

describe('SbbIconSidebarContainer', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SbbSidebarModule, A11yModule, PlatformModule, NoopAnimationsModule],
      declarations: [
        SidebarContainerEmptyTestComponent,
        SidebarDelayedTestComponent,
        SidebarSetToExpandedTrueTestComponent,
        SidebarContainerStateChangesTestAppTestComponent,
        BasicTestComponent,
        SidebarContainerWithContentTestComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  it('should not animate when the sidebar is expanded on load', fakeAsync(() => {
    TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [SbbSidebarModule, BrowserAnimationsModule],
        declarations: [SidebarSetToExpandedTrueTestComponent],
      })
      .compileComponents();

    const fixture = TestBed.createComponent(SidebarSetToExpandedTrueTestComponent);

    fixture.detectChanges();
    tick();

    const container = fixture.debugElement.nativeElement.querySelector(
      '.sbb-icon-sidebar-container'
    );

    expect(container.classList).not.toContain('sbb-sidebar-transition');
  }));

  it('should expose a scrollable when the consumer has not specified sidebar content', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerEmptyTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.sidebarContainer.scrollable instanceof CdkScrollable).toBe(
      true
    );
  }));

  it('should expose a scrollable when the consumer has specified sidebar content', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerWithContentTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.sidebarContainer.scrollable instanceof CdkScrollable).toBe(
      true
    );
  }));

  it('should clean up the sidebars stream on destroy', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerEmptyTestComponent);
    fixture.detectChanges();

    const spy = jasmine.createSpy('complete spy');
    const subscription = fixture.componentInstance.sidebarContainer._sidebars.changes.subscribe({
      complete: spy,
    });

    fixture.destroy();

    expect(spy).toHaveBeenCalled();
    subscription.unsubscribe();
  }));
});

/** Test component that contains an SbbIconSidebarContainer but no SbbIconSidebar. */
@Component({ template: `<sbb-icon-sidebar-container></sbb-icon-sidebar-container>` })
class SidebarContainerNoSidebarTestComponent {}

/** Test component that contains an SbbIconSidebarContainer and an empty sbb-icon-sidebar-content. */
@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar></sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarContainerEmptyTestComponent {
  @ViewChild(SbbIconSidebarContainer) sidebarContainer: SbbIconSidebarContainer;
}

/** Test component that contains an SbbIconSidebarContainer and a SbbIconSidebar. */
@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar
      #sidebar="sbbIconSidebar"
      (expanded)="expanded()"
      (expandedStart)="expandedStart()"
      (collapsed)="collapse()"
      (collapsedStart)="collapseStart()"
    >
      <button #sidebarButton>Content</button>
    </sbb-icon-sidebar>
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      tabindex="0"
      focusable="true"
      #svg
    >
      <circle cx="50" cy="50" r="50" />
    </svg>
  </sbb-icon-sidebar-container>`,
})
class BasicTestComponent {
  expandedCount = 0;
  expandedStartCount = 0;
  collapseCount = 0;
  collapseStartCount = 0;

  @ViewChild('sidebar') sidebar: SbbIconSidebar;
  @ViewChild('sidebarButton') sidebarButton: ElementRef<HTMLButtonElement>;
  @ViewChild('expandedButton') expandedButton: ElementRef<HTMLButtonElement>;
  @ViewChild('svg') svg: ElementRef<SVGElement>;
  @ViewChild('collapseButton') collapseButton: ElementRef<HTMLButtonElement>;

  expanded() {
    this.expandedCount++;
  }

  expandedStart() {
    this.expandedStartCount++;
  }

  collapse() {
    this.collapseCount++;
  }

  collapseStart() {
    this.collapseStartCount++;
  }
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar expanded="false">
      collapsed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarSetToExpandedFalseTestComponent {}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar expanded="true" (expanded)="expandedCallback()">
      Collapsed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarSetToExpandedTrueTestComponent {
  expandedCallback = jasmine.createSpy('expanded callback');
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar [(expanded)]="isExpanded">
      Collapsed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarExpandedBindingTestComponent {
  isExpanded = false;
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar1></sbb-icon-sidebar>
    <sbb-icon-sidebar #sidebar2></sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class TwoSidebarsTestComponent {}

@Component({
  // Note: we use inputs here, because they're guaranteed
  // to be focusable across all platforms.
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar [mode]="mode">
      <input type="text" class="input1" />
    </sbb-icon-sidebar>
    <input type="text" class="input2" />
  </sbb-icon-sidebar-container>`,
})
class SidebarWithFocusableElementsTestComponent {
  mode: string = 'over';
}

@Component({
  template: `
    <sbb-icon-sidebar-container>
      <sbb-icon-sidebar *ngIf="showSidebar" #sidebar>Sidebar</sbb-icon-sidebar>
    </sbb-icon-sidebar-container>
  `,
})
class SidebarDelayedTestComponent {
  @ViewChild(SbbIconSidebar) sidebar: SbbIconSidebar;
  showSidebar = false;
}

@Component({
  template: ` <sbb-icon-sidebar-container [dir]="direction">
    <sbb-icon-sidebar *ngIf="renderSidebar" [mode]="mode" style="width:100px"></sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarContainerStateChangesTestAppTestComponent {
  @ViewChild(SbbIconSidebar) sidebar: SbbIconSidebar;
  @ViewChild(SbbIconSidebarContainer) sidebarContainer: SbbIconSidebarContainer;

  direction: Direction = 'ltr';
  mode = 'side';
  renderSidebar = true;
}

@Component({
  template: `
    <sbb-icon-sidebar-container>
      <sbb-icon-sidebar>Sidebar</sbb-icon-sidebar>
      <sbb-icon-sidebar-content>Content</sbb-icon-sidebar-content>
    </sbb-icon-sidebar-container>
  `,
})
class SidebarContainerWithContentTestComponent {
  @ViewChild(SbbIconSidebarContainer) sidebarContainer: SbbIconSidebarContainer;
}

@Component({
  // Note that we need the `ng-container` with the `ngSwitch` so that
  // there's a directive between the container and the sidebar.
  template: ` <sbb-icon-sidebar-container #container>
    <ng-container [ngSwitch]="true">
      <sbb-icon-sidebar #sidebar>Sidebar</sbb-icon-sidebar>
    </ng-container>
  </sbb-icon-sidebar-container>`,
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
      <sbb-icon-sidebar>
        <a sbbIconSidebarItem [routerLink]="['/link1']" label="Link1">
          <sbb-icon-station sbbIcon></sbb-icon-station>
        </a>
        <hr />
        <a
          sbbIconSidebarItem
          [routerLink]="['/link2']"
          label="Link 2"
          routerLinkActive="sbb-icon-sidebar-item-active"
        >
          <sbb-icon-station sbbIcon></sbb-icon-station>
        </a>
        <a>SHOULD BE IGNORED</a>
        <a sbbIconSidebarItem [routerLink]="['/link3']" label="Link3">
          <sbb-icon-station sbbIcon></sbb-icon-station>
        </a>
      </sbb-icon-sidebar>
      <sbb-icon-sidebar-content>
        Content
      </sbb-icon-sidebar-content>
    </sbb-icon-sidebar-container>
  `,
})
class IconSidebarWithLinksTestComponent {}
