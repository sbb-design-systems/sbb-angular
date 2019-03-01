import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMenuComponent } from './usermenu.component';
import { CommonModule } from '@angular/common';
import { DropdownModule, DropdownComponent } from '../../dropdown/dropdown';
import { IconArrowSmallDownModule } from '../../svg-icons/base/arrows/icon-arrow-small-down.module';
import { IconUserModule } from '../../svg-icons/base/icon-user.module';
import { Component } from '@angular/core';
import { UserMenuModule } from '../usermenu.module';
import { LinkGeneratorResult } from '../../pagination/pagination';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { dispatchFakeEvent } from '../../_common/testing/dispatch-events';
import { User } from '../usermenu/usermenu.component';

@Component({
  selector: 'sbb-usermenu-test',
  template: ` <h4 class="sbbsc-block">Basic Example with custom user image</h4>
              <sbb-usermenu [userName]="user.userName" (loginRequest)="login($event)">
                <img class="image" sbbIcon src="assets/images/user-avatar.png">
                <sbb-dropdown>
                  <a *ngFor="let link of links" sbbDropdownItem
                                                [routerLink]="linkGenerator(link.page).routerLink"
                                                [queryParams]="linkGenerator(link.page).queryParams"
                                                routerLinkActive="sbb-selected">{{ link.text }}
                  </a>
                  <hr>
                  <button sbbDropdownItem type="button" (click)="logout()">Abmeldung</button>
                </sbb-dropdown>
              </sbb-usermenu>`
})
class UsermenuTestComponent {

  user: User = {
    userName: null
  };

  links: Array<any> = [
    { page: 1, text: 'Benutzerkonto' },
    { page: 2, text: 'Eintrag 2' },
    { page: 3, text: 'Eintrag 3' }
  ];

  loggedUser: User = {
    userName: 'ABB1234',
    displayName: null,
  };

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  login($event: any) {
    Object.assign(this.user, this.loggedUser);

    console.log('login successful');
  }

  logout() {
    console.log('Logout');
    this.user.userName = null;
  }
}

@Component({
  selector: 'sbb-usermenu-test2',
  template: `<h4 class="sbbsc-block">Example without user image</h4>
             <sbb-usermenu [userName]="user2.userName" (loginRequest)="login2($event)">
              <sbb-dropdown>
                <a *ngFor="let link of links" sbbDropdownItem
                                              [routerLink]="linkGenerator(link.page).routerLink"
                                              [queryParams]="linkGenerator(link.page).queryParams"
                                              routerLinkActive="sbb-selected">{{ link.text }}
                </a>
                <hr>
                <button sbbDropdownItem type="button" (click)="logout2()">Abmeldung</button>
              </sbb-dropdown>
             </sbb-usermenu>`
})
class UsermenuTest2Component {

  user2: User = {
    userName: null
  };

  links: Array<any> = [
    { page: 1, text: 'Benutzerkonto' },
    { page: 2, text: 'Eintrag 2' },
    { page: 3, text: 'Eintrag 3' }
  ];

  loggedUser2: User = {
    userName: 'ABB1234',
    displayName: null,
  };

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  login2($event: any) {
    Object.assign(this.user2, this.loggedUser2);

    console.log('login successful');
  }

  logout2() {
    console.log('Logout');
    this.user2.userName = null;
  }
}

@Component({
  selector: 'sbb-usermenu-test3',
  template: `<h4 class="sbbsc-block">Example without user image and with username and displayName</h4>
             <sbb-usermenu [userName]="user3.userName" [displayName]="user3.displayName" (loginRequest)="login3($event)">
              <sbb-dropdown>
                <a *ngFor="let link of links" sbbDropdownItem
                                              [routerLink]="linkGenerator(link.page).routerLink"
                                              [queryParams]="linkGenerator(link.page).queryParams"
                                              routerLinkActive="sbb-selected">{{ link.text }}
                </a>
                <hr>
                <button sbbDropdownItem type="button" (click)="logout3()">Abmeldung</button>
              </sbb-dropdown>
             </sbb-usermenu>`
})
class UsermenuTest3Component {

  user3: User = {
    userName: null
  };

  links: Array<any> = [
    { page: 1, text: 'Benutzerkonto' },
    { page: 2, text: 'Eintrag 2' },
    { page: 3, text: 'Eintrag 3' }
  ];

  loggedUser3: User = {
    userName: 'max 98',
    displayName: 'Max Muster',
  };

  linkGenerator(page: string): LinkGeneratorResult {
    return {
      queryParams: { page: page },
      routerLink: ['.']
    };
  }

  login3($event: any) {
    Object.assign(this.user3, this.loggedUser3);

    console.log('login successful');
  }

