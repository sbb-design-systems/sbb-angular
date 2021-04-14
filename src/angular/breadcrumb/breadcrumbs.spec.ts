import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createMouseEvent,
  dispatchEvent,
  dispatchMouseEvent,
} from '@sbb-esta/angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { SbbBreadcrumb, SBB_BREADCRUMB_LEVEL_OFFSET } from './breadcrumb';
import { SbbBreadcrumbModule } from './breadcrumb.module';
import { SbbBreadcrumbs } from './breadcrumbs';

@Component({
  selector: 'sbb-breadcrumbs-test',
  template: `
    <sbb-breadcrumbs>
      <sbb-breadcrumb>
        <a routerLink="." [queryParams]="{ level: 'home' }" routerLinkActive="sbb-selected">
          <sbb-icon svgIcon="kom:house-small"></sbb-icon>
        </a>
      </sbb-breadcrumb>
      <sbb-breadcrumb>
        <a routerLink="." [queryParams]="{ level: '1' }" routerLinkActive="sbb-selected">Level 1</a>
      </sbb-breadcrumb>
      <sbb-breadcrumb>
        <a routerLink="." [queryParams]="{ level: '2' }" routerLinkActive="sbb-selected">Level 2</a>
      </sbb-breadcrumb>
    </sbb-breadcrumbs>
  `,
})
export class BreadcrumbsTestComponent {}

@Component({
  selector: 'sbb-breadcrumbs-test2',
  template: `
    <sbb-breadcrumbs>
      <sbb-breadcrumb>
        <a routerLink="." [queryParams]="{ level: 'home' }" routerLinkActive="sbb-selected">
          <sbb-icon svgIcon="kom:house-small"></sbb-icon>
        </a>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        Level 1 with detail pages
        <sbb-dropdown>
          <a
            sbbDropdownItem
            routerLink="."
            [queryParams]="{ level: '1', sub: '1' }"
            routerLinkActive="sbb-selected"
            >Level 1</a
          >
          <a
            sbbDropdownItem
            routerLink="."
            [queryParams]="{ level: '1', sub: '1b' }"
            routerLinkActive="sbb-selected"
            >Level 1b</a
          >
        </sbb-dropdown>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        Level 2
        <sbb-dropdown>
          <a
            sbbDropdownItem
            routerLink="."
            [queryParams]="{ level: '1', sub: '2' }"
            routerLinkActive="sbb-selected"
            >Level 2</a
          >
          <a
            sbbDropdownItem
            routerLink="."
            [queryParams]="{ level: '1', sub: '2b' }"
            routerLinkActive="sbb-selected"
            >Level 2 with detail pages</a
          >
        </sbb-dropdown>
      </sbb-breadcrumb>
    </sbb-breadcrumbs>
  `,
})
export class BreadcrumbsTest2Component {}

@Component({
  selector: 'sbb-breadcrumbs-test3',
  template: `
    <sbb-breadcrumbs>
      <sbb-breadcrumb>
        <a routerLink="." [queryParams]="{ level: 'home' }">
          <sbb-icon svgIcon="kom:house-small"></sbb-icon>
        </a>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        Level 1 with detail pages
        <sbb-dropdown>
          <a
            sbbDropdownItem
            routerLink="."
            [queryParams]="{ level: '1', sub: '1' }"
            routerLinkActive="sbb-selected"
            >Level 1</a
          >
          <a
            sbbDropdownItem
            routerLink="."
            [queryParams]="{ level: '1', sub: '1b' }"
            routerLinkActive="sbb-selected"
            >Level 1b</a
          >
        </sbb-dropdown>
      </sbb-breadcrumb>
    </sbb-breadcrumbs>
  `,
})
export class BreadcrumbsTest3Component {}

