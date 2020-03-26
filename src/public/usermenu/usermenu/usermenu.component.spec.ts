import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { LinkGeneratorResult } from '@sbb-esta/angular-core/models';
import { dispatchFakeEvent } from '@sbb-esta/angular-core/testing';
import { IconChevronSmallDownModule, IconUserModule } from '@sbb-esta/angular-icons';
import { DropdownComponent, DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { UserMenuModule } from '../usermenu.module';

import { UserMenuComponent } from './usermenu.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-usermenu-test',
  template: `
    <h4 class="sbbsc-block">
      Basic Example with custom user image and with userName and displayName
    </h4>
    <sbb-usermenu
      [userName]="user1.userName"
      [displayName]="user1.displayName"
      (loginRequest)="login()"
    >
      <img
        class="image"
        sbbIcon
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAAAAADFHGIkAAAAHXRFWHRqaXJhLXN5c3RlbS1pbWFnZS10eXBlAGF2YXRhcuQCGmEAAAHHSURBVHjaXcnpb9owGAZw//9f6aQcW0UcBx9xYFKLQC1ldBvqmMqmjUpQIIQQznKEq9U4QuakmzTt51e23+cBHyRFVhRZVuWzROKNrCpKtEkFoEpyRDmTWDbL5YQSr5IKtHeRc+lqFgp+ST6P9rcaQMmkpkG1FIbB8Ricwi8KFEkSAQPqug6Rf9qdwvC0D16IpkMdGgAjwzC0y8MumD7UxsGv43UyhQyEAU3hFIb5/cFjUMPNw6GoEYxTFDBMMNELL8Gd2hmh3HZ/CykhmAGTUGrkl5vnSX3nwMJ2sy4iRokJOKUM3e6Wq/X+EWW8rb+70xmlHFiMMfJ+uvH95bXhPS/W/iU2GbPiwiQZd7VYVm78+Wp4QUT+p2BcLy5nszSczNefdc7iIm1GOGksnqqVyaLFeBykXwtupSrz8Xwxnpawxf8WnDOC0bfpcDAYPn1ChIgkLii2cuVab9AXBu7Pco5jKooMzVbbg9Gw3/M8r+f1R6N++/6CpoFl2aOe23Vj3W403rjF04BdeR1H6Mai13E6Xt4ErOzatt0R7GjEEdyPFJj3Tqv9n5bz1QTWj/bjP5rN6G5/N0H1ofkaNeoNod6I/q1a5TdkFrmNh+TkvgAAAABJRU5ErkJggrbdEexoxBHcjxSY906r/Z+W89UE1o/24z+azehufzdB9aH5GjXqDaHeiP6tWuU3ZBa5jUIVzVsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTMtMDMtMjFUMTc6MDA6NDgrMTE6MDBIBpwWAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDEzLTAzLTEyVDA5OjM0OjAzKzExOjAwMqS6YQAAAABJRU5ErkJggg=="
      />
      <sbb-dropdown>
        <a
          *ngFor="let link of links"
          sbbDropdownItem
          [routerLink]="linkGenerator(link.page).routerLink"
          [queryParams]="linkGenerator(link.page).queryParams"
          routerLinkActive="sbb-selected"
          >{{ link.text }}
        </a>
        <hr />
        <button sbbDropdownItem type="button" (click)="logout(user1)">
          Logout
        </button>
      </sbb-dropdown>
    </sbb-usermenu>
  `
})
class UsermenuTestComponent {
  userName1 = 'john_64';

  user1 = {
    userName: '',
    displayName: 'John Scott'
  };

  links: Array<any> = [
    { page: 1, text: 'Benutzerkonto' },
    { page: 2, text: 'Eintrag 2' },
    { page: 3, text: 'Eintrag 3' }
  ];

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  login() {
    this.user1.userName = this.userName1;
  }

  logout(user: any) {
    user.userName = null;
  }
}

@Component({
  selector: 'sbb-usermenu-test2',
  template: `
    <h4 class="sbbsc-block">
      Example without user image but with displayName and userName
    </h4>
    <sbb-usermenu
      [userName]="user2.userName"
      [displayName]="user2.displayName"
      (loginRequest)="login2()"
    >
      <sbb-dropdown>
        <a
          *ngFor="let link of links"
          sbbDropdownItem
          [routerLink]="linkGenerator(link.page).routerLink"
          [queryParams]="linkGenerator(link.page).queryParams"
          routerLinkActive="sbb-selected"
          >{{ link.text }}
        </a>
        <hr />
        <button sbbDropdownItem type="button" (click)="logout(user2)">
          Logout
        </button>
      </sbb-dropdown>
    </sbb-usermenu>
  `
})
class UsermenuTest2Component {
  userName2 = 'max_98';

