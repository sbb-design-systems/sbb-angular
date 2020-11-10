import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';

import { SbbUsermenuModule } from '../usermenu.module';

import { SbbUserMenu, SBB_USERMENU_SCROLL_STRATEGY_PROVIDER } from './usermenu.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-usermenu-test',
  template: `
    <sbb-usermenu
      [userName]="user.userName"
      [displayName]="user.displayName"
      (loginRequest)="login()"
    >
      <img
        class="image"
        *sbbIcon
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAAAAADFHGIkAAAAHXRFWHRqaXJhLXN5c3RlbS1pbWFnZS10eXBlAGF2YXRhcuQCGmEAAAHHSURBVHjaXcnpb9owGAZw//9f6aQcW0UcBx9xYFKLQC1ldBvqmMqmjUpQIIQQznKEq9U4QuakmzTt51e23+cBHyRFVhRZVuWzROKNrCpKtEkFoEpyRDmTWDbL5YQSr5IKtHeRc+lqFgp+ST6P9rcaQMmkpkG1FIbB8Ricwi8KFEkSAQPqug6Rf9qdwvC0D16IpkMdGgAjwzC0y8MumD7UxsGv43UyhQyEAU3hFIb5/cFjUMPNw6GoEYxTFDBMMNELL8Gd2hmh3HZ/CykhmAGTUGrkl5vnSX3nwMJ2sy4iRokJOKUM3e6Wq/X+EWW8rb+70xmlHFiMMfJ+uvH95bXhPS/W/iU2GbPiwiQZd7VYVm78+Wp4QUT+p2BcLy5nszSczNefdc7iIm1GOGksnqqVyaLFeBykXwtupSrz8Xwxnpawxf8WnDOC0bfpcDAYPn1ChIgkLii2cuVab9AXBu7Pco5jKooMzVbbg9Gw3/M8r+f1R6N++/6CpoFl2aOe23Vj3W403rjF04BdeR1H6Mai13E6Xt4ErOzatt0R7GjEEdyPFJj3Tqv9n5bz1QTWj/bjP5rN6G5/N0H1ofkaNeoNod6I/q1a5TdkFrmNh+TkvgAAAABJRU5ErkJggrbdEexoxBHcjxSY906r/Z+W89UE1o/24z+azehufzdB9aH5GjXqDaHeiP6tWuU3ZBa5jUIVzVsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTMtMDMtMjFUMTc6MDA6NDgrMTE6MDBIBpwWAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDEzLTAzLTEyVDA5OjM0OjAzKzExOjAwMqS6YQAAAABJRU5ErkJggg=="
      />
      <a sbb-usermenu-item href="">Menu Item 1</a>
      <a sbb-usermenu-item href="">Menu Item 2</a>
      <hr />
      <button sbb-usermenu-item type="button" (click)="logout()">Logout</button>
    </sbb-usermenu>
  `,
})
class UsermenuTestComponentWithCustomImage {
  userName: string = 'john_64';

  user = {
    userName: '',
    displayName: 'John Scott',
  };

  login() {
    this.user.userName = this.userName;
  }

  logout() {
    this.user.userName = '';
  }
}

@Component({
  selector: 'sbb-usermenu-test',
  template: `
    <sbb-usermenu
      [userName]="user.userName"
      [displayName]="user.displayName"
      (loginRequest)="login()"
    >
      <a sbb-usermenu-item [routerLink]="'.'" routerLinkActive="sbb-selected">Menu Item 1</a>
      <a sbb-usermenu-item [routerLink]="'.'" routerLinkActive="sbb-selected">Menu Item 2</a>
      <hr />
      <button sbb-usermenu-item type="button" (click)="logout()">Logout</button>
    </sbb-usermenu>
  `,
})
class UsermenuTestComponentWithDisplayName {
  userName: string = 'max_98';

  user = {
    userName: '',
    displayName: 'Max Muster',
  };

  login() {
    this.user.userName = this.userName;
  }

  logout() {
    this.user.userName = '';
  }
}

@Component({
  selector: 'sbb-usermenu-test',
  template: `
    <sbb-usermenu [userName]="user.userName" (loginRequest)="login()">
      <a sbb-usermenu-item href="">Menu Item 1</a>
      <a sbb-usermenu-item href="">Menu Item 2</a>
      <hr />
      <button sbb-usermenu-item type="button" (click)="logout()">Logout</button>
    </sbb-usermenu>
  `,
})
class UsermenuTestComponentWithOnlyUsername {
  userName: string = 'walter_14';

  user = {
    userName: '',
  };

  login() {
    this.user.userName = this.userName;
  }

  logout() {
    this.user.userName = '';
  }
}

const performLoginAndReturnUsermenuComponent = (fixtureTest: ComponentFixture<any>) => {
  const usermenuComponent = fixtureTest.debugElement.query(By.directive(SbbUserMenu));
  const usermenuComponentInstance = usermenuComponent.componentInstance;
  spyOn(usermenuComponentInstance.loginRequest, 'emit').and.callThrough();
  const buttonLogin = usermenuComponent.query(By.css('.sbb-usermenu-logged-off-button'))
    .nativeElement;
  buttonLogin.click();
  fixtureTest.detectChanges();

  expect(usermenuComponentInstance.loginRequest.emit).toHaveBeenCalled();

  return usermenuComponent;
};

