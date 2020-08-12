import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SbbSidebar, SbbSidebarContainer, SbbSidebarModule } from './index';

describe('SbbSidebar', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SbbSidebarModule, NoopAnimationsModule, CommonModule],
      declarations: [
        SidenavWithFixedPositionTestComponent,
        IndirectDescendantSidenavTestComponent,
        NestedSidenavContainersTestComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  it('should be fixed position when in fixed mode', () => {
    const fixture = TestBed.createComponent(SidenavWithFixedPositionTestComponent);
    fixture.detectChanges();
    const sidenavEl = fixture.debugElement.query(By.directive(SbbSidebar))!.nativeElement;

    expect(sidenavEl.classList).toContain('sbb-sidebar-fixed');

    fixture.componentInstance.fixed = false;
    fixture.detectChanges();

    expect(sidenavEl.classList).not.toContain('sbb-sidebar-fixed');
  });

  it('should set fixed bottom and top when in fixed mode', () => {
    const fixture = TestBed.createComponent(SidenavWithFixedPositionTestComponent);
    fixture.detectChanges();
    const sidenavEl = fixture.debugElement.query(By.directive(SbbSidebar))!.nativeElement;

    expect(sidenavEl.style.top).toBe('20px');
    expect(sidenavEl.style.bottom).toBe('30px');

    fixture.componentInstance.fixed = false;
    fixture.detectChanges();

    expect(sidenavEl.style.top).toBeFalsy();
    expect(sidenavEl.style.bottom).toBeFalsy();
  });

  it('should pick up sidenavs that are not direct descendants', fakeAsync(() => {
    const fixture = TestBed.createComponent(IndirectDescendantSidenavTestComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.sidenav.opened).toBe(false);

    fixture.componentInstance.container.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.componentInstance.sidenav.opened).toBe(true);
  }));

  it('should not pick up sidenavs from nested containers', fakeAsync(() => {
    const fixture = TestBed.createComponent(NestedSidenavContainersTestComponent);
    const instance = fixture.componentInstance;
    fixture.detectChanges();

    expect(instance.outerSidenav.opened).toBe(false);
    expect(instance.innerSidenav.opened).toBe(false);

    instance.outerContainer.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(instance.outerSidenav.opened).toBe(true);
    expect(instance.innerSidenav.opened).toBe(false);

    instance.innerContainer.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(instance.outerSidenav.opened).toBe(true);
    expect(instance.innerSidenav.opened).toBe(true);
  }));
});

@Component({
  template: ` <sbb-sidebar-container>
    <sbb-sidebar
      #drawer
      [fixedInViewport]="fixed"
      [fixedTopGap]="fixedTop"
      [fixedBottomGap]="fixedBottom"
    >
      Drawer.
    </sbb-sidebar>
    <sbb-sidebar-content>
      Some content.
    </sbb-sidebar-content>
  </sbb-sidebar-container>`,
})
class SidenavWithFixedPositionTestComponent {
  fixed = true;
  fixedTop = 20;
  fixedBottom = 30;
}

@Component({
  // Note that we need the `ng-container` with the `ngSwitch` so that
  // there's a directive between the container and the sidenav.
  template: ` <sbb-sidebar-container #container>
    <ng-container [ngSwitch]="true">
      <sbb-sidebar #sidenav>Sidenav.</sbb-sidebar>
    </ng-container>
    <sbb-sidebar-content>Some content.</sbb-sidebar-content>
  </sbb-sidebar-container>`,
})
class IndirectDescendantSidenavTestComponent {
  @ViewChild('container') container: SbbSidebarContainer;
  @ViewChild('sidenav') sidenav: SbbSidebar;
}

@Component({
  template: `
    <sbb-sidebar-container #outerContainer>
      <sbb-sidebar #outerSidenav>Sidenav</sbb-sidebar>
      <sbb-sidebar-content>
        <sbb-sidebar-container #innerContainer>
          <sbb-sidebar #innerSidenav>Sidenav</sbb-sidebar>
        </sbb-sidebar-container>
      </sbb-sidebar-content>
    </sbb-sidebar-container>
  `,
})
class NestedSidenavContainersTestComponent {
  @ViewChild('outerContainer') outerContainer: SbbSidebarContainer;
  @ViewChild('outerSidenav') outerSidenav: SbbSidebar;
  @ViewChild('innerContainer') innerContainer: SbbSidebarContainer;
  @ViewChild('innerSidenav') innerSidenav: SbbSidebar;
}
