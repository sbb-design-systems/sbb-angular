import { Component, NgModule, QueryList, ViewChildren } from '@angular/core';
import { SbbProcessflow, SbbProcessflowModule, SbbProcessflowStep } from '@sbb-esta/angular-public';

@Component({
  selector: 'sbb-processflow-test',
  template: `
    <sbb-processflow #processflow>
      <sbb-processflow-step i18n-title="@@processFlowTitleLocation" title="1. Standort"></sbb-processflow-step>
      <sbb-processflow-step i18n-title="@@processFlowTitleVehicle" title="2. Fahrzeug"></sbb-processflow-step>
    </sbb-processflow>

    <sbb-processflow #processflow2 skippable>
      <sbb-processflow-step title="Informationen">
        <app-alter1-study-information [study]="study"></app-alter1-study-information>
        <div class="button-wrapper">
          <button class="btn-right" sbbButton [disabled]="!studyForm?.valid" (click)="alterStudy()" i18n>Studie aktualisieren</button>
          <button class="btn-right" sbbButton [disabled]="!studyForm.get('studyInformation').valid" (click)="processflow2.nextStep()" i18n>
            Nächster Schritt
          </button>
        </div>
      </sbb-processflow-step>

      <sbb-processflow-step title="Studiendetails">
        <app-alter2-study-details [study]="study"></app-alter2-study-details>
        <div class="button-wrapper">
          <button class="btn-style" sbbButton (click)="processflow2.prevStep()" i18n>Vorheriger Schritt</button>
          <button class="btn-right" sbbButton [disabled]="!studyForm?.valid" (click)="alterStudy()" i18n>Studie aktualisieren</button>
          <button class="btn-right" sbbButton [disabled]="!studyForm?.valid" (click)="processflow2.nextStep()" i18n>Nächster Schritt</button>
        </div>
      </sbb-processflow-step>
    </sbb-processflow>

    <sbb-processflow skippable="true" #processflow3 [formGroup]="studyForm" style="overflow: visible;">
      <sbb-processflow-step title="Informationen">
      </sbb-processflow-step>
    </sbb-processflow>
  `,
})
export class ProcessflowTestComponent {
  @ViewChildren(SbbProcessflow) processflows: QueryList<SbbProcessflow>;
  @ViewChildren(SbbProcessflowStep) steps: QueryList<SbbProcessflowStep>;
}

@NgModule({
  declarations: [ProcessflowTestComponent],
  imports: [SbbProcessflowModule],
})
export class ProcessflowTestModule {}
