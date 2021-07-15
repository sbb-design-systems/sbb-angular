import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbLightboxFooter, SbbLightboxHeader, SbbLightboxModule } from '@sbb-esta/angular-business';

@Component({
  template: `
    <div sbbLightboxHeader>Hi</div>
    <div sbbLightboxContent>
      <div>
        What's your favorite animal?
        <sbb-form-field label="Animal">
          <input type="text" [(ngModel)]="data.animal" cdkFocusInitial />
        </sbb-form-field>
      </div>
    </div>
    <div sbbLightboxFooter>
      <button type="button" sbbButton [sbbLightboxClose]="data.animal">Ok</button>
      <button type="button" sbbButton mode="secondary" (click)="noThanks()">No Thanks</button>
    </div>
  `,
})
export class LightboxTestComponent {
  @ViewChild(SbbLightboxHeader) header: SbbLightboxHeader;
  @ViewChild(SbbLightboxFooter) footer: SbbLightboxFooter;
}

@NgModule({
  declarations: [LightboxTestComponent],
  imports: [SbbLightboxModule],
})
export class LightboxTestModule {}
