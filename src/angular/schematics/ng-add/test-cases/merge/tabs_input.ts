import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbTabs, SbbTabsModule } from '@sbb-esta/angular-public';

@Component({
  selector: 'sbb-tabs-test',
  template: `
    <sbb-tabs>
      <sbb-tab i18n-label="desc@@id" label="Test" labelId="test1"></sbb-tab>
      <sbb-tab i18n-label="desc@@id" label="Test 2" labelId="test2" [badgePill]="5"></sbb-tab>
    </sbb-tabs>

    <sbb-tabs>
      <sbb-tab i18n-label="desc@@id" label="{{ 'UPLOAD.DIALOG.TAB_TITLE' | translate }}">
        <div class="tab-container">
        </div>
      </sbb-tab>
      <sbb-tab i18n-label="desc@@id" label="{{ 'UPLOAD.METADATA.TAB_TITLE' | translate }}">
        <div class="tab-container">
        </div>
      </sbb-tab>
    </sbb-tabs>

    <sbb-tabs #tabs>
      <sbb-tab [active]="setTrainrunTabAsActive()"
               i18n-label="desc@@id"
               label="{{selectedTrainrun.getCategoryShortName()}}{{selectedTrainrun.getTitle()}}" id="trainrun-tab"
               labelId="contentTrainrun" #tabTrainrun>
        <div>content</div>
      </sbb-tab>
      <sbb-tab [active]="setTrainrunSectionTabAsActive()"
               i18n-label="desc@@id"
               label="{{selectedTrainrunSectionName}}" id="trainrun-section-tab" labelId="contentTrainrunSection"
               #tabTrainrunSection>
        <div>content</div>
      </sbb-tab>
    </sbb-tabs>

    <sbb-tabs #tabs2 (selectedIndexChange)="onChangeTab($event)">
      <sbb-tab
        *ngFor="let table of tables"
        [label]="table.getName()"
        [id]="table.getId()"
        [labelId]="table.getLabelId()"
      >
        <ng-template sbbTabContent>
          <div class="row">
          </div>
        </ng-template>
      </sbb-tab>

      <sbb-tab i18n-label="desc@@id" label="Karte" id="mapId" labelId="mapLabelId">
        <ng-template sbbTabContent>
          <div class="row">
          </div>
        </ng-template>
      </sbb-tab>
    </sbb-tabs>
  `,
})
export class TabsTestComponent {
  @ViewChild(SbbTabs) tabs: SbbTabs;
}

@NgModule({
  declarations: [TabsTestComponent],
  imports: [SbbTabsModule],
})
export class PanelTestModule {}
