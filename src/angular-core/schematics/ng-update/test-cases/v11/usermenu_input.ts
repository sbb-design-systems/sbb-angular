import { Component, NgModule } from '@angular/core';
import { SbbUsermenuModule } from '@sbb-esta/angular-public/usermenu';

@Component({
  selector: 'sbb-usermenu-test',
  template: ` <div>
    <sbb-usermenu userName="UserName">
      <img src="test.jpg" sbbIcon />
      <img src="test.jpg" *sbbIcon />
      <ng-container>
        <img src="test.jpg" sbbIcon />
        <img src="test.jpg" *sbbIcon />
      </ng-container>
      <sbb-dropdown tag="dummy"><hr/>
        <a sbbDropdownItem routerLinkActive="sbb-selected"> Link <img src="test.jpg" sbbIcon /></a>
        <a sbbDropdownItem routerLinkActive="sbb-selected"> Link 2 </a>
        <hr />
        <button sbbDropdownItem type="button">Logout</button>
      </sbb-dropdown><hr/>
      <ng-container>
        <sbb-dropdown tag="dummy"><hr/>
          <a sbbDropdownItem routerLinkActive="sbb-selected"> Link <img src="test.jpg" sbbIcon /></a>
          <a sbbDropdownItem routerLinkActive="sbb-selected"> Link 2 </a>
          <hr />
          <button sbbDropdownItem type="button">Logout</button>
        </sbb-dropdown><hr/>
      </ng-container>
    </sbb-usermenu>
    <sbb-icon sbbIcon></sbb-icon>
    <sbb-dropdown>
      <a sbbDropdownItem routerLinkActive="sbb-selected"> Link </a>
      <a sbbDropdownItem routerLinkActive="sbb-selected"> Link 2 </a>
      <hr />
      <button sbbDropdownItem type="button">Logout</button>
    </sbb-dropdown>
  </div>`,
})
export class UsermenuTestComponent {}

@NgModule({
  declarations: [UsermenuTestComponent],
  imports: [SbbUsermenuModule],
})
export class UsermenuTestModule {}
