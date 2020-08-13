import { A11yModule } from '@angular/cdk/a11y';
import { Direction } from '@angular/cdk/bidi';
import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import { SbbSidebarModule } from '../sidebar-module';

import { SbbIconSidebar, SbbIconSidebarContainer } from './icon-sidebar';

xdescribe('SbbIconSidebar', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SbbSidebarModule, A11yModule, PlatformModule, NoopAnimationsModule, CommonModule],
      declarations: [
        BasicTestComponent,
        SidebarContainerNoSidebarTestComponent,
        SidebarSetToOpenedFalseTestComponent,
        SidebarSetToOpenedTrueTestComponent,
        TwoSidebarsTestComponent,
        SidebarWithFocusableElementsTestComponent,
        SidebarOpenBindingTestComponent,
        IndirectDescendantSidebarTestComponent,
        NestedSidebarContainersTestComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('methods', () => {
    it('does not throw when created without a sidebar', fakeAsync(() => {
      expect(() => {
        const fixture = TestBed.createComponent(BasicTestComponent);
        fixture.detectChanges();
        tick();
      }).not.toThrow();
    }));
  });

  describe('attributes', () => {
    it('should correctly parse expanded="false"', () => {
      const fixture = TestBed.createComponent(SidebarSetToOpenedFalseTestComponent);

      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;

      expect((sidebar as SbbIconSidebar).expanded).toBe(false);
    });

    it('should correctly parse expanded="true"', () => {
      const fixture = TestBed.createComponent(SidebarSetToOpenedTrueTestComponent);

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

    it('should bind 2-way bind on opened property', fakeAsync(() => {
      const fixture = TestBed.createComponent(SidebarOpenBindingTestComponent);
      fixture.detectChanges();

      const sidebar: SbbIconSidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!
        .componentInstance;

      // sidebar.open(); // TODO
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.isExpanded).toBe(true);
    }));

    it('should not throw when a two-way binding is toggled quickly while animating', fakeAsync(() => {
      TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [SbbSidebarModule, BrowserAnimationsModule],
          declarations: [SidebarOpenBindingTestComponent],
        })
        .compileComponents();

      const fixture = TestBed.createComponent(SidebarOpenBindingTestComponent);
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
});

xdescribe('SbbIconSidebarContainer', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SbbSidebarModule, A11yModule, PlatformModule, NoopAnimationsModule],
      declarations: [
        SidebarContainerEmptyTestComponent,
        SidebarDelayedTestComponent,
        SidebarSetToOpenedTrueTestComponent,
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
        declarations: [SidebarSetToOpenedTrueTestComponent],
      })
      .compileComponents();

    const fixture = TestBed.createComponent(SidebarSetToOpenedTrueTestComponent);

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
    console.error(fixture.componentInstance.sidebarContainer.scrollable);

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

/** Test component that contains an SbbIconSidebarContainer and one SbbIconSidebar. */
@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar
      #sidebar="sbbIconSidebar"
      (opened)="open()"
      (openedStart)="openStart()"
      (closed)="close()"
      (closedStart)="closeStart()"
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
  openCount = 0;
  openStartCount = 0;
  closeCount = 0;
  closeStartCount = 0;

  @ViewChild('sidebar') sidebar: SbbIconSidebar;
  @ViewChild('sidebarButton') sidebarButton: ElementRef<HTMLButtonElement>;
  @ViewChild('openButton') openButton: ElementRef<HTMLButtonElement>;
  @ViewChild('svg') svg: ElementRef<SVGElement>;
  @ViewChild('closeButton') closeButton: ElementRef<HTMLButtonElement>;

  open() {
    this.openCount++;
  }

  openStart() {
    this.openStartCount++;
  }

  close() {
    this.closeCount++;
  }

  closeStart() {
    this.closeStartCount++;
  }
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar expanded="false">
      Closed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarSetToOpenedFalseTestComponent {}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar expanded="true" (opened)="openCallback()">
      Closed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarSetToOpenedTrueTestComponent {
  openCallback = jasmine.createSpy('open callback');
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar [(expanded)]="isExpanded">
      Closed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarOpenBindingTestComponent {
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