describe('SbbUserMenu', () => {
  let userMenuComponent: SbbUserMenu;
  let fixtureUserMenu: ComponentFixture<SbbUserMenu>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbUserMenu],
        imports: [
          CommonModule,
          SbbIconModule,
          SbbIconTestingModule,
          OverlayModule,
          NoopAnimationsModule,
        ],
        providers: [SBB_USERMENU_SCROLL_STRATEGY_PROVIDER],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureUserMenu = TestBed.createComponent(SbbUserMenu);
    userMenuComponent = fixtureUserMenu.componentInstance;
  });

  it('should create', () => {
    expect(userMenuComponent).toBeTruthy();
  });

  it('should open and close panel', () => {
    // login
    userMenuComponent.userName = 'userName';
    fixtureUserMenu.detectChanges();
    expect(userMenuComponent.panelOpen).toBeFalse();

    userMenuComponent.open();
    fixtureUserMenu.detectChanges();

    expect(userMenuComponent.panelOpen).toBeTrue();

    userMenuComponent.close();
    fixtureUserMenu.detectChanges();

    expect(userMenuComponent.panelOpen).toBeFalse();
  });

  it('should open and close panel using toggle method', () => {
    // login
    userMenuComponent.userName = 'userName';
    fixtureUserMenu.detectChanges();
    expect(userMenuComponent.panelOpen).toBeFalse();

    userMenuComponent.toggle();
    fixtureUserMenu.detectChanges();

    expect(userMenuComponent.panelOpen).toBeTrue();

    userMenuComponent.toggle();
    fixtureUserMenu.detectChanges();

    expect(userMenuComponent.panelOpen).toBeFalse();
  });
});

describe('Test Component with custom image', () => {
  let componentTest: UsermenuTestComponentWithCustomImage;
  let fixtureTest: ComponentFixture<UsermenuTestComponentWithCustomImage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbUsermenuModule,
          CommonModule,
          SbbIconModule,
          SbbIconTestingModule,
          NoopAnimationsModule,
        ],
        declarations: [UsermenuTestComponentWithCustomImage],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuTestComponentWithCustomImage);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('should perform login', () => {
    performLoginAndReturnUsermenuComponent(fixtureTest);
  });

  it('should display image', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);

    const iconReference = fixtureTest.debugElement.query(By.css('.image'));
    expect(iconReference.nativeElement).toBeTruthy();
    expect(usermenuComponent.attributes['aria-expanded']).toBe('false');
  });

  it('should display data (displayName and username) if menu expanded', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);

    const displayNameUser = usermenuComponent.query(By.css('.sbb-usermenu-user-info-display-name'))
      .nativeElement;
    expect(usermenuComponent.attributes['aria-expanded']).toBe('false');
    expect(displayNameUser.textContent).toContain('John Scott');

    const arrow = usermenuComponent.query(By.css('.sbb-usermenu-arrow')).nativeElement;
    arrow.click();
    fixtureTest.detectChanges();

    expect(usermenuComponent.attributes['aria-expanded']).toBe('true');
    const userNameUser = usermenuComponent.query(By.css('.sbb-usermenu-user-info-name'))
      .nativeElement;
    expect(userNameUser.textContent).toContain('john_64');
  });

  it('should transform arrow on panel open', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);
    const usermenuComponentInstance: SbbUserMenu = usermenuComponent.componentInstance;
    const arrow = usermenuComponent.query(By.css('.sbb-usermenu-arrow'));

    expect(usermenuComponentInstance.panelOpen).toBe(false);
    expect(getComputedStyle(arrow.nativeElement).transform).toEqual('none');

    usermenuComponentInstance.open();
    fixtureTest.detectChanges();

    expect(usermenuComponentInstance.panelOpen).toBe(true);
    expect(getComputedStyle(arrow.nativeElement).transform).not.toEqual('none');
  });

  it('should display login button after performing logout', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);
    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-open'))).toBeTruthy();
    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-logged-off-button'))).toBeFalsy();

    fixtureTest.componentInstance.logout();
    fixtureTest.detectChanges();

    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-open'))).toBeFalsy();
    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-logged-off-button'))).toBeTruthy();
  });
});

describe('Test Component with userName and displayName without image', () => {
  let componentTest: UsermenuTestComponentWithDisplayName;
  let fixtureTest: ComponentFixture<UsermenuTestComponentWithDisplayName>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbUsermenuModule,
          CommonModule,
          SbbIconModule,
          SbbIconTestingModule,
          RouterTestingModule,
        ],
        declarations: [UsermenuTestComponentWithDisplayName],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuTestComponentWithDisplayName);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('should display initial letters because there is no custom icon/image provided', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);

    const initialLettersReference = usermenuComponent.query(
      By.css('.sbb-usermenu-initial-letters')
    );
    expect(initialLettersReference.nativeElement).toBeTruthy();
    expect(initialLettersReference.nativeElement.textContent).toContain('MM');
  });
});

describe('Test Component with only userName', () => {
  let componentTest: UsermenuTestComponentWithOnlyUsername;
  let fixtureTest: ComponentFixture<UsermenuTestComponentWithOnlyUsername>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SbbUsermenuModule,
          CommonModule,
          SbbIconModule,
          SbbIconTestingModule,
          NoopAnimationsModule,
        ],
        declarations: [UsermenuTestComponentWithOnlyUsername],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuTestComponentWithOnlyUsername);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('should display only username', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);

    const displayNameUser = usermenuComponent.query(By.css('.sbb-usermenu-user-info-display-name'))
      .nativeElement;
    expect(usermenuComponent.attributes['aria-expanded']).toBe('false');
    expect(displayNameUser.textContent).toContain('walter_14');

    const arrow = usermenuComponent.query(By.css('.sbb-usermenu-arrow')).nativeElement;
    arrow.click();
    fixtureTest.detectChanges();

    expect(usermenuComponent.attributes['aria-expanded']).toBe('true');
    expect(displayNameUser.textContent).toContain('walter_14');
    expect(usermenuComponent.query(By.css('.sbb-usermenu-user-info-name'))).toBeNull();
  });
});
