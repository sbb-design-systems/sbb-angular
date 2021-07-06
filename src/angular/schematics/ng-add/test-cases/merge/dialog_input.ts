import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbDialogFooter, SbbDialogHeader, SbbDialogModule } from '@sbb-esta/angular-business';

@Component({
  template: `
    <div sbbDialogHeader>Hi</div>
    <div sbbDialogContent>
      <div>
        What's your favorite animal?
        <sbb-form-field label="Animal">
          <input type="text" [(ngModel)]="data.animal" cdkFocusInitial />
        </sbb-form-field>
      </div>
    </div>
    <div sbbDialogFooter>
      <button type="button" sbbButton [sbbDialogClose]="data.animal">Ok</button>
      <button type="button" sbbButton mode="secondary" (click)="noThanks()">No Thanks</button>
    </div>
  `,
})
export class DialogTestComponent {
  @ViewChild(SbbDialogHeader) header: SbbDialogHeader;
  @ViewChild(SbbDialogFooter) footer: SbbDialogFooter;
}

@NgModule({
  declarations: [DialogTestComponent],
  imports: [SbbDialogModule],
})
export class DialogTestModule {}
