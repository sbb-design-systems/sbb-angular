import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbMenuModule, SbbMenuTrigger } from '@sbb-esta/angular/menu';

import { SbbUsermenu } from './usermenu';
import { SbbUsermenuModule } from './usermenu.module';

const performLoginAndReturnUsermenuComponent = (fixtureTest: ComponentFixture<any>) => {
  const usermenuComponent = fixtureTest.debugElement.query(By.directive(SbbUsermenu));
  const usermenuComponentInstance = usermenuComponent.componentInstance;
  spyOn(usermenuComponentInstance.loginRequest, 'emit').and.callThrough();
  const buttonLogin = usermenuComponent.query(
    By.css('.sbb-usermenu-trigger-logged-out'),
  ).nativeElement;
  buttonLogin.click();
  fixtureTest.detectChanges();

  expect(usermenuComponentInstance.loginRequest.emit).toHaveBeenCalled();

  return usermenuComponent;
};

describe('SbbUsermenu', () => {
  let usermenuComponent: SbbUsermenu;
  let fixtureUsermenu: ComponentFixture<SbbUsermenu>;

  beforeEach(() => {
    fixtureUsermenu = TestBed.createComponent(SbbUsermenu);
    usermenuComponent = fixtureUsermenu.componentInstance;
  });

  it('should create', () => {
    expect(usermenuComponent).toBeTruthy();
  });
});