  user2 = {
    userName: '',
    displayName: 'Max Muster'
  };

  links: Array<any> = [
    { page: 1, text: 'Benutzerkonto' },
    { page: 2, text: 'Eintrag 2' },
    { page: 3, text: 'Eintrag 3' }
  ];

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  login2() {
    this.user2.userName = this.userName2;
  }

  logout(user: any) {
    user.userName = null;
  }
}

@Component({
  selector: 'sbb-usermenu-test3',
  template: `
    <h4 class="sbbsc-block">Example only with userName</h4>
    <sbb-usermenu [userName]="user3.userName" (loginRequest)="login3()">
      <sbb-dropdown>
        <a
          *ngFor="let link of links"
          sbbDropdownItem
          [routerLink]="linkGenerator(link.page).routerLink"
          [queryParams]="linkGenerator(link.page).queryParams"
          routerLinkActive="sbb-selected"
          >{{ link.text }}
        </a>
        <hr />
        <button sbbDropdownItem type="button" (click)="logout(user3)">
          Logout
        </button>
      </sbb-dropdown>
    </sbb-usermenu>
  `
})
class UsermenuTest3Component {
  userName3 = 'walter_14';

  user3 = {
    userName: '',
    displayName: 'Walter Scotti'
  };

  links: Array<any> = [
    { page: 1, text: 'Benutzerkonto' },
    { page: 2, text: 'Eintrag 2' },
    { page: 3, text: 'Eintrag 3' }
  ];

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  login3() {
    this.user3.userName = this.userName3;
  }

  logout(user: any) {
    user.userName = null;
  }
}

describe('UserMenuComponent', () => {
  let userMenuComponent: UserMenuComponent;
  let fixtureUserMenu: ComponentFixture<UserMenuComponent>;

  let dropdownComponent: DropdownComponent;
  let fixtureDropdown: ComponentFixture<DropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserMenuComponent],
      imports: [CommonModule, DropdownModule, IconChevronSmallDownModule, IconUserModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureDropdown = TestBed.createComponent(DropdownComponent);
    dropdownComponent = fixtureDropdown.componentInstance;
    fixtureDropdown.detectChanges();

    fixtureUserMenu = TestBed.createComponent(UserMenuComponent);
    userMenuComponent = fixtureUserMenu.componentInstance;
    userMenuComponent.dropdown = dropdownComponent;
    fixtureDropdown.detectChanges();
  });

  it('should create', () => {
    expect(userMenuComponent).toBeTruthy();
    expect(dropdownComponent).toBeTruthy();
  });
});

