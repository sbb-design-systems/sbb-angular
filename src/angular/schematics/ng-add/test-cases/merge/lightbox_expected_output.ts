import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbLightboxActions, SbbLightboxTitle, SbbLightboxModule } from '@sbb-esta/angular/lightbox';

@Component({
  template: `
    <div sbbLightboxTitle>Hi</div>
    <div sbbLightboxContent>
      <div>
        What's your favorite animal?
        <sbb-form-field label="Animal">
          <input type="text" [(ngModel)]="data.animal" cdkFocusInitial />
        </sbb-form-field>
      </div>
    </div>
    <div sbbLightboxActions>
      <button type="button" sbb-button [sbbLightboxClose]="data.animal">Ok</button>
      <button type="button" sbb-secondary-button (click)="noThanks()">No Thanks</button>
    </div>
  `,
})
export class LightboxTestComponent {
  @ViewChild(SbbLightboxTitle) header: SbbLightboxTitle;
  @ViewChild(SbbLightboxActions) footer: SbbLightboxActions;
}

@NgModule({
  declarations: [LightboxTestComponent],
  imports: [SbbLightboxModule],
})
export class LightboxTestModule {}