describe('SbbBreadcrumbs', () => {
  let component: SbbBreadcrumbs;
  let fixture: ComponentFixture<SbbBreadcrumbs>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbBreadcrumbs],
        imports: [CommonModule, SbbMenuModule, SbbIconModule, SbbIconTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbBreadcrumbs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Breadcrumb behaviour Test', () => {
  let component: BreadcrumbsTestComponent;
  let fixtureTest: ComponentFixture<BreadcrumbsTestComponent>;

  let location: Location = null!;
  let router: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbBreadcrumbModule,
          RouterTestingModule,
          CommonModule,
          SbbIconModule,
          SbbIconTestingModule,
        ],
        declarations: [BreadcrumbsTestComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(BreadcrumbsTestComponent);
    component = fixtureTest.componentInstance;
    router = TestBed.inject(Router);
    fixtureTest.detectChanges();
  });

  it(
    'breadcrumb with navigation to home page',
    waitForAsync(() => {
      fixtureTest.ngZone!.run(async () => {
        router = TestBed.inject(Router);
        router.initialNavigation();
        fixtureTest.detectChanges();
        location = TestBed.inject(Location);

        await router.navigate(['.'], { queryParams: { level: 'home' } });
        fixtureTest.detectChanges();

        await fixtureTest.whenStable();
        const breadcrumbLevelHomeComponent = fixtureTest.debugElement.queryAll(
          By.directive(SbbBreadcrumb)
        )[0];

        const linkHome = breadcrumbLevelHomeComponent.query(
          By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a')
        ).nativeElement;

        dispatchEvent(linkHome, createMouseEvent('click'));
        fixtureTest.detectChanges();
        expect(location.path()).toContain('?level=home');

        const iconHome = breadcrumbLevelHomeComponent.query(
          By.css('.sbb-dropdown-trigger .sbb-icon')
        ).nativeElement;
        expect(iconHome).toBeTruthy();
      });
    })
  );

  it(
    'breadcrumb with navigation to level 1 page',
    waitForAsync(() => {
      fixtureTest.ngZone!.run(async () => {
        router = TestBed.inject(Router);
        router.initialNavigation();
        fixtureTest.detectChanges();
        location = TestBed.inject(Location);

        await router.navigate(['.'], { queryParams: { level: '1' } });
        fixtureTest.detectChanges();

        await fixtureTest.whenStable();
        const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(SbbBreadcrumb))[1];

        const link1 = breadcrumbLevel1.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a'))
          .nativeElement;

        dispatchEvent(link1, createMouseEvent('click'));
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        expect(location.path()).toContain('?level=1');
      });
    })
  );

  it(
    'breadcrumb with navigation to level 2 page',
    waitForAsync(() => {
      fixtureTest.ngZone!.run(async () => {
        router = TestBed.inject(Router);
        router.initialNavigation();
        fixtureTest.detectChanges();
        location = TestBed.inject(Location);

        await router.navigate(['.'], { queryParams: { level: '2' } });
        fixtureTest.detectChanges();

        await fixtureTest.whenStable();
        const breadcrumbLevel2 = fixtureTest.debugElement.queryAll(By.directive(SbbBreadcrumb))[2];

        const link2 = breadcrumbLevel2.query(By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a'))
          .nativeElement;

        dispatchEvent(link2, createMouseEvent('click'));
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        expect(location.path()).toContain('?level=2');
      });
    })
  );
});

