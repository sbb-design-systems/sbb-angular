import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';

import { SbbUsermenu, SBB_USERMENU_SCROLL_STRATEGY_PROVIDER } from './usermenu';
import { SbbUsermenuModule } from './usermenu.module';

// tslint:disable:i18n
@Component({
  selector: 'sbb-usermenu-test',
  template: `
    <sbb-usermenu [userName]="userName" [displayName]="displayName" (loginRequest)="login()">
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
  userName: string;
  displayName: string;

  login() {
    this.userName = 'john_64';
    this.displayName = 'John Scott';
  }

  logout() {
    this.userName = '';
    this.displayName = '';
  }
}

@Component({
  selector: 'sbb-usermenu-test',
  template: `
    <sbb-usermenu [userName]="userName" [displayName]="displayName" (loginRequest)="login()">
      <a sbb-usermenu-item [routerLink]="'.'" routerLinkActive="sbb-selected">Menu Item 1</a>
      <a sbb-usermenu-item [routerLink]="'.'" routerLinkActive="sbb-selected">Menu Item 2</a>
      <hr />
      <button sbb-usermenu-item type="button">Logout</button>
    </sbb-usermenu>
  `,
})
class UsermenuTestComponentWithDisplayNameAndUserName {
  userName: string;
  displayName: string;

  login() {
    this.userName = 'max_98';
    this.displayName = 'Max Muster';
  }
}

@Component({
  selector: 'sbb-usermenu-test',
  template: `
    <sbb-usermenu [displayName]="displayName" (loginRequest)="login()">
      <a sbb-usermenu-item href="">Menu Item 1</a>
      <a sbb-usermenu-item href="">Menu Item 2</a>
      <hr />
      <button sbb-usermenu-item type="button">Logout</button>
    </sbb-usermenu>
  `,
})
class UsermenuTestComponentWithOnlyDisplayName {
  displayName: string;

  login() {
    this.displayName = 'Max Muster';
  }
}

@Component({
  selector: 'sbb-usermenu-test',
  template: `
    <sbb-usermenu [userName]="userName" (loginRequest)="login()">
      <a sbb-usermenu-item href="">Menu Item 1</a>
      <a sbb-usermenu-item href="">Menu Item 2</a>
      <hr />
      <button sbb-usermenu-item type="button">Logout</button>
    </sbb-usermenu>
  `,
})
class UsermenuTestComponentWithOnlyUsername {
  userName: string;

  login() {
    this.userName = 'walter_14';
  }
}

const performLoginAndReturnUsermenuComponent = (fixtureTest: ComponentFixture<any>) => {
  const usermenuComponent = fixtureTest.debugElement.query(By.directive(SbbUsermenu));
  const usermenuComponentInstance = usermenuComponent.componentInstance;
  spyOn(usermenuComponentInstance.loginRequest, 'emit').and.callThrough();
  const buttonLogin = usermenuComponent.query(By.css('.sbb-usermenu-trigger-logged-out'))
    .nativeElement;
  buttonLogin.click();
  fixtureTest.detectChanges();

  expect(usermenuComponentInstance.loginRequest.emit).toHaveBeenCalled();

  return usermenuComponent;
};

describe('SbbUsermenu', () => {
  let usermenuComponent: SbbUsermenu;
  let fixtureUsermenu: ComponentFixture<SbbUsermenu>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbUsermenu],
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
    fixtureUsermenu = TestBed.createComponent(SbbUsermenu);
    usermenuComponent = fixtureUsermenu.componentInstance;
  });

  it('should create', () => {
    expect(usermenuComponent).toBeTruthy();
  });

  function login() {
    usermenuComponent.userName = 'userName';
    fixtureUsermenu.detectChanges();
    expect(usermenuComponent.panelOpen).toBeFalse();
  }

  it('should open and close panel', () => {
    login();

    usermenuComponent.open();
    fixtureUsermenu.detectChanges();

    expect(usermenuComponent.panelOpen).toBeTrue();

    usermenuComponent.close();
    fixtureUsermenu.detectChanges();

    expect(usermenuComponent.panelOpen).toBeFalse();
  });

  it('should open and close panel using toggle method', () => {
    login();

    usermenuComponent.toggle();
    fixtureUsermenu.detectChanges();

    expect(usermenuComponent.panelOpen).toBeTrue();

    usermenuComponent.toggle();
    fixtureUsermenu.detectChanges();

    expect(usermenuComponent.panelOpen).toBeFalse();
  });

  it('should set appropriate aria attributes', () => {
    login();

    const triggerOpenButton = fixtureUsermenu.debugElement.query(
      By.css('.sbb-usermenu-trigger-open')
    );

    expect(triggerOpenButton.attributes['aria-label']).toBe(
      'Logged in as userName. Click or press enter to open user menu.'
    );
    expect(triggerOpenButton.attributes['aria-haspopup']).toBe('true');
    expect(triggerOpenButton.attributes['aria-controls']).toBeUndefined();

    usermenuComponent.toggle();
    fixtureUsermenu.detectChanges();

    const triggerCloseButton = fixtureUsermenu.debugElement.query(
      By.css('.sbb-usermenu-trigger-close')
    );
    const usermenuPanel = fixtureUsermenu.debugElement.query(By.css('.sbb-usermenu-panel'));
    const identificationSection = fixtureUsermenu.debugElement.query(
      By.css('.sbb-usermenu-identification')
    );

    expect(triggerOpenButton.attributes['aria-expanded']).toBe('true');
    expect(triggerOpenButton.attributes['aria-controls']).toBe(usermenuPanel.attributes['id']);
    expect(triggerCloseButton.attributes['aria-label']).toBe(
      'Logged in as userName. Click or press enter to close user menu.'
    );
    expect(identificationSection.attributes['aria-hidden']).toBe('true');
  });

  it('should display data (displayName and username) if menu expanded', () => {
    // login
    usermenuComponent.userName = 'john_64';
    usermenuComponent.displayName = 'John Scott';
    fixtureUsermenu.detectChanges();
    expect(usermenuComponent.panelOpen).toBeFalse();

    const displayName = fixtureUsermenu.debugElement.query(
      By.css('.sbb-usermenu-user-info-display-name')
    ).nativeElement;
    const userName = fixtureUsermenu.debugElement.query(By.css('.sbb-usermenu-user-info-name'))
      .nativeElement;

    // assertions in collapsed state
    expect(fixtureUsermenu.debugElement.nativeElement.classList).not.toContain(
      'sbb-usermenu-opened'
    );
    expect(displayName.textContent).toContain('John Scott');
    expect(userName.textContent).toContain('john_64');
    expect(getComputedStyle(userName).getPropertyValue('display')).toBe('none');

    // open menu
    usermenuComponent.toggle();
    fixtureUsermenu.detectChanges();

    const userNameOpenedState = fixtureUsermenu.debugElement.query(
      By.css('.sbb-usermenu-panel .sbb-usermenu-user-info-name')
    ).nativeElement;
    const displayNameOpenedState = fixtureUsermenu.debugElement.query(
      By.css('.sbb-usermenu-panel .sbb-usermenu-user-info-display-name')
    ).nativeElement;

    // assertions in opened state
    expect(fixtureUsermenu.debugElement.nativeElement.classList).toContain('sbb-usermenu-opened');
    expect(displayNameOpenedState.textContent).toContain('John Scott');
    expect(userNameOpenedState.textContent).toContain('john_64');
    expect(getComputedStyle(userNameOpenedState).getPropertyValue('display')).not.toBe('none');
  });

  it('should open menu on arrow click', () => {
    login();

    const arrow = fixtureUsermenu.debugElement.query(By.css('.sbb-usermenu-arrow')).nativeElement;
    expect(usermenuComponent.panelOpen).toBeFalse();
    expect(getComputedStyle(arrow).transform).toEqual('none');

    arrow.click();
    fixtureUsermenu.detectChanges();

    expect(usermenuComponent.panelOpen).toBeTrue();
    expect(getComputedStyle(arrow).transform).not.toEqual('none');
  });

  it('should display ellipsis if usernName or displayName is too long', () => {
    // login
    usermenuComponent.userName = 'very long username that is really very long';
    usermenuComponent.displayName = 'very long displayName that is really very long';
    fixtureUsermenu.detectChanges();
    expect(usermenuComponent.panelOpen).toBeFalse();

    // open menu
    usermenuComponent.open();
    fixtureUsermenu.detectChanges();
    expect(usermenuComponent.panelOpen).toBeTrue();
    // apply fake width to sbb-usermenu-panel, because in test the size is not the same as the trigger
    fixtureUsermenu.debugElement.query(By.css('.sbb-usermenu-panel')).nativeElement.style.width =
      '288px';

    const displayName = fixtureUsermenu.debugElement.query(
      By.css('.sbb-usermenu-panel .sbb-usermenu-user-info-display-name')
    ).nativeElement;
    const userName = fixtureUsermenu.debugElement.query(
      By.css('.sbb-usermenu-panel .sbb-usermenu-user-info-name')
    ).nativeElement;

    // assert text-overflow is active with ellipsis style
    expect(getComputedStyle(displayName).getPropertyValue('text-overflow')).toBe('ellipsis');
    expect(displayName.offsetWidth).toBeLessThan(
      displayName.scrollWidth,
      'text-overflow is not active'
    );
    expect(getComputedStyle(userName).getPropertyValue('text-overflow')).toBe('ellipsis');
    expect(userName.offsetWidth).toBeLessThan(userName.scrollWidth, 'text-overflow is not active');
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
    expect(usermenuComponent.nativeElement.classList).not.toContain('sbb-usermenu-opened');
  });

  it('should display login button after performing logout', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);
    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-logged-in'))).toBeTruthy();
    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-logged-out'))).toBeFalsy();

    fixtureTest.componentInstance.logout();
    fixtureTest.detectChanges();

    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-logged-in'))).toBeFalsy();
    expect(fixtureTest.debugElement.query(By.css('.sbb-usermenu-trigger-logged-out'))).toBeTruthy();
  });
});

describe('Test Component with userName and displayName without image', () => {
  let componentTest: UsermenuTestComponentWithDisplayNameAndUserName;
  let fixtureTest: ComponentFixture<UsermenuTestComponentWithDisplayNameAndUserName>;

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
        declarations: [UsermenuTestComponentWithDisplayNameAndUserName],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuTestComponentWithDisplayNameAndUserName);
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

    const displayName = usermenuComponent.query(By.css('.sbb-usermenu-user-info-display-name'))
      .nativeElement;
    expect(usermenuComponent.nativeElement.classList).not.toContain('sbb-usermenu-opened');
    expect(displayName.textContent).toContain('walter_14');

    usermenuComponent.componentInstance.open();
    fixtureTest.detectChanges();

    expect(usermenuComponent.nativeElement.classList).toContain('sbb-usermenu-opened');
    expect(displayName.textContent).toContain('walter_14');
    expect(usermenuComponent.query(By.css('.sbb-usermenu-user-info-name'))).toBeNull();
  });
});

describe('Test Component with only displayName', () => {
  let componentTest: UsermenuTestComponentWithOnlyDisplayName;
  let fixtureTest: ComponentFixture<UsermenuTestComponentWithOnlyDisplayName>;

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
        declarations: [UsermenuTestComponentWithOnlyDisplayName],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuTestComponentWithOnlyDisplayName);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('should display only displayName', () => {
    const usermenuComponent = performLoginAndReturnUsermenuComponent(fixtureTest);

    const displayName = usermenuComponent.query(By.css('.sbb-usermenu-user-info-display-name'))
      .nativeElement;
    expect(usermenuComponent.nativeElement.classList).not.toContain('sbb-usermenu-opened');
    expect(displayName.textContent).toContain('Max Muster');

    usermenuComponent.componentInstance.open();
    fixtureTest.detectChanges();

    expect(usermenuComponent.nativeElement.classList).toContain('sbb-usermenu-opened');
    expect(displayName.textContent).toContain('Max Muster');
    expect(usermenuComponent.query(By.css('.sbb-usermenu-user-info-name'))).toBeNull();
  });
});
