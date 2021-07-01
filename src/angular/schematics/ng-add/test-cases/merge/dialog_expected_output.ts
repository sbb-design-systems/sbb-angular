import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbDialogActions, SbbDialogTitle, SbbDialogModule } from '@sbb-esta/angular/dialog';

@Component({
  template: `
    <div sbbDialogTitle>Hi</div>
    <div sbbDialogContent>
      <div>
        What's your favorite animal?
        <sbb-form-field label="Animal">
          <input type="text" [(ngModel)]="data.animal" cdkFocusInitial />
        </sbb-form-field>
      </div>
    </div>
    <div sbbDialogActions>
      <button type="button" sbb-button [sbbDialogClose]="data.animal">Ok</button>
      <button type="button" sbb-secondary-button (click)="noThanks()">No Thanks</button>
    </div>
  `,
})
export class DialogTestComponent {
  @ViewChild(SbbDialogTitle) header: SbbDialogTitle;
  @ViewChild(SbbDialogActions) footer: SbbDialogActions;
}

@NgModule({
  declarations: [DialogTestComponent],
  imports: [SbbDialogModule],
})
export class DialogTestModule {}