describe('Breadcrumb behaviour Test 2', () => {
  let component: BreadcrumbsTest2Component;
  let fixtureTest: ComponentFixture<BreadcrumbsTest2Component>;

  let location: Location = null!;
  let router: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbBreadcrumbModule,
          RouterTestingModule,
          CommonModule,
          SbbIconModule,
          SbbIconTestingModule,
          SbbMenuModule,
        ],
        declarations: [BreadcrumbsTest2Component],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(BreadcrumbsTest2Component);
    component = fixtureTest.componentInstance;
    router = TestBed.inject(Router);
  });

  it(
    'breadcrumb with correctly sized dropdown width',
    waitForAsync(() => {
      fixtureTest.ngZone!.run(async () => {
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(SbbBreadcrumb))[1];

        const dropdownTrigger = breadcrumbLevel1.query(By.css('.sbb-breadcrumb-trigger'));

        dropdownTrigger.nativeElement.click();

        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        const dropdownPanel: HTMLElement = fixtureTest.debugElement.queryAll(
          By.css('.sbb-dropdown-panel.sbb-dropdown-visible')
        )[0].nativeElement;

        expect(dropdownPanel.getBoundingClientRect().width).toBeGreaterThan(
          SBB_BREADCRUMB_LEVEL_OFFSET
        );
      });
    })
  );

  it(
    'breadcrumb with navigation to home page',
    waitForAsync(() => {
      fixtureTest.ngZone!.run(async () => {
        router = TestBed.inject(Router);
        router.initialNavigation();
        fixtureTest.detectChanges();
        location = TestBed.inject(Location);

        await router.navigate(['.'], { queryParams: { level: 'home' } });
        fixtureTest.detectChanges();

        await fixtureTest.whenStable();
        const breadcrumbLevelHomeComponent = fixtureTest.debugElement.queryAll(
          By.directive(SbbBreadcrumb)
        )[0];

        const linkHome = breadcrumbLevelHomeComponent.query(
          By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a')
        ).nativeElement;

        dispatchEvent(linkHome, createMouseEvent('click'));
        fixtureTest.detectChanges();
        expect(location.path()).toContain('?level=home');

        const iconHome = breadcrumbLevelHomeComponent.query(
          By.css('.sbb-dropdown-trigger .sbb-icon')
        ).nativeElement;
        expect(iconHome).toBeTruthy();
      });
    })
  );

  it(
    'breadcrumb with navigation to level 1 page with dropdown',
    waitForAsync(() => {
      fixtureTest.ngZone!.run(async () => {
        router = TestBed.inject(Router);
        router.initialNavigation();
        fixtureTest.detectChanges();
        location = TestBed.inject(Location);

        await router.navigate(['.'], { queryParams: { level: '1', sub: '1' } });
        fixtureTest.detectChanges();

        await fixtureTest.whenStable();
        const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(SbbBreadcrumb))[1];

        const dropdownTrigger = breadcrumbLevel1.query(By.css('.sbb-breadcrumb-trigger'))
          .nativeElement as HTMLButtonElement;
        dispatchMouseEvent(dropdownTrigger, 'click');
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        const subLink1 = fixtureTest.debugElement.queryAll(
          By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a')
        )[0].nativeElement;
        dispatchMouseEvent(subLink1, 'click');
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();
        expect(location.path()).toContain('?level=1&sub=1');

        dispatchMouseEvent(dropdownTrigger, 'click');
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        const subLink2 = fixtureTest.debugElement.queryAll(
          By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a')
        )[1].nativeElement;
        dispatchMouseEvent(subLink2, 'click');
        await fixtureTest.whenStable();
        fixtureTest.detectChanges();
        expect(location.path()).toContain('?level=1&sub=1b');
      });
    })
  );

  it(
    'breadcrumb with navigation to level 2 page with dropdown',
    waitForAsync(() => {
      fixtureTest.ngZone!.run(async () => {
        router = TestBed.inject(Router);
        router.initialNavigation();
        fixtureTest.detectChanges();
        location = TestBed.inject(Location);

        await router.navigate(['.'], { queryParams: { level: '1', sub: '2' } });
        fixtureTest.detectChanges();

        await fixtureTest.whenStable();
        const breadcrumbLevel2 = fixtureTest.debugElement.queryAll(By.directive(SbbBreadcrumb))[2];

        const dropdownTrigger = breadcrumbLevel2.query(By.css('.sbb-breadcrumb-trigger'))
          .nativeElement;
        dispatchMouseEvent(dropdownTrigger, 'click');
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        const subLink1 = fixtureTest.debugElement.queryAll(
          By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a')
        )[0].nativeElement;
        dispatchEvent(subLink1, createMouseEvent('click'));
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        expect(location.path()).toContain('?level=1&sub=2');

        dispatchMouseEvent(dropdownTrigger, 'click');
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        const subLink2 = fixtureTest.debugElement.queryAll(
          By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a')
        )[1].nativeElement;
        dispatchEvent(subLink2, createMouseEvent('click'));
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();
        expect(location.path()).toContain('?level=1&sub=2b');
      });
    })
  );
});

