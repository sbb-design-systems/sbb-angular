import { NgModule } from '@angular/core';
import { IconCollectionArrowModule } from '@sbb-esta/angular-icons/arrow';
import { IconCollectionAudioModule } from '@sbb-esta/angular-icons/audio';
import { IconCollectionBasicModule } from '@sbb-esta/angular-icons/basic';
import { IconCollectionBuildingModule } from '@sbb-esta/angular-icons/building';
import { IconCollectionCareerModule } from '@sbb-esta/angular-icons/career';
import { IconCollectionCommunityModule } from '@sbb-esta/angular-icons/community';
import { IconCollectionDocumentModule } from '@sbb-esta/angular-icons/document';
import { IconCollectionHardwareModule } from '@sbb-esta/angular-icons/hardware';
import { IconCollectionHimCusModule } from '@sbb-esta/angular-icons/him-cus';
import { IconCollectionInstallationModule } from '@sbb-esta/angular-icons/installation';
import { IconCollectionLeisureModule } from '@sbb-esta/angular-icons/leisure';
import { IconCollectionLocationModule } from '@sbb-esta/angular-icons/location';
import { IconCollectionNavigationModule } from '@sbb-esta/angular-icons/navigation';
import { IconCollectionSocialMediaModule } from '@sbb-esta/angular-icons/social-media';
import { IconCollectionStationModule } from '@sbb-esta/angular-icons/station';
import { IconCollectionStatusModule } from '@sbb-esta/angular-icons/status';
import { IconCollectionTicketModule } from '@sbb-esta/angular-icons/ticket';
import { IconCollectionTimetableModule } from '@sbb-esta/angular-icons/timetable';
import { IconCollectionTimetableAttributesModule } from '@sbb-esta/angular-icons/timetable-attributes';
import { IconCollectionTimetableProductsModule } from '@sbb-esta/angular-icons/timetable-products';
import { IconCollectionTransportModule } from '@sbb-esta/angular-icons/transport';
import { IconCollectionUserModule } from '@sbb-esta/angular-icons/user';
import { IconCollectionWeatherModule } from '@sbb-esta/angular-icons/weather';

const modules = [
  IconCollectionTimetableAttributesModule,
  IconCollectionHimCusModule,
  IconCollectionTimetableProductsModule,
  IconCollectionBasicModule,
  IconCollectionCommunityModule,
  IconCollectionUserModule,
  IconCollectionTimetableModule,
  IconCollectionStationModule,
  IconCollectionHardwareModule,
  IconCollectionTransportModule,
  IconCollectionLeisureModule,
  IconCollectionInstallationModule,
  IconCollectionBuildingModule,
  IconCollectionCareerModule,
  IconCollectionArrowModule,
  IconCollectionStatusModule,
  IconCollectionNavigationModule,
  IconCollectionDocumentModule,
  IconCollectionTicketModule,
  IconCollectionLocationModule,
  IconCollectionWeatherModule,
  IconCollectionAudioModule,
  IconCollectionSocialMediaModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class IconCollectionModule {}