describe('SbbUsermenu with userName and displayName without image', () => {
  let componentTest: UsermenuWithDisplayNameAndUserNameTestComponent;
  let fixtureTest: ComponentFixture<UsermenuWithDisplayNameAndUserNameTestComponent>;
  let overlayContainerElement: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule, RouterTestingModule, NoopAnimationsModule],
    });
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuWithDisplayNameAndUserNameTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
    overlayContainerElement = TestBed.inject(OverlayContainer).getContainerElement();
  });

  it('should display initial letters because there is no custom icon/image provided', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);

    const initialLettersReference = usermenuComponent.query(
      By.css('.sbb-usermenu-initial-letters'),
    );
    expect(initialLettersReference.nativeElement).toBeTruthy();
    expect(initialLettersReference.nativeElement.textContent).toContain('MM');
  });

  it('should determine initial letters', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);

    const params = [
      { name: 'Max Muster', expected: 'MM' },
      { name: 'Max', expected: 'MA' },
      { name: 'Meier Julian', expected: 'MJ' },
      { name: 'Meier Pablo Enrique José', expected: 'MJ' },
      { name: 'Meier Ruedi (IT-BDE)', expected: 'MR' },
      { name: 'Åberg Niels (IT-BDE)', expected: 'ÅN' },
      { name: 'aberg niels', expected: 'AN' },
      { name: '(dummy)', expected: '' },
    ];

    params.forEach((param) => {
      componentTest.displayName = param.name;
      fixtureTest.changeDetectorRef.markForCheck();
      fixtureTest.detectChanges();
      const initialLettersReference = usermenuComponent.query(
        By.css('.sbb-usermenu-initial-letters'),
      );
      expect(initialLettersReference.nativeElement.textContent).toContain(param.expected);
    });
  });

  it('should display login button after performing logout', () => {
    performLoginAndReturnUsermenuComponent(fixtureTest);
    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-logged-in'))).toBeTruthy();
    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-logged-out'))).toBeFalsy();

    fixtureTest.componentInstance.logout();
    fixtureTest.detectChanges();

    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-logged-in'))).toBeFalsy();
    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-logged-out'))).toBeTruthy();
  });

  it('should display ellipsis if userName or displayName is too long', async () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);
    const usermenuComponentInstance = usermenuComponent.componentInstance as SbbUsermenu;
    fixtureTest.componentInstance.userName = 'very long username that is really very long';
    fixtureTest.componentInstance.displayName = 'very long displayName that is really very long';
    expect(usermenuComponentInstance.panelOpen).toBeFalse();

    // Open menu
    usermenuComponentInstance.open();
    fixtureTest.detectChanges();
    expect(usermenuComponentInstance.panelOpen).toBeTrue();
    await fixtureTest.whenStable();

    const panel = overlayContainerElement.querySelector(
      '.sbb-menu-panel-type-usermenu',
    )! as HTMLElement;
    const displayName = panel.querySelector('.sbb-usermenu-user-info-display-name')! as HTMLElement;
    const userName = panel.querySelector('.sbb-usermenu-user-info-name')! as HTMLElement;

    // Assert text-overflow is active with ellipsis style
    expect(getComputedStyle(displayName).getPropertyValue('text-overflow')).toBe('ellipsis');
    expect(displayName.offsetWidth)
      .withContext('text-overflow is not active')
      .toBeLessThan(displayName.scrollWidth);
    expect(getComputedStyle(userName).getPropertyValue('text-overflow')).toBe('ellipsis');
    expect(userName.offsetWidth)
      .withContext('text-overflow is not active')
      .toBeLessThan(userName.scrollWidth);
  });

  it('should open menu on arrow click', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest)
      .componentInstance as SbbUsermenu;

    const arrow = fixtureTest.debugElement.query(By.css('.sbb-usermenu-arrow')).nativeElement;
    expect(usermenuComponent.panelOpen).toBeFalse();
    expect(getComputedStyle(arrow).transform).toEqual('none');

    arrow.click();
    fixtureTest.detectChanges();

    expect(usermenuComponent.panelOpen).toBeTrue();
    expect(getComputedStyle(arrow).transform).not.toEqual('none');
  });

  it('should display data (displayName and username) if menu expanded', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest)
      .componentInstance as SbbUsermenu;
    expect(usermenuComponent.panelOpen).toBeFalse();

    const displayName = fixtureTest.debugElement.query(
      By.css('.sbb-usermenu-user-info-display-name'),
    ).nativeElement;
    const userName = fixtureTest.debugElement.query(
      By.css('.sbb-usermenu-user-info-name'),
    ).nativeElement;

    // Assertions in collapsed state
    expect(fixtureTest.debugElement.nativeElement.classList).not.toContain('sbb-usermenu-opened');
    expect(displayName.textContent).toContain('Max Muster');
    expect(userName.textContent).toContain('max_98');
    expect(getComputedStyle(userName).getPropertyValue('display')).toBe('none');

    // Open menu
    usermenuComponent.toggle();
    fixtureTest.detectChanges();

    const userNameOpenedState = fixtureTest.debugElement.query(
      By.css('.sbb-menu-panel-type-usermenu .sbb-usermenu-user-info-name'),
    ).nativeElement;
    const displayNameOpenedState = fixtureTest.debugElement.query(
      By.css('.sbb-menu-panel-type-usermenu .sbb-usermenu-user-info-display-name'),
    ).nativeElement;

    // Assertions in opened state
    expect(usermenuComponent.panelOpen).toBeTrue();
    expect(displayNameOpenedState.textContent).toContain('Max Muster');
    expect(userNameOpenedState.textContent).toContain('max_98');
    expect(getComputedStyle(userNameOpenedState).getPropertyValue('display')).not.toBe('none');
  });

  it('should open and close panel', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest)
      .componentInstance as SbbUsermenu;

    usermenuComponent.open();
    fixtureTest.detectChanges();

    expect(usermenuComponent.panelOpen).toBeTrue();

    usermenuComponent.close();
    fixtureTest.detectChanges();

    expect(usermenuComponent.panelOpen).toBeFalse();
  });

  it('should open and close panel using toggle method', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest)
      .componentInstance as SbbUsermenu;

    usermenuComponent.toggle();
    fixtureTest.detectChanges();

    expect(usermenuComponent.panelOpen).toBeTrue();

    usermenuComponent.toggle();
    fixtureTest.detectChanges();

    expect(usermenuComponent.panelOpen).toBeFalse();
  });

  it('should set appropriate aria attributes', () => {
    // When panel closed
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest)
      .componentInstance as SbbUsermenu;
    const triggerOpenButton = fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger'));

    // Then
    expect(triggerOpenButton.attributes['aria-label']).toBe(
      'Logged in as Max Muster. Click or press enter to open user menu.',
    );
    expect(triggerOpenButton.attributes['aria-haspopup']).toBe('menu');
    expect(triggerOpenButton.attributes['aria-controls']).toBeUndefined();

    // When panel open
    usermenuComponent.toggle();
    fixtureTest.detectChanges();
    const identificationSection = fixtureTest.debugElement.query(
      By.css('.sbb-usermenu-identification'),
    );

    // Then
    expect(triggerOpenButton.attributes['aria-expanded']).toBe('true');
    expect(triggerOpenButton.attributes['aria-controls']).toBe(
      overlayContainerElement.querySelector('.sbb-menu-panel-type-usermenu')!.id,
    );
    expect(identificationSection.attributes['aria-hidden']).toBe('true');
  });

  it('should forward menuOpened and menuClosed of menu to sbb-usermenu', () => {
    // When panel closed
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest)
      .componentInstance as SbbUsermenu;

    spyOn(fixtureTest.componentInstance, 'opened');
    spyOn(fixtureTest.componentInstance, 'closed');

    usermenuComponent.open();
    fixtureTest.detectChanges();

    expect(fixtureTest.componentInstance.opened).toHaveBeenCalledTimes(1);
    expect(fixtureTest.componentInstance.closed).toHaveBeenCalledTimes(0);

    usermenuComponent.close();
    fixtureTest.detectChanges();

    expect(fixtureTest.componentInstance.opened).toHaveBeenCalledTimes(1);
    expect(fixtureTest.componentInstance.closed).toHaveBeenCalledTimes(1);
  });
});

