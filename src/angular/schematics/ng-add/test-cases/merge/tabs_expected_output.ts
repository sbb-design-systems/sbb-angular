import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbTabGroup, SbbTabsModule } from '@sbb-esta/angular/tabs';

@Component({
  selector: 'sbb-tabs-test',
  template: `
    <sbb-tab-group>
      <sbb-tab i18n-label="desc@@id" label="Test"></sbb-tab>
      <sbb-tab><span *sbb-tab-label [sbbBadge]="5" i18n="desc@@id">Test 2</span></sbb-tab>
    </sbb-tab-group>

    <sbb-tab-group>
      <sbb-tab i18n-label="desc@@id" label="{{ 'UPLOAD.DIALOG.TAB_TITLE' | translate }}">
        <div class="tab-container">
        </div>
      </sbb-tab>
      <sbb-tab i18n-label="desc@@id" label="{{ 'UPLOAD.METADATA.TAB_TITLE' | translate }}">
        <div class="tab-container">
        </div>
      </sbb-tab>
    </sbb-tab-group>

    <sbb-tab-group #tabs>
      <sbb-tab [active]="setTrainrunTabAsActive()"
               i18n-label="desc@@id"
               label="{{selectedTrainrun.getCategoryShortName()}}{{selectedTrainrun.getTitle()}}" id="trainrun-tab"
               #tabTrainrun>
        <div>content</div>
      </sbb-tab>
      <sbb-tab [active]="setTrainrunSectionTabAsActive()"
               i18n-label="desc@@id"
               label="{{selectedTrainrunSectionName}}" id="trainrun-section-tab"
               #tabTrainrunSection>
        <div>content</div>
      </sbb-tab>
    </sbb-tab-group>

    <sbb-tab-group #tabs2 (selectedIndexChange)="onChangeTab($event)">
      <sbb-tab
        *ngFor="let table of tables"
        [label]="table.getName()"
        [id]="table.getId()"
       
      >
        <ng-template sbbTabContent>
          <div class="row">
          </div>
        </ng-template>
      </sbb-tab>

      <sbb-tab i18n-label="desc@@id" label="Karte" id="mapId">
        <ng-template sbbTabContent>
          <div class="row">
          </div>
        </ng-template>
      </sbb-tab>
    </sbb-tab-group>
  `,
})
export class TabsTestComponent {
  @ViewChild(SbbTabGroup) tabs: SbbTabGroup;
}

@NgModule({
  declarations: [TabsTestComponent],
  imports: [SbbTabsModule],
})
export class PanelTestModule {}