describe('Breadcrumb behaviour Test 3', () => {
  let component: BreadcrumbsTest3Component;
  let fixtureTest: ComponentFixture<BreadcrumbsTest3Component>;

  let location: Location = null!;
  let router: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbBreadcrumbModule,
          RouterTestingModule,
          CommonModule,
          SbbIconModule,
          SbbIconTestingModule,
          SbbMenuModule,
        ],
        declarations: [BreadcrumbsTest3Component],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(BreadcrumbsTest3Component);
    component = fixtureTest.componentInstance;
    router = TestBed.inject(Router);
  });

  it(
    'breadcrumb with navigation to home page',
    waitForAsync(() => {
      fixtureTest.ngZone!.run(async () => {
        router = TestBed.inject(Router);
        router.initialNavigation();
        fixtureTest.detectChanges();
        location = TestBed.inject(Location);

        await router.navigate(['.'], { queryParams: { level: 'home' } });
        fixtureTest.detectChanges();

        await fixtureTest.whenStable();
        const breadcrumbLevelHomeComponent = fixtureTest.debugElement.queryAll(
          By.directive(SbbBreadcrumb)
        )[0];

        const linkHome = breadcrumbLevelHomeComponent.query(
          By.css('.sbb-dropdown-trigger.sbb-breadcrumb > a')
        ).nativeElement;

        dispatchEvent(linkHome, createMouseEvent('click'));
        fixtureTest.detectChanges();
        expect(location.path()).toContain('?level=home');

        const iconHome = breadcrumbLevelHomeComponent.query(
          By.css('.sbb-dropdown-trigger .sbb-icon')
        ).nativeElement;
        expect(iconHome).toBeTruthy();
      });
    })
  );

  it(
    'breadcrumb with navigation to level 1 page with dropdown',
    waitForAsync(() => {
      fixtureTest.ngZone!.run(async () => {
        router = TestBed.inject(Router);
        router.initialNavigation();
        fixtureTest.detectChanges();
        location = TestBed.inject(Location);

        await router.navigate(['.'], { queryParams: { level: '1', sub: '1' } });
        fixtureTest.detectChanges();

        await fixtureTest.whenStable();
        const breadcrumbLevel1 = fixtureTest.debugElement.queryAll(By.directive(SbbBreadcrumb))[1];

        const dropdownTrigger = breadcrumbLevel1.query(By.css('.sbb-breadcrumb-trigger'))
          .nativeElement;
        dispatchMouseEvent(dropdownTrigger, 'click');
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        const subLink1 = fixtureTest.debugElement.queryAll(
          By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a')
        )[0].nativeElement;
        dispatchEvent(subLink1, createMouseEvent('click'));
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();
        expect(location.path()).toContain('?level=1&sub=1');

        dispatchMouseEvent(dropdownTrigger, 'click');
        fixtureTest.detectChanges();
        await fixtureTest.whenStable();

        const subLink2 = fixtureTest.debugElement.queryAll(
          By.css('.sbb-dropdown-panel.sbb-dropdown-visible > a')
        )[1].nativeElement;
        dispatchEvent(subLink2, createMouseEvent('click'));
        await fixtureTest.whenStable();
        fixtureTest.detectChanges();
        expect(location.path()).toContain('?level=1&sub=1b');
      });
    })
  );
});
