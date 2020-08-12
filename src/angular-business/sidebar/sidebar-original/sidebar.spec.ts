import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SbbSidebarModule } from '../sidebar-module';

import { SbbSidebar, SbbSidebarContainer } from './sidebar';

describe('SbbSidebar', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SbbSidebarModule, NoopAnimationsModule, CommonModule],
      declarations: [
        SidenarWithFixedPositionTestComponent,
        IndirectDescendantSidenarTestComponent,
        NestedSidenarContainersTestComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  it('should be fixed position when in fixed mode', () => {
    const fixture = TestBed.createComponent(SidenarWithFixedPositionTestComponent);
    fixture.detectChanges();
    const sidebarEl = fixture.debugElement.query(By.directive(SbbSidebar))!.nativeElement;

    expect(sidebarEl.classList).toContain('sbb-sidebar-fixed');

    fixture.componentInstance.fixed = false;
    fixture.detectChanges();

    expect(sidebarEl.classList).not.toContain('sbb-sidebar-fixed');
  });

  it('should set fixed bottom and top when in fixed mode', () => {
    const fixture = TestBed.createComponent(SidenarWithFixedPositionTestComponent);
    fixture.detectChanges();
    const sidebarEl = fixture.debugElement.query(By.directive(SbbSidebar))!.nativeElement;

    expect(sidebarEl.style.top).toBe('20px');
    expect(sidebarEl.style.bottom).toBe('30px');

    fixture.componentInstance.fixed = false;
    fixture.detectChanges();

    expect(sidebarEl.style.top).toBeFalsy();
    expect(sidebarEl.style.bottom).toBeFalsy();
  });

  it('should pick up sidebars that are not direct descendants', fakeAsync(() => {
    const fixture = TestBed.createComponent(IndirectDescendantSidenarTestComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.sidebar.opened).toBe(false);

    fixture.componentInstance.container.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(fixture.componentInstance.sidebar.opened).toBe(true);
  }));

  it('should not pick up sidebars from nested containers', fakeAsync(() => {
    const fixture = TestBed.createComponent(NestedSidenarContainersTestComponent);
    const instance = fixture.componentInstance;
    fixture.detectChanges();

    expect(instance.outerSidenar.opened).toBe(false);
    expect(instance.innerSidenar.opened).toBe(false);

    instance.outerContainer.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(instance.outerSidenar.opened).toBe(true);
    expect(instance.innerSidenar.opened).toBe(false);

    instance.innerContainer.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(instance.outerSidenar.opened).toBe(true);
    expect(instance.innerSidenar.opened).toBe(true);
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
class SidenarWithFixedPositionTestComponent {
  fixed = true;
  fixedTop = 20;
  fixedBottom = 30;
}

@Component({
  // Note that we need the `ng-container` with the `ngSwitch` so that
  // there's a directive between the container and the sidebar.
  template: ` <sbb-sidebar-container #container>
    <ng-container [ngSwitch]="true">
      <sbb-sidebar #sidebar>Sidenar.</sbb-sidebar>
    </ng-container>
    <sbb-sidebar-content>Some content.</sbb-sidebar-content>
  </sbb-sidebar-container>`,
})
class IndirectDescendantSidenarTestComponent {
  @ViewChild('container') container: SbbSidebarContainer;
  @ViewChild('sidebar') sidebar: SbbSidebar;
}

@Component({
  template: `
    <sbb-sidebar-container #outerContainer>
      <sbb-sidebar #outerSidenar>Sidenar</sbb-sidebar>
      <sbb-sidebar-content>
        <sbb-sidebar-container #innerContainer>
          <sbb-sidebar #innerSidenar>Sidenar</sbb-sidebar>
        </sbb-sidebar-container>
      </sbb-sidebar-content>
    </sbb-sidebar-container>
  `,
})
class NestedSidenarContainersTestComponent {
  @ViewChild('outerContainer') outerContainer: SbbSidebarContainer;
  @ViewChild('outerSidenar') outerSidenar: SbbSidebar;
  @ViewChild('innerContainer') innerContainer: SbbSidebarContainer;
  @ViewChild('innerSidenar') innerSidenar: SbbSidebar;
}