describe('Usermenu test case: user with custom image using mock component', () => {
  let componentTest: UsermenuTestComponent;
  let fixtureTest: ComponentFixture<UsermenuTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UserMenuModule,
        CommonModule,
        DropdownModule,
        IconChevronSmallDownModule,
        IconUserModule,
        RouterTestingModule
      ],
      declarations: [UsermenuTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuTestComponent);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('should create', () => {
    expect(componentTest).toBeTruthy();
  });

  it('user should be logged-in', () => {
    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
      .nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login).toHaveBeenCalled();
  });

  it('user should be logged-in and he provides an image (in collapsed status)', () => {
    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
      .nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login).toHaveBeenCalled();

    const iconReference = fixtureTest.debugElement.query(By.css('[sbbIcon]'));
    expect(iconReference.nativeElement).toBeTruthy();

    const contentCollapsed = fixtureTest.debugElement.query(By.css('.sbb-usermenu-logged-in'));
    expect(contentCollapsed.attributes['aria-expanded']).toBe('false');
  });

  it(
    'user should be logged-in and he can see data (displayName and username) to a click on' +
      ' the arrow down in the collapsed status',
    () => {
      const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
      const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
        .nativeElement;
      buttonLogin.click();
      fixtureTest.detectChanges();

      spyOn(componentTest, 'login');
      dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
      expect(componentTest.login).toHaveBeenCalled();

      const displayNameUser = usermenuComponent.queryAll(
        By.css('.sbb-usermenu-logged-in-expanded-displayName')
      )[0].nativeElement;
      expect(displayNameUser.textContent).toContain('John Scott');

      const arrowCollapsed = usermenuComponent.queryAll(
        By.css('.sbb-usermenu-logged-in-collapsed-arrow')
      )[0].nativeElement;
      arrowCollapsed.click();
      fixtureTest.detectChanges();

      const contentCollapsed = fixtureTest.debugElement.query(
        By.css('.sbb-usermenu-logged-in.sbb-usermenu-logged-in-active')
      );
      expect(contentCollapsed.attributes['aria-expanded']).toBe('true');

      const userNameUser = usermenuComponent.queryAll(
        By.css('.sbb-usermenu-logged-in-expanded-username')
      )[0].nativeElement;
      expect(userNameUser.textContent).toContain('john_64');
    }
  );

  it(
    'user should be logged-in and the arrow should be on the right. After click to see ' +
      'dropdown details the arrow should be at the end of the button',
    () => {
      const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
      const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
        .nativeElement;
      buttonLogin.click();
      fixtureTest.detectChanges();

      spyOn(componentTest, 'login');
      dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
      expect(componentTest.login).toHaveBeenCalled();

      const displayNameUser = usermenuComponent.queryAll(
        By.css('.sbb-usermenu-logged-in-expanded-displayName')
      )[0].nativeElement;
      expect(displayNameUser.textContent).toContain('John Scott');

      const displayNameUserWithNoCollapsedDropdown = usermenuComponent.queryAll(
        By.css('sbb-usermenu-logged-in-expanded-info-user-dropdown-open')
      );
      expect(displayNameUserWithNoCollapsedDropdown.length).toBe(0);

      const arrowCollapsed = usermenuComponent.queryAll(
        By.css('.sbb-usermenu-logged-in-collapsed-arrow')
      )[0].nativeElement;
      arrowCollapsed.click();
      fixtureTest.detectChanges();

      const dropdownOpen = fixtureTest.debugElement.queryAll(
        By.css('.sbb-usermenu-logged-in-expanded-info-user-dropdown-open')
      );
      expect(dropdownOpen.length).toBeGreaterThan(0);
    }
  );

  it('user should be logged out when click on button logout in the expanded status', () => {
    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
      .nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login).toHaveBeenCalled();

    const arrowCollapsed = usermenuComponent.queryAll(
      By.css('.sbb-usermenu-logged-in-collapsed-arrow')
    )[0].nativeElement;
    arrowCollapsed.click();
    fixtureTest.detectChanges();

    const buttonLogout = usermenuComponent.query(By.css('button')).nativeElement;
    buttonLogout.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'logout');
    dispatchFakeEvent(buttonLogout, 'click');
    expect(componentTest.logout).toHaveBeenCalled();
  });
});

describe('Usermenu test case: usermenu without user image but with initial letters using mock component', () => {
  let componentTest: UsermenuTest2Component;
  let fixtureTest: ComponentFixture<UsermenuTest2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UserMenuModule,
        CommonModule,
        DropdownModule,
        IconChevronSmallDownModule,
        IconUserModule,
        RouterTestingModule
      ],
      declarations: [UsermenuTest2Component]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuTest2Component);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('should create', () => {
    expect(componentTest).toBeTruthy();
  });

  it('user should be logged-in', () => {
    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
      .nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login2');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login2).toHaveBeenCalled();
  });

  it(
    'user should be logged-in and he does not provide an image (in collapsed status) and he can' +
      ' see his initial letters ',
    () => {
      const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
      const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
        .nativeElement;
      buttonLogin.click();
      fixtureTest.detectChanges();

      spyOn(componentTest, 'login2');
      dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
      expect(componentTest.login2).toHaveBeenCalled();

      const initialLettersReference = fixtureTest.debugElement.query(
        By.css('.sbb-usermenu-logged-in-collapsed-initial-letters')
      );
      expect(initialLettersReference.nativeElement).toBeTruthy();
      expect(initialLettersReference.nativeElement.textContent).toContain('MM');
    }
  );

  it(
    'user should be logged-in and he can see data (userName and displayName) to a click on the' +
      ' arrow down in the collapsed status',
    () => {
      const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
      const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
        .nativeElement;
      buttonLogin.click();
      fixtureTest.detectChanges();

      spyOn(componentTest, 'login2');
      dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
      expect(componentTest.login2).toHaveBeenCalled();

      const displayNameUser = usermenuComponent.queryAll(
        By.css('.sbb-usermenu-logged-in-expanded-displayName')
      )[0].nativeElement;
      expect(displayNameUser.textContent).toContain('Max Muster');

      const arrowCollapsed = usermenuComponent.queryAll(
        By.css('.sbb-usermenu-logged-in-collapsed-arrow')
      )[0].nativeElement;
      arrowCollapsed.click();
      fixtureTest.detectChanges();

      const contentCollapsed = fixtureTest.debugElement.query(
        By.css('.sbb-usermenu-logged-in.sbb-usermenu-logged-in-active')
      );
      expect(contentCollapsed.attributes['aria-expanded']).toBe('true');

      const userNameUser = usermenuComponent.queryAll(
        By.css('.sbb-usermenu-logged-in-expanded-username')
      )[0].nativeElement;
      expect(userNameUser.textContent).toContain('max_98');
    }
  );

  it('user should be logged out when click on button logout in the expanded status', () => {
    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
      .nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login2');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login2).toHaveBeenCalled();

    const arrowCollapsed = usermenuComponent.queryAll(
      By.css('.sbb-usermenu-logged-in-collapsed-arrow')
    )[0].nativeElement;
    arrowCollapsed.click();
    fixtureTest.detectChanges();

    const buttonLogout = usermenuComponent.query(By.css('button')).nativeElement;
    buttonLogout.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'logout');
    dispatchFakeEvent(buttonLogout, 'click');
    expect(componentTest.logout).toHaveBeenCalled();
  });
});