  logout3() {
    console.log('Logout');
    this.user3.userName = null;
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
      imports: [CommonModule, DropdownModule, IconArrowSmallDownModule, IconUserModule]
    })
      .compileComponents();
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
      imports: [UserMenuModule, CommonModule, DropdownModule, IconArrowSmallDownModule, IconUserModule, RouterTestingModule],
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
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login).toHaveBeenCalled();
  });

  it('user should be logged-in and he provides an image (in collapsed status)', () => {

    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
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

  it('user should be logged-in and he can see data (username) to a click on the arrow down in the collapsed status', () => {

    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login).toHaveBeenCalled();

    const arrowCollapsed = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-collapsed-arrow'))[0].nativeElement;
    arrowCollapsed.click();
    fixtureTest.detectChanges();

    const contentCollapsed = fixtureTest.debugElement.query(By.css('.sbb-usermenu-logged-in.sbb-usermenu-logged-in-active'));
    expect(contentCollapsed.attributes['aria-expanded']).toBe('true');

    const usernameUser = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-expanded-username'))[0].nativeElement;
    expect(usernameUser.textContent).toContain('ABB1234');
  });

  it('user should be logged out when click on button logout in the expanded status', () => {

    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login).toHaveBeenCalled();

    const arrowCollapsed = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-collapsed-arrow'))[0].nativeElement;
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
      imports: [UserMenuModule, CommonModule, DropdownModule, IconArrowSmallDownModule, IconUserModule, RouterTestingModule],
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
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login2');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login2).toHaveBeenCalled();
  });

  it('user should be logged-in and he does not provide an image (in collapsed status) and he can see his initial letters ', () => {

    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login2');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login2).toHaveBeenCalled();

    const initialLettersReference = fixtureTest.debugElement.query(By.css('.sbb-usermenu-logged-in-collapsed-initial-letters'));
    expect(initialLettersReference.nativeElement).toBeTruthy();
    expect(initialLettersReference.nativeElement.textContent).toContain('ABB');
  });

  it('user should be logged-in and he can see data (username) to a click on the arrow down in the collapsed status', () => {

    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login2');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login2).toHaveBeenCalled();

    const arrowCollapsed = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-collapsed-arrow'))[0].nativeElement;
    arrowCollapsed.click();
    fixtureTest.detectChanges();

    const contentCollapsed = fixtureTest.debugElement.query(By.css('.sbb-usermenu-logged-in.sbb-usermenu-logged-in-active'));
    expect(contentCollapsed.attributes['aria-expanded']).toBe('true');

    const usernameUser = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-expanded-username'))[0].nativeElement;
    expect(usernameUser.textContent).toContain('ABB1234');
  });

  it('user should be logged out when click on button logout in the expanded status', () => {

    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login2');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login2).toHaveBeenCalled();

    const arrowCollapsed = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-collapsed-arrow'))[0].nativeElement;
    arrowCollapsed.click();
    fixtureTest.detectChanges();

    const buttonLogout = usermenuComponent.query(By.css('button')).nativeElement;
    buttonLogout.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'logout2');
    dispatchFakeEvent(buttonLogout, 'click');
    expect(componentTest.logout2).toHaveBeenCalled();
  });
});


describe('Usermenu test case: usermenu without user image but with username and displayName using mock component', () => {

  let componentTest: UsermenuTest3Component;
  let fixtureTest: ComponentFixture<UsermenuTest3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UserMenuModule, CommonModule, DropdownModule, IconArrowSmallDownModule, IconUserModule, RouterTestingModule],
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
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login3');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login3).toHaveBeenCalled();
  });

  it('user should be logged-in and he does not provide an image (in collapsed status) and he can see the initial letters', () => {

    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login3');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login3).toHaveBeenCalled();

    const initialLettersReference = fixtureTest.debugElement.query(By.css('.sbb-usermenu-logged-in-collapsed-initial-letters'));
    expect(initialLettersReference.nativeElement).toBeTruthy();
    expect(initialLettersReference.nativeElement.textContent).toContain('M9');
  });

  it('user should be logged-in and he can see data (username & display name) to a click on the arrow down in the collapsed status', () => {

    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login3');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login3).toHaveBeenCalled();

    const arrowCollapsed = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-collapsed-arrow'))[0].nativeElement;
    arrowCollapsed.click();
    fixtureTest.detectChanges();

    const contentCollapsed = fixtureTest.debugElement.query(By.css('.sbb-usermenu-logged-in.sbb-usermenu-logged-in-active'));
    expect(contentCollapsed.attributes['aria-expanded']).toBe('true');

    const usernameUser = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-expanded-username'))[0].nativeElement;
    expect(usernameUser.textContent).toContain('max 98');

    const displayNameUser = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-expanded-displayName'))[0].nativeElement;
    expect(displayNameUser.textContent).toContain('Max Muster');
  });

  it('user should be logged out when clicks on button logout in the expanded status', () => {

    const usermenuComponent = fixtureTest.debugElement.query(By.directive(UserMenuComponent));
    const buttonLogin = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-off-button'))[0].nativeElement;
    buttonLogin.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'login3');
    dispatchFakeEvent(usermenuComponent.nativeElement, 'loginRequest');
    expect(componentTest.login3).toHaveBeenCalled();

    const arrowCollapsed = usermenuComponent.queryAll(By.css('.sbb-usermenu-logged-in-collapsed-arrow'))[0].nativeElement;
    arrowCollapsed.click();
    fixtureTest.detectChanges();

    const buttonLogout = usermenuComponent.query(By.css('button')).nativeElement;
    buttonLogout.click();
    fixtureTest.detectChanges();

    spyOn(componentTest, 'logout3');
    dispatchFakeEvent(buttonLogout, 'click');
    expect(componentTest.logout3).toHaveBeenCalled();
  });
});
