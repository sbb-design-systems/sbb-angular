import { Component, NgModule, QueryList, ViewChildren } from '@angular/core';
import { SbbProcessflow, SbbProcessflowModule, SbbStep } from '@sbb-esta/angular/processflow';

@Component({
  selector: 'sbb-processflow-test',
  template: `
    <sbb-processflow #processflow linear>
      <sbb-step i18n-label="@@processFlowTitleLocation" label="1. Standort"></sbb-step>
      <sbb-step i18n-label="@@processFlowTitleVehicle" label="2. Fahrzeug"></sbb-step>
    </sbb-processflow>

    <sbb-processflow #processflow2>
      <sbb-step label="Informationen">
        <app-alter1-study-information [study]="study"></app-alter1-study-information>
        <div class="button-wrapper">
          <button class="btn-right" sbb-button [disabled]="!studyForm?.valid" (click)="alterStudy()" i18n>Studie aktualisieren</button>
          <button class="btn-right" sbb-button [disabled]="!studyForm.get('studyInformation').valid" (click)="processflow2.next()" i18n>
            Nächster Schritt
          </button>
        </div>
      </sbb-step>

      <sbb-step label="Studiendetails">
        <app-alter2-study-details [study]="study"></app-alter2-study-details>
        <div class="button-wrapper">
          <button class="btn-style" sbb-button (click)="processflow2.previous()" i18n>Vorheriger Schritt</button>
          <button class="btn-right" sbb-button [disabled]="!studyForm?.valid" (click)="alterStudy()" i18n>Studie aktualisieren</button>
          <button class="btn-right" sbb-button [disabled]="!studyForm?.valid" (click)="processflow2.next()" i18n>Nächster Schritt</button>
        </div>
      </sbb-step>
    </sbb-processflow>

    <sbb-processflow #processflow3 [formGroup]="studyForm" style="overflow: visible;">
      <sbb-step label="Informationen">
      </sbb-step>
    </sbb-processflow>
  `,
})
export class ProcessflowTestComponent {
  @ViewChildren(SbbProcessflow) processflows: QueryList<SbbProcessflow>;
  @ViewChildren(SbbStep) steps: QueryList<SbbStep>;
}

@NgModule({
  declarations: [ProcessflowTestComponent],
  imports: [SbbProcessflowModule],
})
export class ProcessflowTestModule {}