describe('SbbUsermenu with only displayName', () => {
  let fixtureTest: ComponentFixture<UsermenuWithOnlyDisplayNameTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule, NoopAnimationsModule],
    });
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuWithOnlyDisplayNameTestComponent);
    fixtureTest.detectChanges();
  });

  it('should display only displayName', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);
    const trigger = usermenuComponent.query(By.directive(SbbMenuTrigger));

    const displayName = trigger.query(By.css('.sbb-usermenu-user-info-display-name')).nativeElement;
    expect(trigger.nativeElement.classList).not.toContain('sbb-menu-trigger-menu-open');
    expect(displayName.textContent).toContain('Max Muster');

    usermenuComponent.componentInstance.open();
    fixtureTest.detectChanges();

    expect(trigger.nativeElement.classList).toContain('sbb-menu-trigger-menu-open');
    expect(displayName.textContent).toContain('Max Muster');
    expect(trigger.query(By.css('.sbb-usermenu-user-info-name'))).toBeNull();
  });
});

describe('SbbUsermenu with only userName', () => {
  let fixtureTest: ComponentFixture<UsermenuWithOnlyUsernameTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule, NoopAnimationsModule],
    });
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuWithOnlyUsernameTestComponent);
    fixtureTest.detectChanges();
  });

  it('should display only username', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);
    const trigger = usermenuComponent.query(By.directive(SbbMenuTrigger));

    const displayName = trigger.query(By.css('.sbb-usermenu-user-info-display-name')).nativeElement;
    expect(trigger.nativeElement.classList).not.toContain('sbb-menu-trigger-menu-open');
    expect(displayName.textContent).toContain('walter_14');

    usermenuComponent.componentInstance.open();
    fixtureTest.detectChanges();

    expect(trigger.nativeElement.classList).toContain('sbb-menu-trigger-menu-open');
    expect(displayName.textContent).toContain('walter_14');
    expect(trigger.query(By.css('.sbb-usermenu-user-info-name'))).toBeNull();
  });
});

describe('SbbUsermenu with custom image', () => {
  let fixtureTest: ComponentFixture<UsermenuWithCustomImageTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule, NoopAnimationsModule],
    });
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuWithCustomImageTestComponent);
    fixtureTest.detectChanges();
  });

  it('should perform login', () => {
    performLoginAndReturnUsermenuComponent(fixtureTest);
  });

  it('should display image', () => {
    performLoginAndReturnUsermenuComponent(fixtureTest);

    const iconReference = fixtureTest.debugElement.query(By.css('.image'));
    expect(iconReference.nativeElement).toBeTruthy();
  });
});

describe('SbbUsermenu with no connected menu', () => {
  let fixtureTest: ComponentFixture<UsermenuNoMenuTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule, NoopAnimationsModule],
    });
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuNoMenuTestComponent);
    fixtureTest.detectChanges();
  });

  it('should not provide button to open menu', () => {
    performLoginAndReturnUsermenuComponent(fixtureTest);

    expect(fixtureTest.debugElement.query(By.css('button.sbb-usermenu-trigger'))).toBeFalsy();
    expect(fixtureTest.debugElement.query(By.css('div.sbb-usermenu-trigger'))).toBeTruthy();
  });

  it('should hide arrow', () => {
    performLoginAndReturnUsermenuComponent(fixtureTest);

    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-arrow'))).toBeFalsy();
  });
});

@Component({
  template: `
    <sbb-usermenu
      [userName]="userName"
      [displayName]="displayName"
      (loginRequest)="login()"
      [menu]="menu"
      (menuClosed)="closed()"
      (menuOpened)="opened()"
    ></sbb-usermenu>
    <sbb-menu #menu="sbbMenu">
      <a sbb-menu-item [routerLink]="'.'" routerLinkActive="sbb-active">Menu Item 1</a>
      <a sbb-menu-item [routerLink]="'.'" routerLinkActive="sbb-active">Menu Item 2</a>
      <hr />
      <button sbb-menu-item type="button" (click)="logout()">Logout</button>
    </sbb-menu>
  `,
  imports: [SbbUsermenuModule, RouterTestingModule, SbbMenuModule],
})
class UsermenuWithDisplayNameAndUserNameTestComponent {
  userName: string;
  displayName: string;

  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  login() {
    this.userName = 'max_98';
    this.displayName = 'Max Muster';
    this._changeDetectorRef.markForCheck();
  }