describe('Usermenu test case: usermenu only with userName using mock component', () => {
  let componentTest: UsermenuTest3Component;
  let fixtureTest: ComponentFixture<UsermenuTest3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UserMenuModule,
        CommonModule,
        DropdownModule,
        IconChevronSmallDownModule,
        IconUserModule,
        RouterTestingModule
      ],
      declarations: [UsermenuTest3Component]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureTest = TestBed.createComponent(UsermenuTest3Component);
    componentTest = fixtureTest.componentInstance;
    fixtureTest.detectChanges();
  });

  it('should create', () => {
    expect(componentTest).toBeTruthy();
  });

  it('user should be logged-in', () => {
    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
      .nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login3');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login3).toHaveBeenCalled();
  });

  it(
    'user should be logged-in and he does not provide an image (in collapsed status) and he can' +
      ' see the initial letters',
    () => {
      const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
      const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
        .nativeElement;
      buttonLogin.click();
      fixtureTest.detectChanges();

      spyOn(componentTest, 'login3');
      dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
      expect(componentTest.login3).toHaveBeenCalled();

      const initialLettersReference = fixtureTest.debugElement.query(
        By.css('.sbb-usermenu-logged-in-collapsed-initial-letters')
      );
      expect(initialLettersReference.nativeElement).toBeTruthy();
      expect(initialLettersReference.nativeElement.textContent).toContain('WAL');
    }
  );

  it('user should be logged-in and he can see data only username', () => {
    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
      .nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login3');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login3).toHaveBeenCalled();

    const usernameUser = usermenuComponent.queryAll(
      By.css('.sbb-usermenu-logged-in-expanded-displayName')
    )[0].nativeElement;
    expect(usernameUser.textContent).toContain('walter_14');

    const arrowCollapsed = usermenuComponent.queryAll(
      By.css('.sbb-usermenu-logged-in-collapsed-arrow')
    )[0].nativeElement;
    arrowCollapsed.click();
    fixtureTest.detectChanges();

    const contentCollapsed = fixtureTest.debugElement.query(
      By.css('.sbb-usermenu-logged-in.sbb-usermenu-logged-in-active')
    );
    expect(contentCollapsed.attributes['aria-expanded']).toBe('true');
  });

  it('user should be logged out when clicks on button logout in the expanded status', () => {
    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0]
      .nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login3');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login3).toHaveBeenCalled();

    const arrowCollapsed = usermenuComponent.queryAll(
      By.css('.sbb-usermenu-logged-in-collapsed-arrow')
    )[0].nativeElement;
    arrowCollapsed.click();
    fixtureTest.detectChanges();

    const buttonLogout = usermenuComponent.query(By.css('button')).nativeElement;
    buttonLogout.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'logout');
    dispatchFakeEvent(buttonLogout, 'click');
    expect(componentTest.logout).toHaveBeenCalled();
  });
});