  logout() {
    this.userName = '';
    this.displayName = '';
    this._changeDetectorRef.markForCheck();
  }

  closed() {}

  opened() {}
}

@Component({
  template: `
    <sbb-usermenu [displayName]="displayName" (loginRequest)="login()" [menu]="menu"></sbb-usermenu>
    <sbb-menu #menu="sbbMenu">
      <a sbb-menu-item href="">Menu Item 1</a>
      <a sbb-menu-item href="">Menu Item 2</a>
      <hr />
      <button sbb-menu-item type="button">Logout</button>
    </sbb-menu>
  `,
  imports: [SbbUsermenuModule, SbbMenuModule],
})
class UsermenuWithOnlyDisplayNameTestComponent {
  displayName: string;

  login() {
    this.displayName = 'Max Muster';
  }
}

@Component({
  template: `
    <sbb-usermenu [userName]="userName" (loginRequest)="login()" [menu]="menu"></sbb-usermenu>
    <sbb-menu #menu="sbbMenu">
      <a sbb-menu-item href="">Menu Item 1</a>
      <a sbb-menu-item href="">Menu Item 2</a>
      <hr />
      <button sbb-menu-item type="button">Logout</button>
    </sbb-menu>
  `,
  imports: [SbbUsermenuModule, SbbMenuModule],
})
class UsermenuWithOnlyUsernameTestComponent {
  userName: string;

  login() {
    this.userName = 'walter_14';
  }
}

@Component({
  template: `
    <sbb-usermenu
      [userName]="userName"
      [displayName]="displayName"
      (loginRequest)="login()"
      [menu]="menu"
    >
      <img
        alt="test logo"
        class="image"
        *sbbIcon
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAAAAADFHGIkAAAAHXRFWHRqaXJhLXN5c3RlbS1pbWFnZS10eXBlAGF2YXRhcuQCGmEAAAHHSURBVHjaXcnpb9owGAZw//9f6aQcW0UcBx9xYFKLQC1ldBvqmMqmjUpQIIQQznKEq9U4QuakmzTt51e23+cBHyRFVhRZVuWzROKNrCpKtEkFoEpyRDmTWDbL5YQSr5IKtHeRc+lqFgp+ST6P9rcaQMmkpkG1FIbB8Ricwi8KFEkSAQPqug6Rf9qdwvC0D16IpkMdGgAjwzC0y8MumD7UxsGv43UyhQyEAU3hFIb5/cFjUMPNw6GoEYxTFDBMMNELL8Gd2hmh3HZ/CykhmAGTUGrkl5vnSX3nwMJ2sy4iRokJOKUM3e6Wq/X+EWW8rb+70xmlHFiMMfJ+uvH95bXhPS/W/iU2GbPiwiQZd7VYVm78+Wp4QUT+p2BcLy5nszSczNefdc7iIm1GOGksnqqVyaLFeBykXwtupSrz8Xwxnpawxf8WnDOC0bfpcDAYPn1ChIgkLii2cuVab9AXBu7Pco5jKooMzVbbg9Gw3/M8r+f1R6N++/6CpoFl2aOe23Vj3W403rjF04BdeR1H6Mai13E6Xt4ErOzatt0R7GjEEdyPFJj3Tqv9n5bz1QTWj/bjP5rN6G5/N0H1ofkaNeoNod6I/q1a5TdkFrmNh+TkvgAAAABJRU5ErkJggrbdEexoxBHcjxSY906r/Z+W89UE1o/24z+azehufzdB9aH5GjXqDaHeiP6tWuU3ZBa5jUIVzVsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTMtMDMtMjFUMTc6MDA6NDgrMTE6MDBIBpwWAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDEzLTAzLTEyVDA5OjM0OjAzKzExOjAwMqS6YQAAAABJRU5ErkJggg=="
      />
    </sbb-usermenu>
    <sbb-menu #menu="sbbMenu">
      <a sbb-menu-item href="">Menu Item 1</a>
      <a sbb-menu-item href="">Menu Item 2</a>
      <hr />
      <button sbb-menu-item type="button">Logout</button>
    </sbb-menu>
  `,
  imports: [SbbUsermenuModule, SbbIconModule, SbbMenuModule],
})
class UsermenuWithCustomImageTestComponent {
  userName: string;
  displayName: string;

  login() {
    this.userName = 'john_64';
    this.displayName = 'John Scott';
  }
}

@Component({
  template: ` <sbb-usermenu [displayName]="displayName" (loginRequest)="login()"></sbb-usermenu> `,
  imports: [SbbUsermenuModule],
})
class UsermenuNoMenuTestComponent {
  displayName: string;

  login() {
    this.displayName = 'John Scott';
  }
}
